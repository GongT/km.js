import { pathExistsSync, readJson, readJsonSync, stat, statSync, writeJson, writeJsonSync } from 'fs-extra';

export interface ICreateFunction {
	(jsonData: any): any | undefined | void;
}

export async function createJsonFile(target: string, creator: ICreateFunction) {
	const stats = await stat(target).catch(() => undefined);
	let data: any;
	if (stats) {
		data = await readJson(target);
	} else {
		data = {};
	}
	const ret = creator(data);
	if (ret) {
		data = ret;
	}

	await writeJson(target, data);
}

export function createJsonFileSync(target: string, creator: ICreateFunction) {
	const stats = pathExistsSync(target) ? statSync(target) : undefined;
	let data: any;
	if (stats) {
		data = readJsonSync(target);
	} else {
		data = {};
	}
	creator(data);

	writeJsonSync(target, data);
}
