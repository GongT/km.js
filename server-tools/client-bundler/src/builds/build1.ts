import { buildContext } from '@build-script/builder';
import { getBuildContextConstant } from '../inc/buildScriptContext';

const { typescriptCompilerBin, sourceProjectConfigFile, buildOutputLV1 } = getBuildContextConstant();

buildContext.registerAlias('build-ts', typescriptCompilerBin, [
	'-p',
	sourceProjectConfigFile,
	'--outDir',
	buildOutputLV1,
	'--module',
	'ESNext',
]);
buildContext.addAction('build', ['build-ts']);
