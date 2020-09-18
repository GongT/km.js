import { sleep } from '@idlebox/common';
import { IAliyunHumanVerifyProps, IAliyunHumanVerifySmartCaptcha, IAliyunHumanVerifyData } from './aliyunTypes';

let pIntroScriptLoad: Promise<any> | undefined;
const url = '//g.alicdn.com/sd/nvc/1.1.112/guide.js';
const urls = ['//g.alicdn.com/sd/smartCaptcha/0.0.4/index.js', '//g.alicdn.com/sd/quizCaptcha/0.0.1/index.js'];

interface WithRender {
	renderTo: string;
}

export interface ICodeOptions {
	___mix: never;
	success?(data: IAliyunHumanVerifyData): void;
	fail?(): void;
}

declare class smartCaptcha implements IAliyunHumanVerifySmartCaptcha {
	constructor(options: ICodeOptions);
	clicked: boolean;
	fulfilled: boolean;
	successful: boolean;
	fail(): void;
	succeed(data: IAliyunHumanVerifyData): void;
	neterr(): void;
	reset(): void;
	init(): void;
}

/** @internal */
export let SmartCaptcha: typeof smartCaptcha;

/** 删除验证码相关数据，可以回收少量内存 */
export function cleanupAliyunScript() {
	cleanupAliyunScript();
	pIntroScriptLoad = undefined;
	SmartCaptcha = undefined as any;
}

/** 载入验证码所需脚本 */
export function loadAliyunScript(props: IAliyunHumanVerifyProps & WithRender): Promise<ICodeOptions> {
	if (pIntroScriptLoad) {
		Object.assign((window as any)['NVC_Opt'], props);
		return pIntroScriptLoad;
	}

	const NVC_Opt = { ...props };
	Object.assign(window, { NVC_Opt });
	pIntroScriptLoad = import(url)
		.then(() => {
			return Promise.all(urls.map((e) => import(e)));
		})
		.then(async () => {
			let i = 0;
			while (i < 20) {
				if (window.hasOwnProperty('smartCaptcha')) {
					SmartCaptcha = smartCaptcha;
					return NVC_Opt;
				}
				console.log('wait smartCaptcha %s', i);
				await sleep(300);
				i++;
			}
			throw new Error('Captcha can not load');
		})
		.catch((e) => {
			pIntroScriptLoad = undefined;
			throw e;
		});

	return pIntroScriptLoad;
}
