import { warn } from 'fancy-log';
import { resolve } from 'path';
import { parseArguments } from '../inc/args';

const myOptions = {
	WORKING_DIR: process.cwd(),
	SOURCE_DIR: '',
	OUTPUT_DIR: '',
	GENERATE_KIND: '',
};
const required: (keyof typeof myOptions)[] = ['SOURCE_DIR', 'OUTPUT_DIR', 'GENERATE_KIND'];

for (const [name, value] of Object.entries(parseArguments())) {
	if (name === 'source') {
		myOptions.SOURCE_DIR = value;
	} else if (name === 'out') {
		myOptions.OUTPUT_DIR = value;
	} else if (name === 'project') {
		myOptions.WORKING_DIR = value;
	} else if (name === 'kind') {
		myOptions.GENERATE_KIND = value;
	} else {
		warn('Ignore unknown argument: name=%s, value=%s', name, value);
	}
}

for (const i of required) {
	if (!myOptions[i]) {
		throw new Error('Missing required argument: ' + i);
	}
}

export const WORKING_DIR = myOptions.WORKING_DIR;
export const KIND = myOptions.GENERATE_KIND;
export const APP_SOURCE: string = resolve(WORKING_DIR, myOptions.SOURCE_DIR);

export const APP_OUTPUT_DIR: string = resolve(WORKING_DIR, myOptions.OUTPUT_DIR);
export const APP_SOURCE_TEMP: string = resolve(APP_OUTPUT_DIR, KIND);
export const APP_TARGET_MODULES: string = resolve(APP_OUTPUT_DIR, 'node-modules');

export const VENDOR_HASH: string = process.env.VENDOR_HASH!;
export const APPLICATION_HASH: string = process.env.APPLICATION_HASH!;
