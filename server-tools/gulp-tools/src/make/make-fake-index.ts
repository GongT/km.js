import { FSWatcher, WatchHelper } from '@idlebox/chokidar';
import { writeFileIfChange, writeFileIfChangeSync } from '@idlebox/node';
import execa from 'execa';
import { info } from 'fancy-log';
import { existsSync, mkdirpSync, readJSON } from 'fs-extra';
import { sync as globSync } from 'glob';
import { resolve } from 'path';
import { findTsc, getTypescriptAt } from '../inc/typescript';
import { parseArguments } from './inc/args';

const options = parseArguments();
const cwd = options.cwd;
if (!existsSync(cwd)) {
	mkdirpSync(cwd);
	process.chdir(cwd);
}
info('Watching %s', cwd);

const tmpdir = resolve(cwd, '../import-temp');
mkdirpSync(tmpdir);

const tsconfig = resolve(tmpdir, 'tsconfig.json');
writeFileIfChangeSync(
	tsconfig,
	JSON.stringify({
		extends: options.tsconfig,
		compilerOptions: {
			target: 'ESNext',
			module: 'ESNext',
			plugins: [],
			outDir: './',
			rootDir: './',
		},
		files: ['index.ts'],
	})
);

const distFile = resolve(tmpdir, 'index.ts');

const chokidar = new FSWatcher({
	ignoreInitial: false,
	cwd,
});

const tsc = findTsc(getTypescriptAt(tsconfig));

const watch = new WatchHelper(chokidar, async () => {
	const files = globSync('**/*.importinfo', { cwd, absolute: true });
	const imports: string[] = [];
	for (const file of files) {
		const data: any = await readJSON(file);
		if (!data.externals) {
			continue;
		}
		for (const extModule of data.externals) {
			imports.push(createImport(extModule));
		}
	}
	const data = imports.join('\n') + '\n';

	const change = await writeFileIfChange(distFile, data);
	if (change) {
		info('recreate %s', distFile);
	}
	if (!tscRun) {
		startTSC();
	}
});
watch.addWatch(resolve(cwd, '**/*.importinfo'));

let tscRun = false;

function startTSC() {
	info('spawn tsc for imports');
	tscRun = true;
	const p = execa(tsc, ['-p', tsconfig, '-w', '--preserveWatchOutput'], {
		stdio: 'inherit',
	});
	p.finally(() => {
		const e = new Error('tsc died');
		setImmediate(() => {
			throw e;
		});
	});
}

function createImport({ specifier, type, identifiers }: any) {
	if (type === 'commonjs') {
		return `import "${specifier}";`;
	} else {
		// const sp = nodeResolve || specifier;
		if (identifiers && identifiers.length && identifiers[0] !== '*') {
			return `export { ${identifiers.join(', ')} } from "${specifier}";`;
		} else {
			return `import "${specifier}";`;
		}
	}
}
