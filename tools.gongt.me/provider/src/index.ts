import 'source-map-support/register';
import { createServer, RequestListener } from 'http';
import { resolve } from 'path';
import { registerGlobalLifecycle, toDisposable } from '@idlebox/common';
import {
	createApplication,
	getApplicationRouter,
	getBuildMap,
	passThroughConfig,
	setApplicationRootUrl,
	terminate404,
} from '@km.js/server-express';
import { getApiRouter } from '@tools.gongt.me/api';
import { info, warn } from 'fancy-log';
import morgan from 'morgan';

function listen(express: RequestListener) {
	const server = createServer(express);

	const listen = process.env.LISTEN || '15080';
	info('LISTEN==%s', process.env.LISTEN);
	if (listen[0] === '/') {
		info('Try listen unix path: %s', listen);
		server.listen(listen, done);
	} else if (parseInt(listen)) {
		info('Try listen tcp port: %s', listen);
		server.listen(parseInt(listen), '0.0.0.0', done);
	} else {
		throw new Error('Invalid listen path: ' + listen);
	}

	function done() {
		info('Express server listening %s', server.address());
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
}

const express = createApplication();

express.set('views', resolve(__dirname, '../view'));
express.set('view engine', 'ejs');

express.use(morgan('dev'));

const config = {
	API_URL: '/_api',
	APP_URL: '/_application',
	// STATIC_URL: 'https://static.gongt.net/tools',
	STATIC_URL: '/static',
};

passThroughConfig(config);
express.use('/_api', getApiRouter());

setApplicationRootUrl('/application');
express.use('/application', getApplicationRouter(), terminate404());
const importMap = getBuildMap();

Object.assign(express.locals, {
	...config,
	IMPORT_MAP_JSON: JSON.stringify(importMap),
	APP_LOADER_JS: importMap.imports['loader'],
});
express.get(/./, (req, res) => {
	res.locals.originalUrl = req.originalUrl;
	res.locals.uri = req.url;
	// res.locals.http2 = req.header('http2');
	// res.locals.https = req.header('https');
	res.render('index.ejs');
});

express.use(
	terminate404(
		'炸了💥……',
		`没有这个页面。现在咋办？
<ul>
<li><a href="/">返回首页</a></li>
</ul>
`
	)
);

listen(express);
