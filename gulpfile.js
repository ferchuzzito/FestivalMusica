import gulp from 'gulp';
const { src, watch, parallel } = gulp;

const paths = {
   styles: {
    src: './src/scss/**/*.scss',
    dest: './build/css'
  },
  scripts: {
   src: './src/js/**/*.js',
   dest: './build/js'
 },
  images: {
   src: './src/assets/img/**/*',
   dest: './build/assets/img'
 }
};

// CSS
import sass from 'gulp-sass';
import * as dartSass from 'sass'
import plumber from 'gulp-plumber';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import purgecss from 'gulp-purgecss';

// Javascript
import terser from 'gulp-terser';

// Initialize gulp-sass with dart-sass
const sassCompiler = sass(dartSass);

// Tareas
export function css(done) {
   // sass directory
   src(paths.styles.src)
      // sourcemaps
      .pipe(sourcemaps.init())
      .pipe(plumber())
      // outputstyle (nested, compact, expanded, compressed)
      .pipe(sassCompiler({ outputStyle: 'compressed' })/* .on('error', sass.logError) */)
      // autoprefixer
      .pipe(postcss([autoprefixer({
         overrideBrowserslist: ['> .5%, last 10 versions']
      })]))
      .pipe(sourcemaps.write('./'))
      // css output directory
      .pipe(gulp.dest(paths.styles.dest));
   done();
};

export function cleanCSS(done) {
   src('build/**/*.css')
      .pipe(purgecss({
         content: ['./*.html'],
         rejected: true 
      }))
      .pipe(gulp.dest('build/css'));
   done();
};

export function js(done) {
   src(paths.scripts.src)
      .pipe(sourcemaps.init())
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.scripts.dest));
   done();
};

 export function dev(done) {
   watch(paths.styles.src, css);
   watch(paths.scripts.src, js);
   done();
}

// const build = parallel(images, webpImages, avifImages, dev);
