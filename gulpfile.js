// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint'),
	htmlmin = require('gulp-htmlmin'),
	concat = require('gulp-concat'),
	stripDebug = require('gulp-strip-debug'),
	uglify = require('gulp-uglify');

// JS hint task
gulp.task('jshint', function(){
	return gulp.src('js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// htmlmin tastk
gulp.task('htmlmin', function(){
	return gulp.src('*.html')
		.pipe(htmlmin({collapseWhitespace: true,
						removeComments: true,
						minifyJS: true
					}))
    	.pipe(gulp.dest('dist'))
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src('js/*.js')
    .pipe(concat('app.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});