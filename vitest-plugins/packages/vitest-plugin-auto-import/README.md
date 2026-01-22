# @wrikka/vitest-plugin-auto-import

Auto import test utilities for Vitest.

## Installation

```bash
bun add -D @wrikka/vitest-plugin-auto-import
```

## Usage

```typescript
// vitest.config.ts
import { vitestAutoImport } from "@wrikka/vitest-plugin-auto-import";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [vitestAutoImport()],
});
```

## Options

```typescript
interface AutoImportOptions {
	// Custom imports to auto-import
	imports?: string[];
	// Generate .d.ts file for type safety
	dts?: string | boolean;
}
```

## Example

```typescript
// Without plugin - need to import
import { describe, expect, it } from "vitest";

// With plugin - no imports needed
describe("test", () => {
	it("works", () => {
		expect(true).toBe(true);
	});
});
```

## Default Imports

- describe, it, test
- expect
- beforeAll, beforeEach, afterAll, afterEach
- vi

## License

MIT
