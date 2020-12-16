import { escapeRegExp } from '@idlebox/common';

/** @internal */
export let baseUrl = '/_cdn_proxy';

export function setProxyBaseUrl(_baseUrl: string) {
	baseUrl = _baseUrl;
}

/** @internal */
export let knownRemote = new Set<RegExp>();

export function cdnAddWhitelist(urls: (string | RegExp)[]) {
	for (const url of urls) {
		let reg: RegExp;
		if (typeof url === 'string') {
			reg = new RegExp(escapeRegExp(url), 'i');
		} else {
			reg = url;
		}
		knownRemote.add(reg);
	}
}
