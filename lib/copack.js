"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var yargs_1 = require("yargs");
var appDirectory = fs.realpathSync(process.cwd());
exports.resolveApp = function (relativePath) { return path.resolve(appDirectory, relativePath); };
var config = {
    webpack: {
        entry: [exports.resolveApp('src/index')],
        resolve: {
            extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx']
        },
        output: {
            path: exports.resolveApp('build'),
            filename: 'static/js/bundle.js',
        },
        module: {
            rules: []
        }
    }
};
var copackInfo = {};
var copackFile = exports.resolveApp('copack.json');
if (fs.existsSync(copackFile)) {
    copackInfo = require(copackFile);
}
else {
}
if (copackInfo.boilers && copackInfo.boilers.length) {
    var boilers = copackInfo.boilers.map(function (name) { return require(name); })
        .sort(function (a, b) { return (a.order || 500) - (b.order || 500); });
    for (var _i = 0, boilers_1 = boilers; _i < boilers_1.length; _i++) {
        var boiler = boilers_1[_i];
        config = boiler.configure(config);
    }
}
var compiler = webpack(config.webpack);
if (yargs_1.argv.build) {
    compiler.run(function (err, stats) {
        if (err) {
            console.log(err);
        }
        if (stats.hasErrors()) {
            console.log(stats.toString());
        }
        if (stats.hasWarnings()) {
            console.log(stats.toString());
        }
    });
}
else if (yargs_1.argv.start) {
    var port = 3000;
    var host = 'localhost';
    var devServer = new WebpackDevServer(compiler, { publicPath: "http://" + host + ":" + port });
    devServer.listen(port, host, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}
//# sourceMappingURL=copack.js.map