import { OutputPlugin } from 'rollup';

export const importMetaPathPlugin: OutputPlugin = {
	name: 'dynamic-import-as-systemjs',
	resolveImportMeta(property, { moduleId }) {
		if (property === 'url') {
			//  return JSON.stringify(relativePath(APP_SOURCE_TEMP, moduleId));
			console.error('---------------------- result:', moduleId);
		}
		return null;
	},
};
