import { createRequire } from 'module';
import { resolve } from 'path';
import { buildContext, getProjectDir } from '@build-script/builder';
import { findTsc, getTypescriptAt, readTsconfig } from '@km.js/gulp-tools';
import { CompilerOptions } from 'typescript';
import { mkdirSync, pathExistsSync } from 'fs-extra';

const tsconfig = resolve(getProjectDir(), buildContext.args[0] || './src/tsconfig.json');
const library = buildContext.args[1] || 'ttypescript';

const tsc = findTsc(getTypescriptAt(tsconfig, library));
const { options } = readTsconfig(tsconfig, library);

if (!options.outDir) {
	throw new Error('failed get outDir from tsconfig.json');
}

const rollup = createRequire(tsconfig).resolve('rollup/dist/bin/rollup');

if (!pathExistsSync(options.outDir)) {
	mkdirSync(options.outDir);
}

export const rollupBin = rollup;
export const typescriptCompilerBin = tsc;
export const sourceProjectConfigFile = tsconfig;
export const sourceProjectConfigFileWrapper = resolve(tsconfig, '../tsconfig.temp.system.json');
export const sourceProjectOptions: CompilerOptions = options;
export const typescriptLibrary = library;
export const myselfPath = resolve(__dirname, '..');
export const buildTempDir = options.outDir;
export const buildOutputLV1 = resolve(options.outDir, 'tsc-esm');
export const buildOutputFinal = resolve(options.outDir, 'production');
export const watchOutputLV1 = resolve(options.outDir, 'tsc-system');
export const watchOutputLV2 = resolve(options.outDir, 'import-index-temp');
export const watchOutputFinal = resolve(options.outDir, 'development');
