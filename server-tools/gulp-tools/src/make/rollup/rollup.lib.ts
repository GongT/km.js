import { basename, resolve } from 'path';
import { escapeRegExp } from '@idlebox/common';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replacePlugin from '@rollup/plugin-replace';
import { warn } from 'fancy-log';
import { Plugin, RollupWarning, WarningHandler } from 'rollup';
import sourcemapsPlugin from 'rollup-plugin-sourcemaps';
import { APP_SOURCE, APP_SOURCE_TEMP, WORKING_DIR } from './rollup.args';

export function getAllDependencies(): Record<string, string> {
	return require(resolve(WORKING_DIR, 'package.json')).dependencies;
}

export function onWarning(warning: RollupWarning, defaultHandler: WarningHandler) {
	translateWarningPath(warning);
	if (!warning.loc) return defaultHandler(warning);
	warn('[%s] %s\n    at %s:%s', warning.code, warning.message, warning.loc.file, warning.loc.line);
}

const tempDirRegexp = new RegExp('\\S*' + escapeRegExp(basename(APP_SOURCE_TEMP)) + '/(.+?).js', 'g');
const upDirRegexp = /\.\.\//g;
function translateWarningPath(warn: RollupWarning) {
	warn.message = warn.message
		.replace(tempDirRegexp, (_m0, file) => {
			return APP_SOURCE + '/' + file + '.ts';
		})
		.replace(upDirRegexp, '');
}

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
