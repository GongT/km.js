import { resolve } from 'path';
import { md5 } from '@idlebox/node';
import { Router } from 'express';
import serveStatic from 'serve-static';
import { MIME_IMPORTMAP_JSON_UTF8 } from '../../data/mime';
import { buildMap as buildImportMap, createServerRoute, IImportMap } from './importmap';

let virtualUrlBase = '/';

export function setApplicationRootUrl(base: string) {
	virtualUrlBase = resolve('/', base);
}

let importmap: IImportMap;

export function reloadRouter() {
	router.stack.length = 0;

	importmap = buildImportMap(virtualUrlBase);
	const importmapString = JSON.stringify(importmap, null, 4);
	const hash = md5(Buffer.from(importmapString));
	router.get('/importmap.json', (req, res) => {
		if (req.header('If-None-Match') === hash) {
			res.sendStatus(304);
		} else {
			res.setHeader('Content-Type', MIME_IMPORTMAP_JSON_UTF8);
			res.setHeader('ETag', hash);
			res.send(importmapString);
		}
	});

	for (const { mountpoint, path, serveOptions } of createServerRoute(virtualUrlBase)) {
		router.use(mountpoint, serveStatic(path, serveOptions));
	}
}

let router: Router = Router();

export function getApplicationRouter() {
	reloadRouter();
	return router;
}

export function getBuildMap() {
	return importmap;
}
