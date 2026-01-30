# vite-plugin-linter

Vite plugin to run and display linter reports (oxlint, biome, eslint, vue-tsc) during development.

## Features

- **Multiple Linters Support**: oxlint, biome, eslint, vue-tsc
- **Watch Mode**: Automatically runs linters when files change
- **Configurable**: Choose which linters to run
- **Error Reporting**: Clear console output with colored messages

## Installation

```bash
bun add -D vite-plugin-linter
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { linterPlugin } from 'vite-plugin-linter';

export default defineConfig({
  plugins: [
    linterPlugin({
      linters: ['oxlint', 'biome', 'eslint', 'vue-tsc'],
      watchPaths: ['./apps', './packages'],
      verbose: true,
      failOnError: false,
    }),
  ],
});
```

## Options

### `linters` (optional, default: `['oxlint', 'biome', 'eslint', 'vue-tsc']`)

Array of linters to run. Available linters:
- `oxlint`
- `biome`
- `eslint`
- `vue-tsc`

### `watchPaths` (optional, default: `['./apps', './packages']`)

Array of paths to watch for file changes.

### `verbose` (optional, default: `false`)

Enable verbose logging for debugging.

### `failOnError` (optional, default: `false`)

Stop the build if any linter fails.

## How it Works

The plugin runs configured linters:
- On initial server start
- When watched files change (debounced by 100ms)
- On manual refresh via WebSocket event

## License

MIT
