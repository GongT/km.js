import { createRequire } from 'module';
import { resolve } from 'path';
import { buildContext, getProjectDir } from '@build-script/builder';
import { findTsc, getTypescriptAt, readTsconfig } from '@km.js/gulp-tools';
import { CompilerOptions } from 'typescript';

interface BuildContextConstant {
	// rollup可执行文件
	rollupBin: string;
	// tsc可执行文件
	typescriptCompilerBin: string;
	// 源ts文件编译时所用的tsconfig.json
	sourceProjectConfigFile: string;
	// 源ts文件编译时所用的tsconfig.json的内容
	sourceProjectOptions: CompilerOptions;
	// 编译带importmap时所用的tsconfig.json
	sourceProjectConfigFileWrapper: string;
	// 使用的typescript包代替
	typescriptLibrary: string;
	// 全部构建工作使用的根目录
	buildTempDir: string;
	// 发布时tsc编译结果目录
	buildOutputLV1: string;
	// 发布时rollup结果目录
	buildOutputFinal: string;
	// 开发时tsc编译结果目录
	watchOutputLV1: string;
	// 开发时依赖处理临时目录
	watchOutputLV2: string;
	// 开发时rollup结果目录
	watchOutputFinal: string;
	// 当前项目（make）的根目录
	myselfPath: string;
}

let cache: any;

/** @internal */
export function getBuildContextConstant(): BuildContextConstant {
	if (!cache) {
		const tsconfig = resolve(getProjectDir(), buildContext.args[0] || './src/tsconfig.json');
		const library = buildContext.args[1] || 'ttypescript';

		const tsc = findTsc(getTypescriptAt(tsconfig, library));
		const { options } = readTsconfig(tsconfig, library);

		if (!options.outDir) {
			throw new Error('failed get outDir from tsconfig.json');
		}

		const require = createRequire(tsconfig);
		const rollup = require.resolve('rollup/dist/bin/rollup');

		cache = {
			rollupBin: rollup,
			typescriptCompilerBin: tsc,
			sourceProjectConfigFile: tsconfig,
			sourceProjectConfigFileWrapper: resolve(tsconfig, '../tsconfig.temp.system.json'),
			sourceProjectOptions: options,
			typescriptLibrary: library,
			myselfPath: resolve(__dirname, '..'),
			buildTempDir: options.outDir,
			buildOutputLV1: resolve(options.outDir, 'tsc-esm'),
			buildOutputFinal: resolve(options.outDir, 'production'),
			watchOutputLV1: resolve(options.outDir, 'tsc-system'),
			watchOutputLV2: resolve(options.outDir, 'import-index-temp'),
			watchOutputFinal: resolve(options.outDir, 'development'),
		};
	}
	return cache;
}
