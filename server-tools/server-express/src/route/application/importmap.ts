import { boundMethod } from 'autobind-decorator';
import { posix, basename } from 'path';
import { ServeStaticOptions } from 'serve-static';
import { passConfig } from './config';
import { createCommonOptions, ResourceType } from './browser-cache';
import { MIME_JSON_UTF8 } from '../../data/mime';

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

interface lconfig {
	id: string;
	isScope: boolean;
	path?: string;
	url?: string;
	serveConfig?: ServeStaticOptions;
}

class FileRegister {
	private config: lconfig;

	constructor(packageId: string, private readonly rootUrl: string, private readonly _reset: Function) {
		this.config = { id: packageId, isScope: false };
	}

	/** @internal */
	toJSON() {
		const ret = {
			...this.config,
		};
		if (!ret.path) {
			throw new Error(`dont know where to find module "${ret.id}"`);
		}
		return ret;
	}

	asScopeFolder() {
		this._reset();
		this.config.isScope = true;
		return this;
	}
	fromFilesystem(fileAbs: string) {
		this._reset();
		this.config.path = fileAbs;
		return this;
	}
	throughUrl(middleUrl: string) {
		this._reset();
		this.config.url = middleUrl;
		return this;
	}
	withHttpConfig(serveConfig: ServeStaticOptions) {
		this._reset();
		this.config.serveConfig = serveConfig;
		return this;
	}
	getMount() {
		return this.__get(false);
	}
	getUrl() {
		return this.__get(true);
	}

	private __get(withroot: boolean) {
		if (!this.config.path) {
			throw new Error(`dont know where to find module "${this.config.id}"`);
		}
		let urls = posix.resolve('/', (withroot ? this.rootUrl : '') + '/' + this.config.url);
		urls += '/';
		if (this.config.isScope) {
			if (!this.config.url) {
				urls += basename(this.config.path) + '/';
			}
		} else {
			urls += basename(this.config.path);
		}
		return urls;
	}
}

class PackageRegister {
	private readonly map: Record<string, FileRegister> = {};
	private declare serveConfig: ServeStaticOptions;
	private rootUrl: string = '/__application__';
	private _cache?: { importMap: IImportMap; serveInfo: IServeParam[] };

	/** @internal */
	@boundMethod
	_reset() {
		delete this._cache;
	}

	/**
	 * module("react").from("/path/to/react.js");
	 */
	serveModule(packageId: string) {
		if (this.map[packageId]) {
			throw new Error(`duplicate package id: ${packageId}`);
		}

		this._reset();
		this.map[packageId] = new FileRegister(packageId, this.rootUrl, this._reset);
		return this.map[packageId];
	}

	mountTo(rootUrl: string) {
		this._reset();
		this.rootUrl = rootUrl;
		return this;
	}

	config(serveConfig: ServeStaticOptions) {
		this._reset();
		this.serveConfig = serveConfig;
		return this;
	}

	private _create() {
		const imports: Record<string, string> = {};
		const serveInfo: IServeParam[] = [];

		const mapConfig = createCommonOptions(ResourceType.Dynamic, MIME_JSON_UTF8, true);

		for (const item of Object.values(this.map)) {
			const info = item.toJSON();
			const mount = item.getMount();
			const url = item.getUrl();

			const postfix = info.isScope ? '/' : '';
			imports[info.id + postfix] = url;

			if (info.isScope) {
				serveInfo.push({
					mountpoint: mount + '**/*.map',
					path: info.path!,
					serveOptions: mapConfig,
				});
			} else {
				serveInfo.push({
					mountpoint: mount + '.map',
					path: info.path! + '.map',
					serveOptions: mapConfig,
				});
			}
			serveInfo.push({
				mountpoint: mount,
				path: info.path!,
				serveOptions: Object.assign({}, this.serveConfig, info.serveConfig),
			});
		}

		this._cache = {
			importMap: { imports, config: passConfig },
			serveInfo,
		};
	}

	getImportMap() {
		if (!this._cache) this._create();
		return this._cache!.importMap;
	}
	getRouteInfo() {
		if (!this._cache) this._create();
		return this._cache!.serveInfo;
	}
}

export const clientNamespace = new PackageRegister();
