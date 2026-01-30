# @booking-platform/vite-plugin-wanalyzer

Vite plugin สำหรับ bundle analysis และ dependency analysis ระหว่างการพัฒนา

## Features

- 📊 Bundle size visualization ด้วย interactive charts
- 🔍 Dependency analysis และ circular dependency detection
- 📈 Module dependency graph visualization
- 🎯 Gzip และ Brotli size estimation
- 🚀 Multiple visualization formats (HTML, JSON, Treemap, Sunburst, Network)
- ⚡ Fast analysis ด้วย rollup-plugin-visualizer

## Installation

```bash
bun add -D @booking-platform/vite-plugin-wanalyzer
```

## Usage

### Basic Usage

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { wanalyzerPlugin } from "@booking-platform/vite-plugin-wanalyzer";

export default defineConfig({
	plugins: [wanalyzerPlugin()],
});
```

### Advanced Configuration

```ts
import { defineConfig } from "vite";
import { wanalyzerPlugin } from "@booking-platform/vite-plugin-wanalyzer";

export default defineConfig({
	plugins: [
		wanalyzerPlugin({
			enabled: true,
			verbose: true,
			open: true,
			outputFile: "./stats.html",
			outputFormat: "html",
			gzipSize: true,
			brotliSize: true,
		}),
	],
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | เปิด/ปิด plugin |
| `verbose` | `boolean` | `false` | แสดง verbose logging |
| `open` | `boolean` | `false` | เปิด report อัตโนมัติหลัง build |
| `outputFile` | `string` | `"./stats.html"` | Path สำหรับ output report |
| `outputFormat` | `"html" \| "json" \| "treemap" \| "sunburst" \| "network"` | `"html"` | Format ของ report |
| `gzipSize` | `boolean` | `true` | คำนวณ gzip size |
| `brotliSize` | `boolean` | `true` | คำนวณ brotli size |

## Output Formats

- **html** - Interactive HTML report
- **json** - JSON data สำหรับ custom analysis
- **treemap** - Treemap visualization
- **sunburst** - Sunburst chart
- **network** - Network graph

## License

MIT
