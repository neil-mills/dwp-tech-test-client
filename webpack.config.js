const path = require('path');

const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const outputPath = join(process.cwd(), '/build');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const env = process.env.NODE_ENV;
module.exports = {
	entry: './src/app.ts',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					env == 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.svg$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
              encoding: false,
              esModule: true
						},
					},
				],
			},
			{ test: /\.tsx?$/, loader: 'babel-loader' },
			{ test: /\.tsx?$/, loader: 'ts-loader' },
			{ enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: outputPath,
	},
	devServer: {
		contentBase: path.join(__dirname, 'build'),
		compress: true,
		port: 8000,
		proxy: {
			'/api': 'http://localhost:9000',
		},
	},
	plugins: [
		new HtmlWebpackPlugin({ template: 'src/index.html' }),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
	],
};
