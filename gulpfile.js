/**
 * Created by ChangeCheng on 2016/10/25.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var pump = require('pump');
var watch = require('gulp-watch');
var path = require('path');
var baseUrl = './public/ide/modules/ide/js/';

gulp.task('compress', function (cb) {
    pump([
            gulp.src(['public/ide/modules/ide/js/**/*.js','!public/ide/modules/ide/js/parts/simulator/*.js','!public/ide/modules/ide/js/projectService.js'],{base:'public/ide/modules/ide/js'}),
            uglify(),
            gulp.dest('public/ide/modules/ide/min-js')
        ],
        function () {
            pump([
                    gulp.src(['public/ide/modules/ide/js/parts/simulator/*.js','public/ide/modules/ide/js/projectService.js'],{base:'public/ide/modules/ide/js'}),
                    gulp.dest('public/ide/modules/ide/min-js')
                ],
                cb
            );
        }
    );


});


gulp.task('transNormalFiles',function (cb) {
    pump([
            gulp.src(['public/ide/modules/ide/js/parts/simulator/*.js','public/ide/modules/ide/js/projectService.js'],{base:'public/ide/modules/ide/js'}),
            gulp.dest('public/ide/modules/ide/min-js')
        ],
        cb
    );
})


gulp.task('keepCompressing',function () {
    return gulp.src([baseUrl+'**/*.js','!'+baseUrl+'parts/simulator/*.js','!'+baseUrl+'projectService.js'],{base:baseUrl})
        .pipe(watch([baseUrl+'**/*.js','!'+baseUrl+'parts/simulator/*.js','!'+baseUrl+'projectService.js']))
        .pipe(uglify())
        .pipe(gulp.dest('public/ide/modules/ide/min-js'))
})

gulp.task('transferNormalFiles',function () {
    return gulp.src([baseUrl+'parts/simulator/*.js',baseUrl+'projectService.js'],{base:baseUrl})
        .pipe(watch([baseUrl+'parts/simulator/*.js',baseUrl+'projectService.js']))
        .pipe(gulp.dest('public/ide/modules/ide/min-js'))
})

gulp.task('default', function() {
    return gulp.src('sass/*.scss')
        .pipe(watch('sass/*.scss'))
        .pipe(sass())
        .pipe(gulp.dest('dist'));
})

gulp.task('dev',['keepCompressing','transferNormalFiles']);