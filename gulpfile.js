var path = require('path'),
    gulp = require('gulp'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    source = require('vinyl-source-stream'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload');

var MAIN_JS_FILE = path.join(__dirname, './client/javascripts/main.js');
var PUBLIC_JS_DIR = path.join(__dirname, './public/javascripts');

gulp.task('compileJS', function () {

    var b = browserify({
        insertGlobals: true
    }).add(MAIN_JS_FILE).transform(reactify);

    var bundling = b.bundle();

    bundling.on('error', function (err) {
        console.error(err.message);
        bundling.emit('end');
    });

    return bundling
        .pipe(plumber())
        .pipe(source('compiled.js'))
        .pipe(gulp.dest(PUBLIC_JS_DIR));

});

gulp.task('compileCSS', function () {

    return gulp.src('./client/sass/main.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./public/stylesheets'))
        .pipe(livereload());

});

gulp.task('default', function () {
    livereload.listen();
    gulp.watch('client/javascripts/**/*.js', ['compileJS']);
    gulp.watch('client/sass/**/*.scss', ['compileCSS']);
});