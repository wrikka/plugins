import UnoCSS from "@unocss/vite";
import type { Plugin } from "vite";
import { resolveOptions } from "./config";
import type { StylesPluginOptions } from "./types";

export function stylesPlugin(options: StylesPluginOptions = {}): Plugin {
  const resolved = resolveOptions(options);

  if (!resolved.enabled) {
    return {
      name: "vite-plugin-styles",
      enforce: "pre",
      configResolved() {
        console.log("[vite-plugin-styles] Plugin is disabled");
      },
    };
  }

  return {
    name: "vite-plugin-styles",
    ...UnoCSS(resolved.unocss),
  };
}

export default stylesPlugin;
