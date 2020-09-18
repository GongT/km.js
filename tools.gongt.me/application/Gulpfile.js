const gulp = require('gulp');
const { loadToGulp } = require('@build-script/builder');

gulp.task('test1', async () => {});

const tasks = loadToGulp(gulp, __dirname);
