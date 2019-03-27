// External libraries
var webpack = require("webpack");
var webpackDevServer = require("webpack-dev-server");

var config = require("../../webpack.config.js");

config.entry.app.unshift(
  "webpack-dev-server/client?http://localhost:8080/",
  "webpack/hot/dev-server"
);

console.log(config);
var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
  hot: true,
  historyApiFallback: true,
  proxy: {
    "/api": {
      target: "http://localhost:8081",
      secure: false
    }
  }
});
server.listen(8080);
