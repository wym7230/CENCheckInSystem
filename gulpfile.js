var gulp    = require('gulp');
var concat = require('gulp-concat');
var uglify  = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('scripts', function() {
    gulp.src(['./public/**/*.js', '!./public/**/*.test.js', '!./public/app.min.js', '!./public/bower_components/**/*.js'])
        .pipe(sourcemaps.init())
            .pipe(concat('./app.min.js'))
            .pipe(uglify({mangle: true}))
            .pipe(gulp.dest('public'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public'));
});

gulp.task('watch', function() {
    watch(['./public/**/*.js', '!./public/**/*.test.js', '!./public/app.min.js', '!./public/bower_components/**/*.js'], function () {
        gulp.start('scripts');
    });
});

gulp.task('default', ['scripts', 'watch']);