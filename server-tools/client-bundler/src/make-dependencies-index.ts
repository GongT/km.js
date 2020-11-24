import { resolve } from 'path';
import { FSWatcher, WatchHelper } from '@idlebox/chokidar';
import { writeFileIfChange } from '@idlebox/node';
import { info } from 'fancy-log';
import { mkdirpSync, pathExistsSync, readJSON } from 'fs-extra';
import { sync as globSync } from 'glob';
import { requireArgument } from './inc/childProcessContext';
import { INDEX_FILE_NAME } from './inc/constants';

const lv1Dir = requireArgument('lv1');
if (!pathExistsSync(lv1Dir)) {
	mkdirpSync(lv1Dir);
}
process.chdir(lv1Dir);

const lv2Dir = requireArgument('lv2');
const distFile = resolve(lv2Dir, INDEX_FILE_NAME);

const chokidar = new FSWatcher({
	ignoreInitial: false,
	cwd: lv1Dir,
	atomic: 1000,
	awaitWriteFinish: {
		stabilityThreshold: 800,
		pollInterval: 100,
	},
});

const watch = new WatchHelper(chokidar, doCreateIndex);
watch.addWatch('**/*.importinfo');
info('watching changes in %s', lv1Dir);

async function doCreateIndex() {
	info('check import info change');
	const files = globSync('**/*.importinfo', { cwd: lv1Dir, absolute: true });
	const imports: string[] = [];
	for (const file of files) {
		imports.push('// + ' + file);
		const data: any = await readJSON(file);
		for (const extModule of data?.imports ?? []) {
			imports.push(createImport(extModule));
		}
	}
	const data = imports.join('\n') + '\n';

	const change = await writeFileIfChange(distFile, data);
	if (change) {
		info('recreate %s', distFile);
	}
}

function createImport({ specifier, values }: any) {
	if (values.length > 0) {
		return `import "${specifier}";`;
	} else {
		return '// only types from ' + specifier;
	}
}
