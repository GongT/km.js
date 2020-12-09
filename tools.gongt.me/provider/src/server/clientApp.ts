import { ClientGlobalRegister, createCommonOptions, MIME_JAVASCRIPT_UTF8, ResourceType } from '@km.js/server-express';
import { compiledPath, fileMap, outputPath, packageDistPath, sourcePath } from '@tools.gongt.me/application';
import { resolve } from 'path';

export function attachClientApplication(client: ClientGlobalRegister) {
	console.log('serving application: %s', outputPath);

	client.map('client/', 'client/', outputPath, createCommonOptions(ResourceType.Assets, MIME_JAVASCRIPT_UTF8));

	if (compiledPath) {
		console.log('serving application in development mode: %s', compiledPath);
		const dynamicOpt = createCommonOptions(ResourceType.Dynamic, MIME_JAVASCRIPT_UTF8);

		client.serve('client', compiledPath, dynamicOpt);
		client.serve('client', sourcePath, dynamicOpt);
	}

	const clientDeps = client.createScope('client');
	const thirdOpt = createCommonOptions(ResourceType.ThirdParty, MIME_JAVASCRIPT_UTF8);
	for (const [specifier, { fileName }] of Object.entries(fileMap)) {
		clientDeps.map(specifier, fileName, resolve(packageDistPath, fileName), thirdOpt);
	}
}
