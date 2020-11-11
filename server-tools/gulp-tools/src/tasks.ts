import { info } from 'fancy-log';
import { mkdirpSync } from 'fs-extra';
import { dest, parallel, series, src, task, TaskFunction, watch, WatchOptions } from 'gulp';
import { resolve } from 'path';
import { Task } from 'undertaker';
import File from 'vinyl';
import { DestOptions, SrcOptions } from 'vinyl-fs';
import { handleQuit } from './inc/lifecycle';

export type VinylFile = File;
export const VinylFile: typeof File = File;

export { watch as gulpWatch } from 'gulp';

export function gulpPublicTask(name: string, description: string, callback: TaskFunction): Task {
	task(name, gulpTask(name, description, callback));
	return name;
}

export function gulpTask(name: string, description: string, callback: TaskFunction): TaskFunction;
export function gulpTask(name: string, callback: TaskFunction): TaskFunction;

export function gulpTask(name: string, description: TaskFunction | string, callback?: TaskFunction): TaskFunction {
	if (typeof description === 'string') {
		return Object.assign(callback, { displayName: name, description });
	} else {
		return Object.assign(description, { displayName: name });
	}
}

export function gulpNamedSerise(name: string, ...tasks: Task[]): TaskFunction {
	return gulpTask(name, series(...tasks));
}

export function gulpNamedParallel(name: string, ...tasks: Task[]): TaskFunction {
	return gulpTask(name, parallel(...tasks));
}

export function gulpSerise(...tasks: Task[]): TaskFunction {
	return series(...tasks);
}

export function gulpParallel(...tasks: Task[]): TaskFunction {
	return parallel(...tasks);
}

export function gulpSrc(globs: string | string[], opt: SrcOptions = {}): NodeJS.ReadWriteStream {
	if (!('nodir' in opt)) {
		opt.nodir = true;
	}
	return src(globs, opt);
}

export function gulpSrcFrom(parentDir: string, globs: string | string[]): NodeJS.ReadWriteStream {
	return src(globs, {
		nodir: true,
		cwd: parentDir,
		base: parentDir,
	});
}

export function gulpDest(folder: string, opt?: DestOptions): NodeJS.ReadWriteStream {
	return dest(folder, opt);
}

export interface IBuildBundle {
	build: TaskFunction;
	watch: TaskFunction;
}

export function buildTask(
	name: string,
	title: string,
	base: string,
	glob: string,
	immediate: boolean,
	buildAction: TaskFunction
): IBuildBundle {
	const taskBuild = gulpTask('build:' + name, `[BUILD] ${title}`, buildAction);
	const taskWatch = gulpTask('watch:' + name, `[WATCH] ${title}`, () => {
		mkdirpSync(base);
		const watchStream = watch(
			resolve(base, glob),
			({ delay: 1000, queue: true, ignoreInitial: !immediate } as unknown) as WatchOptions,
			buildAction
		);

		handleQuit(() => {
			info('监视%s已停止', title);
			watchStream.close();
		});

		return watchStream;
	});

	return { build: taskBuild, watch: taskWatch };
}
