import { join } from 'path';

type ImportRecord = Record<string /* Import specifier */, string /* URL */>;
export interface IImportMap {
	imports: ImportRecord;
	scopes: Record<string, ImportRecord>;
	config: any;
}

/** @internal */
export const importMap: IImportMap = {
	imports: {},
	scopes: {},
	config: undefined,
};

export function registerGlobalMapping(specifier: string, url: string) {
	importMap.imports[specifier] = join('/', url);
}

export function createImportScope(path: string) {
	if (!importMap.scopes[path]) {
		importMap.scopes[path] = {};
	}
	return importMap.scopes[path];
}
