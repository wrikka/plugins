import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";
import { CodeAnalyzer } from "./analyzers.js";
import type { WunusedPluginOptions } from "./types.js";
import { formatFilePath, logError, logInfo, logSection, logSuccess, logWarning } from "./utils.js";

export function wunusedPlugin(options: WunusedPluginOptions = {}): Plugin {
	const {
		include = ["src/**/*"],
		exclude = ["**/*.test.ts", "**/*.spec.ts", "**/node_modules/**"],
		ignoreExports = ["default", "__esModule"],
		ignoreFiles = [],
		verbose = false,
		reportUnusedFiles = true,
		reportUnusedExports = true,
		reportUnusedDependencies = true,
		watchMode = false,
	} = options;

	let analyzer: CodeAnalyzer;
	let isRunning = false;

	const runAnalysis = async () => {
		if (isRunning) return;
		isRunning = true;

		try {
			if (verbose) {
				logInfo("Running unused code analysis...");
			}

			const report = await analyzer.analyze();
			displayReport(report);
		} catch (error) {
			if (verbose) {
				logError(`Analysis failed: ${error instanceof Error ? error.message : String(error)}`);
			}
		} finally {
			isRunning = false;
		}
	};

	const displayReport = (report: any) => {
		const cwd = process.cwd();

		if (reportUnusedFiles && report.unusedFiles.length > 0) {
			logSection("📄 Unused Files:");
			for (const file of report.unusedFiles) {
				logWarning(`  ${formatFilePath(file, cwd)}`);
			}
		}

		if (reportUnusedExports && report.unusedExports.length > 0) {
			logSection("🎯 Unused Exports:");
			for (const item of report.unusedExports) {
				const filePath = formatFilePath(item.file, cwd);
				for (const exp of item.exports) {
					logWarning(`  ${filePath}:${exp.line} - ${exp.name}`);
				}
			}
		}

		if (reportUnusedDependencies && report.unusedDependencies.length > 0) {
			logSection("📦 Unused Dependencies:");
			for (const dep of report.unusedDependencies) {
				logWarning(`  ${dep}`);
			}
		}

		if (report.duplicateDependencies.length > 0) {
			logSection("⚠️  Duplicate Dependencies:");
			for (const dep of report.duplicateDependencies) {
				logWarning(`  ${dep.name}: ${dep.versions.join(", ")}`);
			}
		}

		if (report.unresolvedImports.length > 0) {
			logSection("❌ Unresolved Imports:");
			for (const imp of report.unresolvedImports) {
				logError(`  ${formatFilePath(imp.file, cwd)}: ${imp.source}`);
			}
		}

		const totalIssues = report.unusedFiles.length
			+ report.unusedExports.length
			+ report.unusedDependencies.length
			+ report.duplicateDependencies.length
			+ report.unresolvedImports.length;

		if (totalIssues === 0) {
			logSuccess("No unused code or dependencies found!");
		} else {
			logInfo(`Found ${totalIssues} issue${totalIssues > 1 ? "s" : ""}`);
		}
	};

	return {
		name: "vite-plugin-wunused",
		enforce: "post",

		configResolved(config: ResolvedConfig) {
			analyzer = new CodeAnalyzer(
				{
					include,
					exclude,
					ignoreExports,
					ignoreFiles,
					verbose,
					reportUnusedFiles,
					reportUnusedExports,
					reportUnusedDependencies,
				},
				config.root,
			);

			if (config.command === "serve" || config.command === "build") {
				runAnalysis();
			}
		},

		configureServer(server: ViteDevServer) {
			if (!watchMode) return;

			server.ws.on("vite-plugin-wunused:refresh", () => {
				runAnalysis();
			});
		},

		handleHotUpdate(): void {
			if (!watchMode) return;

			// Debounce the analysis
			if (isRunning) return;

			setTimeout(() => {
				runAnalysis();
			}, 300);

			return;
		},
	};
}

export { CodeAnalyzer } from "./analyzers.js";
export type * from "./types.js";
