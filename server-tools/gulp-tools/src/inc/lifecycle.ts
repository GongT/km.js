import { disposeGlobal, registerGlobalLifecycle, toDisposable } from '@idlebox/common';
import { info } from 'fancy-log';

export function handleQuit(dispose: () => void) {
	registerGlobalLifecycle(toDisposable(dispose));
}

process.on('beforeExit', (code) => {
	info('beforeExit: code=%s', code);
	disposeGlobal().finally(() => {
		process.exit(code);
	});
});
