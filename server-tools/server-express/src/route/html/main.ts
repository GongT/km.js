/// <reference path="../extern.d.ts" />

import { Request } from 'express';

export interface IContribution {
	head?(request: Request, locals: any, globalStorage: Record<string, any>): string;
	headString?: string;
	headAssetString?: string;
	body?(request: Request, locals: any, globalStorage: Record<string, any>): string;
	bodyString?: string;
}

const pageElements: IContribution[] = [];
let bodyClasses = '';
let publicHead = '';
let publicBody = '';

const constHead = `
<!DOCTYPE html>
<html lang="zh-cn">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
`;

export function renderHtml(request: Request, locals: any, options: Record<string, any>): string {
	let html = constHead + publicHead;
	for (const item of pageElements) {
		if (item.head) {
			html += item.head(request, locals, options);
		}
	}
	html += '</head><body class="' + bodyClasses + '">' + publicBody;
	for (const item of pageElements) {
		if (item.body) {
			html += item.body(request, locals, options);
		}
	}
	html += '</body><html>';
	return html;
}

export function contributePageBodyClass(classNames: string) {
	bodyClasses += (bodyClasses ? ' ' : '') + classNames;
}

export function contributePageHtml(fn: IContribution) {
	if (fn.headString) {
		publicHead += fn.headString;
	}
	if (fn.headAssetString) {
		publicHead = fn.headAssetString + publicHead;
	}
	if (fn.bodyString) {
		publicBody += fn.bodyString;
	}
	if (fn.head || fn.body) {
		pageElements.push(fn);
	}
}
