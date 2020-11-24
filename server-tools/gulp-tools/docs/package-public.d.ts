/// <reference types="node" />
import { DestOptions } from 'vinyl-fs';
import { Duplex } from 'stream';
import File from 'vinyl';
import { watch as gulpWatch } from 'gulp';
import { PassThrough } from 'stream';
import { SrcOptions } from 'vinyl-fs';
import { Task } from 'undertaker';
import { TaskFunction } from 'gulp';
import { TaskFunctionParams } from 'undertaker';
import _ts from 'typescript';
import { WatchOptions } from 'gulp';
import { WriteOptions } from 'gulp-sourcemaps';

export declare function buildTask({ name, title, action, base, glob, immediate, ...watchOptions }: IBuildTaskDefine): IBuildBundle;

export declare function createJsonFile(target: string, creator: ICreateFunction): Promise<void>;

export declare function createJsonFileSync(target: string, creator: ICreateFunction): void;

export declare function createMeta(source: VinylFile, metadata: any): VinylFile;

export declare function debounce<T, FN extends Function_2<T>>(debounceMs: number, cooldownMs: number, fn: FN): FN & DebounceController;

declare interface DebounceController {
    dispose(): void;
}

export declare function findTsc(location?: string): string;

declare interface Function_2<T> {
    (...args: any[]): T | Promise<T>;
}

export declare function getTypescriptAt(location: string, library?: string): string;

export declare function gulpDest(folder: string, opt?: DestOptions): NodeJS.ReadWriteStream;

export declare function gulpManualyLoadModules(opt: ICopyModuleInput): Duplex;

export declare function gulpNamedParallel(name: string, ...tasks: Task[]): TaskFunction;

export declare function gulpNamedSerise(name: string, ...tasks: Task[]): TaskFunction;

export declare function gulpParallel(...tasks: Task[]): TaskFunction;

export declare function gulpPublicTask(name: string, description: string, callback: TaskFunction): Task;

export declare function gulpRimraf(folder: string): TaskFunction;

export declare function gulpSerise(...tasks: Task[]): TaskFunction;

export declare function gulpSpawnTsc(options: ISpawnTscConfig & ISpawnTscConfigWatch): PassThrough;

export declare function gulpSrc(globs: string | string[], opt?: SrcOptions): NodeJS.ReadWriteStream;

export declare function gulpSrcFrom(parentDir: string, globs: string | string[]): NodeJS.ReadWriteStream;

export declare function gulpTask(name: string, description: string, callback: TaskFunction): TaskFunction;

export declare function gulpTask(name: string, callback: TaskFunction): TaskFunction;

export declare function gulpTransformer(action: ITransformFunction): NodeJS.ReadWriteStream;

export declare function gulpTypescriptTask(name: string, title: string, options: ISpawnTscConfig): IBuildBundleStream & ITypescriptBuildInfo;
export { gulpWatch }

export declare function handleQuit(dispose: () => void): void;

export declare interface IBuildBundle {
    build: TaskFunction;
    watch: TaskFunction;
}

export declare interface IBuildBundleStream {
    build: TscTaskFunction & TaskFunctionParams;
    watch: TscTaskFunction & TaskFunctionParams;
}

export declare interface IBuildTaskDefine {
    name: string;
    title: string;
    base: string;
    glob: string;
    action: TaskFunction;
    immediate?: boolean;
    ignorePermissionErrors?: WatchOptions['ignorePermissionErrors'];
    alwaysStat?: WatchOptions['alwaysStat'];
    depth?: WatchOptions['depth'];
    ignored?: WatchOptions['ignored'];
    followSymlinks?: WatchOptions['followSymlinks'];
    disableGlobbing?: WatchOptions['disableGlobbing'];
}

export declare interface ICopyModuleInput {
    /** where to save (relative to vfs root) */
    baseDirectory?: string;
    /** in vfs root, default "/" */
    vfsRoot?: string;
    /** node_modules in real fs */
    nodeModulesDir?: string;
    moduleList: IModuleCopy[];
}

export declare interface ICreateFunction {
    (jsonData: any): any | undefined | void;
}

export declare interface IFileSpecifier {
    source: string;
    map?: string;
    fileName?: string | INameFunction;
}

export declare interface IModuleCopy {
    packageName: string;
    importName?: string;
    files: IModuleFile | Record<string, IModuleFile>;
}

export declare type IModuleFile = string | IFileSpecifier;

export declare type INameFunction = (name: string, version: string) => string;

export declare interface ISpawnTscConfig {
    tsconfig: string;
    outDir?: string;
    library?: string;
    extraArguments?: string[];
}

export declare interface ISpawnTscConfigWatch {
    watchMode?: true;
}

export declare interface ITransformFunction {
    (this: NodeJS.WritableStream, file: VinylFile): VinylFile | null | Promise<VinylFile | null>;
}

export declare interface ITypescriptBuildInfo {
    outDir: string;
    distFiles: string;
}

export declare function logPassing(): NodeJS.ReadWriteStream;

export declare function readTsconfig(tsconfig: string, library?: string): _ts.ParsedCommandLine;

export declare function sourcemapsInit(): NodeJS.ReadWriteStream;

export declare function sourcemapsWrite(sourceRoot?: WriteOptions['sourceRoot']): NodeJS.ReadWriteStream;

export declare interface TscTaskFunction {
    (done: (error?: any) => void): Duplex;
}

export declare type VinylFile = File;

export declare const VinylFile: typeof File;

export { }
