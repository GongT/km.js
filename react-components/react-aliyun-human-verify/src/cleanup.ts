const addedKeys = [
	'NVC_Opt',
	'NVC_Result',
	'jsonp_05800803738848375',
	'quizCaptcha',
	'smartCaptcha',

	'AWSC',
	'AWSCFY',
	'AWSCInner',
	'NVC_Data',
	'UA_Opt',
	'__acjs',
	'__acjs_awsc_125',
	'__nvc__uab',
	'__nvc__umid',
	'__nvc_uaboption',
	'_nvc',
	'_uab_module',
	'getLC',
	'getNC',
	'getNVCVal',
	'getSC',
	'nvc',
	'nvcReset',
	'um',
	'umx',
];

/** @internal */
export function cleanupAliyunScripts() {
	document.querySelectorAll<HTMLScriptElement>('head>script').forEach((s: HTMLScriptElement) => {
		console.log(s.src, s.id);
		if (s.src?.includes('aliyun.com/nvc/') || s.src?.includes('alicdn.com/sd/nvc/') || s.id?.startsWith('AWSC_')) {
			s.remove();
		}
	});

	for (const i of addedKeys) {
		delete (window as any)[i];
	}
}
