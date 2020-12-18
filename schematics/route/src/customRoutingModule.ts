import { resolve } from 'path';
import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { camelCase, escapeRegExp, linux_case_hyphen, ucfirst } from '@idlebox/common';
import { check, create } from './lib';
import { RegexInserter } from './regexInserter';

interface IApplicationOptions {
	title: string;
	parent: string;
	id: string;
	icon?: string;
}

export function customRoutingModule(opt: IApplicationOptions): Rule {
	const { title, id, icon, parent } = opt;
	const ccId = ucfirst(camelCase(id));
	const ccCat = ucfirst(camelCase(parent));

	return (tree: Tree, _context: SchematicContext) => {
		const { root, dataFile } = check(tree, opt);

		const filebase = resolve(
			root,
			linux_case_hyphen(ccCat),
			linux_case_hyphen(ccId),
			linux_case_hyphen(ccId) + '.'
		);

		create(tree, filebase, 'component', ``);

		const regReplace = new RegexInserter(tree, dataFile);

		regReplace.insert(/const enum ApplicationCategoryId {([^}]*?)}/, (_, body) => {
			const exists = body.split('\n').find((item) => {
				return new RegExp('^' + escapeRegExp(ccCat) + '\\s*=').test(item.trim());
			});
			if (!exists) {
				throw new SchematicsException(`组不存在，使用[ ng g route:category --id ${parent} ] 创建一个先`);
			}
			return null;
		});
		regReplace.insert(/const enum ApplicationId {([^}]*?)}/, (m0, body) => {
			const exists = body.split('\n').find((item) => {
				return new RegExp('^' + escapeRegExp(ccId) + '\\s*=').test(item.trim());
			});
			if (exists) {
				throw new SchematicsException(`ID 重复(${ccId})`);
			}
			return {
				offset: m0.indexOf('{'),
				content: `\n\t${ccId} = ${JSON.stringify(id)},`,
			};
		});

		regReplace.insert(/const ApplicationRoutes[\S\s]*?^]|const ApplicationRoutes([^\r\n]+)\[]/m, (m0) => {
			return {
				offset: m0.indexOf('['),
				content: `
	{
		path: 'files/hash',
		loadChildren: () => import('../pages/'+ApplicationCategoryId.${ccCat}+'/'+ApplicationId.${ccId}+'/'+ApplicationId.${ccId}+'.module').then((m) => m.${ccId}Module),
		data: {
			title: ${JSON.stringify(title)},
			icon: ${JSON.stringify(icon)},
		},
	},`,
			};
		});

		regReplace.commit();

		return tree;
	};
}
