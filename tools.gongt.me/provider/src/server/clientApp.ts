import { createRequire } from 'module';
import { resolve } from 'path';
import { clientNamespace, createCommonOptions, MIME_JAVASCRIPT_UTF8, ResourceType } from '@km.js/server-express';
import { ServeStaticOptions } from 'serve-static';

export function attachClientApplication() {
	const require = createRequire(__dirname);
	const applicationDistFolder = resolve(require.resolve('@tools.gongt.me/application'), '../lib/system');
	console.log('serving application: %s', applicationDistFolder);

	let serveConfig: ServeStaticOptions, version: string;
	if (process.env.NODE_ENV === 'production') {
		serveConfig = createCommonOptions(ResourceType.Application, MIME_JAVASCRIPT_UTF8, false);
		version = '.' + require('../../package.json').version;
	} else {
		serveConfig = createCommonOptions(ResourceType.Dynamic, MIME_JAVASCRIPT_UTF8, false);
		version = 'dev' + Date.now();
	}
	clientNamespace
		.serveModule('client')
		.asScopeFolder()
		.fromFilesystem(applicationDistFolder)
		.throughUrl('my-program' + version)
		.withHttpConfig(serveConfig);
}
