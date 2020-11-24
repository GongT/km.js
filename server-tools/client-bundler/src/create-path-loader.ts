import { resolve } from 'path';
import { writeFileIfChangeSync } from '@idlebox/node';
import { requireArgument } from './inc/childProcessContext';

const type = requireArgument('type');
const output = requireArgument('output');
writeFileIfChangeSync(resolve(output, 'index.js'), `module.exports = require('../path-loader/${type}.js');`);
