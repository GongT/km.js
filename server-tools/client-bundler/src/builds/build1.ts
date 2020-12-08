import { buildContext } from '@build-script/builder';
import { typescriptCompilerBin, sourceProjectConfigFile, buildOutputLV1 } from '../inc/buildScriptContext';

buildContext.registerAlias('build-ts', typescriptCompilerBin, [
	'-p',
	sourceProjectConfigFile,
	'--outDir',
	buildOutputLV1,
	'--module',
	'ESNext',
]);
buildContext.addAction('build', ['build-ts']);
