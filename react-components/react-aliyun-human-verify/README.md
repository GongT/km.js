# react-aliyun-human-verify

阿里云机器人验证组件

## 参数和 API
[docs/package-public.d.ts](docs/package-public.d.ts)


## 相关
* [@km.js/react-captcha](https://www.npmjs.com/package/@km.js/react-captcha)
* [react-google-recaptcha](https://www.npmjs.com/package/react-google-recaptcha)

## 示例

```jsx
import { AliyunHumanVerify } from '@km.js/react-aliyun-human-verify';

class MyComp extends React.Component {
	render() {
		return (
			<div>
				<AliyunHumanVerify
					appkey="XXXXXXXXX0000000000"
					scene="ic_login"
					onSuccess={() => this.onSuccess()}
					onLoaded={(ref) => (this.cc = ref)}
					onFailed={() => this.onFailed()}
				/>
				<button onClick={this.cc.reset()}>RESET</button>
			</div>
		);
	}

	onSuccess(data) {
		// do anything you want
	}

	onFailed() {
		alert('江南皮革厂倒闭了！');
	}
}
```
