import { Handler } from 'express';
import { MIME_HTML_UTF8 } from '../../data/mime';

const padding = `<!-- padding --><!-- padding --><!-- padding --><!-- padding --><!-- padding -->
<!-- padding --><!-- padding --><!-- padding --><!-- padding --><!-- padding -->
<!-- padding --><!-- padding --><!-- padding --><!-- padding --><!-- padding -->
<!-- padding --><!-- padding --><!-- padding --><!-- padding --><!-- padding -->
<!-- padding --><!-- padding --><!-- padding --><!-- padding --><!-- padding -->
<!-- padding --><!-- padding --><!-- padding --><!-- padding --><!-- padding -->
<!-- padding --><!-- padding --><!-- padding --><!-- padding --><!-- padding -->
<!-- padding --><!-- padding --><!-- padding --><!-- padding --><!-- padding -->`;

export function terminate404(message: string = '404 Not Found', extraData?: string): Handler {
	return function notFound(_, res) {
		res.setHeader('Cache-Control', 'no-store');
		res.setHeader('Content-Type', MIME_HTML_UTF8);
		res.send(`<h1>${message}</h1>${extraData || padding}`).status(404);
	};
}
