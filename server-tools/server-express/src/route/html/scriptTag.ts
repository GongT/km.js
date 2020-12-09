import { contributePageHtml } from './main';

export function contributeScriptTag(url: string) {
	contributePageHtml({
		headString: `<script async defer crossOrigin="" src="${url}"></script>`,
	});
}
