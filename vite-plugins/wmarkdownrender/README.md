# vite-plugin-wmarkdownrender

Modern Vite plugin for markdown rendering with type safety, async support, and plugin system.

## Features

- **Type Safety** - Full TypeScript support with robust types
- **Async Rendering** - Support async rendering for all markdown elements including code blocks highlighting
- **Plugin System** - Plugin-based architecture to extend and customize markdown parsing and rendering
- **Shiki Integration** - Beautiful syntax highlighting powered by Shiki
- **Twoslash Support** - TypeScript type checking with twoslash
- **Compatibility** - Compatible with markdown-it and plugin API. Seamless migration from markdown-it

## Installation

```bash
bun add vite-plugin-wmarkdownrender shiki @shikijs/twoslash
```

## Usage

### Basic Usage

```typescript
import { defineConfig } from 'vite';
import wmarkdownrender from 'vite-plugin-wmarkdownrender';

export default defineConfig({
  plugins: [
    wmarkdownrender(),
  ],
});
```

### Advanced Usage with Shiki

```typescript
import { defineConfig } from 'vite';
import wmarkdownrender from 'vite-plugin-wmarkdownrender';

export default defineConfig({
  plugins: [
    wmarkdownrender({
      extensions: ['.md', '.markdown'],
      include: /\.md$/,
      exclude: /node_modules/,
      transformOptions: {
        enableHighlight: true,
        enableAsync: true,
        enablePlugins: true,
        shikiOptions: {
          themes: ['github-dark', 'github-light'],
          langs: ['javascript', 'typescript', 'css', 'html', 'json', 'markdown', 'bash'],
          theme: 'github-dark',
        },
        twoslashOptions: {
          enabled: true,
          renderer: 'rich',
        },
      },
    }),
  ],
});
```

### Custom Highlighter

```typescript
import { defineConfig } from 'vite';
import wmarkdownrender from 'vite-plugin-wmarkdownrender';

export default defineConfig({
  plugins: [
    wmarkdownrender({
      transformOptions: {
        highlightOptions: {
          highlight: async (code, lang) => {
            // Your custom highlighter
            return `<pre><code class="language-${lang}">${code}</code></pre>`;
          },
        },
      },
    }),
  ],
});
```

## API

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `extensions` | `string[]` | `['.md', '.markdown']` | File extensions to process |
| `include` | `RegExp \| RegExp[]` | `/\.md$/` | Pattern to include files |
| `exclude` | `RegExp \| RegExp[]` | `/node_modules/` | Pattern to exclude files |
| `transformOptions` | `MarkdownRenderOptions` | `{}` | Options for markdown rendering |

### MarkdownRenderOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableHighlight` | `boolean` | `true` | Enable syntax highlighting |
| `enableAsync` | `boolean` | `false` | Enable async rendering |
| `enablePlugins` | `boolean` | `true` | Enable plugin system |
| `plugins` | `MarkdownPlugin[]` | `[]` | Plugins to use |
| `highlightOptions` | `HighlightOptions` | `{}` | Options for syntax highlighting |
| `shikiOptions` | `ShikiOptions` | `{}` | Options for Shiki |
| `twoslashOptions` | `TwoslashOptions` | `{}` | Options for twoslash |

### ShikiOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `themes` | `string[]` | `['github-dark']` | Shiki themes to load |
| `langs` | `string[]` | `['javascript', 'typescript', ...]` | Languages to support |
| `theme` | `string` | `'github-dark'` | Default theme |

### TwoslashOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable twoslash |
| `renderer` | `'rich' \| 'classic' \| 'floating-vue'` | `'rich'` | Twoslash renderer type |

### HighlightOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lang` | `string` | - | Default language |
| `highlight` | `(code: string, lang: string) => string \| Promise<string>` | - | Custom highlight function |

## Plugin System

### Creating Custom Plugins

```typescript
import { createPlugin } from 'vite-plugin-wmarkdownrender';

const myPlugin = createPlugin('my-plugin', (parser) => {
  // Customize markdown parser
  parser.addRule('my-rule', (text) => {
    return text.replace(/@mention/g, '<span class="mention">$&</span>');
  });
});

wmarkdownrender({
  transformOptions: {
    plugins: [myPlugin],
  },
});
```

## Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Watch mode
bun run dev

# Lint
bun run lint
```

## License

MIT
