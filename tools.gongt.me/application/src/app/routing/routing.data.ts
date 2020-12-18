import type { ExtendedRoutes, IMyRouteData } from './routing.module';
import { ucfirst, camelCase } from '@idlebox/common';

const enum ApplicationCategoryId {
	Linux = 'linux',
	TestPages = 'test-pages',
	Pictures = 'pictures',
	Files = 'files',
}
const enum ApplicationId {
	LvmCacheCalc = 'lvm-cache-calc',
	Hash = 'hash',
}

export const ApplicationMenuCategorys: Record<string, IMyRouteData> = {
	[ApplicationCategoryId.Files]: {
		title: '文件操作',
		icon: 'folder_open',
	},
	[ApplicationCategoryId.Pictures]: {
		title: '图片处理',
		icon: 'svg:image-edit-outline',
	},
	[ApplicationCategoryId.Linux]: {
		title: 'Linux',
		icon: 'svg:linux',
	},
	[ApplicationCategoryId.TestPages]: {
		title: '测试',
		icon: 'svg:test-tube',
	},
};

export const ApplicationRoutes: ExtendedRoutes = [
	{
		path: ApplicationCategoryId.Linux + '/' + ApplicationId.LvmCacheCalc,
		loadChildren: () =>
			import(
				`../pages/${ApplicationCategoryId.Linux}/${ApplicationId.LvmCacheCalc}/${ApplicationId.LvmCacheCalc}.module`
			).then((m) => m.LvmCacheCalcModule),
		data: {
			title: 'LVM缓存计算器',
			icon: 'svg:harddisk',
		},
	},
	{
		path: ApplicationCategoryId.Files + '/' + ApplicationId.Hash,
		loadChildren: () => {
			return import(
				`../pages/${ApplicationCategoryId.Files}/${ApplicationId.Hash}/${ApplicationId.Hash}.module`
			).then((m) => m[ucfirst(camelCase(ApplicationId.Hash)) + 'Module']);
		},
		data: {
			title: 'Hash计算',
			icon: 'svg:pound',
		},
	},
];
/*

	{
		path: 'files/hash',
		loadChildren: () => import('../pages/files/hash/hash.module').then((m) => m.HashModule),
		data: {
			title: 'Hash计算',
			icon: 'svg:pound',
		},
	},
	*/
