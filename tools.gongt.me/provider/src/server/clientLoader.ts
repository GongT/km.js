import { resolve } from 'path';
import { createCommonOptions, clientNamespace, MIME_JAVASCRIPT_UTF8, ResourceType } from '@km.js/server-express';
import { readJsonSync } from 'fs-extra';
import { sync as globSync } from 'glob';

export function attachClientLoader() {
	const config = createCommonOptions(ResourceType.ThirdParty, MIME_JAVASCRIPT_UTF8, false);
	const loaderPath = resolve(__dirname, '../loader');

	const files = globSync('**/*.meta.json', {
		cwd: loaderPath,
		absolute: true,
	});

	for (const metaFile of files) {
		// console.log('loading %s', metaFile);

		const { name } = readJsonSync(metaFile);
		const file = metaFile.replace(/\.meta\.json$/, '');

		clientNamespace.serveModule(name).fromFilesystem(file).throughUrl('loader').withHttpConfig(config);
	}
}
