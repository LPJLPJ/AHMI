/**
 * Created by ChangeCheng on 2016/10/25.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump');
var watch = require('gulp-watch');
var path = require('path');
var os = require('os');
var lec = require('gulp-line-ending-corrector');
var baseUrl = './public/ide/modules/ide/js/';


console.log('os',os.platform());
var eolc;

switch (os.platform()){
    case 'win32':
        eolc = 'CRLF';
        break;
    default:
        eolc = 'LF';
        break;
}

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
    return gulp.src([baseUrl+'**/*.js','!'+baseUrl+'parts/simulator/*.js','!'+baseUrl+'projectService.js','!'+baseUrl+'widgetService.js'],{base:baseUrl})
        .pipe(watch([baseUrl+'**/*.js','!'+baseUrl+'parts/simulator/*.js','!'+baseUrl+'projectService.js','!'+baseUrl+'widgetService.js']))
        .pipe(uglify())
        .pipe(lec({eolc:eolc,encoding:'utf-8'}))
        .pipe(gulp.dest('public/ide/modules/ide/min-js'))
})

gulp.task('transferNormalFiles',function () {
    return gulp.src([baseUrl+'parts/simulator/*.js',baseUrl+'projectService.js',baseUrl+'widgetService.js'],{base:baseUrl})
        .pipe(watch([baseUrl+'parts/simulator/*.js',baseUrl+'projectService.js',baseUrl+'widgetService.js'],{base:baseUrl}))
        .pipe(lec({eolc:eolc,encoding:'utf-8'}))
        .pipe(gulp.dest('public/ide/modules/ide/min-js'))
})


gulp.task('transferAllFiles',function () {
    return gulp.src([baseUrl+'**/*.js'],{base:baseUrl})
        .pipe(watch([baseUrl+'**/*.js'],{base:baseUrl}))
        .pipe(gulp.dest('public/ide/modules/ide/min-js'))
})

gulp.task('build',['keepCompressing','transferNormalFiles']);

gulp.task('dev',['transferAllFiles'])

