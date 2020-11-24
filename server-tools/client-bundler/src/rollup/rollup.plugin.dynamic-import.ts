import { OutputPlugin } from 'rollup';

export const dynamicImportPlugin: OutputPlugin = {
	name: 'dynamic-import-as-systemjs',
	renderDynamicImport() {
		return {
			left: 'System.import(',
			right: ')',
		};
	},
};
