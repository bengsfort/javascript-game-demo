var gulp = require('gulp'),
  /** Utilities */
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
  /** JS Specific */
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    es = require('event-stream'),
/** Config */
    paths = require('../package.json').paths;

/**
 * JavaScript
 */

module.exports = function browserifyTask() {

  console.log('Creating app bundles.');

    var tasks = paths.js.entries.map(function (entry) { // bundle each entry individually
        return browserify({ entries : entry.path })
            .bundle()
            .pipe(source(entry.name)) // Convert bundle into type of stream gulp is expecting
            .pipe(rename({ extname: '.bundle.js' })) // add `.bundle.js` extension
            .pipe(gulp.dest(entry.dest))
            .on('end', function() {
                console.log('Bundled '+ gutil.colors.blue(entry.name));
            });
    });

    return es.merge.apply(null, tasks);
};