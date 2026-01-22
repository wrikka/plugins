import type { File, TaskResultPack } from "@vitest/runner";
import type { Reporter } from "vitest/reporters";

export interface ReporterOptions {
	emoji?: boolean;
	colors?: boolean;
	summary?: boolean;
}

export class VitestCustomReporter implements Reporter {
	private options: Required<ReporterOptions>;
	private startTime = 0;
	private passed = 0;
	private failed = 0;
	private skipped = 0;

	constructor(options: ReporterOptions = {}) {
		this.options = {
			emoji: options.emoji ?? true,
			colors: options.colors ?? true,
			summary: options.summary ?? true,
		};
	}

	onInit(): void {
		this.startTime = Date.now();
	}

	onTaskUpdate(packs: TaskResultPack[]): void {
		for (const [, result] of packs) {
			if (result?.state === "pass") this.passed++;
			if (result?.state === "fail") this.failed++;
			if (result?.state === "skip") this.skipped++;
		}
	}

	onFinished(files?: File[]): void {
		const duration = Date.now() - this.startTime;

		if (this.options.summary) {
			this.printSummary(duration);
		}

		if (files) {
			this.printFiles(files);
		}
	}

	private printSummary(duration: number): void {
		const total = this.passed + this.failed + this.skipped;
		const emoji = this.options.emoji;

		console.log("\n");
		console.log("━".repeat(50));
		console.log(`${emoji ? "📊" : ""} Test Summary`);
		console.log("━".repeat(50));
		console.log(
			`${emoji ? "✅" : "✓"} Passed: ${this.color("green", this.passed.toString())}`,
		);
		console.log(`${emoji ? "❌" : "✗"} Failed: ${this.color("red", this.failed.toString())}`);
		console.log(`${emoji ? "⏭️" : "○"} Skipped: ${this.color("yellow", this.skipped.toString())}`);
		console.log(`${emoji ? "📝" : "="} Total: ${total}`);
		console.log(`${emoji ? "⏱️" : "t"} Duration: ${(duration / 1000).toFixed(2)}s`);
		console.log("━".repeat(50));
	}

	private printFiles(files: File[]): void {
		for (const file of files) {
			if (file.result?.state === "fail") {
				console.log(`\n${this.color("red", `✗ ${file.name}`)}`);
			}
		}
	}

	private color(colorName: string, text: string): string {
		if (!this.options.colors) return text;

		const colors: Record<string, string> = {
			red: "\x1b[31m",
			green: "\x1b[32m",
			yellow: "\x1b[33m",
			reset: "\x1b[0m",
		};

		return `${colors[colorName] || ""}${text}${colors.reset}`;
	}
}

export default VitestCustomReporter;
