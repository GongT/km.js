import { registerGlobalLifecycle, toDisposable } from '@idlebox/common';

export function handleQuit(dispose: () => void) {
	registerGlobalLifecycle(toDisposable(dispose));
}
