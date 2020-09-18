import { emptyDir } from 'fs-extra';
import { isAbsolute } from 'path';
import { TaskFunction } from 'gulp';
export function gulpRimraf(folder: string): TaskFunction {
	if (!folder) {
		throw new Error('[gulpRimraf] require path argument');
	}
	if (!isAbsolute(folder)) {
		throw new Error('[gulpRimraf] path must absolute');
	}
	return () => {
		return emptyDir(folder);
	};
}
