# vite-plugin-wunused

Vite plugin for detecting unused code, exports, and dependencies. A knip-like tool with full vite plugin support.

## Features

- **Unused Files Detection**: Find files that are not imported anywhere in your project
- **Unused Exports Detection**: Identify exported functions, classes, and variables that are never used
- **Unused Dependencies Detection**: Detect dependencies in package.json that are never imported
- **Vite Plugin Support**: Analyze vite.config.ts and detect unused vite plugins
- **Duplicate Dependencies**: Find duplicate dependencies across packages
- **Unresolved Imports**: Detect imports that cannot be resolved
- **CLI & Vite Plugin**: Can be used as a standalone CLI tool or as a Vite plugin

## Installation

```bash
bun add -D vite-plugin-wunused
```

## Usage

### As Vite Plugin

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { wunusedPlugin } from 'vite-plugin-wunused';

export default defineConfig({
  plugins: [
    wunusedPlugin({
      include: ['src/**/*.{ts,tsx,js,jsx,vue}'],
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
      ignoreExports: ['default', '__esModule'],
      ignoreFiles: ['src/types/global.ts'],
      verbose: true,
    }),
  ],
});
```

### As CLI Tool

```bash
# Run analysis
bun run wunused

# With custom config
bun run wunused --config wunused.config.ts

# Watch mode
bun run wunused --watch
```

## Options

### `include` (optional, default: `['src/**/*']`)

Glob patterns for files to analyze.

### `exclude` (optional, default: `['**/*.test.ts', '**/*.spec.ts', '**/node_modules/**']`)

Glob patterns for files to exclude from analysis.

### `ignoreExports` (optional, default: `['default', '__esModule']`)

Export names to ignore when detecting unused exports.

### `ignoreFiles` (optional, default: `[]`)

Specific file paths to ignore.

### `verbose` (optional, default: `false`)

Enable verbose logging for debugging.

### `reportUnusedFiles` (optional, default: `true`)

Report unused files.

### `reportUnusedExports` (optional, default: `true`)

Report unused exports.

### `reportUnusedDependencies` (optional, default: `true`)

Report unused dependencies.

## How it Works

The plugin analyzes your project by:

1. **File Discovery**: Scans your project for all relevant files using glob patterns
2. **Import Analysis**: Parses each file to extract all imports and exports
3. **Reference Tracking**: Tracks which exports are imported and used across the project
4. **Dependency Analysis**: Compares used imports with package.json dependencies
5. **Vite Plugin Analysis**: Analyzes vite.config.ts to detect unused vite plugins
6. **Report Generation**: Generates a detailed report of unused code and dependencies

## Example Output

```
🔍 Analyzing project...

📦 Unused Dependencies:
  - lodash (never imported)
  - moment (never imported)

📄 Unused Files:
  - src/utils/old-helper.ts (never imported)
  - src/components/DeprecatedButton.vue (never imported)

🎯 Unused Exports:
  - src/utils/helpers.ts: helperFunction (never imported)
  - src/api/client.ts: deprecatedFetch (never imported)

✨ Analysis complete!
```

## License

MIT
