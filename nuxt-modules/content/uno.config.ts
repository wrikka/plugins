import {
	defineConfig,
	presetWind4,
	transformerCompileClass,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

export default defineConfig({
	presets: [
		presetWind4({
			preflights: {
				reset: true,
			},
		}),
	],
	transformers: [
		transformerVariantGroup(),
		transformerDirectives(),
		transformerCompileClass(),
	],
});
