import { extname, resolve } from 'path';
import { sync as globSync } from 'glob';
import { MergedRollupOptions } from 'rollup';
import { INPUT_DIR_PATH, OUTPUT_DIR_PATH } from './rollup.args';
import { manualChunksProduction } from './rollup.chunks';
import {
	createOutputPlugins,
	createPlugins,
	onWarning,
	rollupBasicOptions,
	rollupBasicOptionsOutput,
} from './rollup.lib';
import { sourcemapPathTransform } from './rollup.sourcemap';

const rollupOptions: MergedRollupOptions = {
	...rollupBasicOptions,
	input: createInput(),
	treeshake: true,
	output: [
		{
			...rollupBasicOptionsOutput,
			format: 'system',
			dir: OUTPUT_DIR_PATH,
			sourcemapPathTransform: sourcemapPathTransform,
			plugins: createOutputPlugins(),
		},
	],
	onwarn: onWarning,
	manualChunks: manualChunksProduction(INPUT_DIR_PATH),
	plugins: createPlugins(false),
};

process.stdin.removeAllListeners('end');

function createInput() {
	const ret: Record<string, string> = {};
	const files = globSync('**/*.js', {
		absolute: false,
		cwd: INPUT_DIR_PATH,
	});
	for (const item of files) {
		const name = item.slice(0, item.length - extname(item).length);
		ret[name] = resolve(INPUT_DIR_PATH, item);
	}
	return ret;
}

/** @internal */
export default rollupOptions;
