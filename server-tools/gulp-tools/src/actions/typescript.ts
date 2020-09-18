import * as _ts from 'typescript';
import { createRequire } from 'module';
import { basename, dirname, resolve } from 'path';
import { Duplex, PassThrough } from 'stream';
import { findUpUntilSync, ICommand, spawnWithoutOutput } from '@idlebox/node';
import { info } from 'fancy-log';
import { pathExistsSync, readJsonSync } from 'fs-extra';
import { TaskFunctionParams } from 'undertaker';
import { gulpSrcFrom, gulpTask } from '../tasks';

export interface ISpawnTscConfigWatch {
	watchMode?: true;
}
export interface ITypescriptBuildInfo {
	outDir: string;
	distFiles: string;
}
interface IToRun extends ITypescriptBuildInfo {
	exec: string[];
	cwd: string;
}

export interface ISpawnTscConfig {
	tsconfig: string;
	outDir?: string;
	// typescript library absolute path
	library?: string;
	extraArguments?: string[];
}

function findTsc(location?: string) {
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
	let tsc = readJsonSync(packagePath).bin.tsc;
	if (tsc) {
		tsc = resolve(packagePath, '..', tsc);
	} else {
		throw new Error('typescript.bin.tsc not exists: ' + packagePath);
	}
	return { tsc, packagePath };
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
function parseOptions(options: ISpawnTscConfig): IToRun {
	const { tsc, packagePath } = findTsc(options.library);
	const tsconfig = options.tsconfig;
	const args = options.extraArguments || [];
	let outDir = options.outDir;

	let distFiles = '**/*.js';
	args.push('--noEmit', 'false');
	if (!outDir) {
		const require = createRequire(import.meta.url);
		const ts = require(dirname(packagePath));
		const config = _parse(ts, tsconfig);
		if (config.errors.length) {
			throw config.errors[0].messageText;
		}

		if (config.options.outFile) {
			outDir = dirname(config.options.outFile);
			distFiles = basename(config.options.outFile);
		} else if (config.options.outDir) {
			outDir = config.options.outDir;
		}
		if (!outDir) {
			console.error(config);
			throw new Error(`failed detect outDir from tsconfig [${tsconfig}], you may set one by {outDir}`);
		}
	}
	args.push('--outDir', outDir);

	return {
		exec: [tsc, '-p', tsconfig, ...args],
		cwd: dirname(tsconfig),
		outDir,
		distFiles,
	};
}

function execStream(run: IToRun) {
	const result = new PassThrough({ objectMode: true });
	spawnLog(run).then(
		() => {
			gulpSrcFrom(run.outDir, run.distFiles).pipe(result, { end: true });
		},
		(e) => {
			result.destroy(e);
		}
	);
	return result;
}

export function gulpSpawnTsc(options: ISpawnTscConfig & ISpawnTscConfigWatch) {
	const run = parseOptions(options);

	if (options.watchMode) {
		run.exec.push('-w');
	}

	return execStream(run);
}

export interface TscTaskFunction {
	(done: (error?: any) => void): Duplex;
}
export interface IBuildBundleStream {
	build: TscTaskFunction & TaskFunctionParams;
	watch: TscTaskFunction & TaskFunctionParams;
}
export function gulpTypescriptTask(
	name: string,
	title: string,
	options: ISpawnTscConfig
): IBuildBundleStream & ITypescriptBuildInfo {
	const run = parseOptions(options);
	const runWat: IToRun = JSON.parse(JSON.stringify(run));
	runWat.exec.push('-w');

	return {
		build: gulpTask('build:' + name, '[BUILD] ' + title, () => {
			return spawnLog(run);
		}),
		watch: gulpTask('watch:' + name, '[WATCH] ' + title, () => {
			return spawnLog(run);
		}),
		outDir: runWat.outDir,
		distFiles: runWat.distFiles,
	};
}

function spawnLog(run: ICommand) {
	info('start %s', run.exec.join(' '));
	info('  > %s', run.cwd);
	return spawnWithoutOutput(run);
}
