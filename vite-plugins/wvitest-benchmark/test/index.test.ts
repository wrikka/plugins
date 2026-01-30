import { describe, expect, it } from "vitest";
import { vitestBenchmark } from "../src/index";

describe("vitestBenchmark", () => {
	it("should create plugin with default options", () => {
		const plugin = vitestBenchmark();
		expect(plugin.name).toBe("vitest-plugin-benchmark");
	});

	it("should create plugin with custom options", () => {
		const plugin = vitestBenchmark({
			outputFile: "bench.json",
			format: "json",
		});
		expect(plugin.name).toBe("vitest-plugin-benchmark");
	});

	it("should configure benchmark in vitest", () => {
		const plugin = vitestBenchmark();
		const config = plugin.config?.();
		expect(config).toEqual({
			test: {
				benchmark: {
					include: ["**/*.bench.ts"],
				},
			},
		});
	});
});
