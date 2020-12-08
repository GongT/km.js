import { basename, resolve } from 'path';
import { gulpParallel, gulpSeries } from '@build-script/gulp-chain-simplify';
import {
	buildTask,
	gulpDest,
	gulpSrcFrom,
	gulpTask,
	gulpTransformer,
	gulpTypescriptTask,
	sourcemapsInit,
	sourcemapsWrite,
} from '@km.js/gulp-tools';
import { info } from 'fancy-log';
import { appendText, prependText } from 'gulp-append-prepend';
import { LOADER_DIST_DIR, LOADER_DIST_FILE } from './consts';

// 最终loader文件的头尾
const scopeStart = '"use strict";(function main() {';
const scopeEnd = '})();';

// 第一步: 从src文件夹编译ts到lib文件夹
const { build, watch, outDir, distFiles } = gulpTypescriptTask('loader', 'App loader', {
	tsconfig: resolve(__dirname, '../src/tsconfig.json'),
});

// 第二步: 最终文件(loader.VERSION.js)的构建任务
const taskConcatLoader = buildTask({
	name: 'loader:join',
	title: 'Concat (build) loader application',
	base: outDir,
	glob: 'out.js',
	action() {
		info('Start concat... [save: %s]', LOADER_DIST_FILE);

		return gulpSrcFrom(outDir, distFiles)
			.pipe(sourcemapsInit())
			.pipe(prependText(scopeStart))
			.pipe(appendText(scopeEnd))
			.pipe(rename())
			.pipe(sourcemapsWrite())
			.pipe(gulpDest(LOADER_DIST_DIR));
	},
});

export const gulpActionBuildLoader = gulpTask(
	'build:loader',
	'Build app loader',
	gulpSeries(build, taskConcatLoader.build)
);
export const gulpActionWatchLoader = gulpTask(
	'watch:loader',
	'Watch app loader',
	gulpParallel(watch, taskConcatLoader.watch)
);

/* 工具们 */
function rename() {
	return gulpTransformer(async function (file) {
		const fileName = basename(LOADER_DIST_FILE);
		file.path = resolve(file.dirname, fileName);

		return file;
	});
}
