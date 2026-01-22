import { addComponentsDir, addImportsDir, addPlugin, createResolver, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
	meta: {
		name: "content-module",
		configKey: "content",
	},
	setup(options, nuxt) {
		const resolver = createResolver(import.meta.url);

		// Register runtime directory
		nuxt.options.alias["#content"] = resolver.resolve("./runtime");

		// Register types
		nuxt.options.alias["#content/types"] = resolver.resolve("./runtime/shared/types/index");

		// Register composables
		addImportsDir(resolver.resolve("./runtime/composables"));

		// Register components
		addComponentsDir({
			path: resolver.resolve("./runtime/components"),
			prefix: "Content",
		});

		// Register plugins
		addPlugin(resolver.resolve("./runtime/plugins/content.client"));
		addPlugin(resolver.resolve("./runtime/plugins/content.server"));
	},
});
