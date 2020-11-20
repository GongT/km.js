import { basename, resolve } from 'path';
import { buildContext, getProjectDir } from '@build-script/builder';
import { findTsc, getTypescriptAt, readTsconfig } from '../inc/typescript';

const tsconfig = resolve(getProjectDir(), buildContext.args[0] || './src/tsconfig.json');
const library = buildContext.args[1] || 'typescript';

const tsc = findTsc(getTypescriptAt(tsconfig, library));
const { options } = readTsconfig(tsconfig, library);

if (!options.outDir) {
	throw new Error('failed get outDir from tsconfig.json');
}

const esm = resolve(options.outDir, 'esm');
const system = resolve(options.outDir, 'system');
const importTemp = resolve(options.outDir, 'import-temp');
const importOutput = resolve(options.outDir, 'import-output');

buildContext.addAction('build', ['@make:postbuild']);

buildContext.addAction('make:postbuild', ['tools:build-tsc', 'tools:build-rollup' /*  "build-es5" */]);
(buildContext as any).setRunMode('make:postbuild', 'serial');
buildContext.addAction('watch', ['tools:watch-tsc', 'tools:watch-import-loader', 'tools:watch-rollup']);

buildContext.registerAlias('tools:watch-tsc', tsc, [
	'-p',
	tsconfig,
	'-w',
	'--outDir',
	system,
	'--module',
	'system',
	'--inlineSources',
	'--preserveWatchOutput',
	'--sourceRoot',
	'./',
]);
buildContext.registerAlias('tools:build-tsc', tsc, ['-p', tsconfig, '--outDir', esm, '--module', 'ESNext']);

buildContext.registerAlias('tools:watch-import-loader', process.argv0, [
	require.resolve('./make-fake-index.cjs'),
	'--',
	`--cwd=${options.outDir}`,
	`--output=${importTemp}`,
	`--tsconfig=${tsconfig}`,
]);

const rollup = require.resolve('rollup/dist/bin/rollup');
buildContext.registerAlias('tools:watch-rollup', rollup, [
	'--config',
	require.resolve('./rollup/rollup.config.watch.cjs'),
	'--watch',
	'--environment',
	`OUTDIR:${options.outDir},FROM:${basename(importTemp)},TO:${basename(importOutput)}`,
]);
buildContext.registerAlias('tools:build-rollup', rollup, [
	require.resolve('./rollup/rollup.config.build.cjs'),
	'--environment',
	`OUTDIR:${options.outDir},FROM:${basename(importTemp)},TO:${basename(importOutput)}`,
]);
