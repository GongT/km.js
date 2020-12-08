import { buildContext } from '@build-script/builder';
import { buildTask, gulpPublishTask } from '@km.js/gulp-tools';
import { sourceProjectConfigFileWrapper, typescriptCompilerBin, watchOutputLV1 } from '../inc/buildScriptContext';

// 第二步，运行tsc，编译成systemjs，此时会产生importmap

const { watch } = buildTask({
	name: 'watch-ts:filemap',
	title: 'create tsc result filemap',
	base: watchOutputLV1,
	glob: '**/*.js',
	async action() {},
});
const createFileMap = gulpPublishTask(watch);

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
buildContext.addAction('watch', ['watch-ts', createFileMap]);
