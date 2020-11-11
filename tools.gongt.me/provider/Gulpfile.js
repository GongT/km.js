const gulp = require('gulp');
const { resolve } = require('path');
const { loadToGulp } = require('@build-script/builder');
const {
	gulpCopyRequiredNativeModules,
	gulpActionWatchLoader,
	gulpActionBuildLoader,
	setResultsDirectory,
} = require('@km.js/client-loader');
const { gulpTask } = require('@km.js/gulp-tools');

const loaderRoot = resolve(__dirname, 'lib/loader');
setResultsDirectory(loaderRoot);

const tasks = loadToGulp(gulp, __dirname);

const libraries = gulpTask('copy:modules', '复制依赖', gulpCopyRequiredNativeModules);

const buildScriptWatch = tasks.watch;
gulp.task('watch', gulp.parallel(buildScriptWatch, gulpActionWatchLoader, libraries));

const buildScriptBuild = tasks.build;
gulp.task('build', gulp.series(buildScriptBuild, gulpActionBuildLoader, libraries));
