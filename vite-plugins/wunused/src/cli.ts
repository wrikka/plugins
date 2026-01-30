#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CodeAnalyzer } from "./analyzers.js";
import type { WunusedPluginOptions } from "./types.js";
import { logInfo, logSuccess, logWarning, logError, logSection, formatFilePath } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CliOptions {
	config?: string;
	watch?: boolean;
	verbose?: boolean;
	include?: string[];
	exclude?: string[];
	ignoreExports?: string[];
	ignoreFiles?: string[];
}

function parseArgs(args: string[]): CliOptions {
	const options: CliOptions = {};
	let i = 0;

	while (i < args.length) {
		const arg = args[i];

		switch (arg) {
			case "--config":
			case "-c":
				options.config = args[++i];
				break;
			case "--watch":
			case "-w":
				options.watch = true;
				break;
			case "--verbose":
			case "-v":
				options.verbose = true;
				break;
			case "--include":
				options.include = (args[++i] || "").split(",");
				break;
			case "--exclude":
				options.exclude = (args[++i] || "").split(",");
				break;
			case "--ignore-exports":
				options.ignoreExports = (args[++i] || "").split(",");
				break;
			case "--ignore-files":
				options.ignoreFiles = (args[++i] || "").split(",");
				break;
			default:
				if (arg.startsWith("--")) {
					logWarning(`Unknown option: ${arg}`);
				}
				break;
		}

		i++;
	}

	return options;
}

function loadConfig(configPath: string): Partial<WunusedPluginOptions> | null {
	const fullPath = join(process.cwd(), configPath);

	if (!existsSync(fullPath)) {
		logError(`Config file not found: ${configPath}`);
		return null;
	}

	try {
		const content = readFileSync(fullPath, "utf-8");
		return JSON.parse(content) as Partial<WunusedPluginOptions>;
	} catch (error) {
		logError(`Failed to load config: ${error instanceof Error ? error.message : String(error)}`);
		return null;
	}
}

async function main() {
	const args = process.argv.slice(2);
	const cliOptions = parseArgs(args);

	const options: WunusedPluginOptions = {};

	// Load config file if specified
	if (cliOptions.config) {
		const config = loadConfig(cliOptions.config);
		if (config) {
			Object.assign(options, config);
		}
	}

	// Merge CLI options
	if (cliOptions.verbose) options.verbose = true;
	if (cliOptions.watch) options.watchMode = true;
	if (cliOptions.include) options.include = cliOptions.include;
	if (cliOptions.exclude) options.exclude = cliOptions.exclude;
	if (cliOptions.ignoreExports) options.ignoreExports = cliOptions.ignoreExports;
	if (cliOptions.ignoreFiles) options.ignoreFiles = cliOptions.ignoreFiles;

	logInfo("🔍 Analyzing project...\n");

	const analyzer = new CodeAnalyzer(options);

	if (cliOptions.watch) {
		logInfo("Watch mode enabled. Press Ctrl+C to exit.\n");

		let isRunning = false;
		const runAnalysis = async () => {
			if (isRunning) return;
			isRunning = true;

			try {
				const report = await analyzer.analyze();
				displayReport(report);
			} finally {
				isRunning = false;
			}
		};

		await runAnalysis();

		// Simple file watching (in real implementation, use chokidar)
		// For now, just run once
	} else {
		const report = await analyzer.analyze();
		displayReport(report);
	}
}

function displayReport(report: any) {
	const cwd = process.cwd();

	if (report.unusedFiles.length > 0) {
		logSection("📄 Unused Files:");
		for (const file of report.unusedFiles) {
			logWarning(`  ${formatFilePath(file, cwd)}`);
		}
	}

	if (report.unusedExports.length > 0) {
		logSection("🎯 Unused Exports:");
		for (const item of report.unusedExports) {
			const filePath = formatFilePath(item.file, cwd);
			for (const exp of item.exports) {
				logWarning(`  ${filePath}:${exp.line} - ${exp.name}`);
			}
		}
	}

	if (report.unusedDependencies.length > 0) {
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

	const totalIssues =
		report.unusedFiles.length +
		report.unusedExports.length +
		report.unusedDependencies.length +
		report.duplicateDependencies.length +
		report.unresolvedImports.length;

	if (totalIssues === 0) {
		logSuccess("✨ No unused code or dependencies found!");
	} else {
		logInfo(`Found ${totalIssues} issue${totalIssues > 1 ? "s" : ""}`);
	}
}

main().catch((error) => {
	logError(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
	process.exit(1);
});
