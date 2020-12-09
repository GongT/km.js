export interface IPassThroughConfig extends Record<string, any> {}

/** @internal */
export const passConfig: IPassThroughConfig = {};

export function passThroughConfig(name: string, value: any): void;
export function passThroughConfig(merge: IPassThroughConfig): void;

export function passThroughConfig(merge: IPassThroughConfig | string, value?: any) {
	if (arguments.length === 1) {
		Object.assign(passConfig, merge);
	} else {
		passConfig[merge as string] = value;
	}
}
