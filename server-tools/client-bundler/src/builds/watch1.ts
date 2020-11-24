import { resolve } from 'path';
import { buildContext } from '@build-script/builder';
import { getBuildContextConstant } from '../inc/buildScriptContext';

// 第一步
// * 创建一个假的index.js，防止rollup直接报错

const {
	watchOutputLV1,
	watchOutputLV2,
	myselfPath,
	sourceProjectConfigFile,
	sourceProjectConfigFileWrapper,
} = getBuildContextConstant();

buildContext.prefixAction('watch', ['prewatch'] as any);
buildContext.addAction('prewatch', ['tools:watch-import-loader:prepare']);

buildContext.registerAlias('tools:watch-import-loader:prepare', process.argv0, [
	resolve(myselfPath, 'make-temp-index'),
	`--lv1=${watchOutputLV1}`,
	`--lv2=${watchOutputLV2}`,
	`--extend=${sourceProjectConfigFile}`,
	`--warpper=${sourceProjectConfigFileWrapper}`,
]);
