import { cdnLoadStyles } from '@km.js/cdn-china-proxy';
import { resolve } from 'path';
import {
	ClientGlobalRegister,
	contributePageBodyClass,
	contributePageHtml,
	createCommonOptions,
	MIME_JAVASCRIPT_UTF8,
	MIME_JSON_UTF8,
	MIME_STYLESHEET_UTF8,
	passThroughConfig,
	ResourceType,
} from '@km.js/server-express';
import { Router } from 'express';
import serveStatic from 'serve-static';

export function attachClientApplication(client: ClientGlobalRegister, router: Router) {
	const outputPath = resolve(require.resolve('@tools.gongt.me/application/package.json'), '../dist');
	console.log('serving angular application: %s', outputPath);

	client.map('client/', 'client/', outputPath, createCommonOptions(ResourceType.Application, MIME_JAVASCRIPT_UTF8));

	router.get(
		'/_static/css/styles.css',
		serveStatic(resolve(outputPath, 'styles.css')),
		serveStatic(
			resolve(outputPath, 'styles.css'),
			createCommonOptions(ResourceType.Application, MIME_STYLESHEET_UTF8, false)
		)
	);
	router.get(
		'/_static/css/styles.css.map',
		serveStatic(
			resolve(outputPath, 'styles.css.map'),
			createCommonOptions(ResourceType.Application, MIME_JSON_UTF8, false)
		)
	);
	contributePageHtml({
		headString: `<base href="/"><link rel="stylesheet" href="/_styles/styles.css">`,
		bodyString: '<app-root></app-root>',
	});
	contributePageBodyClass('mat-typography');
	contributePageHtml({
		headString: cdnLoadStyles([
			'https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap',
			'https://fonts.googleapis.com/icon?family=Material+Icons',
		]),
	});

	passThroughConfig('bootstrap', [
		['client/runtime.js', 'client/polyfills.js', 'client/vendor.js', 'client/main.js'],
	]);
}

/* 
export function attachClientApplication(client: ClientGlobalRegister) {
	console.log('serving application: %s', outputPath);

	if (compiledPath) {
		console.log('serving application in development mode: %s', compiledPath);
		const dynamicOpt = createCommonOptions(ResourceType.DebugResource, MIME_JAVASCRIPT_UTF8);

		client.serve('client', compiledPath, dynamicOpt);
		client.serve('client', sourcePath, dynamicOpt);
	}

	client.map('client/', 'client/', outputPath, createCommonOptions(ResourceType.Assets, MIME_JAVASCRIPT_UTF8));

	passThroughConfig('CLIENT_SCOPE', 'client');
	const clientDeps = client.createScope('client');
	const fileMap: IImportMapProto = readJsonSync(fileMapPath);
	for (const [specifier, { fileName }] of Object.entries(fileMap.imports)) {
		clientDeps.mapOnly(specifier, fileName);
	}

	for (const [fileName, depsArr] of Object.entries(fileMap.depcache)) {
		mapDependencyCache(fileName, depsArr);
	}
}
*/
