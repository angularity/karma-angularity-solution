'use strict';

var fs   = require('fs'),
    path = require('path');

function getDirectoriesExcluding(exclusions) {

  // also exclude hidden directories
  exclusions = [/^\./].concat(exclusions || []);

  return fs.readdirSync(process.cwd())
    .filter(testIncluded);

  function testIncluded(item) {
    var fullPath    = path.resolve(item),
        isDirectory = fs.statSync(fullPath).isDirectory();

    return isDirectory && !exclusions.some(testExclusion);

    function testExclusion(pattern) {
      if (typeof pattern === 'string') {
        return (path.resolve(pattern) === fullPath);
      }
      else if (!!pattern && (typeof pattern === 'object') && (typeof pattern.test === 'function')) {
        return pattern.test(item);
      }
    }
  }
}

module.exports = getDirectoriesExcluding;