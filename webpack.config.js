const path = require( 'path' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

// Set different CSS extraction for editor only and common block styles
const blocksCSSPlugin = new ExtractTextPlugin( {
  filename: './dist/block.style.css',
} );
const editBlocksCSSPlugin = new ExtractTextPlugin( {
  filename: './dist/block.editor.css',
} );

// Configuration for the ExtractTextPlugin.
const extractConfig = {
  use: [
    { loader: 'raw-loader' },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [ require( 'autoprefixer' ) ],
      },
    },
    {
      loader: 'sass-loader',
      query: {
        outputStyle:
          'production' === process.env.NODE_ENV ? 'compressed' : 'nested',
			},
    },
  ],
};
let plugins = [
  blocksCSSPlugin,
  editBlocksCSSPlugin,
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery'
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
];

if ('production' === process.env.NODE_ENV) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false
      }
    }),
  );
}

const config = {
  entry: {
    './dist/block.editor' : './src/block.js',
    './dist/block.frontend' : './src/frontend.js',
  },
  output: {
    path: path.resolve( __dirname ),
    filename: '[name].js',
  },
  watch: true,
  externals: {'jquery': 'jQuery'},
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src/"),
          path.resolve(__dirname, "node_modules/foundation-sites"),
        ],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /style\.s?css$/,
        use: blocksCSSPlugin.extract( extractConfig ),
      },
      {
        test: /editor\.s?css$/,
        use: editBlocksCSSPlugin.extract( extractConfig ),
      },
    ],
  },
  plugins: plugins,
};

if ('production' !== process.env.NODE_ENV) {
  config.devtool = 'cheap-eval-source-map';
}

module.exports = config;
