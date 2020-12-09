import { readFileSync } from 'fs';
import { contributePageHtml } from './main';

export function preloadHtmlFromFile(file: string) {
	preloadHtmlString(readFileSync(file, 'utf-8'));
}
export function preloadHtmlString(html: string) {
	contributePageHtml({
		bodyString: `<div id="pagePreLoader">${html}</html>`,
	});
}
