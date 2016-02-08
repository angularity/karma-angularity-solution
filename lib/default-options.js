'use strict';

function defaultOptions() {
  return {
    port    : 55556,
    reporter: 'spec',
    browser : 'Chrome',
    logLevel: 'LOG_INFO'
  };
}

module.exports = defaultOptions;