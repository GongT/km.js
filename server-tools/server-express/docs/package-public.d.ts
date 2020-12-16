/// <reference types="node" />
import { Application } from 'express';
import { Handler } from 'express';
import { IRouter } from 'express';
import { Request } from 'express';
import { Response } from 'express';
import { Server } from 'http';
import { ServeStaticOptions } from 'serve-static';

export declare class ClientGlobalRegister {
    private readonly router;
    readonly appBaseUrl: string;
    constructor(app: Application);
    map(specifier: string, url: string, fsPath: string, options: ServeStaticOptions): void;
    serve(url: string, fsPath: string, options: ServeStaticOptions): void;
    createScope(scopeUrl: string): ClientScopeRegister;
    finalize(cdn?: string): IImportMap;
}

export declare class ClientScopeRegister {
    private readonly router;
    private readonly scope;
    readonly scopeUrl: string;
    constructor(parent: IRouter, scopeUrl: string);
    mapOnly(specifier: string, url: string): void;
    map(specifier: string, url: string, fsPath: string, options: ServeStaticOptions): void;
    serve(url: string, fsPath: string, options: ServeStaticOptions): void;
}

export declare function contributePageBodyClass(classNames: string): void;

export declare function contributePageHtml(fn: IContribution): void;

export declare function contributeScriptTag(url: string): void;

export declare function createApplication(): Application;

export declare function createCommonOptions(resourceType: ResourceType, mime: string, fallthrough?: boolean): ServeStaticOptions;

export declare function createImportScope(path: string): Record<string, string>;

export declare const DEFAULT_APPLICATION_ROOT = "/__application__";

export declare const DEFAULT_STATIC_ROOT = "/__static__";

export declare enum ExpressConfigKind {
    RootStatic = "staticUrl",
    RootApplication = "applicationUrl",
    RoutingCaseSensitive = "case sensitive routing",
    RoutingStrictFolder = "strict routing",
    ResponseJsonEscape = "json escape",
    ResponseJsonSpaces = "json spaces",
    RequestParser = "query parser",
    RequestTrustProxy = "trust proxy"
}

export declare abstract class ExpressServer {
    protected readonly server: Server;
    protected readonly app: Application;
    protected client: ClientGlobalRegister;
    readonly isDev: boolean;
    private started;
    private stopped;
    private connections;
    readonly listenPort: number;
    constructor();
    protected set(name: ExpressConfigKind, value: any): void;
    startServe(): Promise<void>;
    private listen;
    shutdown(rejectOnError?: boolean): Promise<void>;
    get httpServer(): Server;
    protected serveHtml(req: Request, res: Response): void;
    protected abstract configureApplication?(): IApplicationConfig | Promise<IApplicationConfig>;
    protected abstract initialize(): void | Promise<void>;
}

export declare type IApplicationConfig = {
    [k in ExpressConfigKind]?: any;
};

export declare interface IContribution {
    head?(request: Request, locals: any, globalStorage: Record<string, any>): string;
    headString?: string;
    body?(request: Request, locals: any, globalStorage: Record<string, any>): string;
    bodyString?: string;
}

export declare interface IImportMap {
    imports: ImportRecord;
    scopes: Record<string, ImportRecord>;
    depcache: Record<string, string[]>;
    config: any;
}

declare type ImportRecord = Record<string, string>;

export declare interface IPassThroughConfig extends Record<string, any> {
}

export declare function loadServerAsChildProcess(serverProgram: string): () => Promise<void>;

export declare function mapDependencyCache(url: string, deps: string[]): void;

export declare const MIME_HTML_UTF8 = "text/html; charset=utf-8";

export declare const MIME_IMPORTMAP_JSON_UTF8 = "application/importmap+json";

export declare const MIME_JAVASCRIPT_UTF8 = "application/javascript; charset=utf-8";

export declare const MIME_JSON_UTF8 = "text/json; charset=utf-8";

export declare const MIME_STYLESHEET_UTF8 = "text/css; charset=utf-8";

export declare const oneDay: number;

export declare const oneHour: number;

export declare const oneMonth: number;

export declare const oneWeek: number;

export declare const oneYear: number;

export declare function onServerStartListen(): void;

export declare function passThroughConfig(name: string, value: any): void;

export declare function passThroughConfig(merge: IPassThroughConfig): void;

export declare function preloadHtmlFromFile(file: string): void;

export declare function preloadHtmlString(html: string): void;

export declare function registerGlobalMapping(specifier: string, url: string): void;

export declare function renderHtml(request: Request, locals: any, options: Record<string, any>): string;

export declare enum ResourceType {
    /** must change every request */
    Dynamic = 0,
    /** not change for long time */
    ThirdParty = 1,
    /** may change any time */
    Application = 2,
    /** file with version in it's name */
    Assets = 3,
    /** cache with revalidate */
    DebugResource = 4
}

export declare function serveFavicon(app: Application, url: string, fsPath: string): void;

export declare function serveImportMap(appUrlRoot?: string): Handler & WithReload & WithImportMap;

export declare function terminate404(message?: string, extraData?: string): Handler;

export declare function terminate404Js(script: string): Handler;

declare interface WithImportMap {
    importMap: IImportMap;
}

declare interface WithReload {
    reload(root?: string): void;
}

export { }
