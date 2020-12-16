const gulp = require('gulp');
const { resolve } = require('path');
const { loadToGulp } = require('@build-script/builder');

/*
const loaderRoot = resolve(__dirname, 'lib/loader-dependency');
setResultsDirectory(loaderRoot);
gulpPublicTask('copy:modules', '复制依赖', gulpCopyRequiredNativeModules);
*/
loadToGulp(gulp, __dirname);
