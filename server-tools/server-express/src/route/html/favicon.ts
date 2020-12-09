import { join } from 'path';
import { Application } from 'express';
import serveStatic from 'serve-static';
import { DEFAULT_STATIC_ROOT, ExpressConfigKind } from '../../data/defaultPath';
import { createCommonOptions, ResourceType } from '../application/browser-cache';
import { contributePageHtml } from './main';

export function serveFavicon(app: Application, url: string, fsPath: string) {
	const staticUrl = app.get(ExpressConfigKind.RootStatic) || DEFAULT_STATIC_ROOT;
	app.get(url, serveStatic(fsPath, createCommonOptions(ResourceType.Assets, 'image/png')));
	contributePageHtml({
		headString: `<link rel="shortcut icon" href="${join(staticUrl, url)}" type="image/png" />`,
	});
}
