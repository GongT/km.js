import { resolve } from 'path';
import { buildContext } from '@build-script/builder';
import { watchOutputLV1, watchOutputLV2, myselfPath } from '../inc/buildScriptContext';

// 第三步，根据importmap生成临时index.js给rollup用

buildContext.registerAlias('tools:watch-import-loader', process.argv0, [
	resolve(myselfPath, './make-dependencies-index'),
	`--lv1=${watchOutputLV1}`,
	`--lv2=${watchOutputLV2}`,
]);
buildContext.addAction('watch', ['tools:watch-import-loader']);
