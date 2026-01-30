# vite-plugin-not-use

Vite plugin to watch files and warn about deprecated keywords during development.

## Features

- **Pattern Matching**: Watch files matching glob patterns
- **Keyword Detection**: Detect specific keywords in watched files
- **Console Warnings**: Display yellow warning messages in terminal
- **Hot Update**: Automatically checks files on hot module replacement

## Installation

```bash
bun add -D vite-plugin-not-use
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { notUsePlugin } from 'vite-plugin-not-use';

export default defineConfig({
  plugins: [
    notUsePlugin({
      rules: [
        { pattern: /\.ts$/, keyword: 'deprecatedFunction' },
        { pattern: /\.vue$/, keyword: 'oldApi' },
      ],
      watchPaths: ['./apps', './packages'],
    }),
  ],
});
```

## Options

### `rules` (required)

Array of pattern and keyword pairs to watch for.

Each rule has:
- `pattern`: Regular expression string to match file paths
- `keyword`: String keyword to search for in file contents

### `watchPaths` (optional, default: `['./apps', './packages']`)

Array of paths to watch for file changes.

## How it Works

The plugin checks files for keywords:
- When watched files are updated via hot module replacement
- Matches files against configured patterns
- Searches file contents for configured keywords
- Displays warning messages in terminal when keywords are found

## License

MIT
