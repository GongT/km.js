global.WORKING_DIRECTORY = __dirname;

const {
	gulpPublicTask,
	gulpManualyLoadModules,
	gulpTask,
	gulpRimraf,
	gulpParallel,
	gulpSerise,
	gulpDest,
	logPassing,
	sourcemapsWrite,
} = require('@km.js/gulp-tools');
const {
	gulpActionBuildLoader,
	gulpActionWatchLoader,
	RequiredNativeModules,
	LOADER_DIST,
} = require('./scripts/Gulpfile.js');
const { resolve } = require('path');

const libraries = gulpTask('copy:modules', '复制依赖', () => {
	return gulpManualyLoadModules(RequiredNativeModules)
		.pipe(sourcemapsWrite())
		.pipe(logPassing())
		.pipe(gulpDest(LOADER_DIST));
});

const build = gulpPublicTask('build', '构建', gulpParallel(gulpActionBuildLoader, libraries));
gulpPublicTask('watch', '监视修改', gulpParallel(gulpActionWatchLoader, libraries));

const clean = gulpPublicTask(
	'clean',
	'清理文件夹',
	gulpParallel(gulpRimraf(resolve(__dirname, 'dist')), gulpRimraf(resolve(__dirname, 'lib')))
);
gulpPublicTask('default', '重新构建', gulpSerise(clean, build));
