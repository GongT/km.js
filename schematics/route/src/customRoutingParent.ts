import { SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import { camelCase, escapeRegExp, ucfirst } from '@idlebox/common';
import { check } from './lib';
import { RegexInserter } from './regexInserter';

interface ICategoryOptions {
	title: string;
	id: string;
	icon?: string;
}

export function customRoutingParent(opt: ICategoryOptions) {
	const { title, id, icon } = opt;
	const cc = ucfirst(camelCase(id));

	return (tree: Tree, _context: SchematicContext) => {
		const { dataFile } = check(tree, opt);
		const regReplace = new RegexInserter(tree, dataFile);

		regReplace.insert(/const enum ApplicationCategoryId {([^}]*?)}/, (m0, body) => {
			const exists = body.split('\n').find((item) => {
				return new RegExp('^' + escapeRegExp(cc) + '\\s*=').test(item.trim());
			});
			if (exists) {
				throw new SchematicsException(`ID 重复(${cc})`);
			}
			return {
				offset: m0.indexOf('{'),
				content: `\n\t${cc} = ${JSON.stringify(id)},`,
			};
		});

		regReplace.insert(/export const ApplicationMenuCategorys[^}]*?}/, (m0) => {
			return {
				offset: m0.indexOf('{'),
				content: `
	[ApplicationCategoryId.${cc}]: {
		title: ${JSON.stringify(title)},
		icon: ${JSON.stringify(icon)},
	},`,
			};
		});

		regReplace.commit();

		return tree;
	};
}
