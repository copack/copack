import * as fs from 'fs';
import * as webpack from 'webpack';

let config = {
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

interface ICopackInfo {
  boilers?: string[]
}

let copackInfo: ICopackInfo = {};

if (fs.existsSync('./copack.json')) {
  copackInfo = require('./copack.json');
} else {
  
}

if (copackInfo.boilers && copackInfo.boilers.length) {
  let boilers = copackInfo.boilers.map(name => require(name))
    .sort((a, b) => (a.order || 500) - (b.order || 500));

  for (let boiler of boilers) {
    config = boiler.configure(config);
  }
}

let compiler = webpack(config.webpack);

compiler.run((err, stats) => {
  if (err) {
    console.log(err);
  }

  if (stats.hasErrors()) {
    console.log(stats.toString());
  }

  if (stats.hasWarnings()) {
    console.log(stats.toString());
  }
})
