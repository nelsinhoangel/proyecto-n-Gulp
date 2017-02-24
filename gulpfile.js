//VARIABLES
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
var nib = require('nib');
var minifyCSS = require('gulp-minify-css');
//
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var smoosher = require('gulp-smoosher');
var imageop = require('gulp-image-optimization');

//VARIABLES- RUTAS COMPIlACIÓN CSS-HTML-JS-IMAGES
var config = {
  styles: {
    main: './src/css/web/proyecto.scss',
    //watch: './src/css/web/*.+(css|scss)',
    watch: './src/css/web/**/*.scss',
    output: './build/css/web/'
  },
  html: {
    watch: './build*.html'
  },
  scripts: {
    main: './src/js/actions.js',
    watch: './src/js/**/*.js',
    output: './build/js'
  },
  images: {
    watch: ['./build/img/web/**/*.png','./build/img/web/**/*.jpg','./build/img/web/**/*.gif','./build/img/web/**/*.svg'],
    output: './dist/img/web'
  }
  
}

//FUNCIÓN REFRESCAR ACTUALIZAR EL NAVEGADOR
gulp.task('server', function() {
  gulp.src('./build')
    .pipe(webserver({
      //host: '0.0.0.0',
      host: 'http://localhost/',
      port: 8080,
      livereload: true
    }));
});

//FUNCIÓN OPTIMIZACIÓN CSS
gulp.task('build:css', function() {
  gulp.src(config.styles.main)
    .pipe(sass({
      use: nib(),
      'include css': true
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(config.styles.output));
});

//FUNCIÓN OPTIMIZACIÓN CSS-MEDIA QUERIES
//gulp.task('mmq', function () {
  //gulp.src('./src/**/*.scss')
    //.pipe(mmq({
      //log: true
    //}))
    //.pipe(gulp.dest(config.styles.output));
//});

//FUNCIÓN OPTIMIZACIÓN JS
gulp.task('build:js', function() {
  return browserify(config.scripts.main)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(config.scripts.output));
});


//FUNCIÓN VIGILANTES OPTIMIZACIÓN
gulp.task('watch', function() {
  gulp.watch(config.images.watch, ['images']);
  gulp.watch(config.scripts.watch, ['build:js']);
  gulp.watch(config.styles.watch, ['build:css']);
  gulp.watch(config.html.watch, ['build']);
})

//FUNCIÓN OPTIMIZACIÓN IMÁGENES
gulp.task('images', function() {
  gulp.src(config.images.watch)
    .pipe(imageop({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(config.images.output));
});

//FUNCIÓN COMPILAR CÓDIGO INLINE
gulp.task('inline', function() {
  gulp.src('./build/index.html')
    .pipe(smoosher())
    .pipe(gulp.dest('./dist'));
});
//,'mmq'
//EJECUCIÓN FUNCIONES
gulp.task('build', ['build:css', 'build:js', 'images', 'inline'])
gulp.task('default', ['server', 'watch', 'build']);