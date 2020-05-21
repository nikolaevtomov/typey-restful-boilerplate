/* eslint-disable @typescript-eslint/no-var-requires */
const { EnvironmentPlugin } = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
/* eslint-enable @typescript-eslint/no-var-requires */

const ISDEV = process.env.NODE_ENV !== 'production';
const CWD = process.cwd();

const BABEL_BASE_PRESETS = [
  [
    require.resolve('@babel/preset-env'),
    {
      modules: false,
      useBuiltIns: 'usage',
      corejs: { version: 3 },
    },
  ]
];

const BABEL_BASE_PLUGINS = [
  require.resolve('@babel/plugin-proposal-class-properties'),
  require.resolve('@babel/plugin-proposal-object-rest-spread'),
];

const BABEL_TYPESCRIPT_PRESETS = BABEL_BASE_PRESETS.concat(
  require.resolve('@babel/preset-typescript'),
);

const BABEL_TYPESCRIPT_PLUGINS = BABEL_BASE_PLUGINS.concat(
  require.resolve('babel-plugin-const-enum'),
);

module.exports = {
  target: 'node',

  mode: process.env.NODE_ENV,

  externals: [nodeExternals()],

  entry: [
    require.resolve('raf/polyfill'),
    path.resolve(CWD, 'src', 'index.ts'),
  ],

  output: {
    publicPath: path.resolve(CWD, '/'),
    path: path.resolve(CWD, 'dist'),
    filename: ISDEV ? 'bundle.js' : 'bundle.[hash].js',
  },

  devtool: ISDEV ? 'cheap-source-map' : 'cheap-module-source-map',

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.ts', '.json'],
    alias: {
      '^': path.resolve(CWD, 'src'),
    },
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              presets: BABEL_BASE_PRESETS,
              plugins: BABEL_BASE_PLUGINS,
            },
          },
        ],
      },
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              presets: BABEL_TYPESCRIPT_PRESETS,
              plugins: BABEL_TYPESCRIPT_PLUGINS,
            },
          },
        ],
      },
    ],
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          parse: {},
          compress: {},
          mangle: true,
          output: null,
          toplevel: false,
          nameCache: null,
          // eslint-disable-next-line @typescript-eslint/camelcase
          keep_fnames: false,
        },
      }),
    ],
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),

    new EnvironmentPlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
    }),

    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      cwd: CWD,
    }),
  ].concat(
    ISDEV
      ? []
      : [
          new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$/,
            threshold: 8192,
            minRatio: 0,
          }),
        ],
  ),
};


