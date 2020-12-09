import { join } from 'path';
import { Application, IRouter, Router } from 'express';
import serveStatic, { ServeStaticOptions } from 'serve-static';
import { terminate404Js } from '../static/404-not-found';
import { passThroughConfig } from './config';
import { createImportScope, IImportMap, registerGlobalMapping } from './importmap';
import { serveImportMap } from './importmap.serve';
import { DEFAULT_APPLICATION_ROOT, ExpressConfigKind } from '../../data/defaultPath';

const terminate = terminate404Js(
	`console.log('%cError: 404 Not Found','color:red;font-size:xx-large');alert('Something wrong');`
);

export class ClientGlobalRegister {
	private readonly router: IRouter;
	public readonly appBaseUrl: string;

	constructor(app: Application) {
		if (!app.get(ExpressConfigKind.RootApplication)) {
			app.set(ExpressConfigKind.RootApplication, DEFAULT_APPLICATION_ROOT);
		}

		const appBaseUrl = join('/', app.get(ExpressConfigKind.RootApplication));
		app.set('applicationUrl', appBaseUrl);
		app.locals.APPLICATION_BASE_URL = appBaseUrl;
		passThroughConfig('APPLICATION_BASE_URL', appBaseUrl);

		this.router = Router();
		app.use(appBaseUrl, this.router, terminate);

		this.appBaseUrl = appBaseUrl;
	}

	map(specifier: string, url: string, fsPath: string, options: ServeStaticOptions) {
		registerGlobalMapping(specifier, url);
		this.serve(url, fsPath, options);
	}

	serve(url: string, fsPath: string, options: ServeStaticOptions) {
		options.fallthrough = true;
		this.router.use(join('/', url), serveStatic(fsPath, options));
	}

	createScope(scopeUrl: string) {
		return new ClientScopeRegister(this.router, scopeUrl);
	}

	finalize(cdn: string = this.appBaseUrl): IImportMap {
		const handler = serveImportMap(cdn);
		this.router.use('/importmap.json', handler);
		return handler.importMap;
	}
}

export class ClientScopeRegister {
	private readonly router: IRouter;
	private readonly scope: Record<string, string>;
	public readonly scopeUrl: string;

	constructor(parent: IRouter, scopeUrl: string) {
		scopeUrl = join('/', scopeUrl + '/');
		this.scopeUrl = scopeUrl;

		this.scope = createImportScope(scopeUrl);

		this.router = Router();
		parent.use(scopeUrl, this.router, terminate);
	}

	mapOnly(specifier: string, url: string) {
		this.scope[specifier] = join(this.scopeUrl, url);
	}

	map(specifier: string, url: string, fsPath: string, options: ServeStaticOptions) {
		this.mapOnly(specifier, url);
		this.serve(url, fsPath, options);
	}

	serve(url: string, fsPath: string, options: ServeStaticOptions) {
		options.fallthrough = true;
		this.router.use(url, serveStatic(fsPath, options));
	}
}
