import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

import type { MockRoute } from "./types";

export class MockServer {
	private server: ReturnType<typeof setupServer>;
	private handlers: Map<string, ReturnType<typeof http[method]>> = new Map();

	constructor() {
		this.server = setupServer(...Array.from(this.handlers.values()));
	}

	public start(): void {
		this.server.listen({ onUnhandledRequest: "bypass" });
	}

	public stop(): void {
		this.server.close();
	}

	public addMock(route: MockRoute): void {
		const key = `${route.method}:${route.path}`;

		if (this.handlers.has(key)) {
			return;
		}

		const handler = http[route.method.toLowerCase() as never](
			route.path,
			async ({ request }) => {
				const delay = route.delay ?? 0;

				if (delay > 0) {
					await new Promise((resolve) => setTimeout(resolve, delay));
				}

				const response = route.responseFn ? await route.responseFn() : route.response;
				const status = route.status ?? 200;
				const headers = route.headers ?? { "Content-Type": "application/json" };

				return HttpResponse.json(response, { status, headers });
			},
		);

		this.handlers.set(key, handler);
		this.server.use(handler);
	}
}
