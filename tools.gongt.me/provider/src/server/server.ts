import 'source-map-support/register';
import { resolve } from 'path';
import { ExpressServer, getBuildMap } from '@km.js/server-express';
import { getApiRouter } from '@tools.gongt.me/api';
import { Application } from 'express';
import { attachClientApplication } from './clientApp';
import { attachClientLoader } from './clientLoader';
import { readFileSync } from 'fs-extra';

export class MyServer extends ExpressServer {
	private declare APP_LOADER_JS: string;

	protected configureServer() {
		return {
			listenPort: 15080,
			preloadHtml: readFileSync(resolve(__dirname, '../../view/preloader.html'), 'utf8'),
		};
	}

	protected configureClient() {
		return {
			API_URL: '/_api',
			// STATIC_URL: 'https://static.gongt.net/tools',
			STATIC_URL: '/_static',
			entryFile: this.APP_LOADER_JS,
			bootstrap: 'client/entry.js',
		};
	}

	protected init(express: Application) {
		express.use('/_api', getApiRouter());

		attachClientLoader();
		attachClientApplication();
		const importMap = getBuildMap();

		this.APP_LOADER_JS = importMap.imports['loader'];
	}
}
