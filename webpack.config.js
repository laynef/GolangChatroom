module.exports = {
    mode: "development",
    watch: true,
    entry: "./assets/js/application.tsx",
    output: {
      filename: "application.js",
      path: __dirname + "/public"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".json"]
    },
    devtool: "source-map",
    module: {
      rules: [
        { test: /\.scss$/, use: [ "style-loader", "css-loader", "sass-loader" ] },
        { test: /\.tsx?$/, loader: "babel-loader" },
        { test: /\.tsx?$/, loader: "ts-loader" },
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ]
    }
 };