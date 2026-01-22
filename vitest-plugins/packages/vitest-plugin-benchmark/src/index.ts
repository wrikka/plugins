import type { Plugin } from "vitest/config";

export interface BenchmarkOptions {
	outputFile?: string;
	format?: "json" | "markdown" | "html";
	threshold?: number;
}

export interface BenchmarkResult {
	name: string;
	ops: number;
	time: number;
	samples: number;
	fastest?: boolean;
	slowest?: boolean;
}

export function vitestBenchmark(options: BenchmarkOptions = {}): Plugin {
	const results: BenchmarkResult[] = [];

	return {
		name: "vitest-plugin-benchmark",
		config() {
			return {
				test: {
					benchmark: {
						include: ["**/*.bench.ts"],
					},
				},
			};
		},
		async writeBundle() {
			if (results.length > 0 && options.outputFile) {
				await saveBenchmarkResults(results, options);
			}
		},
	};
}

async function saveBenchmarkResults(
	results: BenchmarkResult[],
	options: BenchmarkOptions,
): Promise<void> {
	const format = options.format || "json";
	let content: string;

	if (format === "json") {
		content = JSON.stringify(results, null, 2);
	} else if (format === "markdown") {
		content = generateMarkdownReport(results);
	} else {
		content = generateHtmlReport(results);
	}

	const isBrowser = typeof (globalThis as unknown as { window?: unknown }).window !== "undefined";
	if (!isBrowser) {
		const fs = await import("node:fs");
		fs.writeFileSync(options.outputFile!, content);
	}
}

function generateMarkdownReport(results: BenchmarkResult[]): string {
	let md = "# Benchmark Results\n\n";
	md += "| Name | Ops/sec | Time (ms) | Samples |\n";
	md += "|------|---------|-----------|--------|\n";

	for (const result of results) {
		const badge = result.fastest ? " 🏆" : result.slowest ? " 🐌" : "";
		md += `| ${result.name}${badge} | ${result.ops.toFixed(0)} | ${result.time.toFixed(2)} | ${result.samples} |\n`;
	}

	return md;
}

function generateHtmlReport(results: BenchmarkResult[]): string {
	return `<!DOCTYPE html>
<html>
<head>
  <title>Benchmark Results</title>
  <style>
    body { font-family: system-ui; max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; }
    .fastest { background-color: #d4edda; }
    .slowest { background-color: #f8d7da; }
  </style>
</head>
<body>
  <h1>Benchmark Results</h1>
  <table>
    <thead>
      <tr><th>Name</th><th>Ops/sec</th><th>Time (ms)</th><th>Samples</th></tr>
    </thead>
    <tbody>
      ${
		results.map((r) =>
			`<tr class="${r.fastest ? "fastest" : r.slowest ? "slowest" : ""}">
        <td>${r.name}</td>
        <td>${r.ops.toFixed(0)}</td>
        <td>${r.time.toFixed(2)}</td>
        <td>${r.samples}</td>
      </tr>`
		).join("\n")
	}
    </tbody>
  </table>
</body>
</html>`;
}

export default vitestBenchmark;
