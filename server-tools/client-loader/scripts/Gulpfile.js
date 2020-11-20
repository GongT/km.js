const {
	buildTask,
	gulpTypescriptTask,
	gulpTask,
	gulpSerise,
	gulpParallel,
	gulpSrcFrom,
	sourcemapsInit,
	sourcemapsWrite,
	gulpDest,
	gulpTransformer,
	gulpManualyLoadModules,
	createMeta,
} = require('@km.js/gulp-tools');
const { info } = require('fancy-log');
const { resolve, basename, extname } = require('path');
const { tmpdir } = require('os');
const { appendText, prependText } = require('gulp-append-prepend');
const { readFileSync } = require('fs');

// 最终loader文件的头尾
const scopeStart = '"use strict";(function main() {';
const scopeEnd = '})();';

// 第一步: 从src文件夹编译ts到lib文件夹
const { build, watch, outDir, distFiles } = gulpTypescriptTask('loader', 'App loader', {
	tsconfig: resolve(__dirname, '../tsconfig.json'),
});

// 版本号主要用来给loader.js加后缀
const version = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8')).version;
module.exports.VERSION = version;

// Note: 如果是从其他node包引用,则在临时文件中工作,如果是这个包自己构建自己,则在包本身目录中工作
function setResultsDirectory(where) {
	module.exports.LOADER_DIST = where;
	module.exports.LOADER_DIST_FILE = resolve(where, 'loader.' + version + extname(distFiles));
}
setResultsDirectory(resolve(tmpdir(), 'kmjs/loader'));
module.exports.setResultsDirectory = setResultsDirectory;

// 第二步: 最终文件(loader.VERSION.js)的构建任务
const taskConcatLoader = buildTask({
	name: 'loader:join',
	title: 'Concat (build) loader application',
	base: outDir,
	glob: 'out.js',
	action() {
		info('Start concat... [save: %s]', module.exports.LOADER_DIST_FILE);

		return gulpSrcFrom(outDir, distFiles)
			.pipe(sourcemapsInit())
			.pipe(prependText(scopeStart))
			.pipe(appendText(scopeEnd))
			.pipe(rename())
			.pipe(sourcemapsWrite())
			.pipe(gulpDest(module.exports.LOADER_DIST));
	},
});

module.exports.gulpActionBuildLoader = gulpTask(
	'build:loader',
	'Build app loader',
	gulpSerise(build, taskConcatLoader.build)
);
module.exports.gulpActionWatchLoader = gulpTask(
	'watch:loader',
	'Watch app loader',
	gulpParallel(watch, taskConcatLoader.watch)
);

// 用于一次性从ts构建出loader.js的方法,直接返回Vinyl文件,不需要其他构建步骤的时候可以用它
/** @returns {NodeJS.ReadWriteStream} */
function onePass() {
	return build(() => {})
		.pipe(sourcemapsInit())
		.pipe(prependText(scopeStart))
		.pipe(appendText(scopeEnd))
		.pipe(rename());
}
module.exports.buildOnce = onePass;

/** 可以通过copyModules收集loader的依赖 */
const RequiredNativeModules = {
	nodeModulesDir: resolve(__dirname, '../node_modules'),
	moduleList: [
		{
			packageName: 'es6-promise',
			files: {
				source: 'dist/es6-promise.min.js',
				map: 'dist/es6-promise.min.map',
			},
		},
		{
			packageName: 'regenerator-runtime',
			files: 'runtime.js',
		},
		{
			packageName: 'es-module-shims',
			files: {
				source: 'dist/es-module-shims.min.js',
				map: 'dist/es-module-shims.min.js.map',
			},
		},
		{
			packageName: 'whatwg-fetch',
			files: 'dist/fetch.umd.js',
		},
		{
			packageName: 'systemjs',
			files: {
				'.': {
					source: 'dist/system.min.js',
					map: 'dist/system.min.js.map',
				},
				transform: {
					source: 'dist/extras/transform.min.js',
					map: 'dist/extras/transform.min.js.map',
					fileName: 'systemjs.transform.VERSION',
				},
			},
		},
		{
			packageName: 'systemjs-transform-babel',
			files: 'dist/babel-transform.js',
		},
	],
};
module.exports.RequiredNativeModules = RequiredNativeModules;

module.exports.gulpCopyRequiredNativeModules = function gulpCopyRequiredNativeModules() {
	info('    copy to: %s', module.exports.LOADER_DIST);
	return gulpManualyLoadModules(RequiredNativeModules)
		.pipe(sourcemapsWrite())
		.pipe(gulpDest(module.exports.LOADER_DIST));
};

/* 工具们 */
function rename() {
	return gulpTransformer(async function (file) {
		file.path = resolve(file.dirname, basename(module.exports.LOADER_DIST_FILE));

		this.push(createMeta(file, { name: 'loader' }));

		return file;
	});
}
