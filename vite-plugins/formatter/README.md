# vite-plugin-dprint-formatter

Vite plugin to run dprint formatting during development.

## Features

- Automatically runs `dprint fmt` when Vite dev server starts
- Watches file changes and re-runs dprint formatting
- Displays dprint findings in the console
- Configurable watch paths and options

## Installation

```bash
bun add -D vite-plugin-dprint-formatter
```

## Usage

Add the plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import { dprintPlugin } from 'vite-plugin-dprint-formatter';

export default defineConfig({
  plugins: [
    dprintPlugin({
      // Optional: specify config path (default: './dprint.json')
      configPath: './dprint.json',
      
      // Optional: specify paths to watch (default: ['./apps', './packages', './plugins'])
      watchPaths: ['./apps', './packages', './plugins'],
      
      // Optional: enable verbose logging (default: false)
      verbose: false,
      
      // Optional: format on start (default: true)
      formatOnStart: true,
      
      // Optional: format on change (default: true)
      formatOnChange: true,
    }),
  ],
});
```

## Options

- `configPath`: Path to dprint config file (default: `./dprint.json`)
- `watchPaths`: Array of paths to watch for changes (default: `['./apps', './packages', './plugins']`)
- `verbose`: Enable verbose logging (default: `false`)
- `formatOnStart`: Run dprint on dev server start (default: `true`)
- `formatOnChange`: Run dprint on file changes (default: `true`)

## Requirements

- Vite 5.x or 6.x
- `dprint` must be installed in your project

## Development

```bash
# Build
bun run build

# Watch mode
bun run dev
```
