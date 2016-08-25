var gulp = require('gulp')
var fs = require('fs')
var runSequence = require('run-sequence')
var livereload = require('gulp-livereload')
var webpack = require("gulp-webpack")
var connect = require('gulp-connect')

var less = require('gulp-less')
var sass = require('gulp-sass')
var csscomb = require('gulp-csscomb')
var autoprefixer = require('autoprefixer')
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps')

var uglify = require('gulp-uglify') //js压缩
var concat = require('gulp-concat') //文件合并

var rename = require('gulp-rename') //重命名
var rev = require('gulp-rev') // 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector') //路径替换
var assetpaths = require('gulp-assetpaths')

var template = require('gulp-template') //html模板标签
var fileinclude = require('gulp-file-include') //html模板合并include


var del = require('del') //删除文件

var webpackConfig = require('./webpack.config')

/*
 * 编译less样式文件
 */
gulp.task('less', function () {
    gulp.src(['./app/less/*.less', '!app/less/*.layout.less'])
        // .pipe(sourcemaps.init())
        .pipe(less())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/css/'))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        // .pipe(rev())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('app/css/'))
        .pipe(connect.reload())
})

gulp.task('map', function () {
    gulp.src(['./app/less/*.less', '!app/less/*.layout.less'])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/map/'))
})

/*
 * 编译sass样式文件
 */
gulp.task('sass', function () {
    gulp.src('app/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(rename({
            suffix: '.map'
        }))
        .pipe(gulp.dest('dist/css/'))
        .pipe(connect.reload())
})

// 合并、压缩js文件
gulp.task('js', function () {
    gulp.src(
        [
            'app/js/jquery-1.8.3.min.js',
            'module/swiper/idangerous.swiper.min.js',
            'module/imgshow/jquery.royalslider.min.js',
        ]
    )
        .pipe(concat('main.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
})

/*
 * html模板文件编译
 */
var templatereplace = require('./app/html/template.json')
gulp.task('html', function () {
    gulp.src(['./app/html/*.html', '!app/html/*.layout.html'])
        .pipe(fileinclude({
            prefix: '@',
            basepath: './'
        }))
        .pipe(template(templatereplace))
        .pipe(gulp.dest('app/web/'))
        .pipe(connect.reload())
})

/*
 * 用webpack编译打包样式文件
 */
gulp.task("webpack", function () {
    gulp.src('./app/app.js')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('.'))
        .pipe(connect.reload())
})

gulp.task('web', function (cb) {
    runSequence('webpack', 'html', cb);
});

/*
 * 替换样式文件中的图片路径
 */
gulp.task('rev', function () {
    return gulp.src(['./app/css/webpack.css'])
        .pipe(assetpaths({
            newDomain: './images',
            oldDomain: 'app/css/images/',
            docRoot: 'public_html',
            filetypes: ['jpg', 'jpeg', 'png', 'ico', 'gif', 'js', 'css'],
            templates: true
        }))
        .pipe(rename('webpack.min.css'))
        .pipe(gulp.dest('app/css'));
})

gulp.task('webserver', function () {
    connect.server({
        port: 3000,
        livereload: true
    })
})

gulp.task('watch', function () {
    gulp.watch(['app/less/*.less', 'module/*/*.less'], ['less', 'map'])
    gulp.watch(['app/sass/*.scss'], ['sass'])
    gulp.watch(['app/html/*', 'module/*/*.html'], ['html'])
})

gulp.task('default', [
    'webserver',
    'watch'
])

// gulp.task('default', function(cb) {
//     runSequence('webserver', 'web', 'watch', cb);
// });