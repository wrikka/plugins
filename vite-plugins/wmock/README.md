# @booking-platform/vite-plugin-wmock

Vite plugin สำหรับ API mocking และ data generation ระหว่างการพัฒนา

## Features

- ✨ Mock API routes ด้วย config ง่ายๆ
- 🎲 Data generator สำหรับ generate mock data
- ⏱️ Response delay simulation
- 📝 Request/response logging
- 🚀 Fast mock server ด้วย MSW
- 🎯 TypeScript type safety

## Installation

```bash
bun add -D @booking-platform/vite-plugin-wmock
```

## Usage

### Basic Usage

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { wmockPlugin } from "@booking-platform/vite-plugin-wmock";

export default defineConfig({
	plugins: [
		wmockPlugin({
			mocks: [
				{
					method: "GET",
					path: "/api/users",
					response: [
						{ id: 1, name: "John Doe", email: "john@example.com" },
						{ id: 2, name: "Jane Smith", email: "jane@example.com" },
					],
				},
				{
					method: "POST",
					path: "/api/users",
					responseFn: () => ({
						id: Math.random(),
						name: "New User",
						email: "new@example.com",
					}),
					delay: 500,
				},
			],
		}),
	],
});
```

### With Data Generator

```ts
import { wmockPlugin, DataGenerator } from "@booking-platform/vite-plugin-wmock";

export default defineConfig({
	plugins: [
		wmockPlugin({
			mocks: [
				{
					method: "GET",
					path: "/api/users",
					responseFn: () =>
						DataGenerator.generateArray(() => ({
							id: DataGenerator.generateId(),
							name: DataGenerator.generateName(),
							email: DataGenerator.generateEmail(),
							phone: DataGenerator.generatePhone(),
						}), 5, 10),
				},
			],
		}),
	],
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mocks` | `MockRoute[]` | `[]` | Mock routes ที่ต้องการ |
| `verbose` | `boolean` | `false` | แสดง verbose logging |
| `enabled` | `boolean` | `true` | เปิด/ปิด plugin |

## MockRoute Options

| Option | Type | Description |
|--------|------|-------------|
| `method` | `"GET" \| "POST" \| "PUT" \| "PATCH" \| "DELETE"` | HTTP method |
| `path` | `string` | Route path |
| `response` | `unknown` | Response data |
| `responseFn` | `() => unknown \| Promise<unknown>` | Function สำหรับ generate response |
| `delay` | `number` | Response delay in ms |
| `status` | `number` | HTTP status code |
| `headers` | `Record<string, string>` | Response headers |

## Data Generator Methods

- `generateId()` - Generate random ID
- `generateEmail()` - Generate random email
- `generateName()` - Generate random name
- `generatePhone()` - Generate random phone number
- `generateDate()` - Generate random date
- `generateNumber(min, max)` - Generate random number
- `generateBoolean()` - Generate random boolean
- `generateArray(fn, min, max)` - Generate array
- `generateObject(fn, count)` - Generate object

## License

MIT
