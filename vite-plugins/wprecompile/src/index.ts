import { build } from "esbuild";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";
import { resolveOptions } from "./config";
import type { CacheEntry, CompileResult, PrecompilePluginOptions, PrecompileReport } from "./types";

export function precompilePlugin(options: PrecompilePluginOptions = {}): Plugin {
	const resolved = resolveOptions(options);

	if (!resolved.enabled) {
		return {
			name: "vite-plugin-precompile",
			enforce: "pre",
			configResolved() {
				console.log("[vite-plugin-precompile] Plugin is disabled");
			},
		};
	}

	let isRunning = false;
	const cache = new Map<string, CacheEntry>();

	const ensureCacheDir = () => {
		if (!existsSync(resolved.cacheDir)) {
			mkdirSync(resolved.cacheDir, { recursive: true });
		}
	};

	const loadCache = () => {
		try {
			const cacheFile = join(resolved.cacheDir, "cache.json");
			if (existsSync(cacheFile)) {
				const data = readFileSync(cacheFile, "utf-8");
				const entries = JSON.parse(data) as CacheEntry[];
				entries.forEach((entry) => {
					cache.set(entry.file, entry);
				});
				if (resolved.verbose) {
					console.log(`[vite-plugin-precompile] Loaded ${entries.length} cache entries`);
				}
			}
		} catch (error) {
			if (resolved.verbose) {
				console.error("[vite-plugin-precompile] Error loading cache:", error);
			}
		}
	};

	const saveCache = () => {
		try {
			ensureCacheDir();
			const cacheFile = join(resolved.cacheDir, "cache.json");
			const entries = Array.from(cache.values());
			writeFileSync(cacheFile, JSON.stringify(entries, null, 2));
			if (resolved.verbose) {
				console.log(`[vite-plugin-precompile] Saved ${entries.length} cache entries`);
			}
		} catch (error) {
			if (resolved.verbose) {
				console.error("[vite-plugin-precompile] Error saving cache:", error);
			}
		}
	};

	const getFileHash = (file: string): string => {
		const stats = statSync(file);
		return `${stats.mtime.getTime()}-${stats.size}`;
	};

	const shouldCompile = (file: string): boolean => {
		if (!resolved.extensions.some((ext) => file.endsWith(ext))) {
			return false;
		}

		if (resolved.exclude.some((pattern) => file.includes(pattern))) {
			return false;
		}

		return true;
	};

	const compileFile = async (file: string): Promise<CompileResult> => {
		const startTime = Date.now();

		try {
			const hash = getFileHash(file);
			const cached = cache.get(file);

			if (cached && cached.hash === hash && resolved.cache) {
				return {
					file,
					success: true,
					duration: Date.now() - startTime,
				};
			}

			const result = await build({
				entryPoints: [file],
				bundle: false,
				write: false,
				minify: resolved.compilerOptions.minify,
				sourcemap: resolved.compilerOptions.sourcemap,
				target: resolved.compilerOptions.target,
				format: "esm",
			});

			if (result.outputFiles.length > 0) {
				const compiled = result.outputFiles[0].text;

				if (resolved.cache) {
					cache.set(file, {
						file,
						compiled,
						compileTime: Date.now(),
						hash,
					});
				}

				return {
					file,
					success: true,
					duration: Date.now() - startTime,
				};
			}

			return {
				file,
				success: false,
				duration: Date.now() - startTime,
				error: "No output files generated",
			};
		} catch (error) {
			return {
				file,
				success: false,
				duration: Date.now() - startTime,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	};

	const getFilesToCompile = (baseDir: string): string[] => {
		const files: string[] = [];

		const scanDir = (dir: string) => {
			try {
				const entries = readdirSync(dir);

				for (const entry of entries) {
					const fullPath = join(dir, entry);
					const stats = statSync(fullPath);

					if (stats.isDirectory()) {
						if (!resolved.exclude.some((pattern) => fullPath.includes(pattern))) {
							scanDir(fullPath);
						}
					} else if (stats.isFile() && shouldCompile(fullPath)) {
						files.push(fullPath);
					}
				}
			} catch (error) {
				if (resolved.verbose) {
					console.error(`[vite-plugin-precompile] Error scanning ${dir}:`, error);
				}
			}
		};

		for (const includePath of resolved.include) {
			const stats = statSync(includePath);
			if (stats.isDirectory()) {
				scanDir(includePath);
			} else if (stats.isFile() && shouldCompile(includePath)) {
				files.push(includePath);
			}
		}

		return files;
	};

	const runPrecompile = async (): Promise<PrecompileReport> => {
		const startTime = Date.now();
		const results: CompileResult[] = [];

		const files = getFilesToCompile(process.cwd());

		if (resolved.verbose) {
			console.log(`[vite-plugin-precompile] Found ${files.length} files to compile`);
		}

		for (const file of files) {
			const result = await compileFile(file);
			results.push(result);
		}

		const cached = results.filter((r) => r.success && r.duration < 10).length;
		const failed = results.filter((r) => !r.success).length;

		return {
			compiled: results,
			cached,
			failed,
			totalDuration: Date.now() - startTime,
		};
	};

	const displayReport = (report: PrecompileReport) => {
		const { compiled, cached, failed, totalDuration } = report;

		if (failed > 0) {
			console.log(`\x1b[31m✗ ${failed} file(s) failed to compile\x1b[0m`);
			compiled
				.filter((r) => !r.success)
				.forEach((result) => {
					console.log(`  - ${result.file}`);
					if (result.error) {
						console.log(`    Error: ${result.error}`);
					}
				});
		}

		if (cached > 0) {
			console.log(`\x1b[36m○ ${cached} file(s) loaded from cache\x1b[0m`);
		}

		const compiledCount = compiled.filter((r) => r.success && r.duration >= 10).length;
		if (compiledCount > 0) {
			console.log(`\x1b[32m✓ ${compiledCount} file(s) compiled\x1b[0m`);
		}

		console.log(`\x1b[90m⏱ Total: ${totalDuration}ms\x1b[0m`);
	};

	return {
		name: "vite-plugin-precompile",
		enforce: "pre",

		configResolved(config) {
			if (config.command === "serve" && resolved.compileOnStart) {
				loadCache();

				runPrecompile()
					.then((report) => {
						displayReport(report);
						saveCache();
					})
					.catch((error) => {
						console.error("[vite-plugin-precompile] Error during precompile:", error);
					});
			}
		},

		handleHotUpdate({ file }) {
			if (!resolved.compileOnChange) {
				return;
			}

			if (!shouldCompile(file)) {
				return;
			}

			if (!resolved.include.some((path) => file.startsWith(path))) {
				return;
			}

			if (isRunning) {
				return;
			}

			isRunning = true;

			setTimeout(async () => {
				try {
					const result = await compileFile(file);
					if (resolved.verbose) {
						console.log(`[vite-plugin-precompile] Compiled ${file} in ${result.duration}ms`);
					}
					saveCache();
				} catch (error) {
					console.error("[vite-plugin-precompile] Error compiling file:", error);
				} finally {
					isRunning = false;
				}
			}, 100);

			return;
		},
	};
}

export default precompilePlugin;
