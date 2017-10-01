"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var webpack = require("webpack");
var config = {
    webpack: {
        entry: ['./src/index'],
        resolve: {
            extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx']
        },
        module: {
            rules: []
        }
    }
};
var copackInfo = {};
if (fs.existsSync('./copack.json')) {
    copackInfo = require('./copack.json');
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
//# sourceMappingURL=copack.js.map