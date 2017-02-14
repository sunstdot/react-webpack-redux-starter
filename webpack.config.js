const webpack = require("webpack");
const path = require("path");

//编译后自动打开浏览器
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
//将样式抽取成独立的文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const autoprefixer = require('autoprefixer');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';
//设置文件目录路径
const sourcePath = path.join(__dirname,'./client');
const staticPath = path.join(__dirname,'./static');

const plugins = [
	new webpack.optimize.CommonsChunkPlugin({
		name:'vendor',
		minChunks:Infinity,
		filename:'vendor.bundle.js'
	}),
	new webpack.DefinePlugin({
		'process.env':{NODE_ENV:JSON.stringify(nodeEnv)}
	}),
	new webpack.NamedModulesPlugin(),
	new OpenBrowserPlugin({url:'http://localhost:9090'}),
	new webpack.LoaderOptionsPlugin({
		postcss:[autoprefixer]
	}),
	new ExtractTextPlugin("main.css")
];
if(isProd){
	plugins.push(
		new webpack.LoaderOptionsPlugin({
			minimize:true,
			debug:false
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress:{
				warnings:false,
				screw_ie8:true,
				conditionals:true,
				unused:true,
				comparisons:true,
				sequences:true,
				dead_code:true,
				evaluate:true,
				if_return:true,
				join_vars:true
			},
			output:{
				comments:false
			},
		})
	);
}else{
	plugins.push(
		new webpack.HotModuleReplacementPlugin()
	);
}

module.exports = {
	context:__dirname,
	entry:{
		index:'./index.js',
		vendor:['react']	
	},
	output:{
		path:staticPath,
		filename:'[name].bundle.js'
	},
	module:{
		rules:[
			{
				test:/\.html$/,
				exclude:/node_modules/,
				use:[
				  {
				  	loader:'file-loader',
				  	query:{
				  		name:"index.html"
				  	}
				  }	
				]
			},			
			{
				test:'/\.jsx$/',
				exclude:/node_modules/,
				use:[
				   'babel-loader',
				   'babel'
				]
			},
			{
				test:/\.js?$/,
				loader:['babel'],
				exclude:/node_modules/
			},
			{
				test:/\.(gif|png|jpg)$/,
				loader:'url-loader',
				query:{
					limit:26000,
					name:'[name].[ext]?[hash]'
				}
			},
			{
				test:/\.css$/,
				loaders:ExtractTextPlugin.extract({
					fallbackLoader:"style-loader",
					loader:"css-loader"
				})
			},
			{
				test:/\.scss$/,
				loaders:['style-loader','css-loader','postcss-loader','sass-loader']
			},
			{
				test:/\.(woff2?)$/,
				loader:'url-loader?limit=10000&mimetype=application/font-woff'
			},
			{
				test:/\.(ttf|eot|svg)$/,
				loader:'file-loader'
			}
		]
	},
	resolve:{
		extensions:['.webpack-loader.js','.web-loader.js','.loader.js','.','.js','.jsx'],
		modules:[
			path.resolve(__dirname,'node_modules'),
			sourcePath
		]
	},
	plugins,
	devServer:{
		contentBase:'./',
		historyApiFallback:true,
		port:9090,
		compress:isProd,
		inline:!isProd,
		hot:!isProd,
		stats:{
			assets:true,
			children:false,
			chunks:false,
			hash:false,
			modules:false,
			publicPath:false,
			timings:true,
			version:false,
			warnings:true,
			colors:{
				green:'\u001b[32m',
			}
		}
	}
}