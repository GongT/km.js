import { resolve } from 'path';
import { distPath, filemap } from '@km.js/client-loader';
import { clientNamespace, createCommonOptions, MIME_JAVASCRIPT_UTF8, ResourceType } from '@km.js/server-express';

export function attachClientLoader() {
	for (const [importSpecifier, fileName] of Object.entries(filemap)) {
		const url = `loader/${fileName}`;

		const sourceAbs = resolve(distPath, fileName);
		clientNamespace
			.serveModule(importSpecifier)
			.fromFilesystem(sourceAbs)
			.throughUrl(url)
			.withHttpConfig(createCommonOptions(ResourceType.Application, MIME_JAVASCRIPT_UTF8, false));
	}
}
