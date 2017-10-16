/*
 * Loads all source modules making them available for testing
 */

(function() {
  'use strict';

  var walk = require('walk'),
    fs = require('fs'),
    path = require('path'),
    options,
    walker;

  options = {
    listeners: {
      file: function(root, fileStats, next) {
        var fullPath = path.resolve(root, fileStats.name);
        var moduleName = fileStats.name.substring(
          0,
          fileStats.name.indexOf('.')
        );
        global[moduleName] = require(fullPath);
        next();
      },
      errors: function(root, nodeStatsArray, next) {
        next();
      }
    }
  };

  walker = walk.walkSync(process.env.SRC, options);
  console.log('Modules loaded');
})();
