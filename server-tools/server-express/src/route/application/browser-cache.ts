import { oneDay, oneHour } from '@idlebox/common';
import { ServeStaticOptions } from 'serve-static';
import { oneYear } from '../../data/datetime';

export enum ResourceType {
	/** must change every request */
	Dynamic,
	/** not change for long time */
	ThirdParty,
	/** may change any time */
	Application,
	/** file with version in it's name */
	Assets,
	/** cache with revalidate */
	DebugResource,
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
		case ResourceType.DebugResource:
			return {
				maxAge: oneHour,
				etag: true,
				lastModified: true,
				setHeaders(res) {
					res.setHeader('Content-Type', mime);
				},
			};
		case ResourceType.Application:
			return {
				cacheControl: false,
				etag: true,
				lastModified: true,
				setHeaders(res) {
					res.setHeader('Cache-Control', 'public, must-revalidate');
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
