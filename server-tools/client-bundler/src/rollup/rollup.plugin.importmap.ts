import { md5 } from '@idlebox/node';
import { NormalizedOutputOptions, OutputBundle, OutputPlugin } from 'rollup';
import { IImportMapProto } from '../inc/loader';

export class ImportMapImpl implements OutputPlugin {
	public readonly name = 'create-importmap';

	generateBundle(options: NormalizedOutputOptions, bundles: OutputBundle) {
		if (!options.dir) {
			throw new Error('rollup output no "dir" option');
		}

		if (Object.keys(bundles).length === 0) {
			return; // first run
		}

		const importProto: IImportMapProto = {
			imports: {},
			depcache: {},
		};
		for (const bundle of Object.values(bundles)) {
			if (bundle.type === 'asset') continue;

			const { fileName, imports, name } = bundle;

			if (imports.length > 0) {
				importProto.depcache[fileName] = imports;
			}

			if (name.startsWith('dependencies/')) {
				continue;
			}
			importProto.imports[name] = {
				fileName: fileName,
				hash: md5(Buffer.from(bundle.code)),
			};
		}

		bundles['importmap.prototype.json'] = {
			fileName: 'importmap.prototype.json',
			type: 'asset',
			name: '@@ImportMapPrototype@@',
			source: JSON.stringify(importProto, null, 2),
			isAsset: true,
		};
	}
}

export const createApplicationImportMapPlugin: OutputPlugin = new ImportMapImpl();
