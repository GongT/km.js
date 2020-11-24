import { buildContext } from '@build-script/builder';
import { getBuildContextConstant } from '../inc/buildScriptContext';

// 第二步，运行tsc，编译成systemjs，此时会产生importmap

const { typescriptCompilerBin, sourceProjectConfigFileWrapper, watchOutputLV1 } = getBuildContextConstant();

buildContext.registerAlias('watch-ts', typescriptCompilerBin, [
	'-p',
	sourceProjectConfigFileWrapper,
	'-w',
	'--outDir',
	watchOutputLV1,
	'--module',
	'system',
	'--inlineSources',
	'--preserveWatchOutput',
	'--sourceRoot',
	'./',
]);
buildContext.addAction('watch', ['watch-ts']);
