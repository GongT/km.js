import * as React from 'react';
import autobind from 'autobind-decorator';
import { IAliyunHumanVerifyData, IAliyunHumanVerifyProps, IAliyunHumanVerifySmartCaptcha } from './aliyunTypes';
import { ICodeOptions, loadAliyunScript, SmartCaptcha } from './loadScript';

interface IState {
	error?: string;
	stage1?: boolean;
}

interface IOptinalId {
	// 手动设置DOM元素的ID（可以用来自定义样式）
	id?: string;
}

export interface IAliyunHumanVerifyCallbacks {
	onSuccess?(data: IAliyunHumanVerifyData): void;
	onLoaded?(object: IAliyunHumanVerifySmartCaptcha): void;
	onFailed?(): void;
}
/** 阿里云机器人验证组件（Class Component） */
export class AliyunHumanVerify extends React.Component<
	IAliyunHumanVerifyCallbacks & IOptinalId & IAliyunHumanVerifyProps,
	IState
> {
	state: IState = {};
	private verifyObject: any;
	private readonly ID: string;
	private ref: HTMLDivElement | null = null;
	private cloneProps: IAliyunHumanVerifyProps;

	private static instanceExists = false;

	constructor(props: IOptinalId & IAliyunHumanVerifyProps) {
		super(props);

		this.cloneProps = { ...this.props };
		if (!this.cloneProps.width) this.cloneProps.width = '100%';
		if (!this.cloneProps.height) this.cloneProps.height = 42;
		this.ID = props.id || `aliyunverify_${Date.now()}_${(1000000 * Math.random()).toFixed(0)}`;
	}

	componentDidMount() {
		if (AliyunHumanVerify.instanceExists) {
			this.setState({ error: '阿里云验证码组件 同时只允许一个', stage1: false });
			return;
		}
		AliyunHumanVerify.instanceExists = true;
		loadAliyunScript({ width: '100%', ...this.cloneProps, renderTo: '#' + this.ID })
			.then(this.createVerify)
			.catch((e) => {
				this.setState({ error: e.message, stage1: false });
			});
	}

	@autobind
	private createVerify(options: ICodeOptions) {
		this.verifyObject = new SmartCaptcha({
			...options,
			success: (data) =>
				this.props.onSuccess?.({
					...data,
					token: (window as any)['NVC_Opt'].token,
				}),
			fail: this.props.onFailed,
		});
		this.props.onLoaded?.(this.verifyObject);

		this.verifyObject.init();
		this.setState({ error: '', stage1: true });

		// Object.assign(window, { __test: this.verifyObject });
	}

	componentWillUnmount() {
		AliyunHumanVerify.instanceExists = false;
		if (this.ref) {
			this.ref.querySelector('div')?.remove();
		}
	}

	shouldComponentUpdate(_nextProps: any, nextState: any) {
		return this.state !== nextState;
	}

	render() {
		return (
			<div id={this.ID} className="AliyunHumanVerifyCaptcha" ref={(ref) => (this.ref = ref)}>
				<span
					className="placeholder"
					style={{
						height: this.cloneProps.height,
						width: this.cloneProps.width,
						display: this.state.stage1 ? 'none' : 'inline-block',
					}}
				>
					{this.state.error ? this.state.error : this.state.stage1 ? '' : 'Verify Code is Loading...'}
				</span>
			</div>
		);
	}
}
