import { basename, resolve } from 'path';
import { relativePath, writeFileIfChangeSync } from '@idlebox/node';
import { libRoot, LOADER_DIST_DIR } from './consts';
import { buildTask } from '@km.js/gulp-tools';

export const createIndexTask = buildTask({
	name: 'create-index',
	title: 'Create package entry (index.js)',
	base: LOADER_DIST_DIR,
	glob: 'loader.*.js',
	action() {},
});

export async function createIndexFile() {
	const LOADER_DIST_FILE = '';
	const index = resolve(libRoot, 'loader.js');
	let scripts = [`const _p = require('path');`];
	const indexTyping = resolve(libRoot, 'loader.d.ts');
	let defines = [`import { IModuleCopy } from '@km.js/gulp-tools';`];

	function define(name, type, value) {
		scripts.push(`const ${name} = module.exports.${name} = ${value};`);
		defines.push(`export const ${name}: ${type};`);
	}

	define('entryFileName', 'string', `"loader.js"`);
	define('version', 'string', `require("./version.js");`);
	define('distPath', 'string', relativeScript(LOADER_DIST_DIR));
	define('id', 'string', `'client-loader'`);
	define('packageJsonPath', 'string', relativeScript(resolve(__dirname, '../package.json')));
	define('filemapJsonPath', 'string', relativeScript(resolve(LOADER_DIST_DIR, 'filemap.json')));
	define('filemap', 'Record<string, string>', 'require(filemapJsonPath)');

	writeFileIfChangeSync(index, scripts.join('\n') + '\n');
	writeFileIfChangeSync(indexTyping, defines.join('\n') + '\n');
}

function relativeScript(path: string) {
	const relPath = relativePath(libRoot, path);
	return `_p.resolve(__dirname, ${JSON.stringify(relPath)})`;
}
