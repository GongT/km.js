import { resolve } from 'path';
import { startChokidar } from '@idlebox/chokidar';
import { distPath, entryFileName } from '@km.js/client-loader';
import { loadServerAsChildProcess } from '@km.js/server-express';
import { info } from 'console';

const program = resolve(__dirname, 'server/start');

if (process.env.NODE_ENV === 'production') {
	import(program);
} else {
	console.error('Development mode enabled, server PID=%s!', process.pid);

	const watch = startChokidar(loadServerAsChildProcess(program));

	function addWatch(p: string) {
		info(' - Watching %s', p);
		watch.addWatch(p);
	}
	addWatch(resolve(__dirname, '**/*.js'));
	addWatch(resolve(__dirname, '../view/**/*.html'));
	addWatch(resolve(distPath, entryFileName));
}
