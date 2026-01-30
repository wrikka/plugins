# ts-to-schema

Convert TypeScript types to schema definitions

## Features

- Parse TypeScript type definitions
- Generate schema from types
- Support for complex types

## Usage

```typescript
import { toSchema } from "ts-to-schema";

const schema = toSchema("MyType");
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
```

## Scripts

- `build` - Build with tsdown
- `dev` - Watch mode
- `lint` - Lint with oxlint
- `test` - Run tests
- `verify` - Lint and test
