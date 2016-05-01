'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');

var options = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  wiredep: {
    directory: 'bower_components',
    exclude: [
      /bootstrap-sass-official\/.*\.js/,
      /bootstrap\.css/,
      /open-sans-fontface\/.*/
    ],
    fileTypes: {
      html: {
        replace: {
          js: function (filePath) {
            var options = '';
            if (filePath.match(/pace\.js/)) {
              options = " data-pace-options='{ \"target\": \".content-wrap\", \"ghostTime\": 1000 }'"
            }
            return '<script' + options + ' src="' + filePath + '"></script>';
          }
        }
      }
    }
  }
};

wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(options);
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
