import { dirname, resolve } from 'path';
import { buildContext } from '@build-script/builder';
import { getBuildContextConstant } from '../inc/buildScriptContext';

const {
	rollupBin,
	buildOutputLV1,
	myselfPath,
	buildOutputFinal: buildOutputLV2,
	sourceProjectConfigFile,
} = getBuildContextConstant();

buildContext.postfixAction('build', ['tools:postbuild'] as any);
buildContext.addAction('tools:postbuild', ['tools:build-rollup']);

buildContext.registerAlias('tools:build-rollup', rollupBin, [
	'--config',
	resolve(myselfPath, 'rollup/rollup.config.build.js'),
	'--environment',
	`FROM:${buildOutputLV1},TO:${buildOutputLV2},SMR:${dirname(sourceProjectConfigFile)}`,
]);
