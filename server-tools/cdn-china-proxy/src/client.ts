import { baseUrl, cdnAddWhitelist } from './config';

function wrapScript(...args: any[]) {
	return `<script data-title="cdn load style">(${preloadScript.toString()})(${args
		.map((e) => JSON.stringify(e))
		.join(', ')});</script>`;
}

export function cdnLoadStyles(urls: string[]): string {
	cdnAddWhitelist(urls);
	const concat = baseUrl.includes('?') ? '&' : '?';
	return wrapScript(baseUrl + concat + 'upstream=', urls);
}

function preloadScript(baseUrl: string, urls: string[]) {
	enum StorageKey {
		RetryCount = 'CDNNetworkAccessStatusRetryCount',
		AlwaysProxy = 'CDNNetworkAccessStatusAlwaysProxy',
		NeverAsk = 'CDNNetworkAccessStatusNeverAsk',
	}

	let retryCount: Record<string, number> = {};
	load();

	function load() {
		function test(obj: any): any {
			return obj && typeof obj === 'object' ? obj : {};
		}
		try {
			retryCount = test(JSON.parse(localStorage[StorageKey.RetryCount]));
		} catch {
			save();
		}
	}
	function save() {
		localStorage[StorageKey.RetryCount] = JSON.stringify(retryCount);
	}

	function toProxy(link: HTMLLinkElement, url: string) {
		link.rel = 'stylesheet';
		link.href = baseUrl + encodeURIComponent(url);
		link.addEventListener('load', function listener() {
			link.removeEventListener('load', listener);

			retryCount[url] = retryCount[url] ? retryCount[url] + 1 : 1;
			save();
		});
	}

	const preloadLinks: HTMLLinkElement[] = [];
	let todo = 0;
	for (const url of urls) {
		const link = document.createElement('link');
		if (retryCount[url] > 3 || localStorage[StorageKey.AlwaysProxy]) {
			console.log('[CDN] proxy %s', url);
			toProxy(link, url);
			document.head.appendChild(link);
		} else if (retryCount[url] < 0) {
			console.log('[CDN] direct %s', url);
			link.rel = 'stylesheet';
			link.href = url;
			document.head.appendChild(link);
		} else {
			console.log('[CDN] test %s', url);
			preloadLinks.push(link);
			todo++;

			link.rel = 'preload';
			link.as = 'style';
			link.addEventListener('error', function listener() {
				todo--;
				if (todo === 0) {
					dismiss();
				}
				link.removeEventListener('error', listener);
				console.log('[CDN] failed-switch %s', url);
				toProxy(link, url);
			});
			link.addEventListener('load', function listener() {
				todo--;
				if (todo === 0) {
					dismiss();
				}
				link.removeEventListener('load', listener);

				retryCount[url] = -1;
				save();

				link.rel = 'stylesheet';
			});
			link.href = url;
		}
	}

	if (preloadLinks.length > 0) {
		setTimeout(() => {
			for (const item of preloadLinks) {
				document.head.appendChild(item);
			}
		}, 0);
		setTimeout(() => {
			for (const item of preloadLinks) {
				item.rel = 'stylesheet';
			}
		}, 1000);
		if (!localStorage[StorageKey.NeverAsk] && navigator.language === 'zh-CN') {
			setTimeout(() => {
				if (todo > 0) {
					showMessage();
				}
			}, 1000);
		}
	}

	function showMessage() {
		const div = document.createElement('DIV');
		div.id = 'askChinaProxy';
		div.appendChild(document.createTextNode('部分CDN资源似乎无法加载，是否切换到国内代理？'));
		div.style.padding = '10px 0';
		div.style.position = 'absolute';
		div.style.top = '0';
		div.style.left = '0';
		div.style.width = '100%';
		div.style.background = 'red';
		div.style.fontWeight = '800';
		div.style.zIndex = '99999999';
		div.style.textAlign = 'center';

		const yes = document.createElement('A');
		yes.innerHTML = '[切换]';
		yes.addEventListener('click', () => {
			localStorage[StorageKey.AlwaysProxy] = 'yes';
			window.location.reload();
		});
		yes.style.padding = '0 10px';
		yes.style.cursor = 'pointer';
		div.appendChild(yes);

		div.appendChild(document.createTextNode(' | '));

		const never = document.createElement('A');
		never.innerHTML = '[不再询问]';
		never.addEventListener('click', () => {
			localStorage[StorageKey.NeverAsk] = 'yes';
			dismiss();
		});
		never.style.cursor = 'pointer';
		div.appendChild(never);

		document.body.appendChild(div);
	}
	function dismiss() {
		const div = document.getElementById('askChinaProxy');
		if (div) {
			document.body.removeChild(div);
		}
	}
}
