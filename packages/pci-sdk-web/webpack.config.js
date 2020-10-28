const webpack = require('webpack');
const path = require("path");

module.exports = (env, argv) => {
	return {
		entry: {
			index: path.resolve(__dirname, "./src/index.ts")
		},
		output: {
			path: path.resolve(__dirname, "./dist/umd"), // builds to ./dist/umd/
			filename: "apto-pci-sdk.js", // index.js
			library: "AptoPCISdk", // aka window.myLibrary
			libraryTarget: "umd", // supports commonjs, amd and web browsers
			globalObject: "this"
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
					options: {
						configFile: 'tsconfig.esm.json'
					},
				},
			],
		},
		node: {
			fs: 'empty',
		},
		mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			}),
		]
	};
};
