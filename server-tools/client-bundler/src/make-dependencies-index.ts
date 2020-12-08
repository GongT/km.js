import { resolve } from 'path';
import { FSWatcher, WatchHelper } from '@idlebox/chokidar';
import { writeFileIfChange } from '@idlebox/node';
import { info } from 'fancy-log';
import { mkdirpSync, mkdirSync, pathExistsSync, readJSON } from 'fs-extra';
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

if (!pathExistsSync(lv2Dir)) {
	mkdirSync(lv2Dir);
}

async function doCreateIndex() {
	info('check import info change');
	const files = globSync('**/*.importinfo', { cwd: lv1Dir, absolute: true });
	const imports = new Set<string>();
	for (const file of files) {
		const data: any = await readJSON(file);
		for (const { specifier, values } of data?.imports ?? []) {
			if (values.length > 0) {
				imports.add(specifier);
			}
		}
	}

	let data = '';
	for (const item of imports.values()) {
		data += `import "${item}";\n`;
	}

	const change = await writeFileIfChange(distFile, data);
	if (change) {
		info('recreate %s', distFile);
	}
}
