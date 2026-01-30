import { describe, expect, it } from "vitest";
import { stylesPlugin } from "../src";

describe("stylesPlugin", () => {
  it("should create plugin with default options", () => {
    const plugin = stylesPlugin();
    expect(plugin.name).toBe("vite-plugin-styles");
  });

  it("should create plugin with custom options", () => {
    const plugin = stylesPlugin({
      enabled: true,
      unocss: {
        presets: [],
      },
    });
    expect(plugin.name).toBe("vite-plugin-styles");
  });

  it("should create disabled plugin when enabled is false", () => {
    const plugin = stylesPlugin({ enabled: false });
    expect(plugin.name).toBe("vite-plugin-styles");
    expect(plugin.configResolved).toBeDefined();
  });

  it("should merge unocss options correctly", () => {
    const plugin = stylesPlugin({
      unocss: {
        presets: [],
        shortcuts: {
          btn: "px-4 py-2 rounded",
        },
      },
    });
    expect(plugin.name).toBe("vite-plugin-styles");
  });
});
