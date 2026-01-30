import { load } from "js-yaml";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { Plugin } from "vite";

interface AstGrepPluginOptions {
	configPath?: string;
	verbose?: boolean;
}

interface AstGrepConfig {
	ruleDirs?: string[];
}

interface AstGrepReport {
	matches: Array<{
		file: string;
		range: {
			start: number;
			end: number;
		};
		ruleId: string;
		message: string;
		severity: "error" | "warning" | "info";
	}>;
}

export function astGrepPlugin(options: AstGrepPluginOptions = {}): Plugin {
	const {
		configPath = "./rules/ast-grep/sgconfig.yml",
		verbose = false,
	} = options;

	let lastReport: AstGrepReport | null = null;
	let isRunning = false;

	const loadConfig = (): string[] => {
		try {
			const configDir = dirname(configPath);
			const configContent = readFileSync(configPath, "utf-8");
			const config = load(configContent) as AstGrepConfig;

			if (!config.ruleDirs || config.ruleDirs.length === 0) {
				if (verbose) {
					console.warn("[ast-grep-plugin] No ruleDirs found in config, using default paths");
				}
				return ["./apps", "./packages"];
			}

			return config.ruleDirs.map(dir => join(configDir, dir));
		} catch (error) {
			if (verbose) {
				console.error("[ast-grep-plugin] Error loading config:", error);
			}
			return ["./apps", "./packages"];
		}
	};

	const watchPaths = loadConfig();

	const runAstGrep = (): AstGrepReport => {
		try {
			const output = execSync("sg scan --json", {
				encoding: "utf-8",
				cwd: process.cwd(),
			});

			const report = JSON.parse(output) as AstGrepReport;
			return report;
		} catch (error) {
			if (verbose) {
				console.error("[ast-grep-plugin] Error running ast-grep:", error);
			}
			return { matches: [] };
		}
	};

	const displayReport = (report: AstGrepReport) => {
		if (report.matches.length === 0) {
			console.log("\x1b[32m✓ No ast-grep issues found\x1b[0m");
			return;
		}

		console.log(`\x1b[33m⚠ Found ${report.matches.length} ast-grep issues:\x1b[0m`);

		report.matches.forEach((match, index) => {
			const severityColor = match.severity === "error"
				? "\x1b[31m"
				: match.severity === "warning"
				? "\x1b[33m"
				: "\x1b[36m";

			console.log(
				`\n  ${index + 1}. ${severityColor}[${match.severity.toUpperCase()}]\x1b[0m ${match.ruleId}`,
			);
			console.log(`     File: ${match.file}`);
			console.log(`     Range: ${match.range.start}-${match.range.end}`);
			console.log(`     Message: ${match.message}`);
		});
	};

	return {
		name: "vite-plugin-ast-grep",
		enforce: "post",

		configResolved(config) {
			if (config.command === "serve") {
				const report = runAstGrep();
				lastReport = report;
				displayReport(report);
			}
		},

		configureServer(server) {
			server.ws.on("vite-plugin-ast-grep:refresh", () => {
				if (isRunning) return;
				isRunning = true;

				try {
					const report = runAstGrep();
					lastReport = report;
					displayReport(report);
				} finally {
					isRunning = false;
				}
			});
		},

		handleHotUpdate({ file }) {
			if (!watchPaths.some(path => file.startsWith(path))) {
				return;
			}

			if (isRunning) {
				return;
			}

			isRunning = true;

			setTimeout(() => {
				try {
					const report = runAstGrep();
					lastReport = report;
					displayReport(report);
				} finally {
					isRunning = false;
				}
			}, 100);

			return;
		},
	};
}
