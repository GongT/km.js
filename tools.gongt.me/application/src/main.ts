import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();
}

declare const criticalError: Function;

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch((err) => (criticalError || console.error)(err))
	.then(() => {
		console.log('angular bootstrap complete');
		const pl = document.getElementById('pagePreLoader');
		if (pl) {
			pl.classList.add('remove');
			setTimeout(() => {
				pl.remove();
			}, 600);
		}
	});
