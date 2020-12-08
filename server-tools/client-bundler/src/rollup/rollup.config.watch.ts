import { resolve } from 'path';
import { MergedRollupOptions } from 'rollup';
import { INDEX_FILE_NAME } from '../inc/constants';
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

const rollupOptions: MergedRollupOptions = {
	...rollupBasicOptions,
	input: resolve(INPUT_DIR_PATH, INDEX_FILE_NAME),
	watch: {
		buildDelay: 2,
		chokidar: {
			awaitWriteFinish: true,
		},
		clearScreen: false,
		// include
	},
	treeshake: false, // MUST NOT ENABLE DURING DEV
	output: [
		{
			...rollupBasicOptionsOutput,
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
