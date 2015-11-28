var gulp          = require('gulp'),

    /** Utils */
    gutil = require('gulp-util'),
    browserSync   = require('browser-sync').create('game'),
    requireDir    = require('require-dir'),
    gulpAutoTask  = require('gulp-auto-task'),

    /** Config */
    paths        = require('./package.json').paths;

/** Import Main Tasks */
// Require them so they can be called as functions
var utils = requireDir('gulp-tasks');
// Automagically set up tasks
gulpAutoTask('{*,**/*}.js', {
  base: paths.tasks,
  gulp: gulp
});

/**
 * BrowserSync
 */
// Init server to build directory
gulp.task('browser', function() {
  browserSync.init({
    server: "./" + paths.build,
    port: 4000
  });
});

// Force reload across all devices
gulp.task('browser:reload', function() {
  browserSync.reload();
});

/**
 * Main Builds
 */
gulp.task('serve', ['build', 'browser'], function() {
  // CSS/SCSS
  gulp.watch([
        paths.css.src +'main.scss',
        paths.css.src+'*.scss',
        paths.css.src +'**/*.scss',
  ], ['buildCss', 'browser:reload']);
  // JS
  gulp.watch([
         paths.src +'*.js',
         paths.src +'**/*.js',
         paths.src + '**/**/*.js'
    ], ['browserify', 'browser:reload']);

  gutil.log('Watching for changes.');
});

gulp.task('default', ['buildCss', 'browserify']);

gulp.task('build', ['default']);