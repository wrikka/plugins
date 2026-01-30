# @booking-platform/vite-plugin-wpreview

Vite plugin สำหรับ component preview ระหว่างการพัฒนา

## Features

- 🎨 Component preview แบบ Storybook
- 🔍 Props inspector
- 📐 Variant showcase
- ⚡ Fast preview ด้วย HMR
- 🎯 TypeScript type safety
- 📱 Responsive preview

## Installation

```bash
bun add -D @booking-platform/vite-plugin-wpreview
```

## Usage

### Basic Usage

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { wpreviewPlugin } from "@booking-platform/vite-plugin-wpreview";

export default defineConfig({
	plugins: [wpreviewPlugin()],
});
```

### Advanced Configuration

```ts
import { defineConfig } from "vite";
import { wpreviewPlugin } from "@booking-platform/vite-plugin-wpreview";

export default defineConfig({
	plugins: [
		wpreviewPlugin({
			enabled: true,
			verbose: true,
			port: 3001,
			host: "localhost",
			open: true,
		}),
	],
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | เปิด/ปิด plugin |
| `verbose` | `boolean` | `false` | แสดง verbose logging |
| `port` | `number` | `3001` | Preview server port |
| `host` | `string` | `"localhost"` | Preview server host |
| `open` | `boolean` | `false` | เปิด preview อัตโนมัติ |

## Preview URL

เมื่อเปิด dev server สามารถเข้าถึง component preview ได้ที่:
```
http://localhost:3000/__preview
```

## License

MIT
