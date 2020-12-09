export const DEFAULT_STATIC_ROOT = '/__static__';
export const DEFAULT_APPLICATION_ROOT = '/__application__';

export enum ExpressConfigKind {
	RootStatic = 'staticUrl',
	RootApplication = 'applicationUrl',
	RoutingCaseSensitive = 'case sensitive routing',
	RoutingStrictFolder = 'strict routing',
	ResponseJsonEscape = 'json escape',
	ResponseJsonSpaces = 'json spaces',
	RequestParser = 'query parser',
	RequestTrustProxy = 'trust proxy',
}

/** @internal */
export const defaultOpts = {
	[ExpressConfigKind.RootStatic]: DEFAULT_STATIC_ROOT,
	[ExpressConfigKind.RootApplication]: DEFAULT_APPLICATION_ROOT,
	[ExpressConfigKind.RoutingCaseSensitive]: true,
	[ExpressConfigKind.RoutingStrictFolder]: true,
	[ExpressConfigKind.ResponseJsonEscape]: false,
	[ExpressConfigKind.ResponseJsonSpaces]: 4,
	[ExpressConfigKind.RequestParser]: 'extended',
	[ExpressConfigKind.RequestTrustProxy]: true,
};
