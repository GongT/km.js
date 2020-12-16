import { resolve } from 'path';
import { gulpDest, gulpManualyLoadModules, gulpTransformer, sourcemapsWrite, VinylFile } from '@km.js/gulp-tools';
import { info } from 'fancy-log';
import { LOADER_DIST_DIR } from './consts';

/** 可以通过copyModules收集loader的依赖 */
export const RequiredNativeModules = {
	nodeModulesDir: resolve(__dirname, '../node_modules'),
	moduleList: require(resolve(__dirname, './dependencies.json')),
};

export function gulpCopyRequiredNativeModules() {
	info('    copy to: %s', LOADER_DIST_DIR);
	return gulpManualyLoadModules(RequiredNativeModules).pipe(sourcemapsWrite()).pipe(gulpDest(LOADER_DIST_DIR));
}
