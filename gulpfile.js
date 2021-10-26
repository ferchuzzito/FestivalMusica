const gulp = require('gulp');

const paths = {
   sassFiles: './src/scss/**/*.scss',
   cssDest: './build/css',
   imageFiles: './src/assets/img/**/*',
   imageDest: './build/assets/img',
   jsFiles: './src/js/**/*.js',
   jsBundle: './build/js',
};

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
//const autoprefixer = require('gulp-autoprefixer');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const purgecss = require('gulp-purgecss');

// Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Javascript
const terser = require('gulp-terser-js');

// Tareas
function css(done) {
   // sass directory
   src(paths.sassFiles)
      // sourcemaps
      .pipe(sourcemaps.init())
      .pipe(plumber())
      // outputstyle (nested, compact, expanded, compressed)
      .pipe(sass({
         outputStyle: 'compressed'
      }))
      // autoprefixer
      .pipe(postcss([autoprefixer({
         overrideBrowserslist: ['last 12 version']
      })]))
      .pipe(sourcemaps.write('./'))
      // css output directory
      .pipe(gulp.dest(paths.cssDest));
   done();
};

function purgecss(done) {
   src('dist/**/*.css')
      .pipe(purgecss({
         content: ['src/**/*.html'],
         //   rejected: true 
      }))
      .pipe(gulp.dest('dist/'));
      done();
};

function images(done) {
   src(paths.imageFiles)
      .pipe(imagemin([
         imagemin.gifsicle({
            interlaced: true
         }),
         imagemin.mozjpeg({
            quality: 75,
            progressive: true
         }),
         imagemin.optipng({
            optimizationLevel: 5
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
      ]))
      .pipe(gulp.dest(paths.imageDest));
      done();
};
function Avif(done) {
   const opciones = {
      quality: 50
   };
   src('src/img/**/*.{png,jpg}')
      .pipe(avif(opciones))
      .pipe(dest('build/img'))
   done();
};

function Webp(done) {
   src(paths.imageFiles)
      .pipe(imagemin([
         imagemin.gifsicle({
            interlaced: true
         }),
         imagemin.mozjpeg({
            quality: 75,
            progressive: true
         }),
         imagemin.optipng({
            optimizationLevel: 5
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
      ]))
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

gulp.task('watch', function () {
   gulp.watch(paths.sassFiles, gulp.series('sass'));
   // gulp.watch(imageFiles, gulp.series('images'));
   // gulp.watch(paths.jsFiles, gulp.series('scripts'));
});

function dev(done) {
   watch(paths.sassFiles, css);
   watch(paths.jsFiles, javascript);
   done();
}

exports.css = css;
exports.purgecss = purgecss;
exports.js = js;
exports.images = images;
exports.Webp = Webp;
exports.Avif = Avif;
exports.dev = parallel(images, Webp, Avif, js, dev);