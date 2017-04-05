/**
 * Created by ChangeCheng on 2016/10/25.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var watch = require('gulp-watch');
var path = require('path');
var babel = require('gulp-babel');
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
    return gulp.src([baseUrl+'**/*.js','!'+baseUrl+'parts/simulator/*.js','!'+baseUrl+'projectService.js','!'+baseUrl+'widgetService.js','!'+baseUrl+'widgetModel/{es6,es6/**}'],{base:baseUrl})
        .pipe(watch([baseUrl+'**/*.js','!'+baseUrl+'parts/simulator/*.js','!'+baseUrl+'projectService.js','!'+baseUrl+'widgetService.js','!'+baseUrl+'widgetModel/{es6,es6/**}']))
        .pipe(uglify())
        .pipe(gulp.dest('public/ide/modules/ide/min-js'))
})

gulp.task('transferNormalFiles',function () {
    return gulp.src([baseUrl+'parts/simulator/*.js',baseUrl+'projectService.js',baseUrl+'widgetService.js'],{base:baseUrl})
        .pipe(watch([baseUrl+'parts/simulator/*.js',baseUrl+'projectService.js',baseUrl+'widgetService.js'],{base:baseUrl}))
        .pipe(gulp.dest('public/ide/modules/ide/min-js'))
})


gulp.task('transferAllFiles',function () {
    return gulp.src([baseUrl+'**/*.js'],{base:baseUrl})
        .pipe(watch([baseUrl+'**/*.js'],{base:baseUrl}))
        .pipe(gulp.dest('public/ide/modules/ide/min-js'))
})

gulp.task('transWidgetCommands',function () {
    return gulp.src(baseUrl+'widgetModel/es6/widgetCommands.js')
            .pipe(watch(baseUrl+'widgetModel/es6/widgetCommands.js'))
            .pipe(babel({
                presets:['es2015']
            }))
            .pipe(gulp.dest(baseUrl+'widgetModel/'))
})

gulp.task('build',['keepCompressing','transferNormalFiles']);

gulp.task('dev',['transferAllFiles'])

