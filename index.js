'use strict';

const DEFAULT_OPTIONS = {
  port      : 55556,
  reporter  : 'spec',
  browser   : 'Chrome',
  logLevel  : 'LOG_INFO',
  watch     : false,
  buildDir  : './app-build',
  testDir   : './app-test',
  releaseDir: './app-release'
};

var merge = require('merge-env');

var getDirectoriesExcluding = require('./lib/get-directories-excluding');

/**
 * Create a Karma configuration function.
 * @param {...object} [options] Any number of options hashes to be merged
 * @returns {function(object)} A karma configuration function
 */
function configFactory(options) {

  // merge options
  var args = Array.prototype.slice.call(arguments);
  options = merge.apply(null, [{}, DEFAULT_OPTIONS].concat(args));

  // make a glob prefix of all directories that sources may exist in
  var directoryList    = getDirectoriesExcluding([
        'node_modules',
        'bower_components',
        options.buildDir,
        options.testDir,
        options.releaseDir
      ]),
      directoryPattern = '{' + directoryList.join(',') + '}';

  return function configuration(config) {
    config.set({

      // base path, that will be used to resolve files and exclude
      basePath: process.cwd(),

      //make sure we use karma-jasmine as the test framework
      frameworks: ['jasmine'],

      // list of files / patterns to load in the browser
      files: [
        {
          pattern : './app-test/vendor*.js',
          included: true,
          watched : true
        }, {
          pattern : './app-test/test*.js',
          included: true,
          watched : true
        }, {
          pattern : './app-test/{test,vendor}*.js.map',
          watched : false,
          included: false
        }, {
          pattern : './' + directoryPattern + '/**/*.js',
          watched : false,
          included: false
        }
      ],

      preprocessors: {
        '**/*.js.map': ['generic']
      },

      // append to existing value to preserve plugins loaded automatically
      plugins: []
        .concat(config.plugins)
        .concat(
          require('karma-generic-preprocessor'),
          require('karma-chrome-launcher'),
          require('karma-spec-reporter'),
          require('karma-teamcity-reporter'),
          require('karma-jasmine')
        )
        .concat(options.plugins)
        .filter(Boolean),

      // use dots reporter, as travis terminal does not support escaping sequences
      // possible values: 'dots', 'progress', 'junit', 'teamcity'
      reporters: [].concat(options.reporter),

      // web server port
      port: options.port,

      // enable / disable colors in the output (reporters and logs)
      colors: true,

      // level of logging
      // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
      logLevel: config[options.logLevel],

      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: !!options.watch,

      // batch multiple changes into a single run
      autoWatchBatchDelay: 1000,

      // Start these browsers, currently available:
      // - Chrome
      // - ChromeCanary
      // - Firefox
      // - Opera
      // - Safari (only Mac)
      // - PhantomJS
      // - IE (only Windows)
      browsers: [].concat(options.browser),

      // How long will Karma wait for a message from a browser before disconnecting from it (in ms)
      browserNoActivityTimeout: 20000,

      // If browser does not capture in given timeout [ms], kill it
      captureTimeout: 20000,

      // Auto run tests on start (when browsers are captured) and exit
      singleRun: !options.watch,

      // report which specs are slow
      reportSlowerThan: 0,

      // adjust sourcemaps
      genericPreprocessor: {
        rules: [{
          process: function (content, file, done, log) {

            // parse existing source-map
            try {
              var json = JSON.parse(content);
            } catch (exception) {
              log.error('file ' + file + ' is not a valid sourcemap');
            }

            // remove sourcesContent, apply a sourceRoot
            delete json.sourcesContent;
            json.sourceRoot = '/base';
            var text = JSON.stringify(json, null, 2);

            // complete
            done(text);
          }
        }]
      }
    });
  };
}

module.exports = configFactory;