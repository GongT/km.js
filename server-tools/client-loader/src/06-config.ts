const { importmap, importMapScriptTag } = (() => {
	const scripts = document.getElementsByTagName('SCRIPT');
	for (let index = 0; index < scripts.length; index++) {
		const tag = scripts.item(index) as HTMLScriptElement;
		if (tag.type === 'importmap') {
			return {
				importmap: (void 0 || eval)(('Object.assign(' + tag.innerText ?? '{}') + ');'),
				importMapScriptTag: tag,
			};
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

function passThroughConfig(name: string): any {
	return importmap.config[name];
}

if (Object.hasOwnProperty('defineProperty')) {
	Object.defineProperty(window, 'passThroughConfig', {
		value: passThroughConfig,
		configurable: false,
		writable: false,
		enumerable: true,
	});
} else {
	(window as any).passThroughConfig = passThroughConfig;
}
