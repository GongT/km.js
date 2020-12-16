const path = require('path');

const tempdir = process.env.RUSH_TEMP_FOLDER || path.resolve(__dirname, '../../common/temp');

module.exports = {
	NG_BUILD_MANGLE: false,
	NG_BUILD_MINIFY: false,
	NG_BUILD_BEAUTIFY: true,
	NG_BUILD_CACHE: path.resolve(tempdir, 'ng-build-cache'),
};
