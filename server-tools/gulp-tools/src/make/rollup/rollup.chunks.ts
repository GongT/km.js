import { resolve } from 'path';
import { findUpUntilSync } from '@idlebox/node';
import { error } from 'fancy-log';
import { getAllDependencies } from './rollup.lib';
import { APP_SOURCE_TEMP, APPLICATION_HASH, VENDOR_HASH } from './rollup.args';

const VENDOR_CHUNK = 'vendor.' + VENDOR_HASH;

export function createManualChunks(isProduction: boolean, entrys: Record<string, string>) {
	if (isProduction) {
		return manualChunksProduction(entrys);
	} else {
		return manualChunksDevelopment(entrys);
	}
}

export function createManualChunksForDev(entrys: Record<string, string>) {
	const knownEntrys = Object.values(entrys);
	return (id: string) => {
		if (knownEntrys.includes(id)) {
			return;
		}
		return 'vendor-dev';
	};
}

function manualChunksProduction(entrys: Record<string, string>) {
	const knownEntrys = Object.values(entrys);
	return (id: string) => {
		if (knownEntrys.includes(id)) {
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
		if (id.startsWith(APP_SOURCE_TEMP)) {
			return 'application.' + APPLICATION_HASH;
		}
		error('not set any chunk: %s', id);
		return undefined;
	};
}
function manualChunksDevelopment(entrys: Record<string, string>) {
	const knownEntrys = Object.values(entrys);

	const dependencies = getAllDependencies();

	return (id: string) => {
		if (knownEntrys.includes(id)) {
			// don't chunk entry
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

		if (id.startsWith(APP_SOURCE_TEMP)) {
			return '@@app/' + id.replace(APP_SOURCE_TEMP, '').replace(/^\/+/, '').replace(/\.js/, '');
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
