import { startChokidar } from '@idlebox/chokidar';
import { loadServerAsChildProcess } from '@km.js/server-express';
import { resolve } from 'path';

const program = resolve(__dirname, 'server/start');

if (process.env.NODE_ENV === 'production') {
	import(program);
} else {
	console.error('Development mode enabled, server PID=%s!', process.pid);

	const watch = startChokidar(loadServerAsChildProcess(program));
	watch.addWatch(resolve(__dirname, '**/*.js'));
}
