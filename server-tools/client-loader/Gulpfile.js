const { gulpPublicTask, gulpRimraf, gulpParallel, gulpSerise } = require('@km.js/gulp-tools');
const { gulpActionBuildLoader, gulpActionWatchLoader, setResultsDirectory } = require('./scripts/Gulpfile.js');
const { resolve } = require('path');

setResultsDirectory(resolve(__dirname, 'dist'));

const build = gulpPublicTask('build', '构建', gulpParallel(gulpActionBuildLoader));
gulpPublicTask('watch', '监视修改', gulpParallel(gulpActionWatchLoader));

const clean = gulpPublicTask(
	'clean',
	'清理文件夹',
	gulpParallel(gulpRimraf(resolve(__dirname, 'dist')), gulpRimraf(resolve(__dirname, 'lib')))
);
gulpPublicTask('default', '重新构建', gulpSerise(clean, build));
