const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: { app: './src/index.jsx' },
	plugins: [
		new MiniCssExtractPlugin({
			filename: './css/[name].css',
		}),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve('./index.html'),
			favicon: path.resolve('./src/resources/favicon.ico'),
		}),
	],
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{ test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
			{
				test: /\.(png|pdf)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'resources/',
						},
					},
				],
			},
		],
	},
};
