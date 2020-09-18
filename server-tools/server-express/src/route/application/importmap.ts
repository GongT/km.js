import { resolve } from 'path';
import { ServeStaticOptions } from 'serve-static';
import { passConfig } from './config';

export interface IImportMap {
	imports: Record<string, string>;
	// scope not support now
	config: any;
}

interface IServeParam {
	mountpoint: string;
	path: string;
	serveOptions: ServeStaticOptions;
}

/** @internal */
export function createServerRoute(base: string): IServeParam[] {
	const result: IServeParam[] = [];
	for (const { middleUrl, registry, serveOptions } of Object.values(packages)) {
		for (const [specifier, path] of Object.entries(registry)) {
			const lastUrl = resolve('/' + base + '/' + middleUrl + '/' + specifier).replace(/^\/+/, '');
			result.push({ mountpoint: lastUrl, path, serveOptions });
		}
	}
	return result;
}

/** @internal */
export function buildMap(base: string): IImportMap {
	const imports: Record<string, string> = {};

	for (const { middleUrl, registry } of Object.values(packages)) {
		for (const specifier of Object.keys(registry)) {
			const lastUrl = resolve('/' + base + '/' + middleUrl + '/' + specifier).replace(/^\/+/, '');
			imports[specifier] = lastUrl;
		}
	}

	return { imports, config: passConfig };
}

export interface IServeInfo {
	filePath: string;
	mountpoint?: string;
}

class PackageRegister {
	/** @internal */
	public readonly middleUrl: string;
	/** @internal */
	public readonly serveOptions: ServeStaticOptions;
	/** @internal */
	public readonly registry: Record<string, string> = {};

	constructor(middleUrl: string, serveOptions: ServeStaticOptions) {
		this.middleUrl = middleUrl;
		this.serveOptions = serveOptions;
	}

	mapFile(url: string, file: string) {
		this.registry[url] = file;
	}

	mapFolder(url: string, path: string) {
		this.registry[url + '/'] = path + '/';
	}
}

let packages: Record<string, PackageRegister> = {};
export function createPackage(middleUrl: string, serveConfig: ServeStaticOptions): PackageRegister {
	if (!packages[middleUrl]) {
		packages[middleUrl] = new PackageRegister(middleUrl, serveConfig);
	}
	return packages[middleUrl];
}
