let preInit = 0;

interface IDone {
	(): void;
}

function load_shim(test: boolean, library: string, callback?: IDone) {
	if (!test) {
		log('use native: not load %s', library);
		return;
	}
	preInit++;
	log('import %s', library);

	if (!importmap.imports[library]) {
		return criticalError('Module not exists: ' + library);
	}

	createScript(importmap.imports[library], function () {
		preInit--;
		log('import %s OK!', library);
		if (callback) callback();
		allScriptLoadDone();
	});
}

var protectDup = false;
function allScriptLoadDone() {
	// log('[BS] allScriptLoadDone() => ', preInit);
	if (preInit !== 0) return;
	if (protectDup) {
		throw new Error('run done twice!!!');
	}
	protectDup = true;
	startProgram();
}

var newSyntax = false;
try {
	eval('try { var a=1 } catch {}');
	newSyntax = true;
} catch (e) {
	newSyntax = false;
}

function usingOldEdge() {
	var edge = window.navigator.userAgent.indexOf('Edge') > -1;
	log('Using (old) MS Edge: %s', edge);
	return edge;
}

load_shim(typeof fetch === 'undefined' || usingOldEdge(), 'whatwg-fetch', function assignFetch() {
	const WHATWGFetch = (window as any).WHATWGFetch;
	window.fetch = WHATWGFetch.fetch;
	window.Request = WHATWGFetch.Request;
	window.Response = WHATWGFetch.Response;
	window.Headers = WHATWGFetch.Headers;
	log('fetch is WHATWGFetch');
});
load_shim(!newSyntax, 'regenerator-runtime');
