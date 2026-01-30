# vite-plugin-wreplace

Vite plugin to replace strings in code during build/dev.

## Installation

```bash
bun add -d vite-plugin-wreplace
```

## Usage

```ts
import { defineConfig } from "vite";
import { replacePlugin } from "vite-plugin-wreplace";

export default defineConfig({
	plugins: [
		replacePlugin({
			replacements: {
				"__VERSION__": "1.0.0",
				"__API_URL__": "https://api.example.com",
			},
			verbose: true,
		}),
	],
});
```

## Options

- `replacements` - Object with search strings as keys and replacement strings as values
- `verbose` - Enable logging for replacements (default: `false`)

## Example

Replace environment variables in code:

```ts
// In your source code
const apiUrl = "__API_URL__";

// In vite.config.ts
replacePlugin({
	replacements: {
		"__API_URL__": "https://api.example.com",
	},
});
```
