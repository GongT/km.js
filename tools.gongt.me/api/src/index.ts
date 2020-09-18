import { Router } from 'express';
import { json } from 'body-parser';

export function getApiRouter(): Router {
	const r = Router();
	r.use(function filterPost(req, res, next) {
		if (req.method !== 'POST' && req.method !== 'OPTIONS') {
			res.sendStatus(405);
			return;
		}
		next();
	});
	r.use(json());

	r.use(function notFound(_, res) {
		res.send('<h1>Api Endpoint Does Not Exists</h1>').status(404);
	});

	return r;
}
