const importmap = (() => {
	const scripts = document.getElementsByTagName('SCRIPT');
	for (let index = 0; index < scripts.length; index++) {
		const tag = scripts.item(index) as HTMLScriptElement;
		if (tag.type === 'systemjs-importmap' || tag.type === 'importmap') {
			return (void 0 || eval)(('Object.assign(' + tag.innerText ?? '{}') + ');');
		}
	}
	console.log('No import map on page. application can not load.');
	alert('[500] Internal Server Error');
})();

if (console && console.table) {
	console.table(importmap.imports);
	console.table(importmap.config);
} else {
	console.log('imports =', importmap.imports);
	console.log('config =', importmap.config);
}

if (Object.hasOwnProperty('freeze')) {
	Object.freeze(importmap.imports);
	Object.freeze(importmap.config);
	Object.freeze(importmap);
}

if (Object.hasOwnProperty('defineProperty')) {
	Object.defineProperty(window, '_importmap', {
		value: importmap,
		configurable: false,
		writable: false,
		enumerable: true,
	});
} else {
	(window as any)._importmap = importmap;
}
