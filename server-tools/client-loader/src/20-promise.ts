load_shim(typeof Promise === 'undefined' || !promiseHasFinally(), 'es6-promise', function assignPromise() {
	const ES6Promise = (window as any).ES6Promise;
	window.Promise = ES6Promise;
	log('Promise is ES6Promise');
});

function promiseHasFinally() {
	var has = false;
	try {
		has = !!Promise.resolve().finally;
	} catch (e) {}
	if (has) {
		log('promise has finally');
	} else {
		log('promise has NO finally');
	}
	return has;
}
