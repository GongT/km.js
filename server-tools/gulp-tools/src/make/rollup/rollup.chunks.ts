import { resolve } from 'path';
import { findUpUntilSync } from '@idlebox/node';
import { error } from 'fancy-log';
import { APPLICATION_HASH, INPUT_DIR_NAME, OUTPUT_ROOT, VENDOR_HASH } from './rollup.args';
import { getAllDependencies } from './rollup.lib';

const VENDOR_CHUNK = 'vendor.' + VENDOR_HASH;
const INPUT_PATH = resolve(OUTPUT_ROOT, INPUT_DIR_NAME);

/** @internal */
export function manualChunksProduction(entrys: string) {
	return (id: string) => {
		if (id.startsWith(entrys)) {
			return;
		}
		if (id.charCodeAt(0) === 0) {
			return VENDOR_CHUNK;
		}
		if (id.includes('/node_modules/')) {
			return VENDOR_CHUNK;
		}
		if (!id.includes('/')) {
			return VENDOR_CHUNK;
		}
		if (id.startsWith(INPUT_PATH)) {
			return 'application.' + APPLICATION_HASH;
		}
		error('not set any chunk: %s', id);
		return undefined;
	};
}

/** @internal */
export function manualChunksDevelopment(entrys: string) {
	const dependencies = getAllDependencies();

	return (id: string) => {
		if (id.startsWith(entrys)) {
			return;
		}
		if (!id.includes('/')) {
			return VENDOR_CHUNK;
		}

		if (id.includes('/node_modules/')) {
			if (id.charCodeAt(0) === 0) {
				id = id.slice(1);
			}
			const packageName = moduleName(id);
			if (dependencies[packageName]) {
				return 'dependencies/' + packageName.replace('/', '$');
			} else {
				// const info = api.getModuleInfo(id);
				// if (info.importedIds.length === 0) {
				// 	return HELPER_CHUNK;
				// }
				return 'dependencies/sub_dependencies/' + packageName.replace('/', '$');
			}
		}

		if (id.startsWith(INPUT_PATH)) {
			return '@@app/' + id.replace(INPUT_PATH, '').replace(/^\/+/, '').replace(/\.js/, '');
		}
		error('not set any chunk: %s', id);
		return undefined;
	};
}

let moduleResolveCache: Record<string, string> = {};
function moduleName(path: string): string {
	if (path.includes('?')) {
		path = path.split('?', 1)[0];
	}
	if (moduleResolveCache[path]) {
		return moduleResolveCache[path];
	}

	const pkg = findUpUntilSync(path, 'package.json');
	if (!pkg) {
		throw new Error('Can not find package.json for file: ' + path);
	}
	const name = require(pkg).name;

	if (typeof name !== 'string') {
		try {
			return moduleName(resolve(pkg, '../..'));
		} catch (e) {
			throw new Error(e.message + '\n  Can not find package.json for file: ' + path);
		}
	}

	moduleResolveCache[path] = name;
	return name;
}
