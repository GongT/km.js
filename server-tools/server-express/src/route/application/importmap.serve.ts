import { md5 } from '@idlebox/node';
import { Handler, Request, Response } from 'express';
import { join } from 'path';
import { MIME_IMPORTMAP_JSON_UTF8 } from '../../data/mime';
import { passConfig } from './config';
import { IImportMap, importMap } from './importmap';

function createString(root: string) {
	const map: IImportMap = JSON.parse(JSON.stringify(importMap));

	map.config = passConfig;
	for (const key of Object.keys(map.imports)) {
		map.imports[key] = join(root, map.imports[key]);
	}

	const scopes = map.scopes;
	map.scopes = {};
	for (const [from, ele] of Object.entries(scopes)) {
		const nfrom = join(root, from);
		map.scopes[nfrom] = {};

		for (const key of Object.keys(ele)) {
			map.scopes[nfrom][key] = join(root, ele[key]);
		}
	}

	const depcache = map.depcache;
	map.depcache = {};
	for (const [file, arr] of Object.entries(depcache)) {
		map.depcache[join(root, file)] = arr.map((e) => join(root, e));
	}

	const content = Buffer.from(JSON.stringify(map, null, 2));
	const hash = md5(content);
	return { json: map, content, hash };
}

interface WithReload {
	reload(root?: string): void;
}

interface WithImportMap {
	importMap: IImportMap;
}

export function serveImportMap(appUrlRoot: string = '/_app_'): Handler & WithReload & WithImportMap {
	let { content, json, hash } = createString(appUrlRoot);
	const reload = function reload(newRoot = appUrlRoot) {
		const result = createString(newRoot);
		content = result.content;
		hash = result.hash;
	};
	return Object.assign(
		function _serveImportMap(req: Request, res: Response) {
			res.setHeader('Cache-Control', 'public, max-age=300');
			res.setHeader('Content-Type', MIME_IMPORTMAP_JSON_UTF8);

			if (req.header('If-None-Match') === hash) {
				res.sendStatus(304);
			} else {
				res.setHeader('ETag', hash);
				res.send(content);
			}
		},
		{ reload, importMap: json }
	);
}
