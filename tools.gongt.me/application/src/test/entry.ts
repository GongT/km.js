console.log('HELLO~');

import { isAbsolute, isWeb, MapLike } from '@idlebox/common';
import React from 'react';
import { boundMethod } from 'autobind-decorator';

const r: MapLike<string> = {};
console.log('HELLO', isWeb, isAbsolute, React.createElement('h1'), r);

const xxx: typeof boundMethod[] = [];
for (const item of [...xxx]) {
	console.log(item);
}
