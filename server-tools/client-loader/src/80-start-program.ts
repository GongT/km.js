interface Importer {
	(file: string): Promise<any>;
}

interface Window {
	dynamicImport: Importer;
}

let scriptLoaderLoaded: Function;

// const browserSupportESM = 'noModule' in HTMLScriptElement.prototype;

// if (browserSupportESM) {
// 	importMapScriptTag.type = 'importmap-shim';
// 	scriptLoaderLoaded = loadWithImport;
// 	load_shim(true, 'es-module-shims');
// } else {
importMapScriptTag.type = 'systemjs-importmap';
scriptLoaderLoaded = loadWithSystem;
load_shim(true, 'systemjs');
// }

function startProgram() {
	var entryFile;

	log('start program.');

	window.dynamicImport = scriptLoaderLoaded();

	if (newSyntax) {
		entryFile = importmap.config.bootstrap;
	} else {
		entryFile = importmap.config.bootstrapES5 || importmap.config.bootstrap;
	}

	if (!entryFile) {
		criticalError(new Error("Client Config `bootstrap' is required."));
	}

	entryFile = Array.isArray(entryFile) ? entryFile : [entryFile];

	_bootstrap_async(entryFile).catch(criticalError);
	bootstrapComplete();
}

function _bootstrap_async(entry: (string | string[])[]) {
	const f = entry.shift();
	let p: Promise<any>;
	if (Array.isArray(f)) {
		p = Promise.all(f.map((f) => window.dynamicImport(f)));
	} else {
		p = window.dynamicImport(f);
	}
	return p.then((exports) => {
		if (entry.length) {
			return _bootstrap_async(entry);
		} else {
			pageLoadFinish();
			return exports;
		}
	});
}
