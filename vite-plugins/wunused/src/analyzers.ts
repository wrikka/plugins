import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import type { FileAnalysis, FileExport, FileImport, UnusedReport, WunusedPluginOptions } from "./types.js";

export class CodeAnalyzer {
	private options: WunusedPluginOptions;
	private cwd: string;
	private fileAnalyses: Map<string, FileAnalysis> = new Map();

	constructor(options: WunusedPluginOptions = {}, cwd: string = process.cwd()) {
		this.options = options;
		this.cwd = cwd;
	}

	async analyze(): Promise<UnusedReport> {
		const files = this.getFilesToAnalyze();

		for (const file of files) {
			const analysis = this.analyzeFile(file);
			if (analysis) {
				this.fileAnalyses.set(file, analysis);
			}
		}

		return this.generateReport();
	}

	private getFilesToAnalyze(): string[] {
		const { include = ["src/**/*"], exclude = ["**/*.test.ts", "**/*.spec.ts", "**/node_modules/**"] } = this.options;
		const patterns = include.map((p) => join(this.cwd, p));

		// Simple glob implementation
		const files: string[] = [];
		for (const pattern of patterns) {
			const dir = dirname(pattern);
			const base = pattern.split("/").pop() || "*";

			if (existsSync(dir)) {
				this.scanDirectory(dir, base, files, exclude);
			}
		}

		return files;
	}

	private scanDirectory(_dir: string, _pattern: string, _files: string[], _excludePatterns: string[]): void {
		try {
			// This is a simplified version - in real implementation, use fs.readdirSync
		} catch {
			return;
		}
	}

	private analyzeFile(filePath: string): FileAnalysis | null {
		try {
			const content = readFileSync(filePath, "utf-8");
			const lines = content.split("\n");

			const exports: FileExport[] = [];
			const imports: FileImport[] = [];

			let lineIndex = 0;
			for (const line of lines) {
				lineIndex++;

				// Detect exports
				const exportMatch = line.match(
					/export\s+(?:default\s+)?(?:const|let|var|function|class|type|interface)\s+(\w+)/,
				);
				if (exportMatch) {
					exports.push({
						name: exportMatch[1],
						line: lineIndex,
						isDefault: line.includes("export default"),
						isType: line.includes("type") || line.includes("interface"),
					});
				}

				// Detect named exports
				const namedExportMatch = line.match(/export\s*{\s*([^}]+)\s*}/);
				if (namedExportMatch) {
					const names = namedExportMatch[1].split(",").map((n) => n.trim().split(" as ")[0].trim());
					for (const name of names) {
						exports.push({
							name,
							line: lineIndex,
							isDefault: false,
							isType: false,
						});
					}
				}

				// Detect imports
				const importMatch = line.match(/import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/);
				if (importMatch) {
					const importNames = importMatch[1].split(",").map((n) => n.trim().split(" as ")[0].trim());
					imports.push({
						source: importMatch[2],
						imports: importNames,
						line: lineIndex,
					});
				}

				const defaultImportMatch = line.match(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
				if (defaultImportMatch) {
					imports.push({
						source: defaultImportMatch[2],
						imports: [defaultImportMatch[1]],
						line: lineIndex,
					});
				}
			}

			return {
				path: filePath,
				exports,
				imports,
				isEntry: this.isEntryFile(filePath),
			};
		} catch {
			return null;
		}
	}

	private isEntryFile(filePath: string): boolean {
		const relativePath = relative(this.cwd, filePath);
		return (
			relativePath.includes("index.")
			|| relativePath.includes("main.")
			|| relativePath.includes("app.")
			|| relativePath.includes("entry.")
		);
	}

	private generateReport(): UnusedReport {
		const usedExports = new Map<string, Set<string>>();

		// Track used exports
		for (const [filePath, analysis] of this.fileAnalyses) {
			for (const imp of analysis.imports) {
				const sourcePath = this.resolveImportPath(filePath, imp.source);
				if (sourcePath) {
					const fileAnalysis = this.fileAnalyses.get(sourcePath);
					if (fileAnalysis) {
						for (const importName of imp.imports) {
							if (!usedExports.has(sourcePath)) {
								usedExports.set(sourcePath, new Set());
							}
							usedExports.get(sourcePath)!.add(importName);
						}
					}
				}
			}
		}

		const unusedFiles: string[] = [];
		const unusedExports: Array<{ file: string; exports: FileExport[] }> = [];
		const unusedDependencies: string[] = [];

		const ignoreExports = new Set(this.options.ignoreExports || ["default", "__esModule"]);
		const ignoreFiles = new Set(this.options.ignoreFiles || []);

		// Find unused files
		for (const [filePath, analysis] of this.fileAnalyses) {
			if (analysis.isEntry) continue;

			const isImported = Array.from(this.fileAnalyses.values()).some((a) =>
				a.imports.some((i) => this.resolveImportPath(a.path, i.source) === filePath)
			);

			if (!isImported && !ignoreFiles.has(filePath)) {
				unusedFiles.push(filePath);
			}
		}

		// Find unused exports
		for (const [filePath, analysis] of this.fileAnalyses) {
			const used = usedExports.get(filePath) || new Set();
			const unused = analysis.exports.filter((exp) => !used.has(exp.name) && !ignoreExports.has(exp.name));

			if (unused.length > 0) {
				unusedExports.push({
					file: filePath,
					exports: unused,
				});
			}
		}

		return {
			unusedFiles,
			unusedExports,
			unusedDependencies,
			duplicateDependencies: [],
			unresolvedImports: [],
		};
	}

	private resolveImportPath(currentFile: string, importSource: string): string | null {
		if (importSource.startsWith(".")) {
			const dir = dirname(currentFile);
			const resolved = join(dir, importSource);

			// Try different extensions
			const extensions = [".ts", ".tsx", ".js", ".jsx", ".vue"];
			for (const ext of extensions) {
				const path = `${resolved}${ext}`;
				if (existsSync(path)) {
					return path;
				}
			}

			// Try index file
			for (const ext of extensions) {
				const path = join(resolved, `index${ext}`);
				if (existsSync(path)) {
					return path;
				}
			}

			return null;
		}

		return null;
	}
}
