'use strict';

/**
 * The default options of the application.
 * @returns {object}
 */
function defaultOptions() {
  return {
    port    : 55556,
    reporter: 'spec',
    browser : 'Chrome',
    logLevel: 'LOG_INFO'
  };
}

module.exports = defaultOptions;