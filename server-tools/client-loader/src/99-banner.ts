window.pageLoadFinish = pageLoadFinish;
function pageLoadFinish() {
	if (console && console.log) {
		const shadows = ['#F60000', '#FF8C00', '#FFEE00', '#4DE94C', '#3783FF', '#4815AA'];
		_rawLog(
			'%c   WELCOME TO THE FUTURE!',
			[
				'text-align:center',
				'font-weight:bold',
				'font-size:50px',
				'line-height:100px',
				'color:red',
				'text-shadow:' + shadows.map((color, index) => `${index * 2}px ${index * 4}px 0 ${color}`).join(', '),
			].join(';')
		);

		if (console.timeStamp) {
			console.timeStamp('入口文件加载完成');
		}
	}
}

window.showPageLoad = showPageLoad;
function showPageLoad() {
	log('页面加载消耗了 %s 毫秒', new Date().getTime() - pageLoadStartAt);
}
