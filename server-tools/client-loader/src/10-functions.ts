// @ts-ignore
function criticalError(e: any): never {
	console.groupEnd();
	console.groupEnd();
	console.groupEnd();
	error(e);
	var h1 = document.createElement('H1');
	h1.innerText = 'Error: ' + e.message;
	h1.style.color = 'red';
	const ele = document.getElementById('applicationRoot');
	if (ele) {
		ele.appendChild(h1);
	} else {
		document.body.append(h1);
	}
	if (!(console && console.error)) {
		throw e;
	}
}

function createScript(url: string, done: (ev: Event) => any) {
	const script = document.createElement('SCRIPT') as HTMLScriptElement;
	document.head.appendChild(script);
	script.type = 'text/javascript';
	script.crossOrigin = '*';
	script.onerror = criticalError;
	if (done) script.onload = done;
	script.src = url;
}
