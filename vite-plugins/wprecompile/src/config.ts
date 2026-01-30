import type { PrecompilePluginOptions } from "./types";

const DEFAULT_OPTIONS: Required<PrecompilePluginOptions> = {
	include: ["./apps", "./packages"],
	exclude: ["node_modules", ".git", "dist", ".nuxt"],
	enabled: true,
	verbose: false,
	cache: true,
	cacheDir: "./node_modules/.vite/precompile-cache",
	compileOnStart: true,
	compileOnChange: true,
	extensions: [".ts", ".tsx", ".vue", ".js", ".jsx"],
	compilerOptions: {
		minify: false,
		sourcemap: true,
		target: "esnext",
	},
};

export function resolveOptions(
	options: PrecompilePluginOptions = {},
): Required<PrecompilePluginOptions> {
	return {
		...DEFAULT_OPTIONS,
		...options,
		compilerOptions: {
			...DEFAULT_OPTIONS.compilerOptions,
			...options.compilerOptions,
		},
	};
}

export function getCacheKey(file: string): string {
	return file.replace(/[/\\]/g, "_");
}
