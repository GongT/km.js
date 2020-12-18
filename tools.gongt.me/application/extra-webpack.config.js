const { DefinePlugin } = require('webpack');

module.exports = {
	module: {
		rules: [
			{
				test: /@idlebox\/.*\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [['@babel/preset-env', { targets: 'defaults' }]],
						plugins: ['@babel/plugin-proposal-class-properties'],
					},
				},
			},
		],
	},
};
