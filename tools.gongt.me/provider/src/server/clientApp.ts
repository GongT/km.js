import { resolve } from 'path';
import { clientNamespace, createCommonOptions, MIME_JAVASCRIPT_UTF8, ResourceType } from '@km.js/server-express';
import { compiledPath, outputPath, sourcePath } from '@tools.gongt.me/application';

export function attachClientApplication() {
	console.log('serving application: %s', outputPath);

	const version = '.' + require(resolve(__dirname, '../../package.json')).version;

	const clientScope = clientNamespace
		.serveModule('client')
		.asScopeFolder()
		.withHttpConfig(createCommonOptions(ResourceType.Application, MIME_JAVASCRIPT_UTF8, false))
		.throughUrl('my-program' + version)
		.fromFilesystem(outputPath);

	if (compiledPath) {
		console.log('    and: %s', compiledPath);
		const dynamicOpt = createCommonOptions(ResourceType.Dynamic, MIME_JAVASCRIPT_UTF8, false);
		clientScope.fromFilesystem(compiledPath, dynamicOpt);
		clientScope.fromFilesystem(sourcePath, dynamicOpt);
	}
}
