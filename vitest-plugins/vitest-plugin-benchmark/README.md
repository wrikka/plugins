# @wrikka/vitest-plugin-benchmark

Enhanced benchmark utilities for Vitest.

## Installation

```bash
bun add -D @wrikka/vitest-plugin-benchmark
```

## Usage

```typescript
// vitest.config.ts
import { vitestBenchmark } from "@wrikka/vitest-plugin-benchmark";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [
		vitestBenchmark({
			outputFile: "benchmark-results.json",
			format: "markdown",
		}),
	],
});
```

## Options

```typescript
interface BenchmarkOptions {
	// Output file path
	outputFile?: string;
	// Output format: json, markdown, or html
	format?: "json" | "markdown" | "html";
	// Performance threshold (ops/sec)
	threshold?: number;
}
```

## Example

```typescript
// example.bench.ts
import { bench, describe } from "vitest";

describe("Array operations", () => {
	bench("Array.push", () => {
		const arr = [];
		for (let i = 0; i < 1000; i++) {
			arr.push(i);
		}
	});

	bench("Array spread", () => {
		let arr = [];
		for (let i = 0; i < 1000; i++) {
			arr = [...arr, i];
		}
	});
});
```

## Features

- 📊 Export results in JSON, Markdown, or HTML
- 🏆 Automatically mark fastest/slowest benchmarks
- 📈 Performance threshold warnings
- 🎯 Easy integration with CI/CD

## License

MIT
