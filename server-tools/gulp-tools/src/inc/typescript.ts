import { findUpUntilSync } from '@idlebox/node';
import { pathExistsSync } from 'fs-extra';
import { createRequire } from 'module';
import { resolve } from 'path';
import _ts from 'typescript';

export function getTypescriptAt(location: string, library = 'typescript') {
	location = resolve(process.cwd(), location);

	const require = createRequire(location);
	return require.resolve(library);
}

export function readTsconfig(tsconfig: string, library = 'typescript') {
	tsconfig = resolve(process.cwd(), tsconfig);
	if (!pathExistsSync(tsconfig)) {
		throw new Error('Missing tsconfig file: ' + tsconfig);
	}

	const require = createRequire(import.meta.url);
	const ts = require(getTypescriptAt(tsconfig, library));
	const config = _parse(ts, tsconfig);

	if (config.errors.length) {
		throw config.errors[0].messageText;
	}

	return config;
}

function _parse(ts: typeof _ts, tsconfig: string): _ts.ParsedCommandLine {
	const config = ts.getParsedCommandLineOfConfigFile(
		tsconfig,
		{},
		{
			...ts.sys,
			onUnRecoverableConfigFileDiagnostic(diagnostic: _ts.Diagnostic) {
				throw ts.formatDiagnostic(diagnostic, {
					...ts.sys,
					getCanonicalFileName(f) {
						return f;
					},
					getNewLine(): string {
						return '\n';
					},
				});
			},
		}
	);
	if (!config) {
		throw new Error('failed parse: ' + tsconfig);
	}
	return config;
}

export function findTsc(location?: string): string {
	let packagePath;
	if (location) {
		if (location.endsWith('/package.json')) {
			packagePath = location;
		} else if (location.endsWith('/typescript.js')) {
			packagePath = findUpUntilSync(location, 'package.json');
		} else if (pathExistsSync(resolve(location, 'package.json'))) {
			packagePath = resolve(location, 'package.json');
		}
		if (!packagePath) {
			throw new Error(`typescript do not exists (at ${location})`);
		}
	} else {
		const require = createRequire(resolve(process.cwd(), 'package.json'));
		try {
			packagePath = require.resolve('typescript/package.json');
		} catch {
			throw new Error(`can not found typescript, may manually set by {library}.`);
		}
	}
	let tsc = resolve(packagePath, '..', './bin/tsc');
	if (pathExistsSync(tsc)) {
		return tsc;
	}

	throw new Error('binary tsc not exists: ' + tsc);
}
