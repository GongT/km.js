declare const System: any;

function appendJsExtension(element: string) {
	// FIXME: double extension
	if (element.startsWith('./') || element.startsWith('../')) {
		if (!element.endsWith('.js')) {
			return element + '.js';
		}
	}
	return element;
}

let systemjsModified = false;
function loadWithSystem(): Importer {
	if (!systemjsModified) {
		systemjsModified = true;
		const originalRegister = System.register;
		function wrapRegister(deps: string[], ...args: any[]) {
			return originalRegister.call(this, deps.map(appendJsExtension), ...args);
		}
		System.register = wrapRegister;
	}

	return (file: string) => {
		log('load /%s with systemjs', file);
		return System.import(file);
	};
}
