# @booking-platform/vite-plugin-precompile

Vite plugin สำหรับ precompile TypeScript/Vue components ล่วงหน้าเพื่อเพิ่ม performance และ developer experience

## Features

- ✨ Precompile files ล่วงหน้าเมื่อ start dev server
- 🚀 Cache compiled results เพื่อลดเวลา compile
- 🔄 Watch mode สำหรับ compile อัตโนมัติเมื่อมีการแก้ไข
- 📊 Clear progress feedback และ error messages
- ⚡ Fast compilation ด้วย esbuild
- 🎯 TypeScript type safety

## Installation

```bash
bun add -D @booking-platform/vite-plugin-precompile
```

## Usage

### Basic Usage

```ts
// vite.config.ts
import precompilePlugin from "@booking-platform/vite-plugin-precompile";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		precompilePlugin(),
	],
});
```

### Advanced Configuration

```ts
import precompilePlugin from "@booking-platform/vite-plugin-precompile";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		precompilePlugin({
			// Paths ที่ต้องการ precompile
			include: ["./apps", "./packages"],

			// Paths ที่ไม่ต้องการ precompile
			exclude: ["node_modules", ".git", "dist", ".nuxt"],

			// เปิด/ปิด plugin
			enabled: true,

			// แสดง verbose logging
			verbose: false,

			// เปิด/ปิด caching
			cache: true,

			// Cache directory
			cacheDir: "./node_modules/.vite/precompile-cache",

			// Compile เมื่อ start dev server
			compileOnStart: true,

			// Compile เมื่อมีการแก้ไขไฟล์
			compileOnChange: true,

			// File extensions ที่ต้องการ compile
			extensions: [".ts", ".tsx", ".vue", ".js", ".jsx"],

			// Compiler options
			compilerOptions: {
				minify: false,
				sourcemap: true,
				target: "esnext",
			},
		}),
	],
});
```

## Options

| Option            | Type       | Default                                     | Description                     |
| ----------------- | ---------- | ------------------------------------------- | ------------------------------- |
| `include`         | `string[]` | `["./apps", "./packages"]`                  | Paths ที่ต้องการ precompile        |
| `exclude`         | `string[]` | `["node_modules", ".git", "dist", ".nuxt"]` | Paths ที่ไม่ต้องการ precompile      |
| `enabled`         | `boolean`  | `true`                                      | เปิด/ปิด plugin                   |
| `verbose`         | `boolean`  | `false`                                     | แสดง verbose logging            |
| `cache`           | `boolean`  | `true`                                      | เปิด/ปิด caching                  |
| `cacheDir`        | `string`   | `"./node_modules/.vite/precompile-cache"`   | Cache directory                 |
| `compileOnStart`  | `boolean`  | `true`                                      | Compile เมื่อ start dev server    |
| `compileOnChange` | `boolean`  | `true`                                      | Compile เมื่อมีการแก้ไขไฟล์          |
| `extensions`      | `string[]` | `[".ts", ".tsx", ".vue", ".js", ".jsx"]`    | File extensions ที่ต้องการ compile |
| `compilerOptions` | `object`   | -                                           | Compiler options                |

## How It Works

1. **On Start**: Plugin จะ scan files ใน paths ที่ระบุและ compile ทั้งหมด
2. **Caching**: Compiled results จะถูก cache ไว้เพื่อลดเวลา compile ในครั้งต่อไป
3. **Watch Mode**: เมื่อมีการแก้ไขไฟล์ plugin จะ compile เฉพาะไฟล์ที่แก้ไข
4. **Cache Invalidation**: Cache จะถูก invalidate เมื่อไฟล์ถูกแก้ไข (ตาม mtime และ file size)

## Performance

- First run: Compile ทุกไฟล์
- Subsequent runs: Load จาก cache ถ้าไฟล์ไม่ถูกแก้ไข
- File changes: Compile เฉพาะไฟล์ที่แก้ไข

## License

MIT
