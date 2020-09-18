import { writeFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { resolve } from 'path';

const p = spawnSync('jp2a', ['banner.jpg', '--grayscale', '--background=light', '--size=400x40'], {
	encoding: 'utf-8',
	stdio: ['ignore', 'pipe', 'inherit'],
	cwd: __dirname,
});
if (p.error) {
	throw p.error;
}
if (p.signal) {
	throw new Error('Failed run `jp2a`, killed by signal: ' + p.signal);
}
if (p.status) {
	throw new Error('Failed run `jp2a`, exit with code: ' + p.status);
}

const output = p.stdout;

let state = false;
const arr = output
	.split(/\n/)
	.filter((e) => {
		if (e.trim().length > 0) {
			state = false;
			return true;
		} else if (state) {
			return false;
		} else {
			state = true;
			return true;
		}
	})
	.map((e) => {
		return ' * ' + e.replace(/ +$/, '');
	});

const safe = arr.join('\n').replace(/\*\//g, '*\\');

writeFileSync(resolve('../src/00-banner.ts'), '/**\n' + safe + '\n */');
