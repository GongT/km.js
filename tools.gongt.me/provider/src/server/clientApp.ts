import { ClientGlobalRegister, createCommonOptions, MIME_JAVASCRIPT_UTF8, ResourceType } from '@km.js/server-express';
import { compiledPath, fileMapPath, IFileMap, outputPath, sourcePath } from '@tools.gongt.me/application';
import { readJsonSync } from 'fs-extra';

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
	const fileMap: IFileMap = readJsonSync(fileMapPath);
	for (const [specifier, { fileName }] of Object.entries(fileMap)) {
		clientDeps.mapOnly(specifier, fileName);
	}
}
