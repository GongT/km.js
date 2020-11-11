import { Handler } from 'express';
import { MIME_HTML_UTF8, MIME_JAVASCRIPT_UTF8 } from '../../data/mime';

const padding = `<!-- padding -->`.repeat(20);

export function terminate404(message: string = '404 Not Found', extraData?: string): Handler {
	return function notFound(_, res) {
		res.setHeader('Cache-Control', 'no-store');
		res.setHeader('Content-Type', MIME_HTML_UTF8);
		res.status(404).send(`<h1>${message}</h1>${extraData || padding}`);
	};
}

export function terminate404Js(script: string): Handler {
	return function notFound(req, res) {
		res.setHeader('Cache-Control', 'no-store');
		res.setHeader('Content-Type', MIME_JAVASCRIPT_UTF8);
		res.status(404).send(script + `/*${req.url}*/`);
	};
}
