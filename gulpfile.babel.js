import gulp from 'gulp'
import pug from "gulp-pug2"
import del from 'del'
import connect from 'gulp-connect'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
import concat from 'gulp-concat'
import postcss from 'gulp-postcss'
import precss from 'precss'
import browserify from 'browserify'
import autoprefixer from 'autoprefixer'

let paths = {
	templates: {
    	src: './app/templates/*.pug',
   		dest: 'build'
  	},
	scripts: {
    	src: './app/scripts/*.js',
    	dest: 'build/scripts'
  	},
	styles: {
    	src: './app/styles/*.css',
    	dest: 'build/styles'
  	},  	
	images: {
    	src: './app/images/*.png',
    	dest: 'build/images'
  	},  	  	
};

const clean = () => del([ 'build' ])

function templates() {
	return gulp.src(paths.templates.src)
		.pipe(pug())
		.pipe(gulp.dest(paths.templates.dest))
		.pipe(connect.reload())
}

function images() {
	return gulp.src(paths.images.src)
		.pipe(gulp.dest(paths.images.dest))
		.pipe(connect.reload())
}

function scripts() {
	return gulp.src(paths.scripts.src, { sourcemaps: true })
    	// .pipe(babel())
    	// .pipe(uglify())
    	.pipe(concat('main.min.js'))
    	.pipe(gulp.dest(paths.scripts.dest))
    	.pipe(connect.reload())
}

function styles() {
	return gulp.src(paths.styles.src)
		.pipe(postcss([autoprefixer, precss]))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(connect.reload())
}

function watch() {
    gulp.watch(paths.templates.src, templates)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.images.src, images)
}

function serve() {
	connect.server({
		root: 'build',
		port: 8081,
		livereload: true
	})
}

export let build = gulp.series(clean, gulp.parallel(templates, scripts, styles, images))
let localDev = gulp.series(build, gulp.parallel(serve, watch))

export default localDev