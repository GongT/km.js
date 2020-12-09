/// <reference path="../extern.d.ts" />

import { Request } from 'express';

export interface IContribution {
	head?(request: Request, locals: any, globalStorage: Record<string, any>): string;
	headString?: string;
	body?(request: Request, locals: any, globalStorage: Record<string, any>): string;
	bodyString?: string;
}

const pageElements: IContribution[] = [];
let publicHead = '';
let publicBody = '';

publicHead += '<!DOCTYPE html><html lang="zh-cn">';
publicHead += '<head>';
publicHead += '<meta http-equiv="X-UA-Compatible" content="IE=Edge" />';
publicHead += '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />';
publicHead += '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';

export function renderHtml(request: Request, locals: any, options: Record<string, any>): string {
	let html = publicHead;
	for (const item of pageElements) {
		if (item.head) {
			html += item.head(request, locals, options);
		}
	}
	html += '</head><body>' + publicBody;
	for (const item of pageElements) {
		if (item.body) {
			html += item.body(request, locals, options);
		}
	}
	html += '</body><html>';
	return html;
}

export function contributePageHtml(fn: IContribution) {
	if (fn.headString) {
		publicHead += fn.headString;
	}
	if (fn.bodyString) {
		publicBody += fn.bodyString;
	}
	if (fn.head || fn.body) {
		pageElements.push(fn);
	}
}

/*
		<html lang="zh-cn">
			<head>
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
				<div id="applicationRoot"></div>
			</body>
		</html>
*/
