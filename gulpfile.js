import gulp from 'gulp';
const { src, watch, parallel } = gulp;
import path from 'path'
import fs from 'fs'
import { glob } from 'glob'
import sharp from 'sharp'

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
      .pipe(sassCompiler({ outputStyle: 'compressed' }) .on('error', sassCompiler.logError))
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

export async function crop(done) {
   const inputFolder = 'src/assets/img/gallery/edm'
   const outputFolder = 'src/assets/img/gallery/thumb';
   const width = 250;
   const height = 180;
   if (!fs.existsSync(outputFolder)) {
       fs.mkdirSync(outputFolder, { recursive: true })
   }
   const images = fs.readdirSync(inputFolder).filter(file => {
       return /\.(jpg)$/i.test(path.extname(file));
   });
   try {
       images.forEach(file => {
           const inputFile = path.join(inputFolder, file)
           const outputFile = path.join(outputFolder, file)
           sharp(inputFile) 
               .resize(width, height, {
                   position: 'centre'
               })
               .toFile(outputFile)
       });

       done()
   } catch (error) {
       console.log(error)
   }
}

export async function images(done) {
   const srcDir = './src/assets/img';
   const buildDir = './build/img';
   const images =  await glob('./src/assets/img/**/*{jpg,png}')

   images.forEach(file => {
       const relativePath = path.relative(srcDir, path.dirname(file));
       const outputSubDir = path.join(buildDir, relativePath);
       procesarImagenes(file, outputSubDir);
   });
   done();
}

function procesarImagenes(file, outputSubDir) {
   if (!fs.existsSync(outputSubDir)) {
       fs.mkdirSync(outputSubDir, { recursive: true })
   }
   const baseName = path.basename(file, path.extname(file))
   const extName = path.extname(file)
   const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
   const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
   const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)

   const options = { quality: 80 }
   sharp(file).jpeg(options).toFile(outputFile)
   sharp(file).webp(options).toFile(outputFileWebp)
   sharp(file).avif().toFile(outputFileAvif)
}

 export function dev(done) {
   watch(paths.styles.src, css);
   watch(paths.scripts.src, js);
   done();
}

// const build = parallel(images, webpImages, avifImages, dev);
