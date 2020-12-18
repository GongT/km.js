import { parseJsonText } from '@idlebox/node-json-edit';
import { SchematicsException, Tree } from '@angular-devkit/schematics';

export function requireChangeFile(tree: Tree, filePath: string) {
	const data = tree.read(filePath);
	if (!data) {
		throw new SchematicsException('丢失文件：/app/routing/routing.data.ts');
	}
	const content = data.toString('utf-8');
	const update = tree.beginUpdate(filePath);
	return { content, update };
}

export function check(tree: Tree, options: any) {
	if (options.id) {
		if (!/^[a-z][0-9a-z-]*$/.test(options.id)) {
			throw new SchematicsException(`不能接受的ID，必须符合: /^[a-z][a-z-]*$/`);
		}
	}

	const workspaceConfig = tree.read('/angular.json');
	if (!workspaceConfig) {
		throw new SchematicsException('Could not find Angular workspace configuration');
	}
	const workspaceContent = workspaceConfig.toString();
	const workspace = parseJsonText(workspaceContent);
	if (!options.project) {
		options.project = workspace.defaultProject;
	}

	const projectName = options.project as string;
	const project = workspace.projects[projectName];

	if (project.projectType !== 'application') {
		throw new SchematicsException('只能在application类型的项目里创建');
	}
	const dataFile = project.sourceRoot + '/app/routing/routing.data.ts';

	return {
		root: project.sourceRoot + '/app/pages',
		dataFile,
	};
}

export function create(tree: Tree, base: string, type: string, data: string) {
	const file = base + type + '.ts';
	if (tree.exists(file)) {
		return;
	}

	tree.create(file, data);
}
