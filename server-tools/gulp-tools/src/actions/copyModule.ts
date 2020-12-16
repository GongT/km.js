import { basename, dirname, extname, join, relative, resolve } from 'path';
import { Duplex, PassThrough } from 'stream';
import { info, warn } from 'fancy-log';
import { pathExists, pathExistsSync, readFile, readJson, stat } from 'fs-extra';
import { VinylFile } from '../tasks';

export interface ICopyModuleInput {
	/** where to save (relative to vfs root) */
	baseDirectory?: string;
	/** in vfs root, default "/" */
	vfsRoot?: string;
	/** node_modules in real fs */
	nodeModulesDir?: string;
	moduleList: IModuleCopy[];
}

export type INameFunction = (name: string, version: string) => string;

export interface IFileSpecifier {
	source: string;
	map?: string;
	fileName?: string | INameFunction;
}

export type IModuleFile = string | IFileSpecifier;

export interface IModuleCopy {
	packageName: string;
	importName?: string;
	files: IModuleFile | Record<string /* import name */, IModuleFile>;
}

async function findSourceMap(source: string) {
	if (await pathExists(source + '.map')) {
		return source + '.map';
	}
	const bbase = dirname(source) + '/' + basename(source, extname(source));
	if (await pathExists(bbase + '.map')) {
		return bbase + '.map';
	}
	return '';
}

function createName(source: string, version: string, fileName?: string | INameFunction): string {
	const ext = extname(source);
	if (fileName) {
		let r;
		if (typeof fileName === 'function') {
			r = fileName(source, version);
		} else {
			r = fileName.replace(/VERSION/, version);
		}
		if (extname(r) !== ext) {
			r += ext;
		}
		return r;
	} else {
		return basename(source, ext) + '.' + version + ext;
	}
}
function parseInput(input: IModuleFile): IFileSpecifier {
	if (typeof input === 'string') {
		return { source: input };
	} else {
		return input;
	}
}

export function gulpManualyLoadModules(opt: ICopyModuleInput): Duplex {
	const resultStream = new PassThrough({ objectMode: true });

	const node_modules = opt.nodeModulesDir || resolve(process.cwd(), 'node_modules');
	if (!pathExistsSync(node_modules)) {
		throw new Error(
			`node_modules folder did not exists (at ${node_modules}), please set {nodeModulesDir} to your node_modules path.`
		);
	}

	const vfsRoot = resolve(opt.vfsRoot || '/');
	const baseDirectory = resolve(vfsRoot, (opt.baseDirectory || '').replace(/^\/+/, ''));

	info('copy module files from %s', node_modules);

	(async function emitter() {
		const metaFile: Record<string, string> = {};
		for (const request of opt.moduleList) {
			info('    * %s', request.packageName);
			if (!request.importName) request.importName = request.packageName;

			const folder = resolve(node_modules, request.packageName);
			const version = (await readJson(resolve(folder, 'package.json'))).version;

			if (typeof request.files === 'string') {
				request.files = { '.': request.files };
			}
			if (typeof request.files === 'object' && request.files.source) {
				request.files = { '.': request.files as IModuleFile };
			}

			for (const [importPath, input] of Object.entries(request.files)) {
				const { source, map, fileName: fileNameSet } = parseInput(input);
				const fileName = createName(source, version, fileNameSet);
				const importAs = join(request.importName, importPath || '.');

				const sourcemapPath = map || (await findSourceMap(source));

				const absolute = resolve(folder, source);
				const s = await stat(absolute);

				const file = new VinylFile({
					base: vfsRoot,
					cwd: baseDirectory,
					path: resolve(baseDirectory, fileName),
					stat: s,
					contents: await readFile(absolute),
				});

				if (sourcemapPath) {
					const absolute = resolve(folder, sourcemapPath);
					const mapData = await readJson(absolute);
					mapData.file = '../' + basename(fileName);
					mapData.sources = mapData.sources.map((value: string) => {
						if (value.startsWith('/')) {
							warn(`absolute sourcemap path in package "${request.packageName}": ${value}`);
							return value;
						} else {
							const abs = resolve(absolute, '..', value);
							const rel = relative(folder, abs);
							if (rel.startsWith('..')) {
								warn(
									`none standard sourcemap path in package "${request.packageName}": out of scope (${rel})`
								);
							}
							return '/node_modules/' + request.packageName + '/' + rel;
						}
					});
					file.sourceMap = mapData;
				}

				resultStream.write(file);
				metaFile[importAs] = fileName;
			}

			resultStream.write(
				new VinylFile({
					base: vfsRoot,
					cwd: baseDirectory,
					path: resolve(baseDirectory, 'filemap.json'),
					contents: Buffer.from(JSON.stringify(metaFile, null, 4)),
				})
			);
		}
	})().then(
		() => {
			resultStream.end();
		},
		(e) => {
			resultStream.destroy(e);
		}
	);

	return resultStream;
}
