import { Application } from 'express';
import { Handler } from 'express';
import { Router } from 'express';
import { ServeStaticOptions } from 'serve-static';

export declare function createApplication(): Application;

export declare function createCommonOptions(resourceType: ResourceType, mime: string, fallthrough?: boolean): ServeStaticOptions;

export declare function createPackage(middleUrl: string, serveConfig: ServeStaticOptions): PackageRegister;

export declare function getApplicationRouter(): Router;

export declare function getBuildMap(): IImportMap;

export declare interface IImportMap {
    imports: Record<string, string>;
    config: any;
}

export declare interface IPassThroughConfig extends Record<string, any> {
}

export declare interface IServeInfo {
    filePath: string;
    mountpoint?: string;
}

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

declare class PackageRegister {
    constructor(middleUrl: string, serveOptions: ServeStaticOptions);
    mapFile(url: string, file: string): void;
    mapFolder(url: string, path: string): void;
}

export declare function passThroughConfig(merge: IPassThroughConfig): void;

export declare function reloadRouter(): void;

export declare enum ResourceType {
    Dynamic = 0,
    ThirdParty = 1,
    Application = 2,
    Assets = 3
}

export declare function setApplicationRootUrl(base: string): void;

export declare function terminate404(message?: string, extraData?: string): Handler;

export { }
