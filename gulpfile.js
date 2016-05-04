var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean-css'),
    rename = require('gulp-rename');
var sass = require('gulp-sass');

var config = {
  entryFile: './client/js/app.js',
  outputDir: './public/js/',
  outputFile: 'bundle.js'
};

var cssOutDir = 'public/css/';
var cssPattern = 'public/css/**';
var viewPattern = 'views/**';
var scssPattern = 'client/sass/*.scss';

function notifyLiveReload(event) {
    var fileName = require('path').relative(__dirname, event.path);
    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

var bundler;
function getBundler() {
  if (!bundler) {
    bundler = watchify(browserify(config.entryFile, _.extend({ debug: true }, watchify.args)));
  }
  return bundler;
}

function bundle() {
  return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir));
}

gulp.task('build', function() {
  return bundle();
});

gulp.task('livereload', function() {
    tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

gulp.task('styles', function() {
    gulp.src(scssPattern)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(cssOutDir))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(clean({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(cssOutDir));
});

gulp.task('watch', function() {
    gulp.watch("src/**", ['build'] );
    gulp.watch(scssPattern, ['styles']);
    gulp.watch(cssOutDir, notifyLiveReload);
    gulp.watch(config.outputDir+"/**", notifyLiveReload);
    gulp.watch(viewPattern, notifyLiveReload);
});

gulp.task('default', [
    'build',
    'styles',
    'livereload',
    'watch'
]);
