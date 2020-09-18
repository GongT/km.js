import * as React_2 from 'react';

/** 阿里云机器人验证组件（Class Component） */
export declare class AliyunHumanVerify extends React_2.Component<IAliyunHumanVerifyCallbacks & IOptinalId & IAliyunHumanVerifyProps, IState> {
    state: IState;
    private verifyObject;
    private readonly ID;
    private ref;
    private cloneProps;
    private static instanceExists;
    constructor(props: IOptinalId & IAliyunHumanVerifyProps);
    componentDidMount(): void;
    private createVerify;
    componentWillUnmount(): void;
    shouldComponentUpdate(_nextProps: any, nextState: any): boolean;
    render(): JSX.Element;
}

/** 删除验证码相关数据，可以回收少量内存 */
export declare function cleanupAliyunScript(): void;

export declare interface IAliyunHumanVerifyCallbacks {
    onSuccess?(data: IAliyunHumanVerifyData): void;
    onLoaded?(object: IAliyunHumanVerifySmartCaptcha): void;
    onFailed?(): void;
}

/** 验证结果，应发往服务器 */
export declare interface IAliyunHumanVerifyData {
    sessionId: string;
    sig: string;
    token: string;
}

export declare interface IAliyunHumanVerifyProps {
    appkey: string;
    scene: string;
    trans?: any;
    elements?: [
        string,
        string
    ];
    bg_back_prepared?: string;
    bg_front?: string;
    obj_ok?: string;
    bg_back_pass?: string;
    obj_error?: string;
    bg_back_fail?: string;
    upLang?: Record<string, Partial<IAliyunHumanVerifyTranslate>>;
    width?: number | string;
    height?: number | string;
    default_txt?: string;
    success_txt?: string;
    fail_txt?: string;
    scaning_txt?: string;
}

/** DOM控制（和状态） */
export declare interface IAliyunHumanVerifySmartCaptcha {
    reset(): void;
    readonly clicked: boolean;
    readonly fulfilled: boolean;
    readonly successful: boolean;
    fail(): void;
    succeed(data: IAliyunHumanVerifyData): void;
    neterr(): void;
}

export declare interface IAliyunHumanVerifyTranslate {
    readonly _ggk_guide: string;
    readonly _ggk_success: string;
    readonly _ggk_loading: string;
    readonly _ggk_fail: ReadonlyArray<string>;
    readonly _ggk_action_timeout: ReadonlyArray<string>;
    readonly _ggk_net_err: ReadonlyArray<string>;
    readonly _ggk_too_fast: ReadonlyArray<string>;
}

export declare interface ICodeOptions {
    ___mix: never;
    success?(data: IAliyunHumanVerifyData): void;
    fail?(): void;
}

declare interface IOptinalId {
    id?: string;
}

declare interface IState {
    error?: string;
    stage1?: boolean;
}

/** 载入验证码所需脚本 */
export declare function loadAliyunScript(props: IAliyunHumanVerifyProps & WithRender): Promise<ICodeOptions>;

declare interface WithRender {
    renderTo: string;
}

export { }
