import { VinylFile } from '../tasks';

export function createMeta(source: VinylFile, metadata: any): VinylFile {
	return new VinylFile({
		base: source.base,
		cwd: source.cwd,
		path: source.path + '.meta.json',
		contents: Buffer.from(JSON.stringify(metadata)),
		sourcemap: null,
	});
}
