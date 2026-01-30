export interface PrecompilePluginOptions {
	/** Paths to directories or files to precompile */
	include?: string[];
	/** Paths to exclude from precompilation */
	exclude?: string[];
	/** Enable/disable precompilation */
	enabled?: boolean;
	/** Enable verbose logging */
	verbose?: boolean;
	/** Enable caching of compiled results */
	cache?: boolean;
	/** Cache directory path */
	cacheDir?: string;
	/** Precompile on dev server start */
	compileOnStart?: boolean;
	/** Precompile on file changes */
	compileOnChange?: boolean;
	/** File extensions to precompile */
	extensions?: string[];
	/** Custom compiler options */
	compilerOptions?: {
		/** Minify output */
		minify?: boolean;
		/** Source maps */
		sourcemap?: boolean;
		/** Target environment */
		target?: "esnext" | "es2020" | "es2015" | "es5";
	};
}

export interface CompileResult {
	file: string;
	success: boolean;
	duration: number;
	error?: string;
}

export interface PrecompileReport {
	compiled: CompileResult[];
	cached: number;
	failed: number;
	totalDuration: number;
}

export interface CacheEntry {
	file: string;
	compiled: string;
	compileTime: number;
	hash: string;
}
