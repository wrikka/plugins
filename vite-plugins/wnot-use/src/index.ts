import { readFileSync } from "node:fs";
import type { Plugin } from "vite";

interface PatternKeyword {
	pattern: string;
	keyword: string;
}

interface NotUsePluginOptions {
	rules: PatternKeyword[];
	watchPaths?: string[];
}

export function notUsePlugin(options: NotUsePluginOptions): Plugin {
	const { rules, watchPaths = ["./apps", "./packages"] } = options;

	const checkFile = (filePath: string) => {
		for (const rule of rules) {
			if (!filePath.match(rule.pattern)) continue;

			try {
				const content = readFileSync(filePath, "utf-8");
				if (content.includes(rule.keyword)) {
					console.warn(
						`\x1b[33m⚠  File "${filePath}" contains "${rule.keyword}" which should not be used\x1b[0m`,
					);
				}
			} catch (error) {
				const err = error as { code?: string };
				if (err.code !== "ENOENT") {
					console.error(`Error reading file ${filePath}:`, error);
				}
			}
		}
	};

	return {
		name: "vite-plugin-not-use",
		enforce: "post",

		handleHotUpdate({ file }: { file: string }) {
			if (!watchPaths.some((path) => file.startsWith(path))) {
				return;
			}

			checkFile(file);
		},
	};
}
