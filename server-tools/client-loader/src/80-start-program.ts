interface ProgramLoader {
	(entryFile: string): Promise<any>;
}

let programLoader: ProgramLoader;
// const browserSupportESM = 'noModule' in HTMLScriptElement.prototype;

programLoader = loadWithSystem;
load_shim(true, 'systemjs');

function startProgram() {
	var entryFile;
	if (newSyntax) {
		entryFile = 'bootstrap';
	} else {
		entryFile = 'bootstrap.es5';
	}
	programLoader(entryFile).then(function () {
		pageLoadFinish();
	}, criticalError);
}
