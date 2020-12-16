import 'source-map-support/register';
import { resolve } from 'path';
import { cdnAddWhitelist, serveChinaCDNProxy, setProxyBaseUrl } from '@km.js/cdn-china-proxy';
import {
	ExpressConfigKind,
	ExpressServer,
	IApplicationConfig,
	passThroughConfig,
	preloadHtmlFromFile,
	terminate404,
} from '@km.js/server-express';
import { getApiRouter } from '@tools.gongt.me/api';
import { SERVER_ROOT } from '../constants';
import { attachClientApplication } from './clientApp';
import { attachClientLoader } from './clientLoader';
import { debugProvideNodeModules } from './nodeModule';

export class MyServer extends ExpressServer {
	private declare APP_LOADER_JS: string;
	listenPort = 15080;

	configureApplication(): IApplicationConfig {
		return {
			[ExpressConfigKind.RootStatic]: '/_static',
		};
	}

	initialize() {
		setProxyBaseUrl('/_cdnproxyendpoint');

		passThroughConfig('API_URL', '/_api');
		this.app.use('/_api', getApiRouter());

		attachClientApplication(this.client, this.app);
		attachClientLoader(this.client);

		this.app.use('/node_modules', debugProvideNodeModules);

		preloadHtmlFromFile(resolve(SERVER_ROOT, 'view/preloader.html'));

		cdnAddWhitelist([/^https?:\/\/fonts\.gstatic\.com\//]);
		serveChinaCDNProxy(this.app, {
			proxy: 'http://proxy-server.:3271',
			contentReplacer: contentReplace,
		});

		this.app.get(/^\/_/, terminate404());
	}
}

function contentReplace(body: string) {
	return body.replace(/http:\/\/fonts.gstatic.com\/[-a-zA-Z0-9()@:%_\+.~#?&\/=]+/g, (m0) => {
		return '/_cdnproxyendpoint?upstream=' + encodeURIComponent(m0);
	});
}
