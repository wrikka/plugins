# Plugins Monorepo

Monorepo สำหรับจัดการ plugins และ modules ต่างๆ สำหรับโปรเจกต์

## Workspaces

- `nuxt-modules/*` - Nuxt modules
- `tsdown-plugins/*` - TypeScript tools built with tsdown
- `vite-plugins/*` - Vite plugins
- `vitest-plugins/*` - Vitest plugins

## Package Manager

ใช้ `bun` เป็น package manager หลัก

## Scripts

```bash
# Development
bun dev          # Start dev mode with turbo
bun watch        # Watch mode

# Build & Test
bun build        # Build all packages
bun test         # Run all tests
bun verify       # Run lint, test, and build

# Code Quality
bun lint         # Lint all packages
bun format       # Format all code

# Tools
bun scan         # Security scan
```

## Git Hooks

ใช้ `lefthook` สำหรับจัดการ git hooks:
- `pre-commit` - Install dependencies and format staged files
- `pre-rebase` - Check if branch is up to date
- `post-checkout` - Install dependencies after checkout

## Structure

```
plugins/
├── nuxt-modules/      # Nuxt modules
│   └── content/       # Content management module
├── tsdown-plugins/    # TypeScript tools
│   └── ts-to-schema/  # Convert TypeScript to schema
├── vite-plugins/      # Vite plugins
│   ├── formatter/     # dprint formatter
│   ├── styles/        # Style utilities
│   ├── wast-grep/     # WebAssembly grep
│   ├── wlinter/       # Linter
│   ├── wnot-use/      # Unused code detector
│   └── wrikka/        # Plugin aggregator
└── vitest-plugins/    # Vitest plugins
    ├── vitest-plugin-auto-import/
    ├── vitest-plugin-benchmark/
    └── vitest-plugin-reporter/
```

## Development

ติดตั้ง dependencies:
```bash
bun install
```

รัน dev server:
```bash
bun dev
```

Build all packages:
```bash
bun build
```

Verify all packages:
```bash
bun verify
```