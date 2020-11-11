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
				<title>:)</title>
				<link rel="stylesheet" href={`${options.STATIC_URL}/app/styles/global.css`} />
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
