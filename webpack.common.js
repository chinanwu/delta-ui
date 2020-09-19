const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
	entry: { app: './src/index.jsx' },
	plugins: [
		new MiniCssExtractPlugin({
			filename: './css/[name].[contenthash].css',
			chunkFilename: './css/[name].[contenthash].chunk.css',
		}),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve('./index.html'),
			favicon: path.resolve('./src/resources/favicon.ico'),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
		new CompressionPlugin({
			filename: '[path][base].gz',
			algorithm: 'gzip',
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8,
		}),
		new webpack.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
	],
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.less$/,
				use: ['style-loader', 'css-loader', 'less-loader'],
			},
			{
				test: /\.(png|svg)$/,
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

//https://linguinecode.com/post/top-webpack-plugins
