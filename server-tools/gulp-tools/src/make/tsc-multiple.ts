import { dirname, resolve } from 'path';
import { buildContext, getProjectDir } from '@build-script/builder';
import { findTsc, getTypescriptAt, readTsconfig } from '../inc/typescript';
import { relativePath } from '@idlebox/node';

const tsconfig = resolve(getProjectDir(), buildContext.args[0] || './src/tsconfig.json');
const library = buildContext.args[1] || 'typescript';

const tsc = findTsc(getTypescriptAt(tsconfig, library));
const { options } = readTsconfig(tsconfig, library);

if (!options.outDir) {
	throw new Error('failed get outDir from tsconfig.json');
}

const esm = resolve(options.outDir, 'esm');
const system = resolve(options.outDir, 'system');

buildContext.addAction('build', ['@make:postbuild']);

buildContext.addAction('make:postbuild', ['build-tsc', 'build-rollup' /*  "build-es5" */]);
(buildContext as any).setRunMode('make:postbuild', 'serial');
buildContext.addAction('watch', ['watch-tsc', 'watch-import-loader', 'watch-rollup']);

buildContext.registerAlias('watch-tsc', tsc, [
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
buildContext.registerAlias('build-tsc', tsc, ['-p', tsconfig, '--outDir', esm, '--module', 'ESNext']);

// const rollup = require.resolve('rollup/dist/bin/rollup');
const rollupConfig = require.resolve('./rollup/rollup.config.cjs');

const root = getProjectDir();
const source = options.rootDir || dirname(tsconfig);
const rollupEnvironment = [
	'--',
	`--source=${relativePath(root, source)}`,
	`--out=${relativePath(root, options.outDir)}`,
	`--project=${root}`,
];

buildContext.registerAlias('watch-rollup', process.argv0, [
	rollupConfig,
	/*'--watch',
	'--no-watch.clearScreen',
	'--watch.buildDelay',
	'2',*/
	...rollupEnvironment,
	`--kind=system`,
]);
buildContext.registerAlias('build-rollup', process.argv0, [rollupConfig, ...rollupEnvironment, `--kind=esm`]);

buildContext.registerAlias('watch-import-loader', process.argv0, [
	require.resolve('./make-fake-index.cjs'),
	'--',
	`--cwd=${system}`,
	`--tsconfig=${tsconfig}`,
]);
