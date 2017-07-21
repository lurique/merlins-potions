// Requiring necessary packages
var gulp = require('gulp')
		watch = require('gulp-watch'),
		jade = require('gulp-jade'),
		autoprefixer = require('gulp-autoprefixer'),
		sass = require('gulp-sass'),
		cssNano = require('gulp-cssnano'),
		uglify = require('gulp-uglify'),
		concat = require('gulp-concat'),
		changed = require('gulp-changed'),
		browserSync = require('browser-sync');

function swallowError (error) {
	console.log(error.toString())
	this.emit('end')
}

// Custom tasks
gulp.task('html', function() {
	gulp.src('source/index.jade')
		.pipe(changed('public'), {extension: 'html'})
   	.pipe(jade())
   	.on('error', swallowError)
   	.pipe(gulp.dest('public'));
});

gulp.task('css', function() {
	gulp.src('source/scss/main.scss')
		.pipe(changed('public/css'), {extension: 'css'})
		.pipe(concat('style.min.css'))
		.pipe(sass())
		.on('error', swallowError)
		.pipe(autoprefixer())
		.pipe(cssNano())
		.pipe(gulp.dest('public/css'))
		.pipe(browserSync.stream({match: "**/*.css"}));
});

gulp.task('js', function() {
	gulp.src('source/js/**/*.js')
		.pipe(changed('public/js'), {extension: 'js'})
		.pipe(concat('script.min.js'))
		.pipe(uglify())
		.on('error', swallowError)
		.pipe(gulp.dest('public/js'));
});

gulp.task('img', function() {
	gulp.src('source/img/**/*.*')
		.pipe(changed('public/img'))
		.pipe(gulp.dest('public/img'));
});

gulp.task('watch', function() {
	var html = gulp.watch(['source/index.jade', 'source/inc/**/*.jade'], ['html']);
  var css = gulp.watch(['source/scss/**/*.scss'], ['css']);
  var js = gulp.watch(['source/js/**/*.js'], ['js']);
});

gulp.task('browser-sync', function() {
	browserSync.init(['public'], {
    proxy: 'http://localhost/',
    browser: 'firefox',
    port: 3000,
    notify: false
  });
});

// Global task
gulp.task('default', ['html', 'css', 'img', 'js', 'browser-sync', 'watch']);