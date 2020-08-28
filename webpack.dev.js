const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		proxy: {
			'/api': 'http://localhost:5000',
		},
		historyApiFallback: { disableDotRule: true },
	},
});
