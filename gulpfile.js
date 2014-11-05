var concat = require('gulp-concat');
var gulp = require('gulp');
var changed = require('gulp-changed');
var glob = require('glob');
var path = require('path');
var browserify  = require('browserify');
var source = require('vinyl-source-stream');
var map = require('vinyl-map');
var exorcist = require('exorcist');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var typescript = require('gulp-typescript');

gulp.task('compile', function() {
    var tsProject = typescript.createProject({
        declarationFiles: true,
        noExternalResolve: true,
        target: 'ES5',
        module: 'commonjs',
        sourceRoot: './awayjs-parsers/lib/'
    });

    var ambientWrap = map(function(code, filename) {
        code = code.toString();
        code = 'declare module "' + path.relative('../', filename.slice(0,-5)) + '" {\n\t'
        + code.split('declare ').join('').split('\n').join('\n\t') + "\n"
        + '}';
        return code;
    });

    var tsResult = gulp.src(['./lib/**/*.ts', './node_modules/awayjs-**/build/*.d.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));

    tsResult.dts
        .pipe(ambientWrap)
        .pipe(concat('awayjs-parsers.d.ts'))
        .pipe(gulp.dest('./build'));

    return tsResult.js
        .pipe(sourcemaps.write({sourceRoot: '../'}))
        .pipe(gulp.dest('./lib'));
});

gulp.task('watch', ['package'], function() {
    gulp.watch('./lib/**/*.ts', ['package']);
});

gulp.task('package', ['compile'], function(callback){
    var b = browserify({
        debug: true,
        paths: ['../']
    });

    glob('./node_modules/awayjs-**/lib/**/*.js', {}, function (error, files) {
        files.forEach(function (file) {
            b.external(file);
        });
    });

    glob('./lib/**/*.js', {}, function (error, files) {

        files.forEach(function (file) {
            b.require(file, {expose:path.relative('../', file.slice(0,-3))});
        });

        b.bundle()
            .pipe(exorcist('./build/awayjs-parsers.js.map'))
            .pipe(source('awayjs-parsers.js'))
            .pipe(gulp.dest('./build'))
            .on('end', callback);
    });
});

gulp.task('package-min', ['package'], function(callback){
    return gulp.src('./build/awayjs-parsers.js')
        .pipe(sourcemaps.init({loadMaps:true}))
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(sourcemaps.write('./', {sourceRoot: './'}))
        .pipe(gulp.dest('./build'));
});


gulp.task('tests', function () {

    var tsProject = typescript.createProject({
        declarationFiles: true,
        noExternalResolve: true,
        target: 'ES5',
        module: 'commonjs',
        sourceRoot: './'
    });

    var tsResult = gulp.src(['./tests/**/*.ts', './node_modules/awayjs-**/build/*.d.ts', './build/awayjs-parsers.d.ts'])
        //.pipe(changed('./tests', {extension:'.js', hasChanged: changed.compareLastModifiedTime}))
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write({sourceRoot: './tests'}))
        .pipe(gulp.dest('./tests'));
});