var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var clean = require('gulp-clean-css');
var fs = require('fs');
var url = require('url');
var path = require('path');
var list = require('./src/data/list.json');
gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css/'))
})
gulp.task('watch', function() {
        return gulp.watch('./src/scss/*.scss', gulp.series('sass'))
    })
    //起服务
gulp.task('webserver', function() {
        return gulp.src('src')
            .pipe(webserver({
                port: 5678,
                open: true,
                livereload: true,
                middleware: function(req, res, next) {
                    var pathname = url.parse(req.url).pathname;
                    if (pathname === '/favicon.ico') {
                        return res.end();
                    }
                    if (pathname === '/api/list') {
                        res.end(JSON.stringify({
                            code: 1,
                            data: list
                        }))
                    } else {
                        pathname = pathname === '/' ? 'index.html' : pathname
                        res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                    }
                }
            }))
    })
    //开发环境
gulp.task('dev', gulp.series('sass', 'webserver', 'watch'));
//合并压缩js
gulp.task('minjs', function() {
        return gulp.src('./src/js/*.js')
            .pipe(concat('all.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./src/bulid/js'))
    })
    //es6转es5
gulp.task('babel', function() {
        return gulp.src('./src/js/ajax.js') //需要编译的js文件
            .pipe(babel({
                presets: ['env']
            }))
            .pipe(uglify())
            .pipe(concat('all.js'))
            .pipe(gulp.dest('./src/bulid/js'))

    })
    //压缩css
gulp.task('cssmin', function() {
        return gulp.src('./src/css/*.css')
            .pipe(clean())
            .pipe(gulp.dest('./src/bulid/css'))
    })
    //打包环境
gulp.task('bulid', gulp.series('babel', 'sass', 'cssmin', 'webserver', 'watch'))






// gulp.task('default', () =>
// 	gulp.src('src/app.js')
// 		.pipe(babel({
// 			presets: ['env']
// 		}))
// 		.pipe(gulp.dest('dist'))
// );