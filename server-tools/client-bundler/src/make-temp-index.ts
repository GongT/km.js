import { basename, dirname, resolve } from 'path';
import { relativePath, writeFileIfChangeSync } from '@idlebox/node';
import { mkdirSync, pathExistsSync, readFileSync, writeFileSync } from 'fs-extra';
import { requireArgument } from './inc/childProcessContext';
import { INDEX_FILE_NAME } from './inc/constants';

const lv1Dir = requireArgument('lv1');
const lv2Dir = requireArgument('lv2');
if (!pathExistsSync(lv2Dir)) {
	mkdirSync(lv2Dir);
}
const distFile = resolve(lv2Dir, INDEX_FILE_NAME);

writeFileSync(distFile, '// awaiting file create...\n');

const extend = requireArgument('extend');

const tempTSConfig = requireArgument('warpper');
writeFileIfChangeSync(
	tempTSConfig,
	JSON.stringify(
		{
			extends: './' + relativePath(dirname(tempTSConfig), extend),
			compilerOptions: {
				target: 'ESNext',
				module: 'system',
				plugins: [{ transform: require.resolve('@build-script/typescript-transformer-resolve-info') }],
				outDir: './' + relativePath(dirname(tempTSConfig), lv1Dir),
			},
		},
		null,
		4
	)
);

const ignore = resolve(tempTSConfig, '../.gitignore');
const bName = basename(tempTSConfig);
if (pathExistsSync(ignore)) {
	let ignoreData = readFileSync(ignore, 'utf-8');
	if (!ignoreData.includes(bName)) {
		if (!ignoreData.endsWith('\n')) {
			ignoreData += '\n';
		}
		ignoreData += bName + '\n';
		writeFileSync(ignore, ignoreData);
	}
} else {
	writeFileSync(ignore, ['./.gitignore', bName, ''].join('\n'));
}
