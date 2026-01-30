# @wrikka/content

Nuxt content module for wrikka.com

## Features

- Content management for Nuxt applications
- Type-safe content loading
- Runtime composables and components
- Server and client plugins

## Installation

```bash
bun add @wrikka/content
```

## Usage

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
	modules: ["@wrikka/content"],
});
```

## Development

```bash
# Build
bun run build

# Dev mode
bun run dev

# Test
bun run test

# Lint
bun run lint

# Type check
bun run typecheck
```

## API

### Composables

- `useContent()` - Access content utilities

### Components

- `Content*` - Content components

## License

MIT
