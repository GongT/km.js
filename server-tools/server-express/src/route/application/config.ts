export interface IPassThroughConfig extends Record<string, any> {}

/** @internal */
export const passConfig: IPassThroughConfig = {};

export function passThroughConfig(merge: IPassThroughConfig) {
	Object.assign(passConfig, merge);
}
