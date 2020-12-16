import { MIME_JAVASCRIPT_UTF8 } from '@km.js/server-express';
import { Request, Response } from 'express';
import { createRequire } from 'module';

const requires = [
	createRequire(require.resolve('@km.js/client-loader')),
	createRequire(require.resolve('@tools.gongt.me/application/package.json')),
	require,
];

const cache = new Map<string, string>();

export function debugProvideNodeModules(req: Request, res: Response) {
	const specifier = req.url.slice(1);

	if (!cache.has(specifier)) {
		const fsPath = findFile(specifier);
		console.log('%s => %s', specifier, fsPath);
		cache.set(specifier, fsPath);
	}

	response(res, cache.get(specifier)!);
}

function findFile(specifier: string) {
	for (const require of requires) {
		try {
			return require.resolve(specifier);
		} catch {}
	}
	return '';
}

function response(res: Response, file: string) {
	if (file) {
		res.sendFile(file, {
			maxAge: '1d',
			headers: {
				'Content-Type': MIME_JAVASCRIPT_UTF8,
			},
		});
	} else {
		res.sendStatus(404);
	}
}
