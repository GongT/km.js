import { DeferredPromise, nameFunction, sleep } from '@idlebox/common';

interface Function<T> {
	(...args: any[]): T | Promise<T>;
}

interface DebounceController {
	dispose(): void;
}

enum State {
	FREE,
	DEBOUCE,
	RUN,
	COOLDOWN,
	INVALID,
}

export function debounce<T, FN extends Function<T>>(
	debounceMs: number,
	cooldownMs: number,
	fn: FN
): FN & DebounceController {
	let state = State.FREE;
	let dTimer: NodeJS.Timeout | undefined;
	let triggerArguments: any[] | undefined;
	let waitingPromise: Promise<any> | undefined;
	let resultPromise: DeferredPromise<any> | undefined;

	function dispose() {
		state = State.INVALID;
	}

	function caller(...args: any[]) {
		// info'debounce()');
		triggerArguments = args;
		return changeState();
	}

	async function _fire(args: any[]) {
		await new Promise((resolve) => setImmediate(resolve));
		// info'[%s] run callback', fn.name);
		await Promise.resolve()
			.then(() => fn(...args))
			.then(
				(d) => resultPromise!.complete(d),
				(e) => resultPromise!.error(e)
			);
		// info'[%s] callback done', fn.name);

		state = State.COOLDOWN;
		await sleep(cooldownMs);
		state = State.FREE;

		// info'[%s] cooldown done', fn.name);
	}

	function fire() {
		// info'[%s] fire!', fn.name);
		state = State.RUN;
		const args = triggerArguments!;
		waitingPromise = _fire(args);
	}

	function changeState(): Promise<T> {
		switch (state) {
			case State.FREE:
			case State.DEBOUCE:
				if (!resultPromise) {
					// this is State.FREE
					state = State.DEBOUCE;
					resultPromise = new DeferredPromise();
					// info'[%s] will run', fn.name);
				}
				if (dTimer) {
					// info'[%s] reset timer', fn.name);
					clearTimeout(dTimer);
				}
				// info'[%s] set timer', fn.name);
				dTimer = setTimeout(() => {
					// info'[%s] timer reach', fn.name);
					dTimer = undefined;
					fire();
				}, debounceMs);
				return resultPromise.p;
			case State.RUN:
			case State.COOLDOWN:
				// info'[%s] schedule (%s)', fn.name, State[state]);
				return waitingPromise!.then(() => caller());
			default:
				throw new Error('invalid state');
		}
	}

	return Object.assign(nameFunction('debounce$$' + fn.name, caller as any), { dispose });
}
