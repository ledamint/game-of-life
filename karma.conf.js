const webpackConfig = require('./webpack.config.js');

module.exports = function (config) {
  config.set({
    basePath: 'src/__tests__/',

    browsers: ['PhantomJS'],

    frameworks: ['mocha', 'sinon', 'chai'],

    files: [
      '*.js',
    ],

    reporters: ['mocha'],

    preprocessors: {
      '*.js': ['webpack'],
    },

    webpack: {
      module: webpackConfig.module,
      resolve: {
        alias: {
          sinon: 'sinon/pkg/sinon.js',
        },
      },
    },

    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-sinon-chai',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
    ],
  });
};
