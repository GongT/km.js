import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

// Just return the tree
export function ngAdd(_options: any): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		return tree;
	};
}
