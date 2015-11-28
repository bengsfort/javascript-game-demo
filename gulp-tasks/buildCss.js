var gulp        = require('gulp'),
    /** Utilities */
    rename      = require('gulp-rename'),
    /** CSS */
    sass          = require('gulp-sass'),
    minifyCss     = require('gulp-minify-css'),
    autoprefixer  = require('gulp-autoprefixer'),
    /** Config */
    paths      = require('../package.json').paths;

/**
 * CSS
 */

module.exports = function buildCss (cb) {

  gulp.src(paths.css.src + 'main.scss')
    .pipe(sass({
      includePaths: [paths.css.src]
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(minifyCss())
    .pipe(rename({ extname: '.bundle.css' }))
    .pipe(gulp.dest(paths.css.dest));

  cb(); // I'm done, yo!
};
