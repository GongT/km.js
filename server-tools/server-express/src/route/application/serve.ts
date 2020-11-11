import { md5 } from '@idlebox/node';
import { Router } from 'express';
import serveStatic from 'serve-static';
import { MIME_IMPORTMAP_JSON_UTF8 } from '../../data/mime';
import { clientNamespace, IImportMap } from './importmap';

let importmap: IImportMap;

export function reloadRouter() {
	router.stack.length = 0;

	importmap = clientNamespace.getImportMap();
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

	for (const { mountpoint, path, serveOptions } of clientNamespace.getRouteInfo()) {
		// console.log('use: %s => %s', mountpoint, path);
		router.use(mountpoint, serveStatic(path, serveOptions));
	}
}

let router: Router = Router();

export function getApplicationRouter() {
	if (!importmap) {
		reloadRouter();
	}
	return router;
}

export function getBuildMap() {
	if (!importmap) {
		reloadRouter();
	}
	return importmap;
}
