console.log('HELLO~');

import { isAbsolute, isWeb } from '@idlebox/common';
import { boundMethod } from 'autobind-decorator';
import React from 'react';

debugger;

console.log('@idlebox/common', isWeb, isAbsolute);
console.log('react', React);
console.log('react test h1s', React.createElement('h1'));

const xxx: typeof boundMethod[] = [];
for (const item of [...xxx]) {
	console.log(item);
}
