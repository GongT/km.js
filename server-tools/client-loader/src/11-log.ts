function wrapLog(tag: string, original: keyof Console): (...data: any[]) => void {
	if (console && console[original]) {
		const logFn = console[original];
		tag = '[' + tag + '] ';
		return function () {
			var args = Array.prototype.slice.call(arguments);
			if (typeof args[0] === 'string') {
				args[0] = tag + args[0];
			} else {
				args.unshift(tag);
			}
			logFn.apply(console, args);
		};
	} else {
		return function () {};
	}
}

const log = wrapLog('BOOTSTRAP', 'log');
const error = wrapLog('BOOTSTRAP', 'error');
const _rawLog = (console && console.log) || ((..._args: any[]) => {});
