import { resolve } from 'path';
import { startChokidar } from '@idlebox/chokidar';
import { distPath, entryFileName } from '@km.js/client-loader';
import { loadServerAsChildProcess } from '@km.js/server-express';
import { fileMapPath } from '@tools.gongt.me/application';

const program = resolve(__dirname, 'server/start');

if (process.env.NODE_ENV === 'production') {
	import(program);
} else {
	console.error('Development mode enabled, server PID=%s!', process.pid);

	const watch = startChokidar(loadServerAsChildProcess(program));
	watch.addWatch(resolve(__dirname, '**/*.js'));
	watch.addWatch(fileMapPath);
	watch.addWatch(resolve(distPath, entryFileName));
}
