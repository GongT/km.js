import { prettyPrintError } from '@idlebox/node';

if (process.send) {
	process.on('uncaughtException', printError);
	process.on('unhandledRejection', printError);
}

export function onServerStartListen() {
	if (process.send) {
		process.send({ done: true });
	}
}

function printError(e: Error) {
	console.error('-'.repeat(process.stderr.columns || 80));
	prettyPrintError('ServerProcess', e);
	console.error('-'.repeat(process.stderr.columns || 80));
	process.send!({ error: true });
}
