// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint'),
	htmlmin = require('gulp-htmlmin'),
	concat = require('gulp-concat'),
	stripDebug = require('gulp-strip-debug'),
	uglify = require('gulp-uglify'),
	autoprefix = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
  browserSync = require('browser-sync').create();

// broserSync task
gulp.task('browserSync', function(){
  return browserSync.init({
    server: {
      baseDir: 'src'
    }
  });
});

// JS hint task
gulp.task('jshint', function(){
	return gulp.src('src/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// htmlmin tastk
gulp.task('htmlmin', function(){
	return gulp.src('src/*.html')
		.pipe(htmlmin({collapseWhitespace: true,
						removeComments: true,
						minifyJS: true
					}))
    	.pipe(gulp.dest('dist'))
      .pipe(browserSync.reload({stream:true}));
});

// JS concat, strip debugging and minify
gulp.task('scripts', ['jshint'], function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('app.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.reload({stream:true}));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  return gulp.src(['src/css/*.css'])
    .pipe(concat('style.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function(){
  gulp.watch(['htmlmin']);
  gulp.watch('src/js/*.js',['scripts']);
  gulp.watch('src/css/*.css', ['styles']);
})

// default gulp task
gulp.task('default', ['browserSync', 'watch']);