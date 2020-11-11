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
		entryFile = importmap.config.bootstrap;
	} else {
		entryFile = importmap.config.bootstrapES5 || importmap.config.bootstrap;
	}

	if (!entryFile) {
		criticalError(new Error("Client Config `bootstrap' is required."));
	}

	programLoader(entryFile).then(function () {
		pageLoadFinish();
	}, criticalError);
}
