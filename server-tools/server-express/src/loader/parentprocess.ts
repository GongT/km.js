import { ChildProcess, spawn } from 'child_process';
import { boundMethod } from 'autobind-decorator';

function log(msg: string, ...args: any[]) {
	console.error('\x1B[2m[Parent] ' + msg + '\x1B[0m', ...args);
}

export function loadServerAsChildProcess(serverProgram: string): () => Promise<void> {
	const program = new ChildProcessLifecycle(serverProgram);
	return program.restart;
}

class ChildProcessLifecycle {
	private currentProcess?: ChildProcess;
	private reject?: (e?: Error) => void;

	constructor(public readonly serverProgram: string) {
		log('Press Ctrl+C to quit...');
		process.on('SIGINT', this.shutdown_quit);
		process.on('SIGTERM', this.shutdown_quit);
		process.on('SIGHUP', this.shutdown_quit);

		this.createProcess();
	}

	@boundMethod
	private async shutdown(term = false) {
		if (this.currentProcess) {
			log('stopping...');
			this.currentProcess.removeListener('exit', this.onExit);
			this.currentProcess.removeListener('error', this.onError);

			const p = new Promise((resolve) => {
				this.currentProcess!.on('exit', () => resolve());
			});
			this.currentProcess.kill(term ? 'SIGTERM' : 'SIGINT');
			await p;

			delete this.currentProcess;
		} else {
			log('server already stop.');
		}
	}

	@boundMethod
	async restart() {
		console.log('\x1Bc');
		await this.shutdown();
		await this.createProcess();
	}

	@boundMethod
	private onError(e?: Error) {
		if (this.reject) {
			this.reject(e);
		}
		if (e) {
			log('failed start server: %s', e.message);
		} else {
			log('failed start server');
		}
	}

	@boundMethod
	private onExit(code: number, signal: string) {
		if (signal) {
			this.onError(new Error('process killed by signal ' + signal));
		}
		this.onError(new Error('process exited with code ' + code));
		delete this.currentProcess;
	}

	private createProcess() {
		log('starting...');
		if (this.currentProcess) {
			throw new Error('program state error: duplicate call to createProcess()');
		}
		const p = spawn(process.argv0, [this.serverProgram], {
			stdio: ['ignore', 'inherit', 'inherit', 'ipc'],
		});
		this.currentProcess = p;

		p.on('exit', this.onExit);
		p.on('error', this.onError);

		return new Promise((resolve) => {
			this.reject = resolve;

			p.on('message', (data: any) => {
				if (data.error) {
					resolve();
				}
				if (data.done) {
					delete this.reject;
					resolve();
				}
			});
		});
	}

	@boundMethod
	private shutdown_quit() {
		log('Parent process will quit...');
		this.shutdown(true).finally(() => {
			process.exit(0);
		});
	}
}
