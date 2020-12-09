import { dirname, resolve } from 'path';
import { buildContext } from '@build-script/builder';
import {
	myselfPath,
	sourceProjectConfigFile,
	watchOutputFinal as watchOutputLV3,
	watchOutputLV2,
} from '../inc/buildScriptContext';

// 第四步，运行rollup(监视)分析临时index.js，生成最终结果(依赖项目)

buildContext.registerAlias('tools:watch-rollup', process.argv0, [
	resolve(myselfPath, 'rollup/rollup-watch-main.js'),
	'--from=' + watchOutputLV2,
	'--to',
	watchOutputLV3,
	'--smr',
	dirname(sourceProjectConfigFile),
]);
buildContext.addAction('watch', ['tools:watch-rollup']);
