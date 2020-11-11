import { debug, info, warn } from 'console';
import { readFile as readFileAsync } from 'fs';
import { createServer, Server } from 'http';
import { Socket } from 'net';
import { resolve } from 'path';
import { promisify } from 'util';
import { registerGlobalLifecycle, toDisposable } from '@idlebox/common';
import { boundMethod } from 'autobind-decorator';
import { Application, Request, Response } from 'express';
import morgan from 'morgan';
import { onServerStartListen } from './loader/childprocess';
import { createApplication } from './route/app';
import { passThroughConfig } from './route/application/config';
import { clientNamespace } from './route/application/importmap';
import { getApplicationRouter, getBuildMap } from './route/application/serve';
import { renderDefaultHtml } from './route/html';
import { terminate404Js } from './route/static/404-not-found';

const readFile = promisify(readFileAsync);

export interface IServerConfig {
	listenPort?: string | number;
	viewEngine?: string;
	viewPath?: string;
	applicationRootUrl?: string;
	preloadHtml?: string;
	preloadHtmlFile?: string;
}
export interface IClientConfig extends Record<string, any> {
	entryFile?: string;
}

export abstract class ExpressServer {
	private server?: Server;
	private app?: Application;
	public readonly isDev: boolean;
	private started = false;
	private connections = new Set<Socket>();

	constructor() {
		this.isDev = process.env.NODE_ENV !== 'production';
	}

	private _create_base() {
		this.app = createApplication();
		this.server = createServer(this.app);
		this.server.on('connection', (socket) => {
			this.connections.add(socket);
			// Remove the socket when it closes
			socket.on('close', () => {
				this.connections.delete(socket);
			});
		});
		if (this.isDev) {
			this.app.use(morgan('dev'));
		}
	}

	async startServe() {
		if (this.started) {
			throw new Error('duplicate call to startServe');
		}
		this.started = true;

		this._create_base();
		const app = this.app!;

		const myCfg = this.configureServer();
		if (myCfg.viewPath) {
			app.set('views', myCfg.viewPath);
		}
		if (myCfg.viewEngine) {
			app.set('view engine', myCfg.viewEngine);
		}

		if (myCfg.preloadHtmlFile) {
			app.locals.preloadHtml = await readFile(myCfg.preloadHtmlFile, 'utf8');
		} else if (myCfg.preloadHtml) {
			app.locals.preloadHtml = myCfg.preloadHtml;
		}

		const applicationRootUrl = resolve('/', myCfg.applicationRootUrl || '/__application__');
		clientNamespace.mountTo(applicationRootUrl);

		this.init(app);

		const config = this.configureClient();

		passThroughConfig(config);
		Object.assign(app.locals, config);

		const importMap = getBuildMap();
		app.locals.IMPORT_MAP_JSON = JSON.stringify(importMap);
		app.locals.IMPORT_MAP_JSON_TAG = `<script type="systemjs-importmap" id="AppConfig">${app.locals.IMPORT_MAP_JSON}</script>`;

		app.use(applicationRootUrl, getApplicationRouter(), terminate404Js(`alert('Something wrong');`));

		app.get(/./, this.serveHtml);

		await new Promise((resolve, reject) => {
			this.listen(myCfg.listenPort || 1551, resolve, reject);
		});
	}

	private listen(port: string | number, resolve: () => void, reject: (e: Error) => void) {
		const listen = process.env.LISTEN || port;
		const server = this.server!;

		const listenDone = () => {
			info('Express server listening %s', server.address());
			server.removeListener('error', reject);
			resolve();
			onServerStartListen();
		};

		if (typeof listen === 'string') {
			debug('Try listen unix path: %s', listen);
			server.listen(listen, listenDone);
		} else if (typeof listen === 'number') {
			debug('Try listen tcp port: %s', listen);
			server.listen(listen, '0.0.0.0', listenDone);
		} else {
			throw new Error('Invalid listen path: ' + listen);
		}

		server.once('error', reject);

		registerGlobalLifecycle(
			toDisposable(() => {
				info('Closing express server...');
				server.close((err) => {
					info('Express server closed.');
					if (err) {
						warn('   %s', err.stack || err.message);
					}
				});
			})
		);
	}

	async shutdown(rejectOnError = false) {
		if (this.server) {
			info('express server is stopping...');
			await new Promise((resolve, reject) => {
				this.server!.close((e) => {
					info('express server closed', e ? '(with error).' : '.');
					if (e) {
						if (rejectOnError) {
							reject(e);
						} else {
							console.error(e.stack);
							resolve();
						}
					} else {
						resolve();
					}
				});

				const sockets = [...this.connections.values()];
				for (const socket of sockets) {
					socket.end();
				}
			});

			this.started = false;
			delete this.server;
			delete this.app;
		} else {
			info('express server did not started.');
		}
	}

	get httpServer() {
		return this.server || undefined;
	}

	@boundMethod
	protected serveHtml(req: Request, res: Response): void {
		// res.locals.http2 = req.header('http2');
		// res.locals.https = req.header('https');

		res.send(
			renderDefaultHtml({
				...this.app!.locals,
				...res.locals,
				originalUrl: req.originalUrl,
				url: req.url,
			})
		);
	}

	protected abstract configureServer(): IServerConfig;
	protected abstract configureClient(): IClientConfig;
	protected abstract init(express: Application): void;
}
