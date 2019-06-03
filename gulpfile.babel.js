'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';

import nodemon from 'gulp-nodemon';

gulp.task('start', function (done) {
  nodemon({
    script: 'server.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  , done: done
  })
})

gulp.task('default', () => {
    return gutil.log('Gulp is running');
});