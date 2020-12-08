import { gulpParallel, gulpSeries } from '@build-script/gulp-chain-simplify';
import { gulpPublicTask, gulpRimraf } from '@km.js/gulp-tools';
import { libRoot } from './scripts/consts';
import { createIndexFile } from './scripts/createClientProjectLoader';
import { gulpCopyRequiredNativeModules } from './scripts/task.copy';
import { gulpActionBuildLoader, gulpActionWatchLoader } from './scripts/task.concat';

const build = gulpPublicTask(
	'build',
	'构建',
	gulpParallel(gulpActionBuildLoader, createIndexFile, gulpCopyRequiredNativeModules)
);
gulpPublicTask(
	'watch',
	'监视修改',
	gulpParallel(gulpActionWatchLoader, createIndexFile, gulpCopyRequiredNativeModules)
);

const clean = gulpPublicTask('clean', '清理文件夹', gulpRimraf(libRoot));
gulpPublicTask('default', '重新构建', gulpSeries(clean, build));
