import express, { Application } from 'express';
import { defaultOpts } from '../data/defaultPath';

export function createApplication(): Application {
	const app = express();

	Object.assign(app.locals, defaultOpts);
	for (const [k, v] of Object.entries(defaultOpts)) {
		app.set(k, v);
	}

	return app;
}
