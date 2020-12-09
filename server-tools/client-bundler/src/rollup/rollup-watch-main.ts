import { resolve } from 'path';
import { startChokidar } from '@idlebox/chokidar';
import { sync as globSync } from 'glob';
import { MergedRollupOptions, rollup } from 'rollup';
import { requireArgument } from '../inc/childProcessContext';
import { emptyDirSync } from 'fs-extra';

process.env.FROM = requireArgument('from');
process.env.TO = requireArgument('to');
process.env.SMR = requireArgument('smr');

emptyDirSync(process.env.TO);

const fromDir = process.env.FROM;

const config: MergedRollupOptions = require('./rollup.config.watch').default;

const watch = startChokidar(rebuild);

watch.addWatch(fromDir);

async function rebuild() {
	const list = globSync('**/*.js', { cwd: fromDir, absolute: false });

	const input: Record<string, string> = {};
	for (const file of list) {
		input[file.replace(/\.js$/, '')] = resolve(fromDir, file);
	}

	config.input = input;

	const built = await rollup(config);
	for (const output of config.output) {
		await built.write(output);
	}
}
