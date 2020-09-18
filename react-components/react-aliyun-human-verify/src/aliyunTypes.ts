export interface IAliyunHumanVerifyTranslate {
	readonly _ggk_guide: string;
	readonly _ggk_success: string;
	readonly _ggk_loading: string;
	readonly _ggk_fail: ReadonlyArray<string>;
	readonly _ggk_action_timeout: ReadonlyArray<string>;
	readonly _ggk_net_err: ReadonlyArray<string>;
	readonly _ggk_too_fast: ReadonlyArray<string>;
}

export interface IAliyunHumanVerifyProps {
	//应用类型标识。它和使用场景标识（scene字段）一起决定了智能验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
	appkey: string;
	//使用场景标识。它和应用类型标识（appkey字段）一起决定了智能验证的业务场景与后端对应使用的策略模型。您可以在人机验证控制台的配置管理页签找到对应的scene值，请务必正确填写。
	scene: string;
	//业务键字段，可为空。该参数可用于上线前测试，请按照代码集成后测试部分中的方法配置该字段值。
	trans?: any;
	//当唤醒刮刮卡验证作为二次验证时，配置需要刮出的两个elements的图片资源。
	elements?: [string, string];
	//当唤醒刮刮卡验证作为二次验证时，配置刮动时的背景图像（自动应用平铺填充的方式）。
	bg_back_prepared?: string;
	//当唤醒刮刮卡验证作为二次验证时，配置刮动时的前景图像（仅支持base64数据流）。
	bg_front?: string;
	//当唤醒刮刮卡验证作为二次验证时，配置验证通过时显示的图标资源。
	obj_ok?: string;
	//当唤醒刮刮卡验证作为二次验证时，配置验证通过时显示的背景图像（自动应用平铺填充的方式）。
	bg_back_pass?: string;
	//当唤醒刮刮卡验证作为二次验证时，配置验证失败或异常时显示的图标资源。
	obj_error?: string;
	//当唤醒刮刮卡验证作为二次验证时，配置验证失败或异常时显示的背景图像（自动应用平铺填充的方式）。
	bg_back_fail?: string;
	//当唤醒刮刮卡验证作为二次验证时，用于自定义文案。详细配置方法请参见自定义文案文档。
	upLang?: Record<string /* lang id */, Partial<IAliyunHumanVerifyTranslate>>;

	//智能验证组件的宽度。
	width?: number | string;
	//智能验证组件的高度。
	height?: number | string;
	//智能验证组件初始状态文案。
	default_txt?: string;
	//智能验证组件验证通过状态文案。
	success_txt?: string;
	//智能验证组件验证失败（拦截）状态文案。
	fail_txt?: string;
	//智能验证组件验证中状态文案。
	scaning_txt?: string;
}

/** 验证结果，应发往服务器 */
export interface IAliyunHumanVerifyData {
	sessionId: string;
	sig: string;
	token: string;
}

/** DOM控制（和状态） */
export interface IAliyunHumanVerifySmartCaptcha {
	// 重置为未点击的状态
	reset(): void;

	// 曾经触发过验证
	readonly clicked: boolean;
	// 验证过程结束
	readonly fulfilled: boolean;
	// 验证结束并且通过
	readonly successful: boolean;

	// 设为“验证不通过”状态
	fail(): void;
	// 设为“验证成功”状态
	succeed(data: IAliyunHumanVerifyData): void;
	// 设为“网络错误”状态
	neterr(): void;
}
