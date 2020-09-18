import { spawnSync } from 'child_process';
import { createRequire } from 'module';
import { findBinary, respawnInScope } from '@idlebox/node';
import { readJsonSync } from 'fs-extra';

function tryResolve(require: NodeRequire, mdl: string) {
	try {
		return require.resolve(mdl);
	} catch {
		return undefined;
	}
}

respawnInScope(function () {
	const require = createRequire(process.cwd() + '/package.json');
	let gulp: string | undefined;

	if ((gulp = tryResolve(require, 'gulp-cli'))) {
		require(gulp);
	} else if ((gulp = tryResolve(require, 'gulp/package.json'))) {
		const gulpPkg = require.resolve('gulp/package.json');
		const json = readJsonSync(gulpPkg);
		require(json.bin?.gulp ?? json.bin);
	} else if ((gulp = findBinary('gulp'))) {
		const r = spawnSync(gulp);
		if (r.signal) {
			process.kill(process.pid, r.signal);
		}
		process.exit(r.status || 0);
	} else {
		throw new Error('package "gulp" did not found');
	}
});
