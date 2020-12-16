import { IncomingMessage, request as httpRequest, RequestOptions } from 'http';
import { request as httpsRequest } from 'https';
import { CollectingStream } from '@idlebox/node';
import { parse } from 'url';
import { baseUrl, knownRemote } from './config';
import { Router, Request, Response, Handler } from 'express';
import ProxyAgent from 'proxy-agent';
import { createGunzip, gzip as gzipAsync } from 'zlib';
import { promisify } from 'util';

const gzip = promisify(gzipAsync);

export type ContentReplacer = (body: string) => string;

export interface ProxyOptions {
	contentReplacer?(body: string): string;
	proxy: string;
}

function requestAsync(request: typeof httpRequest, options: RequestOptions): Promise<IncomingMessage> {
	return new Promise((resolve, reject) => {
		const req = request(options, resolve);
		req.on('error', reject);
		req.end();
	});
}

function validRequest(url: string) {
	for (const item of knownRemote.values()) {
		if (item.test(url)) {
			return true;
		}
	}
	return false;
}

export function serveChinaCDNProxy(rootRouter: Router, { proxy, contentReplacer }: ProxyOptions) {
	const agent = new ProxyAgent(proxy);
	rootRouter.get(
		baseUrl,
		handle(async (req: Request, res: Response) => {
			const url = req.query.upstream;
			if (typeof url !== 'string') {
				res.set('content-type', 'text/plain; charset=utf8')
					.status(400)
					.send('Unknown upstream type: ' + JSON.stringify(url));
				return;
			}
			if (!validRequest(url)) {
				res.set('content-type', 'text/plain; charset=utf8')
					.status(400)
					.write('Unknown upstream url: ' + url + '\n');
				for (const item of knownRemote.values()) {
					res.write(item.toString() + '\n');
				}
				res.end();
				return;
			}

			const u = parse(url);
			const ssl = u.protocol === 'https';
			const request = ssl ? httpsRequest : httpRequest;

			const inputHeaders = { ...req.headers };
			delete inputHeaders['connection'];
			inputHeaders['host'] = u.hostname!;

			const acceptGzip = (inputHeaders['accept-encoding'] || '').includes('gzip');
			inputHeaders['accept-encoding'] = 'gzip';

			const proxyRes = await requestAsync(request, {
				agent: agent,
				headers: inputHeaders,
				port: u.port || undefined,
				hostname: u.hostname,
				method: 'GET',
				path: u.path,
				setHost: false,
			});

			res.status(proxyRes.statusCode || 500);
			const responseHeaders = proxyRes.headers;
			delete responseHeaders['content-length'];
			res.set(responseHeaders);

			const isText = (responseHeaders['content-type'] || '').toLowerCase().startsWith('text/');

			if (isText) {
				const gzipEnabled =
					responseHeaders['content-encoding'] && responseHeaders['content-encoding'].toLowerCase() === 'gzip';

				const resp = gzipEnabled ? proxyRes.pipe(createGunzip()) : proxyRes;
				let content: string | Buffer = await resp.pipe(new CollectingStream()).promise();

				if (contentReplacer) {
					content = contentReplacer(content as string);
				}
				if (acceptGzip) {
					content = await gzip(content);
				}
				res.send(content);
			} else {
				proxyRes.pipe(res);
			}
		})
	);
}

function handle(handler: (req: Request, res: Response) => Promise<any>): Handler {
	return (req: Request, res: Response) => {
		Promise.resolve()
			.then(() => {
				return handler(req, res);
			})
			.catch((e) => {
				console.error('Proxy' + e.stack);
				res.set('content-type', 'text/plain; charset=utf8')
					.status(500)
					.send('Proxy ' + e.message)
					.end();
			});
	};
}
