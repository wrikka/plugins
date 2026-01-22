import checker from "vite-plugin-checker";

export default defineNuxtConfig({
	compatibilityDate: "latest",
	devtools: { enabled: true },
	modules: [
		"@vue-macros/nuxt",
		"@nuxtjs/color-mode",
		"@vueuse/nuxt",
		"@unocss/nuxt",
		"@pinia/nuxt",
		"nuxt-mcp-dev",
		"@nuxt/icon",
		"@scalar/nuxt",
	],

	scalar: {
		url: "https://registry.scalar.com/@scalar/apis/galaxy?format=yaml",
	},

	typescript: {
		strict: true,
		typeCheck: true,
	},

	colorMode: {
		preference: "system",
		fallback: "light",
		classSuffix: "",
	},

	icon: {
		serverBundle: {
			collections: ["mdi"],
		},
	},

	nitro: {
		experimental: {
			openAPI: true,
		},
		preset: "cloudflare_module",
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
			wrangler: {
				routes: [
					{
						pattern: "*example.com",
						custom_domain: true,
					},
				],
			},
		},
	},

	vite: {
		plugins: [
			checker({
				overlay: {
					initialIsOpen: false,
				},
				typescript: true,
				vueTsc: true,
				oxlint: true,
			}),
		],
	},
});
