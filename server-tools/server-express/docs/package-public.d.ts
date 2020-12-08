/// <reference types="node" />
import { Application } from 'express';
import { Handler } from 'express';
import { Request } from 'express';
import { Response } from 'express';
import { Router } from 'express';
import { Server } from 'http';
import { ServeStaticOptions } from 'serve-static';

export declare const clientNamespace: PackageRegister;

export declare function createApplication(): Application;

export declare function createCommonOptions(resourceType: ResourceType, mime: string, fallthrough?: boolean): ServeStaticOptions;

export declare abstract class ExpressServer {
    private server?;
    private app?;
    readonly isDev: boolean;
    private started;
    private connections;
    constructor();
    private _create_base;
    startServe(): Promise<void>;
    private listen;
    shutdown(rejectOnError?: boolean): Promise<void>;
    get httpServer(): Server | undefined;
    protected serveHtml(req: Request, res: Response): void;
    protected abstract configureServer(): IServerConfig;
    protected abstract configureClient(): IClientConfig;
    protected abstract init(express: Application): void;
}

declare class FileRegister {
    private readonly rootUrl;
    private readonly _reset;
    private config;
    constructor(packageId: string, rootUrl: string, _reset: Function);
    asScopeFolder(): this;
    fromFilesystem(fileAbs: string, overwriteConfig?: ServeStaticOptions): this;
    throughUrl(middleUrl: string): this;
    withHttpConfig(serveConfig: ServeStaticOptions): this;
    getMount(): string;
    getUrl(): string;
    private __get;
}

export declare function getApplicationRouter(): Router;

export declare function getBuildMap(): IImportMap;

export declare interface IClientConfig extends Record<string, any> {
    entryFile?: string;
    STATIC_URL?: string;
}

export declare interface IImportMap {
    imports: Record<string, string>;
    config: any;
}

export declare interface IPassThroughConfig extends Record<string, any> {
}

declare interface IProvideFs {
    path: string;
    options: ServeStaticOptions;
}

declare interface IServeParam {
    mountpoint: string;
    paths: IProvideFs[];
}

export declare interface IServerConfig {
    listenPort?: string | number;
    viewEngine?: string;
    viewPath?: string;
    applicationRootUrl?: string;
    preloadHtml?: string;
    preloadHtmlFile?: string;
}

export declare function loadServerAsChildProcess(serverProgram: string): () => Promise<void>;

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

declare class PackageRegister {
    private readonly map;
    private serveConfig;
    private rootUrl;
    private _cache?;
    /**
     * module("react").from("/path/to/react.js");
     */
    serveModule(packageId: string): FileRegister;
    mountTo(rootUrl: string): this;
    config(serveConfig: ServeStaticOptions): this;
    private _create;
    getImportMap(): IImportMap;
    getRouteInfo(): IServeParam[];
}

export declare function passThroughConfig(merge: IPassThroughConfig): void;

export declare function reloadRouter(): void;

export declare function renderDefaultHtml(options: Record<string, any>): string;

export declare enum ResourceType {
    Dynamic = 0,
    ThirdParty = 1,
    Application = 2,
    Assets = 3
}

export declare function terminate404(message?: string, extraData?: string): Handler;

export declare function terminate404Js(script: string): Handler;

export { }
