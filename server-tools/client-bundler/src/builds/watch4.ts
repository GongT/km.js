import { dirname, resolve } from 'path';
import { buildContext } from '@build-script/builder';
import { getBuildContextConstant } from '../inc/buildScriptContext';

// 第四步，运行rollup(监视)分析临时index.js，生成最终结果(依赖项目)

const {
	watchOutputLV2,
	myselfPath,
	watchOutputFinal: watchOutputLV3,
	rollupBin,
	sourceProjectConfigFile,
} = getBuildContextConstant();

buildContext.registerAlias('tools:watch-rollup', rollupBin, [
	'--config',
	resolve(myselfPath, 'rollup/rollup.config.watch.js'),
	'--watch',
	'--environment',
	`FROM:${watchOutputLV2},TO:${watchOutputLV3},SMR:${dirname(sourceProjectConfigFile)}`,
]);
buildContext.addAction('watch', ['tools:watch-rollup']);
