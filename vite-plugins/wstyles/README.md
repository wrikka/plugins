# @booking-platform/vite-plugin-styles

Vite plugin wrapper for UnoCSS with configuration support.

## Installation

```bash
bun add @booking-platform/vite-plugin-styles
```

## Usage

```typescript
import { stylesPlugin } from "@booking-platform/vite-plugin-styles";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    stylesPlugin({
      enabled: true,
      unocss: {
        // UnoCSS options
      },
    }),
  ],
});
```

## Options

- `enabled` (boolean): Enable or disable the plugin. Default: `true`
- `unocss` (UserConfig): UnoCSS configuration options

## Development

```bash
bun install
bun run dev
bun run test
bun run build
```
