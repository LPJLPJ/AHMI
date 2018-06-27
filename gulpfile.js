/**
 * Created by ChangeCheng on 2016/10/25.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uglifyES = require('uglify-es')
var composer = require('gulp-uglify/composer');
var uglifyWithES = composer(uglifyES, console);
var plumber = require('gulp-plumber');
var pump = require('pump');
var watch = require('gulp-watch');
//css
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var htmlmin = require('gulp-htmlmin')
var runSequence = require('run-sequence');
var path = require('path');
var os = require('os');
var baseUrl = './public/ide/modules/ide/js/';
//var debug = require('gulp-debug');
var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

var NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV !== 'production') {
    var lec = require('gulp-line-ending-corrector');
}

var eolc;
switch (os.platform()){
    case 'win32':
        eolc = 'CRLF';
        break;
    default:
        eolc = 'LF';
        break;
}

console.log('os',os.platform());
console.log('ENV',NODE_ENV);

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
});


gulp.task('keepCompressing',function () {
    var src = gulp.src([baseUrl + '**/*.js', '!' + baseUrl + 'parts/simulator/*.js', '!' + baseUrl + 'projectService.js', '!' + baseUrl + 'widgetService.js', '!' + baseUrl + 'widgetModel/{es6,es6/**}'], {base: baseUrl});

    if (NODE_ENV !== 'production') {
        src = src.pipe(watch([baseUrl + '**/*.js', '!' + baseUrl + 'parts/simulator/*.js', '!' + baseUrl + 'projectService.js', '!' + baseUrl + 'widgetService.js', '!' + baseUrl + 'widgetModel/{es6,es6/**}'])).pipe(plumber())
    }

    src = src.pipe(uglify());

    if (NODE_ENV !== 'production') {
        src = src.pipe(lec({eolc: eolc, encoding: 'utf-8'}))
    }

    return src.pipe(gulp.dest('public/ide/modules/ide/min-js'))

});

gulp.task('transferNormalFiles',function () {
    var src = gulp.src([baseUrl + 'parts/simulator/*.js', baseUrl + 'projectService.js', baseUrl + 'widgetService.js'], {base: baseUrl});

    if (NODE_ENV !== 'production') {
        src = src.pipe(watch([baseUrl + 'parts/simulator/*.js', baseUrl + 'projectService.js', baseUrl + 'widgetService.js'], {base: baseUrl})).pipe(plumber())
            .pipe(lec({eolc: eolc, encoding: 'utf-8'}))
    }

    return src.pipe(gulp.dest('public/ide/modules/ide/min-js'));

});


gulp.task('transferAllFiles',function () {
    return gulp.src([baseUrl+'**/*.js'],{base:baseUrl})
        .pipe(watch([baseUrl+'**/*.js'],{base:baseUrl}))
        .pipe(gulp.dest('public/ide/modules/ide/min-js'))
})


var srcBaseUrl = './src/'
//transferAllFiles
gulp.task('transferBeforeCompress', function () {
    return gulp.src([srcBaseUrl+'**/*'],{base:srcBaseUrl})
    // Auto-prefix css styles for cross browser compatibility
        // Output
        .pipe(gulp.dest('./'))
});

var ignoreCSSList = [
    '!'+srcBaseUrl+'**/@(lib|libs)/**/*.css'
]
// Gulp task to minify CSS files
gulp.task('compressCSS', function () {
    return gulp.src([srcBaseUrl+'**/*.css'].concat(ignoreCSSList),{base:srcBaseUrl})
    // Auto-prefix css styles for cross browser compatibility
        .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        // Minify the file
        .pipe(csso())
        // Output
        .pipe(gulp.dest('./'))
});

// Gulp task to minify JavaScript files
var ignoreJSList = [
    // '!'+srcBaseUrl+'public/general/js/spinner.js',
    // '!'+srcBaseUrl+'public/ide/modules/visualization/js/d3Tree.js',
    '!'+srcBaseUrl+'public/ide/modules/ide/js/parts/simulator/simulator.bundle.js',
    '!'+srcBaseUrl+'**/@(lib|libs)/**/*.js'
]


gulp.task('compressJS', function() {
    return gulp.src([srcBaseUrl+'**/*.js'].concat(ignoreJSList),{base:srcBaseUrl})
    // Minify the file
    //     .pipe(uglify())
        .pipe(uglifyWithES())
        // Output
        .pipe(gulp.dest('./'))
});

gulp.task('copyJStoMin',function () {
    return gulp.src(['./public/ide/modules/ide/js/**/*.js'],{base:'./public/ide/modules/ide/js'})
        .pipe(gulp.dest('./public/ide/modules/ide/min-js/'))
})


// Gulp task to minify HTML files
gulp.task('compressHTML', function() {
    return gulp.src([srcBaseUrl+'**/*.html'],{base:srcBaseUrl})
        // .pipe(minifyejs())
        .pipe(htmlmin({collapseWhitespace: true,removeComments: true,ignoreCustomFragments: [/{{.*?}}/,/<%.*?%>/]}))
        .pipe(gulp.dest('./'));
});

gulp.task('compressALL',['compressJS','compressCSS','compressHTML'],function () {
    
})

gulp.task('buildAll',function () {
    runSequence(
        'transferBeforeCompress',
        'compressALL',
        'copyJStoMin'
    );
})

// gulp.task('build',['keepCompressing','transferNormalFiles']);
//
// gulp.task('dev',['transferAllFiles'])

gulp.task('build',['buildAll'])

gulp.task('dev',function () {
    runSequence(
        'transferBeforeCompress',
        // 'compressALL',
        'copyJStoMin'
    );
    console.log('watch files ...')
    return gulp.watch([srcBaseUrl+'**/*'],{base:srcBaseUrl}, function(event) {
        runSequence(
            'transferBeforeCompress',
            // 'compressALL',
            'copyJStoMin'
        );
    });
})