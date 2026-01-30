import type { Plugin } from "vite";

interface ReplacePluginOptions {
	replacements?: Record<string, string>;
	verbose?: boolean;
}

export function replacePlugin(options: ReplacePluginOptions = {}): Plugin {
	const { replacements = {}, verbose = false } = options;

	if (Object.keys(replacements).length === 0) {
		if (verbose) {
			console.log("[replace-plugin] No replacements configured");
		}
		return {
			name: "vite-plugin-wreplace",
		};
	}

	return {
		name: "vite-plugin-wreplace",
		enforce: "pre",

		transform(code: string, id: string) {
			let transformedCode = code;
			let hasChanges = false;

			for (const [search, replace] of Object.entries(replacements)) {
				if (transformedCode.includes(search)) {
					transformedCode = transformedCode.replaceAll(search, replace);
					hasChanges = true;

					if (verbose) {
						console.log(`[replace-plugin] Replaced "${search}" in ${id}`);
					}
				}
			}

			if (hasChanges) {
				return {
					code: transformedCode,
					map: null,
				};
			}

			return null;
		},
	};
}
