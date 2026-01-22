# @wrikka/vitest-plugin-reporter

Custom test reporter for Vitest with beautiful output.

## Installation

```bash
bun add -D @wrikka/vitest-plugin-reporter
```

## Usage

```typescript
// vitest.config.ts
import { VitestCustomReporter } from "@wrikka/vitest-plugin-reporter";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		reporters: [new VitestCustomReporter()],
	},
});
```

## Options

```typescript
interface ReporterOptions {
	// Use emoji in output
	emoji?: boolean;
	// Use colors in output
	colors?: boolean;
	// Show summary
	summary?: boolean;
}
```

## Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Test Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Passed: 25
❌ Failed: 0
⏭️  Skipped: 2
📝 Total: 27
⏱️  Duration: 2.45s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Features

- 📊 Beautiful summary output
- 🎨 Colored output with emoji support
- ⚡ Performance metrics
- 🎯 Failed test highlights

## License

MIT
