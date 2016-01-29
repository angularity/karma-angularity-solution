'use strict';

/* globals basePath:true, files:true, exclude:true, reporters:true, port:true, colors:true, config:true */
/* globals autoWatch:true, browsers:true, captureTimeout:true, singleRun:true, reportSlowerThan:true */
/* globals LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG */

var path = require('path'),
    fs   = require('fs');

var defaults = require('lodash.defaults');

function configFactory(options) {

  // where angularity.json is present it should define the port
  var angularityJsonPath = path.resolve('angularity.json'),
      angularityPort     = fs.existsSync(angularityJsonPath) && require(angularityJsonPath).port;

  // options set
  options = defaults(options, {
    port    : (angularityPort + 1) || 55556,
    reporter: 'spec',
    browser : 'Chrome',
    logLevel: 'LOG_INFO'
  });

  return function configuration(config) {
    config.set({
      // base path, that will be used to resolve files and exclude
      basePath: process.cwd(),

      //make sure we use karma-jasmine as the test framework
      frameworks: ['jasmine'],

      // list of files / patterns to load in the browser
      // angularity will package unit tests and append to the `files` array
      files: [
        './app-build/vendor.*.js',
        './app-build/test.*.js'
      ],

      // list of files to exclude
      exclude: [],

      // register any plugins which are not siblings of karma in angularity global
      // installation and thus need to be registered manually
      // append to existing value to preserve plugins loaded automatically
      plugins: []
        .concat(config.plugins)
        .concat(
          require('karma-sourcemap-loader'),
          require('karma-chrome-launcher'),
          require('karma-spec-reporter'),
          require('karma-teamcity-reporter'),
          require('karma-jasmine')
        ),

      // use dots reporter, as travis terminal does not support escaping sequences
      // possible values: 'dots', 'progress', 'junit', 'teamcity'
      reporters: [options.reporter],

      // web server port
      port: options.port,

      // enable / disable colors in the output (reporters and logs)
      colors: true,

      // level of logging
      // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
      logLevel: config[options.logLevel],

      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: false,

      // Start these browsers, currently available:
      // - Chrome
      // - ChromeCanary
      // - Firefox
      // - Opera
      // - Safari (only Mac)
      // - PhantomJS
      // - IE (only Windows)
      browsers: [options.browser],

      // If browser does not capture in given timeout [ms], kill it
      captureTimeout: 20000,

      // Auto run tests on start (when browsers are captured) and exit
      singleRun: true,

      // report which specs are slower than 500ms
      reportSlowerThan: 500
    });
  };
}

module.exports = configFactory;

