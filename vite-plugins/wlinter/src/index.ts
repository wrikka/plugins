import { execSync } from "node:child_process";
import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";

type LinterType = "oxlint" | "biome" | "eslint" | "vue-tsc";

interface LinterPluginOptions {
	linters?: LinterType[];
	watchPaths?: string[];
	verbose?: boolean;
	failOnError?: boolean;
}

interface LinterReport {
	linter: LinterType;
	success: boolean;
	output: string;
	error?: string;
}

export function linterPlugin(options: LinterPluginOptions = {}): Plugin {
	const {
		linters = ["oxlint", "biome", "eslint", "vue-tsc"],
		watchPaths = ["./apps", "./packages"],
		verbose = false,
		failOnError = false,
	} = options;

	let lastReports: Map<LinterType, LinterReport> = new Map();
	let isRunning = false;

	const runLinter = (linter: LinterType): LinterReport => {
		try {
			let command = "";
			let args: string[] = [];

			switch (linter) {
				case "oxlint":
					command = "oxlint";
					args = ["--quiet"];
					break;
				case "biome":
					command = "biome";
					args = ["check", "--diagnostic-level=error"];
					break;
				case "eslint":
					command = "eslint";
					args = ["."];
					break;
				case "vue-tsc":
					command = "vue-tsc";
					args = ["--noEmit"];
					break;
			}

			const output = execSync(`${command} ${args.join(" ")}`, {
				encoding: "utf-8",
				cwd: process.cwd(),
				stdio: "pipe",
			});

			return {
				linter,
				success: true,
				output,
			};
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			if (verbose) {
				console.error(`[linter-plugin] Error running ${linter}:`, error);
			}
			return {
				linter,
				success: false,
				output: "",
				error: errorMessage,
			};
		}
	};

	const displayReport = (report: LinterReport) => {
		const { linter, success, output, error } = report;

		if (success) {
			console.log(`\x1b[32m✓ ${linter} passed\x1b[0m`);
			return;
		}

		console.log(`\x1b[31m✗ ${linter} failed\x1b[0m`);

		if (error && verbose) {
			console.log(`\x1b[90mError: ${error}\x1b[0m`);
		}

		if (output) {
			console.log(`\x1b[90m${output}\x1b[0m`);
		}
	};

	const runAllLinters = (): Map<LinterType, LinterReport> => {
		const reports = new Map<LinterType, LinterReport>();

		for (const linter of linters) {
			const report = runLinter(linter);
			reports.set(linter, report);
			displayReport(report);

			if (!report.success && failOnError) {
				throw new Error(`${linter} failed`);
			}
		}

		return reports;
	};

	return {
		name: "vite-plugin-linter",
		enforce: "post",

		configResolved(config: ResolvedConfig) {
			if (config.command === "serve") {
				try {
					lastReports = runAllLinters();
				} catch (error) {
					if (verbose) {
						console.error("[linter-plugin] Initial lint failed:", error);
					}
				}
			}
		},

		configureServer(server: ViteDevServer) {
			server.ws.on("vite-plugin-linter:refresh", () => {
				if (isRunning) return;
				isRunning = true;

				try {
					lastReports = runAllLinters();
				} finally {
					isRunning = false;
				}
			});
		},

		handleHotUpdate({ file }: { file: string }) {
			if (!watchPaths.some(path => file.startsWith(path))) {
				return;
			}

			if (isRunning) {
				return;
			}

			isRunning = true;

			setTimeout(() => {
				try {
					lastReports = runAllLinters();
				} finally {
					isRunning = false;
				}
			}, 100);

			return;
		},
	};
}
