import { execSync } from "node:child_process";
import type { Plugin } from "vite";

interface DprintPluginOptions {
	configPath?: string;
	watchPaths?: string[];
	verbose?: boolean;
	formatOnStart?: boolean;
	formatOnChange?: boolean;
}

interface DprintReport {
	formattedFiles: string[];
	errors: string[];
}

export function dprintPlugin(options: DprintPluginOptions = {}): Plugin {
	const {
		configPath = "./dprint.json",
		watchPaths = ["./apps", "./packages", "./plugins"],
		verbose = false,
		formatOnStart = true,
		formatOnChange = true,
	} = options;

	let isRunning = false;

	const runDprint = (): DprintReport => {
		try {
			const output = execSync(`dprint fmt --config ${configPath}`, {
				encoding: "utf-8",
				cwd: process.cwd(),
			});

			if (verbose) {
				console.log("[dprint-plugin] dprint output:", output);
			}

			const lines = output.split("\n");
			const formattedFiles: string[] = [];
			const errors: string[] = [];

			lines.forEach(line => {
				if (line.includes("would format")) {
					const match = line.match(/would format (.+)/);
					if (match?.[1]) {
						formattedFiles.push(match[1].trim());
					}
				}
				if (line.toLowerCase().includes("error")) {
					errors.push(line);
				}
			});

			return { formattedFiles, errors };
		} catch (error) {
			if (verbose) {
				console.error("[dprint-plugin] Error running dprint:", error);
			}
			return { formattedFiles: [], errors: [String(error)] };
		}
	};

	const displayReport = (report: DprintReport) => {
		if (report.errors.length > 0) {
			console.log("\x1b[31m✗ dprint errors:\x1b[0m");
			report.errors.forEach(error => {
				console.log(`  ${error}`);
			});
			return;
		}

		if (report.formattedFiles.length === 0) {
			console.log("\x1b[32m✓ All files are properly formatted\x1b[0m");
			return;
		}

		console.log(`\x1b[33m⚠ ${report.formattedFiles.length} file(s) need formatting:\x1b[0m`);
		report.formattedFiles.forEach((file, index) => {
			console.log(`  ${index + 1}. ${file}`);
		});
	};

	return {
		name: "vite-plugin-dprint-formatter",
		enforce: "post",

		configResolved(config) {
			if (config.command === "serve" && formatOnStart) {
				const report = runDprint();
				displayReport(report);
			}
		},

		handleHotUpdate({ file }) {
			if (!formatOnChange) {
				return;
			}

			if (!watchPaths.some(path => file.startsWith(path))) {
				return;
			}

			if (isRunning) {
				return;
			}

			isRunning = true;

			setTimeout(() => {
				try {
					const report = runDprint();
					displayReport(report);
				} finally {
					isRunning = false;
				}
			}, 100);

			return;
		},
	};
}
