import express, { Application } from 'express';

export function createApplication(): Application {
	const app = express();

	app.set('case sensitive routing', true);
	app.set('json escape', false);
	app.set('json spaces', 4);
	app.set('query parser', 'extended');
	app.set('strict routing', true);
	app.set('trust proxy', true);

	return app;
}
