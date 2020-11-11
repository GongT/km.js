import { runMain } from '@idlebox/node';
import { MergedRollupOptions } from 'rollup';
import { APP_TARGET_MODULES, KIND } from './rollup.args';
import { createManualChunksForDev } from './rollup.chunks';
import { createPlugins, onWarning } from './rollup.lib';

async function createProduction() {
	/*const config = createNodeModulesConfig(input)
	const bundle = await rollup(inputOptions);
	const { output } = await bundle.generate(outputOptions);*/
}
async function createDevelop() {}

runMain(KIND === 'esm' ? createProduction : createDevelop);

export function createNodeModulesConfig(input: Record<string, string>): MergedRollupOptions {
	return {
		input: input,
		treeshake: false,
		output: [
			{
				format: 'system',
				dir: APP_TARGET_MODULES,
				sourcemap: true,
				exports: 'named',
				strict: true,
				// sourcemapPathTransform: sourcemapPathTransformDev,
			},
		],
		context: 'window',
		onwarn: onWarning,
		manualChunks: createManualChunksForDev(input),
		plugins: createPlugins(false),
	};
}
