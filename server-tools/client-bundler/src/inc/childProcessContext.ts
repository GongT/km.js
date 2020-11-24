function parseArguments() {
	const ret: Record<string, string | boolean> = {};
	const args = process.argv.slice(2);
	let item: string | undefined;
	while ((item = args.shift())) {
		if (!item.startsWith('--')) {
			throw new Error(`Invalid argument: ${item}`);
		}
		const eqSign = item.indexOf('=');
		const name = item.slice(2, eqSign);
		if (eqSign === -1) {
			const next = args[0];
			if (next && !next.startsWith('--')) {
				ret[name] = next;
				args.shift();
			} else {
				ret[name] = true;
			}
		} else {
			const value = item.slice(eqSign + 1);
			ret[name] = value;
		}
	}
	return ret;
}

let options: any;
function parseArguments1(): Record<string, string> {
	if (!options) options = parseArguments();
	return options;
}

/** @internal */
export function requireArgument(name: string): string {
	const options = parseArguments1();
	if (typeof options[name] === 'string' && options[name]) {
		return options[name];
	} else {
		throw new Error(`missing argument: --${name}`);
	}
}

/** @internal */
export function optionalArgument(name: string): string | undefined {
	const options = parseArguments1();
	if (typeof options[name] === 'string' && options[name]) {
		return options[name];
	} else {
		throw new Error(`missing argument: --${name}`);
	}
}
