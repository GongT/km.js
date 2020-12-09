import { md5 } from '@idlebox/node';
import { NormalizedOutputOptions, OutputBundle, OutputPlugin } from 'rollup';
import { IFileMap } from '../inc/loader';

export class ImportMapImpl implements OutputPlugin {
	public readonly name = 'create-importmap';

	generateBundle(options: NormalizedOutputOptions, bundles: OutputBundle) {
		if (!options.dir) {
			throw new Error('rollup output no "dir" option');
		}

		if (Object.keys(bundles).length === 0) {
			return; // first run
		}

		const imports: IFileMap = {};
		for (const bundle of Object.values(bundles)) {
			if (bundle.type === 'asset') continue;

			const { fileName, name } = bundle;

			if (name.startsWith('_')) {
				continue;
			}
			if (name.startsWith('dependencies/')) {
				continue;
			}
			imports[name] = {
				fileName: fileName,
				hash: md5(Buffer.from(bundle.code)),
			};
		}

		bundles['filemap.json'] = {
			fileName: 'filemap.json',
			type: 'asset',
			name: '@@filemap@@',
			source: JSON.stringify(imports, null, 2),
			isAsset: true,
		};
	}
}

export const createApplicationImportMapPlugin: OutputPlugin = new ImportMapImpl();
