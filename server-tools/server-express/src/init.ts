import { debug, info } from 'console';
import { createServer, Server } from 'http';
import { Socket } from 'net';
import { registerGlobalLifecycle, toDisposable } from '@idlebox/common';
import { boundMethod } from 'autobind-decorator';
import { Application, Request, Response } from 'express';
import morgan from 'morgan';
import { ExpressConfigKind } from './data/defaultPath';
import { onServerStartListen } from './loader/childprocess';
import { createApplication } from './route/app';
import { ClientGlobalRegister } from './route/application/importmap.fs';
import { contributePageHtml, renderHtml } from './route/html/main';

export type IApplicationConfig = {
	[k in ExpressConfigKind]?: any;
};

// export interface IServerConfig {
// 	listenPort?: string | number;
// 	applicationRootUrl?: string;
// }
// export interface IClientConfig extends Record<string, any> {
// 	entryFile?: string;
// 	STATIC_URL?: string;
// }

export abstract class ExpressServer {
	protected readonly server: Server;
	protected readonly app: Application;
	protected declare client: ClientGlobalRegister;
	public readonly isDev: boolean;
	private started = false;
	private stopped = false;
	private connections = new Set<Socket>();
	public readonly listenPort: number = 1551;

	constructor() {
		this.isDev = process.env.NODE_ENV !== 'production';
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

	protected set(name: ExpressConfigKind, value: any) {
		this.app.set(name, value);
		this.app.locals[name] = value;
	}

	async startServe() {
		if (this.started) {
			throw new Error('duplicate call to startServe');
		}
		this.started = true;

		const app = this.app;

		if (this.configureApplication) {
			const config = await this.configureApplication();
			for (const [k, v] of Object.entries(config)) {
				this.set(k as any, v);
			}
		}

		this.client = new ClientGlobalRegister(this.app);

		await this.initialize();

		const importMap = this.client.finalize();
		const imString = JSON.stringify(importMap, null, this.isDev ? 4 : undefined);
		contributePageHtml({
			headString: `<script type="systemjs-importmap" id="AppConfig">${imString}</script>`,
		});

		app.get(/./, this.serveHtml);

		await new Promise<void>((resolve, reject) => {
			this.listen(this.listenPort, resolve, reject);
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
				return this.shutdown(false);
			})
		);
	}

	async shutdown(rejectOnError = false) {
		if (!this.started) {
			info('express server did not started.');
			return;
		}
		if (this.stopped) {
			info('express server already stopped.');
			return;
		}
		this.stopped = true;

		info('express server is stopping...');
		await new Promise<void>((resolve, reject) => {
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
	}

	get httpServer() {
		return this.server || undefined;
	}

	@boundMethod
	protected serveHtml(req: Request, res: Response): void {
		res.send(
			renderHtml(req, this.app.locals, {
				originalUrl: req.originalUrl,
				url: req.url,
			})
		);
	}

	protected abstract configureApplication?(): IApplicationConfig | Promise<IApplicationConfig>;
	protected abstract initialize(): void | Promise<void>;
}
