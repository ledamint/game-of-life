var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src',

  output: {
    path: './dist',
    filename: '[name].js',
  },

  watch: true,

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'stage-2'],
      },
    }, {
      test: /.styl$/,
      loader: 'style-loader!css-loader!stylus-loader',
    }, {
      test: /.pug$/,
      loader: 'pug-loader',
    }],
  },

  plugins: [new HtmlWebpackPlugin({
    title: 'Life',
  }),
  ],

  devServer: {
    host: 'localhost',
    port: '3000',
    historyApiFallback: true,
  },
};
