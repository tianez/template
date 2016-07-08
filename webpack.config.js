var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
module.exports = {
	entry: [
		path.resolve(__dirname, 'app/app.js')
	],
	output: {
		// path: path.resolve(__dirname, '../build'),
		path: __dirname,
		filename: 'app/bundle.js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/, // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
			loader: 'babel', // 加载模块 "babel" 是 "babel-loader" 的缩写
			query: {
				//添加两个presents 使用这两种presets处理js或者jsx文件
				presets: ['es2015', 'react']
			}
		}, { //css
			test: /\.css$/, // Only .css files
			loader: ExtractTextPlugin.extract("style-loader", "css-loader")
				// loader: 'style!css' // Run both loaders
		}, { // LESS
			test: /\.less$/,
			// loader: 'style!css!less'
			loader: ExtractTextPlugin.extract("style", "css!less")
		}, { // SASS
			test: /\.scss$/,
			// loader: 'style!css!sass'
			loader: ExtractTextPlugin.extract("style", "css!sass")
		}, { //图片
			test: /\.(png|jpg)$/,
			// loader: 'url?limit=25000',
			loader: 'url?limit=25000&name=dist/images/[name].[ext]',

		}]
	},
	plugins: [
			new ExtractTextPlugin("dist/css/webpack.css")
		]
		// devtool: 'source-map'
}
