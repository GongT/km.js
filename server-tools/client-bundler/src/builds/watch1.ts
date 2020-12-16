import { resolve } from 'path';
import { buildContext } from '@build-script/builder';
import {
	myselfPath,
	sourceProjectConfigFile,
	sourceProjectConfigFileWrapper,
	watchOutputLV1,
} from '../inc/buildScriptContext';

// 第一步

buildContext.prefixAction('watch', ['prewatch'] as any);
buildContext.addAction('prewatch', ['tools:watch-import-loader:prepare']);

buildContext.registerAlias('tools:watch-import-loader:prepare', process.argv0, [
	resolve(myselfPath, 'create-tsconfig'),
	`--lv1=${watchOutputLV1}`,
	`--extend=${sourceProjectConfigFile}`,
	`--warpper=${sourceProjectConfigFileWrapper}`,
]);
