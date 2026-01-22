import { beforeEach, describe, expect, it } from "vitest";
import { VitestCustomReporter } from "../src/index";

describe("VitestCustomReporter", () => {
	let reporter: VitestCustomReporter;

	beforeEach(() => {
		reporter = new VitestCustomReporter();
	});

	it("should create reporter with default options", () => {
		expect(reporter).toBeInstanceOf(VitestCustomReporter);
	});

	it("should create reporter with custom options", () => {
		const customReporter = new VitestCustomReporter({
			emoji: false,
			colors: false,
			summary: false,
		});
		expect(customReporter).toBeInstanceOf(VitestCustomReporter);
	});

	it("should initialize reporter", () => {
		expect(() => reporter.onInit()).not.toThrow();
	});

	it("should handle task updates", () => {
		expect(() =>
			reporter.onTaskUpdate([
				["test-1", { state: "pass", duration: 10 }],
				["test-2", { state: "fail", duration: 20 }],
			])
		).not.toThrow();
	});
});
