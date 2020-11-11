import { Duplex } from 'stream';
import { TaskFunction } from 'gulp';
import { ICopyModuleInput } from '@km.js/gulp-tools';

export declare const gulpActionBuildLoader: TaskFunction;
export declare const gulpActionWatchLoader: TaskFunction;
export declare const LOADER_DIST_FILE: string;
export declare const VERSION: string;
export declare function buildOnce(): Duplex;
export declare const RequiredNativeModules: ICopyModuleInput;
export declare function gulpCopyRequiredNativeModules(): Duplex;
export declare function setResultsDirectory(path: string): void;
