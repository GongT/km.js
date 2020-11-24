import { resolve } from 'path';
import { escapeRegExp } from '@idlebox/common';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replacePlugin from '@rollup/plugin-replace';
import { warn } from 'fancy-log';
import { MergedRollupOptions, OutputOptions, OutputPlugin, Plugin, RollupWarning, WarningHandler } from 'rollup';
import sourcemapsPlugin from 'rollup-plugin-sourcemaps';
import { INPUT_DIR_PATH } from './rollup.args';
import { dynamicImportPlugin } from './rollup.plugin.dynamic-import';
import { createApplicationImportMapPlugin } from './rollup.plugin.importmap';
import { importMetaPathPlugin } from './rollup.plugin.meta';

/** @internal */
export function getAllDependencies(): Record<string, string> {
	return require(resolve(process.cwd(), 'package.json')).dependencies;
}

/** @internal */
export function onWarning(warning: RollupWarning, defaultHandler: WarningHandler) {
	translateWarningPath(warning);
	if (!warning.loc) return defaultHandler(warning);
	warn('[%s] %s\n    at %s:%s', warning.code, warning.message, warning.loc.file, warning.loc.line);
}

const tempDirRegexp = new RegExp('\\S*' + escapeRegExp(INPUT_DIR_PATH) + '/(.+?).js', 'g');
const upDirRegexp = /\.\.\//g;
function translateWarningPath(warn: RollupWarning) {
	warn.message = warn.message
		.replace(tempDirRegexp, (_m0, file) => {
			return resolve(INPUT_DIR_PATH, file + '.ts');
		})
		.replace(upDirRegexp, '');
}

/** @internal */
export function createPlugins(_isProduction: boolean): Plugin[] {
	const ret: Plugin[] = [
		sourcemapsPlugin(),
		nodeResolve({
			mainFields: ['browser', 'jsnext', 'module', 'main'],
		}),
		replacePlugin({ 'process.env.NODE_ENV': _isProduction ? '"production"' : '"development"' }),
		commonjs({
			extensions: ['.js'],
		}),
	];

	return ret;
}

export const rollupBasicOptions: Partial<MergedRollupOptions> = {
	context: 'window',
};

export const rollupBasicOptionsOutput: Partial<OutputOptions> = {
	sourcemap: true,
	exports: 'named',
	strict: true,
};

export function createOutputPlugins(_isProduction: boolean): OutputPlugin[] {
	return [dynamicImportPlugin, importMetaPathPlugin, createApplicationImportMapPlugin];
}
