import 'source-map-support/register';

import { ExpressConfigKind, ExpressServer, IApplicationConfig, passThroughConfig } from '@km.js/server-express';
import { getApiRouter } from '@tools.gongt.me/api';
import { attachClientApplication } from './clientApp';
import { attachClientLoader } from './clientLoader';

export class MyServer extends ExpressServer {
	private declare APP_LOADER_JS: string;
	listenPort = 15080;

	configureApplication(): IApplicationConfig {
		return {
			[ExpressConfigKind.RootStatic]: '/_static',
		};
	}

	initialize() {
		passThroughConfig('API_URL', '/_api');
		this.app.use('/_api', getApiRouter());

		attachClientLoader(this.client);
		attachClientApplication(this.client);

		passThroughConfig('bootstrap', 'client/entry.js');
	}
}
