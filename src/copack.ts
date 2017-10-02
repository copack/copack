import * as fs from 'fs';
import * as path from 'path';
import * as webpack from 'webpack';

import * as WebpackDevServer from 'webpack-dev-server';

import {argv} from 'yargs';

const appDirectory = fs.realpathSync(process.cwd());
export const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);

let config = {
  webpack: {
    entry: [resolveApp('src/index')],
    resolve: {
      extensions: ['.web.js', '.js', '.json', '.web.jsx', '.jsx']
    },
    output: {
      path: resolveApp('build'),
      filename: 'static/js/bundle.js',
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
let copackFile = resolveApp('copack.json');
if (fs.existsSync(copackFile)) {
  copackInfo = require(copackFile);
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

if (argv.build) {
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
} else if (argv.start) {
  const port = 3000;
  const host = 'localhost';
  const devServer = new WebpackDevServer(compiler, { publicPath: `http://${host}:${port}` });
  
  devServer.listen(port, host, err => {
    if (err) {
      return console.log(err);
    }
  })
}

