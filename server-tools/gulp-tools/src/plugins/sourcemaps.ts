import { init as sourcemapsPluginInit, write as sourcemapsPluginWrite } from 'gulp-sourcemaps';

export function sourcemapsInit() {
	return sourcemapsPluginInit({ loadMaps: true });
}
export function sourcemapsWrite() {
	return sourcemapsPluginWrite('.');
}
