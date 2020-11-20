import { oneDay, oneHour } from '@idlebox/common';
import { ServeStaticOptions } from 'serve-static';
import { oneYear } from '../../data/datetime';

export enum ResourceType {
	Dynamic, // change every request
	ThirdParty, // not change for long time
	Application, // may change any time
	Assets, // file with version in it's name
}

export function createCommonOptions(resourceType: ResourceType, mime: string, fallthrough = false): ServeStaticOptions {
	switch (resourceType) {
		case ResourceType.Dynamic:
			return {
				fallthrough,
				cacheControl: false,
				etag: true,
				lastModified: true,
				setHeaders(res) {
					res.setHeader('Content-Type', mime);
					res.setHeader('Cache-Control', 'no-store');
				},
			};
		case ResourceType.Application:
			return {
				maxAge: oneHour,
				etag: true,
				lastModified: true,
				setHeaders(res) {
					res.setHeader('Content-Type', mime);
				},
			};
		case ResourceType.Assets:
			return {
				maxAge: oneYear,
				immutable: true,
				etag: true,
				lastModified: true,
				setHeaders(res) {
					res.setHeader('Content-Type', mime);
				},
			};
		case ResourceType.ThirdParty:
			return {
				maxAge: oneDay,
				etag: true,
				lastModified: true,
				setHeaders(res) {
					res.setHeader('Content-Type', mime);
				},
			};
	}
}
