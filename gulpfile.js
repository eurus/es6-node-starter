var gulp = require('gulp'),

    // compile CommonJS to AMD
    browserify = require('browserify'),
    watchify = require('watchify'),

    // ES6 support
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    _ = require('lodash'),

    // sass
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    clean = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),

    // start node server
    nodemon = require('gulp-nodemon'),

    // live reload
    tinylr = require('tiny-lr')();

var config = {
    // js
    jsEntryFile: './client/js/app.js',
    jsOutDir: './public/js/',
    jsOutFile: 'bundle.js',
    jsSrcDir: './client/js/',

    // scss & css
    scssDir: './client/sass/',
    cssOutDir: './public/css/',

    // view
    viewDir: './views/',
};

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
        bundler = watchify(browserify(config.jsEntryFile, _.extend({
            debug: true
        }, watchify.args)));
    }
    return bundler;
}

gulp.task('build', function() {
    getBundler()
        .transform(babelify)
        .bundle()
        .on('error', function(err) {
            console.log('Error: ' + err.message);
        })
        .pipe(source(config.jsOutFile))
        .pipe(gulp.dest(config.jsOutDir));
});

gulp.task('start', function() {
    nodemon({
        script: 'run.js',
        ext: 'es6 jade',
        env: {
            'NODE_ENV': 'development'
        }
    });
});

gulp.task('livereload', function() {
    tinylr.listen(35729);
});

gulp.task('styles', function() {
    gulp.src(config.scssDir + '/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(config.cssOutDir))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(clean({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(config.cssOutDir));
});

gulp.task('watch', function() {
    gulp.watch(config.scssDir + '**', ['styles']);
    gulp.watch(config.jsSrcDir + '**', ['build']);

    // live reload
    gulp.watch(config.cssOutDir + '**', notifyLiveReload);
    gulp.watch(config.jsOutDir + '**', notifyLiveReload);
    gulp.watch(config.viewDir + '**', notifyLiveReload);
});

gulp.task('default', [
    'build',
    'styles',
    'livereload',
    'start',
    'watch'
]);
