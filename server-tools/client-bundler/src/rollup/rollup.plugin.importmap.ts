import { resolve } from 'path';
import { NormalizedOutputOptions, OutputBundle, OutputPlugin } from 'rollup';
import { INDEX_FILE_NAME } from '../inc/constants';

export class ImportMapImpl implements OutputPlugin {
	public readonly name = 'create-importmap';

	generateBundle(options: NormalizedOutputOptions, bundles: OutputBundle) {
		if (!options.dir) {
			throw new Error('rollup output no "dir" option');
		}

		delete bundles[INDEX_FILE_NAME];
		if (Object.keys(bundles).length === 0) {
			return; // first run
		}

		const imports: Record<string, string> = {};
		for (const bundle of Object.values(bundles)) {
			if (bundle.type === 'asset') continue;
			const { fileName, name } = bundle;

			imports[name] = resolve(options.dir, fileName);

			const moduleName = recoverName(name);
			if (moduleName) {
				imports[moduleName] = imports[name];
			}
		}

		bundles['importmap.json'] = {
			fileName: 'importmap.json',
			type: 'asset',
			name: '@@importmap@@',
			source: JSON.stringify({ imports }, null, 2),
			isAsset: true,
		};
	}
}

function recoverName(name: string) {
	if (name.startsWith('_')) {
		return;
	}
	return name.replace('$', '/');
}

export const createApplicationImportMapPlugin: OutputPlugin = new ImportMapImpl();
