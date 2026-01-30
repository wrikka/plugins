import type { Plugin } from "vite";

import { MockServer } from "./mock-server";
import type { MockPluginOptions } from "./types";

export function wmockPlugin(options: MockPluginOptions = {}): Plugin {
	const { mocks = [], verbose = false, enabled = true } = options;

	if (!enabled) {
		return {
			name: "vite-plugin-wmock",
		};
	}

	const mockServer = new MockServer();

	return {
		name: "vite-plugin-wmock",
		enforce: "pre",

		configResolved() {
			for (const mock of mocks) {
				mockServer.addMock(mock);
				if (verbose) {
					console.log(`[wmock] Added mock: ${mock.method} ${mock.path}`);
				}
			}
		},

		configureServer() {
			mockServer.start();
			if (verbose) {
				console.log("[wmock] Mock server started");
			}
		},

		closeBundle() {
			mockServer.stop();
			if (verbose) {
				console.log("[wmock] Mock server stopped");
			}
		},
	};
}

export * from "./types";
export * from "./data-generator";
