if (window.document.hasOwnProperty('documentMode')) {
	const _mask = document.createElement('DIV') as HTMLDivElement;
	_mask.className = 'fullMask';
	document.body.appendChild(_mask);

	const _div = document.createElement('DIV') as HTMLDivElement;
	_div.className = 'topAlert';
	const _link = document.createElement('A') as HTMLAnchorElement;
	_link.href = 'https://www.microsoft.com/zh-cn/edge/';
	_link.innerHTML = '点击此处';
	_link.target = '_blank';
	_link.style.color = 'black';
	_div.appendChild(
		document.createTextNode(
			'本网站不支持Internet Explorer浏览器，如果您正在使用“360安全”、“搜狗”等双核浏览器，请点击地址栏中的切换按钮，进入高速模式。或者'
		)
	);
	_div.appendChild(_link);
	_div.appendChild(document.createTextNode('更新浏览器。'));

	const _link2 = document.createElement('A') as HTMLAnchorElement;
	_link2.href = 'javascript: __ie_dismiss()';
	_link2.innerHTML = ' [忽略]';
	_link2.style.color = 'black';
	_link2.style.float = 'right';
	_div.appendChild(_link2);

	document.body.appendChild(_div);

	(window as any).__ie_dismiss = function __ie_dismiss() {
		document.body.removeChild(_mask);
		document.body.removeChild(_div);
	};
}
