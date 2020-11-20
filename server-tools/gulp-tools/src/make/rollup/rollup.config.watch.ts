import { resolve } from 'path';
import { MergedRollupOptions } from 'rollup';
import { INPUT_DIR_NAME, OUTPUT_DIR_NAME, OUTPUT_ROOT } from './rollup.args';
import { manualChunksDevelopment } from './rollup.chunks';
import { createPlugins, onWarning } from './rollup.lib';

const rollupOptions: MergedRollupOptions = {
	input: resolve(OUTPUT_ROOT, INPUT_DIR_NAME, 'index.js'),
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
			format: 'system',
			dir: resolve(OUTPUT_ROOT, OUTPUT_DIR_NAME),
			sourcemap: true,
			exports: 'named',
			strict: true,
			// sourcemapPathTransform: sourcemapPathTransformDev,
		},
	],
	context: 'window',
	onwarn: onWarning,
	manualChunks: manualChunksDevelopment(OUTPUT_ROOT),
	plugins: createPlugins(false),
};

// process.stdin.isTTY = true;
process.stdin.removeAllListeners('end');

/** @internal */
export default rollupOptions;
