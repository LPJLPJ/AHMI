/**
 * Created by ChangeCheng on 2016/10/25.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var pump = require('pump');

gulp.task('compress', function (cb) {
    pump([
            gulp.src(['public/ide/modules/ide/js/**/*.js','!public/ide/modules/ide/js/parts/simulator/*.js']),
            stripDebug(),
            uglify(),
            gulp.dest('public/ide/modules/ide/min-js')
        ],
        cb
    );
});

