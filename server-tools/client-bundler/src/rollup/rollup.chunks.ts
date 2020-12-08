import { resolve } from 'path';
import { findUpUntilSync } from '@idlebox/node';
import { error } from 'fancy-log';
import { APPLICATION_HASH, INPUT_DIR_PATH, VENDOR_HASH } from './rollup.args';
import { getAllDependencies } from './rollup.lib';

const VENDOR_CHUNK = '_vendor.' + VENDOR_HASH;

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
		if (id.startsWith(INPUT_DIR_PATH)) {
			return 'application.' + APPLICATION_HASH;
		}
		error('not set any chunk: %s', id);
		return undefined;
	};
}

export function manualChunksDevelopment(entrys: string) {
	const dependencies = getAllDependencies();
	// console.error('dependencies=%j',dependencies)

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
				return packageName;
			} else {
				// const info = api.getModuleInfo(id);
				// if (info.importedIds.length === 0) {
				// 	return HELPER_CHUNK;
				// }
				return '_sub_dependencies/' + packageName;
			}
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
