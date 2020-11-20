/** @internal */
export function parseArguments() {
	const ret: Record<string, string | boolean> = {};
	const subStart = process.argv.lastIndexOf('--');
	if (subStart === -1) {
		console.log(process.argv);
		throw new Error('must have -- in arguments');
	}

	for (const item of process.argv.slice(subStart + 1)) {
		const eqSign = item.indexOf('=');
		if (eqSign === -1) {
			ret[item] = true;
		} else {
			const name = item.slice(2, eqSign);
			const value = item.slice(eqSign + 1);

			ret[name] = value;
		}
	}
	return ret;
}
