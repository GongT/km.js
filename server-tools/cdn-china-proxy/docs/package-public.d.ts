import { Router } from 'express';

export declare function cdnAddWhitelist(urls: (string | RegExp)[]): void;

export declare function cdnLoadStyles(urls: string[]): string;

export declare type ContentReplacer = (body: string) => string;

export declare interface ProxyOptions {
    contentReplacer?(body: string): string;
    proxy: string;
}

export declare function serveChinaCDNProxy(rootRouter: Router, { proxy, contentReplacer }: ProxyOptions): void;

export declare function setProxyBaseUrl(_baseUrl: string): void;

export { }
