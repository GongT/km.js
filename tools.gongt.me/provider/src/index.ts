import 'source-map-support/register';
import { respawnInScope } from '@idlebox/node';

// console.error('$$=%s', process.pid);
respawnInScope(() => {
	import('./index-run');
});
