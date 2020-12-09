import { dirname, resolve } from 'path';
import { FSWatcher, WatchHelper } from '@idlebox/chokidar';
import { info } from 'fancy-log';
import { emptyDirSync, mkdirpSync, mkdirSync, pathExistsSync, readJSON, writeFileSync } from 'fs-extra';
import { sync as globSync } from 'glob';
import { requireArgument } from './inc/childProcessContext';

const lv1Dir = requireArgument('lv1');
if (!pathExistsSync(lv1Dir)) {
	mkdirpSync(lv1Dir);
}
process.chdir(lv1Dir);

const lv2Dir = requireArgument('lv2');

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
} else {
	emptyDirSync(lv2Dir);
}

const diffCache = new Map<string, string>();
const imports = new Map<string, Set<string>>();

async function doCreateIndex() {
	info('check import info change');
	const files = globSync('**/*.importinfo', { cwd: lv1Dir, absolute: true });
	for (const file of files) {
		const data: any = await readJSON(file);
		for (const { specifier, values } of data?.imports ?? []) {
			if (values.length > 0) {
				if (!imports.has(specifier)) {
					imports.set(specifier, new Set());
				}
				const set = imports.get(specifier)!;
				if (set.has('*')) {
					continue;
				}
				for (const name of values) {
					set.add(name);
				}
			}
		}
	}

	for (const [specifier, items] of imports.entries()) {
		let data: string[] = [];

		if (items.has('*')) {
			data.push(`export * from "${specifier}";`);
		} else {
			if (items.has('default')) {
				data.push(`import imported from "${specifier}";`);
				data.push(`export default imported;`);
				items.delete('default');
			}
			if (items.size > 0) {
				const names = [...items.values()].join(', ');
				data.push(`export { ${names} } from "${specifier}";`);
			}
		}

		const script = data.join('\n');
		if (diffCache.get(specifier) !== script) {
			const distFile = resolve(lv2Dir, specifier + '.js');
			info('recreate %s', distFile);

			if (specifier.includes('/')) {
				mkdirpSync(dirname(distFile));
			}
			writeFileSync(distFile, script, 'utf8');

			diffCache.set(specifier, script);
		}
	}
}
