import { describe, expect, it } from "vitest";
import { vitestAutoImport } from "../src/index";

describe("vitestAutoImport", () => {
	it("should create plugin with default options", () => {
		const plugin = vitestAutoImport();
		expect(plugin.name).toBe("vitest-plugin-auto-import");
	});

	it("should create plugin with custom imports", () => {
		const plugin = vitestAutoImport({
			imports: ["describe", "it", "expect"],
		});
		expect(plugin.name).toBe("vitest-plugin-auto-import");
	});

	it("should enable globals in config", () => {
		const plugin = vitestAutoImport();
		const config = plugin.config?.();
		expect(config).toEqual({
			test: {
				globals: true,
			},
		});
	});
});
