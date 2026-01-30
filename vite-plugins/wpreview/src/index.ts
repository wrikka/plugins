import type { Plugin } from "vite";
import type { PreviewPluginOptions } from "./types";

export function wpreviewPlugin(options: PreviewPluginOptions = {}): Plugin {
	const { enabled = true, verbose = false } = options;

	if (!enabled) {
		return {
			name: "vite-plugin-wpreview",
		};
	}

	return {
		name: "vite-plugin-wpreview",
		enforce: "pre",

		transformIndexHtml(html) {
			if (verbose) {
				console.log("[wpreview] Component preview enabled");
			}

			return html;
		},

		configureServer(server) {
			server.middlewares.use("/__preview", async (req, res) => {
				if (req.url === "/__preview") {
					res.setHeader("Content-Type", "text/html");
					res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Component Preview</title>
	<style>
		* { margin: 0; padding: 0; box-sizing: border-box; }
		body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
		.container { max-width: 1200px; margin: 0 auto; }
		.header { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
		.header h1 { font-size: 24px; color: #111827; }
		.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
		.card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; background: white; }
		.card h3 { margin-bottom: 10px; color: #111827; }
		.card p { color: #6b7280; font-size: 14px; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>Component Preview</h1>
			<p>Select a component to preview</p>
		</div>
		<div class="grid">
			<div class="card">
				<h3>Components will appear here</h3>
				<p>Configure your components in the plugin options</p>
			</div>
		</div>
	</div>
</body>
</html>
					`);
				}
			});

			if (verbose) {
				console.log("[wpreview] Preview server running at /__preview");
			}
		},
	};
}

export * from "./types";
