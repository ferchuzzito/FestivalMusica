const gulp = require('gulp');

const paths = {
   sassFiles: './src/scss/**/*.scss',
   cssDest: './src/css',
   imageFiles: './src/assets/img/**/*',
   imageDest: './src/assets/images',
   jsFiles: './src/js/**/*.js',
   jsBundle: './src/js',
};
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const autoprefixer = require('gulp-autoprefixer');
sass.compiler = require('node-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('sass', function () {
   // sass directory
   return gulp.src(paths.sassFiles)
      // sourcemaps
      .pipe(sourcemaps.init())
      // outputstyle (nested, compact, expanded, compressed)
      .pipe(sass({
         outputStyle: 'compressed'
      }).on('error', sass.logError))
      // autoprefixer
      .pipe(autoprefixer({
         overrideBrowserslist: ['last 15 versions'],
         cascade: false
      }))
      // sourcemaps output directory
      .pipe(sourcemaps.write(('./')))
      // css output directory
      .pipe(gulp.dest(paths.cssDest));
});

gulp.task('images', function () {
   return gulp.src(paths.imageFiles)
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
      .pipe(gulp.dest(paths.imageDest))
});

gulp.task('scripts', function () {
   return gulp.src(paths.jsFiles)
      .pipe(sourcemaps.init())
      .pipe(concat('FestivalMusica.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.jsBundle));
});

gulp.task('watch', function () {
   gulp.watch(paths.sassFiles, gulp.series('sass'));
   // gulp.watch(imageFiles, gulp.series('images'));
   // gulp.watch(paths.jsFiles, gulp.series('scripts'));
});