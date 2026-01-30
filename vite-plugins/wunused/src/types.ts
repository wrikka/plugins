export interface WunusedPluginOptions {
	include?: string[];
	exclude?: string[];
	ignoreExports?: string[];
	ignoreFiles?: string[];
	verbose?: boolean;
	reportUnusedFiles?: boolean;
	reportUnusedExports?: boolean;
	reportUnusedDependencies?: boolean;
	watchMode?: boolean;
}

export interface FileExport {
	name: string;
	line: number;
	isDefault: boolean;
	isType: boolean;
}

export interface FileImport {
	source: string;
	imports: string[];
	line: number;
}

export interface FileAnalysis {
	path: string;
	exports: FileExport[];
	imports: FileImport[];
	isEntry: boolean;
}

export interface UnusedReport {
	unusedFiles: string[];
	unusedExports: Array<{
		file: string;
		exports: FileExport[];
	}>;
	unusedDependencies: string[];
	duplicateDependencies: Array<{
		name: string;
		versions: string[];
	}>;
	unresolvedImports: Array<{
		file: string;
		source: string;
	}>;
}

export interface AnalysisResult {
	totalFiles: number;
	totalExports: number;
	totalImports: number;
	usedExports: Set<string>;
	report: UnusedReport;
}

export interface VitePluginInfo {
	name: string;
	config?: unknown;
}
