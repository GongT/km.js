import { resolve } from 'path';
import { buildContext } from '@build-script/builder';
import { relativePath, writeFileIfChangeSync } from '@idlebox/node';
import { gulpPublicTask } from '@km.js/gulp-tools';
import {
	buildOutputFinal,
	sourceProjectOptions,
	buildTempDir,
	watchOutputFinal,
	watchOutputLV1,
} from '../inc/buildScriptContext';

// 创建包入口文件

gulpPublicTask('tools:copy-path-loader:build', 'create index.js', () => {
	return create(buildOutputFinal);
});
gulpPublicTask('tools:copy-path-loader:watch', 'create index.js', () => {
	return create(watchOutputFinal, watchOutputLV1);
});

async function create(depDistFolder: string, appDistFolder?: string) {
	let scripts: string[] = [];
	let defines: string[] = [];

	function define(name: string, type: string, value: string) {
		scripts.push(`const ${name} = module.exports.${name} = ${value};`);
		defines.push(`export const ${name}: ${type};`);
	}

	scripts.push(`const path = require('path');`);

	define('packageDistPath', 'string', `__dirname`);
	define('fileMapPath', 'string', relativeScript(`${depDistFolder}/filemap.json`));

	defines.push(`export interface IFileMap {
		[id: string]: {
			path: string;
			hash: string;
		}
	}`);
	define('fileMap', 'IFileMap', `require(fileMapPath)`);

	define('outputPath', 'string', relativeScript(depDistFolder));
	define('sourcePath', 'string', relativeScript(sourceProjectOptions.rootDir!));
	define('compiledPath', 'string | undefined', appDistFolder ? relativeScript(appDistFolder) : 'undefined');

	writeFileIfChangeSync(resolve(buildTempDir, 'index.js'), scripts.join('\n'));
	writeFileIfChangeSync(resolve(buildTempDir, 'index.d.ts'), defines.join('\n'));
}

function relativeScript(path: string) {
	const relPath = relativePath(buildTempDir, path);
	return `path.resolve(packageDistPath, ${JSON.stringify(relPath)})`;
}

buildContext.addAction('build', ['tools:copy-path-loader:build']);
buildContext.addAction('watch', ['tools:copy-path-loader:watch']);
