## API Report File for "@km.js/react-aliyun-human-verify"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import * as React_2 from 'react';

// Warning: (ae-forgotten-export) The symbol "IOptinalId" needs to be exported by the entry point _export_all_in_one_index.d.ts
// Warning: (ae-forgotten-export) The symbol "IState" needs to be exported by the entry point _export_all_in_one_index.d.ts
// Warning: (ae-missing-release-tag) "AliyunHumanVerify" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export class AliyunHumanVerify extends React_2.Component<IAliyunHumanVerifyCallbacks & IOptinalId & IAliyunHumanVerifyProps, IState> {
    constructor(props: IOptinalId & IAliyunHumanVerifyProps);
    // (undocumented)
    componentDidMount(): void;
    // (undocumented)
    componentWillUnmount(): void;
    // (undocumented)
    render(): JSX.Element;
    // (undocumented)
    shouldComponentUpdate(_nextProps: any, nextState: any): boolean;
    // (undocumented)
    state: IState;
    }

// Warning: (ae-missing-release-tag) "cleanupAliyunScript" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export function cleanupAliyunScript(): void;

// Warning: (ae-missing-release-tag) "IAliyunHumanVerifyCallbacks" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface IAliyunHumanVerifyCallbacks {
    // (undocumented)
    onFailed?(): void;
    // (undocumented)
    onLoaded?(object: IAliyunHumanVerifySmartCaptcha): void;
    // (undocumented)
    onSuccess?(data: IAliyunHumanVerifyData): void;
}

// Warning: (ae-missing-release-tag) "IAliyunHumanVerifyData" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export interface IAliyunHumanVerifyData {
    // (undocumented)
    sessionId: string;
    // (undocumented)
    sig: string;
    // (undocumented)
    token: string;
}

// Warning: (ae-missing-release-tag) "IAliyunHumanVerifyProps" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface IAliyunHumanVerifyProps {
    // (undocumented)
    appkey: string;
    // (undocumented)
    bg_back_fail?: string;
    // (undocumented)
    bg_back_pass?: string;
    // (undocumented)
    bg_back_prepared?: string;
    // (undocumented)
    bg_front?: string;
    // (undocumented)
    default_txt?: string;
    // (undocumented)
    elements?: [
        string,
        string
    ];
    // (undocumented)
    fail_txt?: string;
    // (undocumented)
    height?: number | string;
    // (undocumented)
    obj_error?: string;
    // (undocumented)
    obj_ok?: string;
    // (undocumented)
    scaning_txt?: string;
    // (undocumented)
    scene: string;
    // (undocumented)
    success_txt?: string;
    // (undocumented)
    trans?: any;
    // (undocumented)
    upLang?: Record<string, Partial<IAliyunHumanVerifyTranslate>>;
    // (undocumented)
    width?: number | string;
}

// Warning: (ae-missing-release-tag) "IAliyunHumanVerifySmartCaptcha" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export interface IAliyunHumanVerifySmartCaptcha {
    // (undocumented)
    readonly clicked: boolean;
    // (undocumented)
    fail(): void;
    // (undocumented)
    readonly fulfilled: boolean;
    // (undocumented)
    neterr(): void;
    // (undocumented)
    reset(): void;
    // (undocumented)
    succeed(data: IAliyunHumanVerifyData): void;
    // (undocumented)
    readonly successful: boolean;
}

// Warning: (ae-missing-release-tag) "IAliyunHumanVerifyTranslate" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface IAliyunHumanVerifyTranslate {
    // (undocumented)
    readonly _ggk_action_timeout: ReadonlyArray<string>;
    // (undocumented)
    readonly _ggk_fail: ReadonlyArray<string>;
    // (undocumented)
    readonly _ggk_guide: string;
    // (undocumented)
    readonly _ggk_loading: string;
    // (undocumented)
    readonly _ggk_net_err: ReadonlyArray<string>;
    // (undocumented)
    readonly _ggk_success: string;
    // (undocumented)
    readonly _ggk_too_fast: ReadonlyArray<string>;
}

// Warning: (ae-missing-release-tag) "ICodeOptions" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ICodeOptions {
    // (undocumented)
    ___mix: never;
    // (undocumented)
    fail?(): void;
    // (undocumented)
    success?(data: IAliyunHumanVerifyData): void;
}

// Warning: (ae-forgotten-export) The symbol "WithRender" needs to be exported by the entry point _export_all_in_one_index.d.ts
// Warning: (ae-missing-release-tag) "loadAliyunScript" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export function loadAliyunScript(props: IAliyunHumanVerifyProps & WithRender): Promise<ICodeOptions>;


// (No @packageDocumentation comment for this package)

```