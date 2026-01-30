export default {
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ["vite", "@unocss/vite", "unocss"],
};
