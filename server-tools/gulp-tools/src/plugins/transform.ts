import { Transform, TransformCallback } from 'stream';
import { VinylFile } from '../tasks';

export interface ITransformFunction {
	(this: NodeJS.WritableStream, file: VinylFile): VinylFile | null | Promise<VinylFile | null>;
}
export function gulpTransformer(action: ITransformFunction): NodeJS.ReadWriteStream {
	return new Transform({
		objectMode: true,
		transform(file: VinylFile, _encoding: string, callback: TransformCallback) {
			Promise.resolve()
				.then(() => action.call(this, file))
				.then(
					(file) => {
						callback(null, file || undefined);
					},
					(e) => {
						callback(e);
					}
				);
		},
	});
}
