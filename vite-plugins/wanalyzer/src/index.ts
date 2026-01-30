import { visualizer } from "rollup-plugin-visualizer";

import type { Plugin } from "vite";
import type { AnalyzerPluginOptions } from "./types";

export function wanalyzerPlugin(options: AnalyzerPluginOptions = {}): Plugin {
	const {
		enabled = true,
		verbose = false,
		open = false,
		outputFile = "./stats.html",
		outputFormat = "html",
		gzipSize = true,
		brotliSize = true,
	} = options;

	if (!enabled) {
		return {
			name: "vite-plugin-wanalyzer",
		};
	}

	return {
		name: "vite-plugin-wanalyzer",
		apply: "build",

		plugins: [
			visualizer({
				open,
				filename: outputFile,
				template: outputFormat,
				gzipSize,
				brotliSize,
				brotliSizeOptions: { mode: "compress" },
			}),
		],

		closeBundle() {
			if (verbose) {
				console.log(`[wanalyzer] Bundle analysis saved to ${outputFile}`);
			}
		},
	};
}

export * from "./types";
