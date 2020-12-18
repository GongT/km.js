declare var window: {
	passThroughConfig(name: string): any;
};

export function getServerPassConfig<T>(name: string, defaultValue: T): T {
	return window.passThroughConfig?.(name) ?? defaultValue;
}
