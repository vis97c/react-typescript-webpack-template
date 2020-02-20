/** @format */
require("intersection-observer");
require("es6-promise").polyfill();

require("dotenv").config({ path: ".env" });

const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV || "development";
const isProduction = mode === "production";

function pkg(m) {
	// get the name. E.g. node_modules/packageName/not/this/part.js
	// or node_modules/packageName
	const packageName = m.context
		.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
		.replace("@", "");

	// npm package names are URL-safe, but some servers don't like @ symbols
	if (packageName.includes("react")) {
		return `pkg.reactCommons`;
	}
	return `pkg.${packageName}`;
}

//webpack defaults
let config = {
	entry: {
		main: "./src/tsx/index.tsx",
	},
	resolve: {
		alias: {
			_src: path.resolve(__dirname, "src"),
			_helpers: path.resolve(__dirname, "src/tsx/helpers"),
			_reactComponents: path.resolve(__dirname, "src/tsx/components"),
			_reactIcons: path.resolve(__dirname, "src/tsx/compiled-icons"),
			_assets: path.resolve(__dirname, "src/assets"),
			_scss: path.resolve(__dirname, "src/scss"),
		},
		extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".sass", ".scss"],
	},
	output: {
		path: __dirname + "/public_html",
		filename: "js/[name].js",
		chunkFilename: "js/lazy/[name].js",
		publicPath: "/",
	},
	plugins: [],
	module: {
		rules: [
			{
				test: /\.[jt]s(x)?$/,
				exclude: /node_modules/,
				use: ["babel-loader", "ts-loader"],
			},
			{
				test: /\.css$/i,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					...(isProduction
						? [MiniCssExtractPlugin.loader, "css-loader"]
						: ["style-loader", "css-loader?sourceMap"]),
				],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					...(isProduction
						? [
								MiniCssExtractPlugin.loader,
								"css-loader",
								{
									loader: "postcss-loader",
									options: {
										plugins: () => [
											require("autoprefixer"),
											require("postcss-custom-properties")(
												{
													// importFrom: path.resolve(__dirname, "src/scss/base/_variables.scss")
												}
											),
										],
									},
								},
								"sass-loader", // Compiles Sass to CSS
						  ]
						: [
								"style-loader",
								"css-loader?sourceMap",
								"sass-loader?sourceMap",
						  ]),
				],
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "images/[name].[ext]",
						},
					},
				],
			},
			{
				test: /\.(mov|mp4|webm)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "video/[name].[ext]",
						},
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "fonts/[name].[ext]",
						},
					},
				],
			},
		],
	},
	mode,
	devtool: isProduction ? false : "source-map",
};
if (isProduction) {
	//production only
	const TerserPlugin = require("terser-webpack-plugin");
	const HtmlBeautifyPlugin = require("html-beautify-webpack-plugin");
	const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
	const PurgecssPlugin = require("purgecss-webpack-plugin");
	const glob = require("glob-all");
	config.plugins.push(
		new MiniCssExtractPlugin({
			filename: "css/[name].css",
		}),
		new PurgecssPlugin({
			paths: glob.sync(
				[
					path.join(__dirname, "./src/index.original.html"),
					path.join(__dirname, "./src/tsx/**/*"),
				],
				{
					nodir: true,
				}
			),

			whitelistPatterns: [/react-/],
		}),
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "src/index.original.html",
			hash: true,
			minify: {
				removeComments: true,
				removeEmptyElements: false,
				minifyCSS: {
					format: "beautify",
				},
			},
		}),
		new HtmlBeautifyPlugin({
			config: {
				html: {
					end_with_newline: false,
					indent_size: 2,
					indent_with_tabs: true,
					indent_inner_html: true,
					preserve_newlines: false,
				},
			},
		}),
		new CopyPlugin([
			{ from: "src/to_public/default", to: "", dot: true },
			{ from: "src/to_public/production", to: "", dot: true },
		])
	);
	module.exports = Object.assign({}, config, {
		optimization: {
			splitChunks: {
				chunks: "all",
				cacheGroups: {
					vendor: {
						test: /(node_modules|vendors).+(?<!css)$/, // eslint-disable-line no-invalid-regexp
						name: m => {
							return pkg(m);
						},
						reuseExistingChunk: true,
						enforce: true,
						chunks: "all",
						minSize: 10000,
					},
					// Split Vue chunks
					react: {
						name: m => {
							if (m.context.includes("node_modules")) {
								//	PACKAGE
								return pkg(m);
							} else if ("rawRequest" in m) {
								let moduleName = m.rawRequest.split("/");
								moduleName = moduleName[moduleName.length - 1]
									.split("?")[0]
									.split(".")[0];
								if (
									m.context.includes("src\\tsx\\components")
								) {
									// COMPONENT
									moduleName =
										moduleName.charAt(0).toLowerCase() +
										moduleName.slice(1);
									return `component.${moduleName}`;
								}
								// else if (
								// 	m.context.includes("src\\tsx\\views")
								// ) {
								// 	// VIEW, this mimics the [request] naming
								// 	let pre = String.raw`${m.context}`.replace(
								// 			/\\/gi,
								// 			"-"
								// 		),
								// 		prefix = pre.split("views-")[1] + "-";
								// 	return `view.${prefix + moduleName}-react`;
								// }
							}
							return "bundle";
						},
						test: /\.[jt]sx$/,
						reuseExistingChunk: true,
						enforce: true,
						chunks: "all",
						minSize: 0,
					},
				},
			},
			minimize: true,
			minimizer: [
				new TerserPlugin({
					cache: true,
					parallel: true,
					terserOptions: {
						output: {
							comments: false,
						},
					},
					extractComments: false,
				}),
				new OptimizeCSSAssetsPlugin({
					cssProcessor: require("cssnano"),
					cssProcessorPluginOptions: {
						preset: [
							"default",
							{
								discardComments: {
									removeAll: true,
								},
							},
						],
					},
				}),
			],
		},
	});
} else {
	//dev only
	const WebpackNotifierPlugin = require("webpack-notifier");
	config.plugins.push(
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "src/index.original.html",
			hash: true,
		}),
		new CopyPlugin([
			{ from: "src/to_public/default", to: "", dot: true },
			{ from: "src/to_public/dev", to: "", dot: true },
		]),
		new WebpackNotifierPlugin({
			title: "Webpack Build",
			contentImage: path.join(__dirname, "src/assets/logo.png"),
			alwaysNotify: true,
		})
	);
	module.exports = Object.assign({}, config, {
		devServer: {
			port: 3000,
			hot: false,
			inline: true,
			contentBase: "public_html",
			historyApiFallback: true,
			open: true,
		},
	});
}
