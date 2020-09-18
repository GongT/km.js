import { gulpTransformer } from '../plugins/transform';
export function logPassing() {
	return gulpTransformer((f) => {
		console.log(f.relative);
		return f;
	});
}
