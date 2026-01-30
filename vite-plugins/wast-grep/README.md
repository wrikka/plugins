# vite-plugin-ast-grep

Vite plugin to watch and display ast-grep reports during development.

## Features

- Automatically runs `sg scan` when Vite dev server starts
- Watches file changes and re-runs ast-grep scan
- Displays ast-grep findings in the console with color-coded severity levels
- Configurable watch paths and options

## Installation

```bash
bun add -D vite-plugin-ast-grep
```

## Usage

Add the plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import { astGrepPlugin } from 'vite-plugin-ast-grep';

export default defineConfig({
  plugins: [
    astGrepPlugin({
      // Optional: specify ast-grep config file path (default: './rules/ast-grep/sgconfig.yml')
      // The plugin will read ruleDirs from this config file
      configPath: './rules/ast-grep/sgconfig.yml',
      
      // Optional: enable verbose logging (default: false)
      verbose: false,
    }),
  ],
});
```

## Options

- `configPath`: Path to ast-grep config file (default: `./rules/ast-grep/sgconfig.yml`). The plugin will read `ruleDirs` from this config file to determine which paths to watch.
- `verbose`: Enable verbose logging (default: `false`)

## Requirements

- Vite 5.x or 6.x
- `@ast-grep/cli` must be installed in your project

## Development

```bash
# Build
bun run build

# Watch mode
bun run dev
```
