import { MergedRollupOptions } from 'rollup';
import { INPUT_DIR_PATH, OUTPUT_DIR_PATH } from './rollup.args';
import { manualChunksDevelopment } from './rollup.chunks';
import {
	createOutputPlugins,
	createPlugins,
	onWarning,
	rollupBasicOptions,
	rollupBasicOptionsOutput,
} from './rollup.lib';
import { sourcemapPathTransformDev } from './rollup.sourcemap';

const cache = {
	modules: [],
	plugins: {},
};

const rollupOptions: MergedRollupOptions = {
	...rollupBasicOptions,
	cache: cache,
	input: INPUT_DIR_PATH,
	watch: {
		buildDelay: 2,
		chokidar: {
			awaitWriteFinish: true,
		},
		clearScreen: false,
		// include
	},
	treeshake: false,
	output: [
		{
			...rollupBasicOptionsOutput,
			entryFileNames: '[name]-[hash].js',
			format: 'system',
			dir: OUTPUT_DIR_PATH,
			sourcemapPathTransform: sourcemapPathTransformDev,
			plugins: createOutputPlugins(),
		},
	],
	onwarn: onWarning,
	manualChunks: manualChunksDevelopment(INPUT_DIR_PATH),
	plugins: createPlugins(false),
};

process.stdin.removeAllListeners('end');

/** @internal */
export default rollupOptions;
