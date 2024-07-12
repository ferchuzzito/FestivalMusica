import gulp from 'gulp';
const { src, watch, parallel } = gulp;

const paths = {
   sassFiles: './src/scss/**/*.scss',
   cssDest: './build/css',
   imageFiles: './src/assets/img/**/*',
   imageDest: './build/assets/img',
   jsFiles: './src/js/**/*.js',
   jsBundle: './build/js',
};

// CSS
import sass from 'gulp-sass';
import * as dartSass from 'sass'
import plumber from 'gulp-plumber';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import purgecss from 'gulp-purgecss';

// Imagenes
import cache from 'gulp-cache';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

// Javascript
import terser from 'gulp-terser';

// Initialize gulp-sass with dart-sass
const sassCompiler = sass(dartSass);

// Tareas
function css(done) {
   // sass directory
   src(paths.sassFiles)
      // sourcemaps
      .pipe(sourcemaps.init())
      .pipe(plumber())
      // outputstyle (nested, compact, expanded, compressed)
      .pipe(sassCompiler({ outputStyle: 'compressed' }))
      // autoprefixer
      .pipe(postcss([autoprefixer({
         overrideBrowserslist: ['> .5%, last 10 versions']
      })]))
      .pipe(sourcemaps.write('./'))
      // css output directory
      .pipe(gulp.dest(paths.cssDest));
   done();
};

function cleanCSS(done) {
   src('build/**/*.css')
      .pipe(purgecss({
         content: ['./*.html'],
         rejected: true 
      }))
      .pipe(gulp.dest('build/css'));
   done();
};

function images(done) {
   src(paths.imageFiles)
      .pipe(cache(imagemin([
         imagemin.gifsicle({
            interlaced: true
         }),
         imagemin.mozjpeg({
            quality: 50,
            progressive: true
         }),
         imagemin.optipng({
            optimizationLevel: 3
         }),
         imagemin.svgo({
            plugins: [{
                  removeViewBox: true
               },
               {
                  cleanupIDs: false
               }
            ]
         })
      ])))
      .pipe(gulp.dest(paths.imageDest));
   done();
};

function avifImages(done) {
   const opciones = {
      quality: 50
   };
   src('src/assets/img/**/*.{png,jpg}')
      .pipe(avif(opciones))
      .pipe(gulp.dest(paths.imageDest))
   done();
};

function webpImages(done) {
   src(paths.imageFiles)
      .pipe(cache(imagemin([
         imagemin.gifsicle({
            interlaced: true
         }),
         imagemin.mozjpeg({
            quality: 50,
            progressive: true
         }),
         imagemin.optipng({
            optimizationLevel: 3
         }),
         imagemin.svgo({
            plugins: [{
                  removeViewBox: true
               },
               {
                  cleanupIDs: false
               }
            ]
         })
      ])))
      .pipe(webp())
      .pipe(gulp.dest(paths.imageDest));
   done();
};

function js(done) {
   src(paths.jsFiles)
      .pipe(sourcemaps.init())
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.jsBundle));
   done();
};

function dev(done) {
   watch(paths.sassFiles, css);
   watch(paths.jsFiles, js);
   done();
}

const build = parallel(images, webpImages, avifImages, dev);
export { css, cleanCSS, js, images, webpImages as webp, avifImages as avif, build as dev };
