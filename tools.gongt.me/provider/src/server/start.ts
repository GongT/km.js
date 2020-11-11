import { MyServer } from './server';

const server = new MyServer();
server.startServe();

function shutdown() {
	server.shutdown().finally(() => {
		process.exit(0);
	});
}

process.on('SIGINT', () => {
	console.error('[Provider] receive SIGINT');
	shutdown();
});
