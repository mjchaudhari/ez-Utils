//1. create folder structure
// concatinate all js files
var gulp = require("gulp");
var del = require("del");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var dest = "./dist/"

var styles =[
    './**/*.css/'
]
var jsFiles =[
   './**/*.js/'
]
/** clean up */
gulp.task('clean', function (cb) {
    del([
        dest
    ], cb);
});

/** concat */
gulp.task('styles', function () {
   gulp.src(styles)
      .pipe(concat('ez-directive.css'))
      .pipe(gulp.dest(dest))
});
/**
 * concat app js
 */
gulp.task('js', function () {
   gulp.src(jsFiles)
      .pipe(concat('ez-directives.js'))
      .pipe(gulp.dest(dest))
});

gulp.task('default', ['clean', 'styles', 'js']);
//gulp.task('default', ['replaceRefs']);

