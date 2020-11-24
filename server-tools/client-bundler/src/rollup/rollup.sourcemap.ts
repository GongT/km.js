import { resolve } from 'path';
import { relativePath } from '@idlebox/node';
import { OUTPUT_DIR_PATH, SOURCE_MAP_ROOT } from './rollup.args';

/** @internal */
export function sourcemapPathTransform(path: string, sourcemapPath: string) {
	path = resolve(sourcemapPath, '..', path);
	if (path.startsWith(SOURCE_MAP_ROOT)) {
		return '/_sourcemap_/output/' + path.slice(SOURCE_MAP_ROOT.length + 1);
	}
	const p = relativePath(OUTPUT_DIR_PATH, path).replace(/^[./]+/, '');
	if (p.includes('node_modules/')) {
		const a = p.split('/node_modules/');
		a.shift();
		return '/_sourcemap_/' + a.join('/node_modules/').replace(/\/\.pnpm\/[^/]+\//g, '/');
	} else {
		console.log('\x1B[38;5;9mMissing rule for sourcemap: %s\x1B[0m', path);
		return p;
	}
}

/** @internal */
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
