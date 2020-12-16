import { OutputPlugin } from 'rollup';

export const dynamicImportPlugin: OutputPlugin = {
	name: 'dynamic-import-replace',
	renderDynamicImport() {
		return {
			left: '(System.import||importShim||dynamicImport)(',
			right: ')',
		};
	},
};
