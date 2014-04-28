var brfs       = require('brfs');
var gulp       = require('gulp');
var jshint     = require('gulp-jshint');
var uglify     = require('gulp-uglify');
var source     = require('vinyl-source-stream');
var watchify   = require('watchify');
var browserify = require('gulp-browserify');


var options = {
  debug: false,
  insertGlobals: true,
  transform: ['brfs']
};

// browserify all the things!
gulp.task('build', function() {
  return gulp.src('./client/app/main.js')
          .pipe(browserify(options))
          .pipe(uglify())
          .pipe(gulp.dest('./client/static/build'));
});


gulp.task('hint', function() {
  return gulp.src([
    '*.js',
    './db/*.js',
    './client/app/**/*.js', // models, views etc.
    './client/app/*.js',
    '!./node_modules/*' // exclude modules
  ])
          .pipe(jshint())
          .pipe(jshint.reporter('default'));
});


// run browserify when stuff changes
gulp.task('watch', function() {
  var bundler = watchify('./client/app/main.js');
  bundler.transform('brfs');

  function rebundle() {
    return bundler.bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./client/static/build'));
  }

  bundler.on('update', rebundle);
  return rebundle();
});

gulp.task('default', ['build', 'hint']);
