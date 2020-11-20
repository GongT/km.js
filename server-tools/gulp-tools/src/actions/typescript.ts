import { basename, dirname } from 'path';
import { Duplex, PassThrough } from 'stream';
import { ICommand, spawnWithoutOutput } from '@idlebox/node';
import { error, info } from 'fancy-log';
import { TaskFunctionParams } from 'undertaker';
import { handleQuit } from '../inc/lifecycle';
import { findTsc, getTypescriptAt, readTsconfig } from '../inc/typescript';
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

function parseOptions(options: ISpawnTscConfig): IToRun {
	const tsconfig = options.tsconfig;
	const tsc = findTsc(getTypescriptAt(tsconfig, options.library));
	const args = options.extraArguments || [];
	let outDir = options.outDir;

	let distFiles = '**/*.js';
	args.push('--noEmit', 'false');
	if (!outDir) {
		const config = readTsconfig(tsconfig, options.library);

		if (config.options.outFile) {
			outDir = dirname(config.options.outFile);
			distFiles = basename(config.options.outFile);
		} else if (config.options.outDir) {
			outDir = config.options.outDir;
		}
		if (!outDir) {
			console.error('tsconfig.json:', config);
			throw new Error(`failed detect outDir from tsconfig [${tsconfig}], you may set one by {outDir}`);
		}
	}
	args.push('--outDir', outDir);

	if (args.includes('-w') || args.includes('--watch')) {
		const pos1 = args.indexOf('-w');
		if (pos1 !== -1) {
			args.splice(pos1, 1);
			console.warn('\x1B[38;5;11mWarn: no effect -w option.\x1B[0m');
		}
		const pos2 = args.indexOf('--watch');
		if (pos2 !== -1) {
			args.splice(pos2, 1);
			console.warn('\x1B[38;5;11mWarn: no effect --watch option.\x1B[0m');
		}
	}

	return {
		exec: [tsc, '-p', options.tsconfig, ...args],
		cwd: dirname(options.tsconfig),
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
	const runWatch: IToRun = JSON.parse(JSON.stringify(run));
	runWatch.exec.push('-w', '--preserveWatchOutput');

	return {
		build: gulpTask('build:' + name + ':tsc', '[BUILD] ' + title, () => {
			return spawnLog(run);
		}),
		watch: gulpTask('watch:' + name + ':tsc', '[WATCH] ' + title, () => {
			let isquit = false;
			handleQuit(() => {
				isquit = true;
			});
			return spawnLog(runWatch).catch((e) => {
				if (isquit) {
					return;
				}
				error('[typescript] %s', e.message);
			});
		}),
		outDir: run.outDir,
		distFiles: run.distFiles,
	};
}

function spawnLog(run: ICommand) {
	info('start %s', run.exec.join(' '));
	info('  > %s', run.cwd);
	return spawnWithoutOutput(run);
}
