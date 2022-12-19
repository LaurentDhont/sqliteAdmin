const path = require('path');

module.exports = {
	mode: process.env.NODE_ENV,
	entry: {
		viewDatabases: "./react/apps/view-databases/index.jsx"
	},
	watch: true,
	output: {
		filename: "[name].js",
		path: path.join(__dirname, "public/react")
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							["@babel/preset-react", {"runtime": "automatic"}]
						],
						plugins: [
							"@babel/plugin-transform-runtime"
						]
					}
				}
			}
		]
	}
};
