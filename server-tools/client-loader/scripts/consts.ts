import { readFileSync } from 'fs-extra';
import { resolve } from 'path';

export const libRoot = resolve(__dirname, '../lib');

// 版本号主要用来给loader.js加后缀
const version = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8')).version;
export const VERSION = version;

export const LOADER_DIST_DIR = resolve(libRoot, 'dist');
export const LOADER_ENTRY_NAME = 'loader.' + version + '.js';
export const LOADER_DIST_FILE = resolve(LOADER_DIST_DIR, LOADER_ENTRY_NAME);
