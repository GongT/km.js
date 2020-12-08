import { resolve } from 'path';
import { relativePath, writeFileIfChangeSync } from '@idlebox/node';
import { libRoot, LOADER_DIST_DIR, LOADER_DIST_FILE } from './consts';

export async function createIndexFile() {
	const index = resolve(libRoot, 'loader.js');
	let scripts = [`const _p = require('path');`];
	const indexTyping = resolve(libRoot, 'loader.d.ts');
	let defines = [`import { IModuleCopy } from '@km.js/gulp-tools';`];

	function define(name, type, value) {
		scripts.push(`const ${name} = module.exports.${name} = ${value};`);
		defines.push(`export const ${name}: ${type};`);
	}

	define('packagePath', 'string', relativeScript(resolve(__dirname, '..')));
	define('entryFileName', 'string', relativeScript(LOADER_DIST_FILE));
	define('distPath', 'string', relativeScript(LOADER_DIST_DIR));
	define('id', 'string', `'client-loader'`);
	define('packageJsonPath', 'string', relativeScript(resolve(__dirname, '../package.json')));
	define('version', 'string', `require(packageJsonPath).version`);
	define('filemapJsonPath', 'string', relativeScript(resolve(LOADER_DIST_DIR, 'filemap.json')));
	scripts.push(`
const map = require(filemapJsonPath);
map[id] = entryFileName;
map[id+'.map'] = entryFileName+'.map';
	`);
	define('filemap', 'Record<string, string>', 'map');

	writeFileIfChangeSync(index, scripts.join('\n') + '\n');
	writeFileIfChangeSync(indexTyping, defines.join('\n') + '\n');
}

function relativeScript(path: string) {
	const relPath = relativePath(libRoot, path);
	return `_p.resolve(__dirname, ${JSON.stringify(relPath)})`;
}
