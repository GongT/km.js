declare function importShim(id: string): Promise<any>;
declare namespace importShim {
	function fetch(id: string): Promise<any>;
	function load(): void;
}

function loadWithImport(entryFile: string) {
	log('load %s with import', entryFile);
	importShim.fetch = importShimFetch;
	return importShim(entryFile);
}

function importShimFetch(url: string) {
	console.log('[ESModuleShim]', url);
	return fetch(modifyUrl(url)).then(function (response) {
		if (response.url.endsWith('.ts')) {
			return response.text().then(handleImport);
		}
		return response;
	});
}
function modifyUrl(url: string) {
	return url;
}
function handleImport(source: string) {
	return new Response(new Blob([source], { type: 'application/javascript' }));
}
