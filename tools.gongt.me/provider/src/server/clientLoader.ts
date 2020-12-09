import { join, resolve } from 'path';
import { distPath, entryFileName, filemap } from '@km.js/client-loader';
import {
	ClientGlobalRegister,
	contributeScriptTag,
	createCommonOptions,
	DEFAULT_APPLICATION_ROOT,
	MIME_JAVASCRIPT_UTF8,
	MIME_JSON_UTF8,
	registerGlobalMapping,
	ResourceType,
} from '@km.js/server-express';

export function attachClientLoader(client: ClientGlobalRegister) {
	client.serve('', distPath, createCommonOptions(ResourceType.ThirdParty, MIME_JAVASCRIPT_UTF8));

	for (const [importSpecifier, fileName] of Object.entries(filemap)) {
		registerGlobalMapping(importSpecifier, fileName);
	}

	const id = 'loader/' + entryFileName;
	client.serve(
		id,
		resolve(distPath, entryFileName),
		createCommonOptions(ResourceType.Application, MIME_JAVASCRIPT_UTF8)
	);
	client.serve(
		id + '.map',
		resolve(distPath, entryFileName) + '.map',
		createCommonOptions(ResourceType.Dynamic, MIME_JSON_UTF8)
	);

	contributeScriptTag(join(DEFAULT_APPLICATION_ROOT, id));
}
