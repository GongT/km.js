import { disposeGlobal, registerGlobalLifecycle, toDisposable } from '@idlebox/common';

export function handleQuit(dispose: () => void) {
	registerGlobalLifecycle(toDisposable(dispose));
}

process.on('beforeExit', (code) => {
	disposeGlobal().finally(() => {
		process.exit(code);
	});
});
