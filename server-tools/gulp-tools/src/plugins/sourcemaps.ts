import { init as sourcemapsPluginInit, write as sourcemapsPluginWrite, WriteOptions } from 'gulp-sourcemaps';

export function sourcemapsInit() {
	return sourcemapsPluginInit({ loadMaps: true });
}
export function sourcemapsWrite(sourceRoot?: WriteOptions['sourceRoot']) {
	return sourcemapsPluginWrite('.', { sourceRoot });
}
