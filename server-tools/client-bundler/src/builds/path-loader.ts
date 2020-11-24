import { resolve } from 'path';
import { buildContext } from '@build-script/builder';
import { getBuildContextConstant } from '../inc/buildScriptContext';

// 从path loader复制dev.js到lib目录种

const { myselfPath, buildTempDir } = getBuildContextConstant();

buildContext.addAction('build', [create('prod')]);
buildContext.addAction('watch', [create('dev')]);

function create(type: string) {
	buildContext.registerAlias(`tools:copy-path-loader:${type}`, process.argv0, [
		resolve(myselfPath, 'create-path-loader'),
		`--output=${buildTempDir}`,
		`--type=${type}`,
	]);

	return `tools:copy-path-loader:${type}`;
}
