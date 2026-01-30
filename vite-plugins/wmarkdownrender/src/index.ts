import type { Plugin } from "vite";
import { WMarkdownRenderer } from "./renderer";
import type { VitePluginOptions } from "./types";

export function wmarkdownrender(options: VitePluginOptions = {}): Plugin {
	const {
		extensions = [".md", ".markdown"],
		include = /\.md$/,
		exclude = /node_modules/,
		transformOptions = {},
	} = options;

	const renderer = new WMarkdownRenderer(transformOptions);

	return {
		name: "vite-plugin-wmarkdownrender",

		configResolved(config) {
			if (config.command === "serve") {
				console.log("[wmarkdownrender] Plugin initialized");
			}
		},

		async transform(code, id) {
			if (!include.test(id)) {
				return null;
			}

			if (exclude.test(id)) {
				return null;
			}

			if (!extensions.some(ext => id.endsWith(ext))) {
				return null;
			}

			try {
				const html = transformOptions.enableAsync
					? await renderer.renderAsync(code)
					: await renderer.render(code);

				return {
					code: `export default ${JSON.stringify(html)}`,
					map: null,
				};
			} catch (error) {
				console.error(`[wmarkdownrender] Error processing ${id}:`, error);
				return null;
			}
		},

		async handleHotUpdate({ file, modules }) {
			if (!extensions.some(ext => file.endsWith(ext))) {
				return;
			}

			return modules;
		},
	};
}

export { createPlugin, PluginManager } from "./plugins";
export { WMarkdownRenderer } from "./renderer";
export type { MarkdownParser, MarkdownPlugin, MarkdownRenderOptions, VitePluginOptions } from "./types";
