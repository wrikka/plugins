import type { Plugin } from "vite";

export interface AnalyzerPluginOptions {
	enabled?: boolean;
	verbose?: boolean;
	open?: boolean;
	outputFile?: string;
	outputFormat?: "html" | "json" | "treemap" | "sunburst" | "network";
	gzipSize?: boolean;
	brotliSize?: boolean;
}
