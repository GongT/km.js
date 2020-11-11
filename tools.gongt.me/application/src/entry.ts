console.log('HELLO~');

import { isAbsolute, isWeb, MapLike } from '@idlebox/common';
import React from 'react';

const r: MapLike<string> = {};
console.log('HELLO', isWeb, isAbsolute, React.createElement('h1'), r);
