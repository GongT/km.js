import { resolve } from 'path';
import { relativePath } from '@idlebox/node';
import { INPUT_DIR_PATH, OUTPUT_DIR_PATH, SOURCE_MAP_ROOT } from './rollup.args';

/** @internal */
export function sourcemapPathTransform(url: string, sourcemapPath: string) {
	const path = resolve(sourcemapPath, '..', url);
	if (path.startsWith(SOURCE_MAP_ROOT)) {
		return url;
	}
	if (path.startsWith(INPUT_DIR_PATH)) {
		return url;
	}
	const p = relativePath(OUTPUT_DIR_PATH, path).replace(/^[./]+/, '');
	if (p.includes('node_modules/')) {
		const a = p.split('/node_modules/');
		a.shift();
		if (a[0].startsWith('.pnpm')) {
			a.shift();
		}
		return '/node_modules/' + a.join('/node_modules/').replace(/\/\.pnpm\/[^/]+\//g, '/');
	} else {
		console.log('\x1B[38;5;9mMissing rule for sourcemap: %s\x1B[0m', path);
		return p;
	}
}
