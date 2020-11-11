import { resolve } from 'path';
import { relativePath } from '@idlebox/node';
import { APP_SOURCE_TEMP, WORKING_DIR } from './rollup.args';

export function sourcemapPathTransform(path: string) {
	// console.log(p)
	const p = relativePath(WORKING_DIR, resolve(APP_SOURCE_TEMP, path)).replace(/^[./]+/, '');
	// console.log('\x1B[2m%s\x1B[0m | %s', resolve(APP_SOURCE_TEMP, p), p);
	if (p.startsWith('node_modules/')) {
		return '/' + p.replace(/\/\.pnpm\/[^/]+\//g, '/');
	} else if (p.startsWith('app/src/')) {
		return p.replace(/^app/, '');
	} else {
		console.log('\x1B[38;5;9mMissing rule for sourcemap: %s\x1B[0m', path);
		return p;
	}
}

export function sourcemapPathTransformDev(path: string) {
	return path;
	// if (!p.includes('/')) {
	// 	return p;
	// } else if (p.startsWith('node_modules/')) {
	// 	return '/' + p.replace(/\/\.pnpm\/[^/]+\//g, '/');
	// } else {
	// 	console.log('\x1B[38;5;9mMissing rule for sourcemap: %s\x1B[0m', path);
	// 	return p;
	// }
}
