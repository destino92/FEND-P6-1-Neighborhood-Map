// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint'),
	htmlmin = require('gulp-htmlmin'),
	concat = require('gulp-concat'),
	stripDebug = require('gulp-strip-debug'),
	uglify = require('gulp-uglify'),
	autoprefix = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css');

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
gulp.task('scripts', ['jshint'], function() {
  	return gulp.src('js/*.js')
    	.pipe(concat('app.js'))
    	.pipe(stripDebug())
    	.pipe(uglify())
    	.pipe(gulp.dest('dist/js/'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  	return gulp.src(['css/*.css'])
    	.pipe(concat('style.css'))
    	.pipe(autoprefix('last 2 versions'))
    	.pipe(cleanCSS())
    	.pipe(gulp.dest('dist/css/'));
});

// default gulp task
gulp.task('default', ['htmlmin', 'scripts', 'styles'], function() {
  // watch for HTML changes
  gulp.watch('*.html', function() {
    gulp.run('htmlmin');
  });

  // watch for JS changes
  gulp.watch('js/*.js', function() {
    gulp.run('scripts');
  });

  // watch for CSS changes
  gulp.watch('css/*.css', function() {
    gulp.run('styles');
  });
});