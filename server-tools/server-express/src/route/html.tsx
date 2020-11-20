/// <reference path="./extern.d.ts" />

import vhtml from 'vhtml';

export function renderDefaultHtml(options: Record<string, any>): string {
	return ('<!DOCTYPE html>' + _renderDefaultHtml(options)) as any;
}

function _renderDefaultHtml(options: Record<string, any>) {
	return (
		<html lang="zh-cn">
			<head>
				<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
				<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>:)</title>
				<link rel="shortcut icon" href={`${options.STATIC_URL}/favicon.png`} type="image/png" />
				<link rel="stylesheet" href={`${options.STATIC_URL}/styles/global.css`} />
				<link id="applicationStyleSheet" rel="stylesheet" />
				<script
					type="systemjs-importmap"
					id="AppConfig"
					dangerouslySetInnerHTML={{ __html: options.IMPORT_MAP_JSON }}
				></script>
				<script async defer crossOrigin="" src={options.entryFile}></script>
			</head>
			<body>
				<div id="pagePreLoader" dangerouslySetInnerHTML={{ __html: options.preloadHtml || '' }}></div>
				<div id="applicationRoot"></div>
			</body>
		</html>
	);
}
