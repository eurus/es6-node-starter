// generated on 2016-05-22 using generator-webapp 2.1.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;

const source = require('vinyl-source-stream');
const _ = require('underscore');
const browserify = require('browserify');
const babelify = require('babelify');
const browserifyCss = require('browserify-css');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
var config = {
    // Dirs
    // js
    jsEntryFile: './client/es/app.js',
    jsDestDir: './public/js/',
    bundleFile: 'bundle.js',

    // scss & css
    cssDestDir: './public/css/',


    // Pattern
    // es & js
    esPattern: './client/es/**/*.js',
    jsPattern: './public/js/**/*.js',

    // scss & css
    scssPattern: './client/sass/**/*.scss',
    cssPattern: './public/css/**/*.css',

    // view
    viewPattern: './views/**',

    // server
    serverPattern: './server/**/*.js'
};

gulp.task('start', function() {
    nodemon({
        script: 'run.js',
        ext: 'es6',
        env: {
            'NODE_ENV': 'development'
        },
        ignore: [config.viewPattern]
    });
});

gulp.task('styles', () => {
    return gulp.src(config.scssPattern)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
        }))
        .pipe(gulp.dest(config.cssDestDir))
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe($.cleanCss({
            compatibility: 'ie8'
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.cssDestDir))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('scripts', () => {
    return browserify(config.jsEntryFile, {
            debug: true
        })
        .transform(browserifyCss)
        .transform(babelify)
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source(config.bundleFile))
        // Start piping stream to tasks!
        .pipe(gulp.dest(config.jsDestDir))
        .pipe(reload({
            stream: true
        }));
});

function lint(files, options) {
    return gulp.src(files)
        .pipe(reload({
            stream: true,
            once: true
        }))
        .pipe($.eslint(options))
        .pipe($.eslint.format())
        .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
    return lint(config.esPattern, {
            fix: true
        })
        .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
    return lint('test/spec/**/*.js', {
            fix: true,
            env: {
                mocha: true
            }
        })
        .pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('images', () => {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{
                cleanupIDs: false
            }]
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
    return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function(err) {})
            .concat('app/fonts/**/*'))
        .pipe(gulp.dest('.tmp/fonts'))
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', del.bind(null, ['public']));

gulp.task('default', ['serve'], function() {
    gulp.watch([
        config.viewPattern,
        config.serverPattern,
    ]).on('change', reload);

    gulp.watch(config.scssPattern, ['styles']);
    gulp.watch(config.esPattern, ['scripts']);
});

gulp.task('serve', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["public/**/*.*"],
        port: 9000,
    });
});

gulp.task('nodemon', function(cb) {
    var started = false;

    return $.nodemon({
        script: 'run.js',
        ext: 'es6',
        env: {
            'NODE_ENV': 'development'
        }
    }).on('start', function() {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});
