'use strict'

const
  gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  csso = require('gulp-csso'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  include = require('gulp-file-include'),
  browserSync = require('browser-sync'),
  size = require('gulp-filesize'),
  imagemin = require('gulp-imagemin'),
  recompress = require('imagemin-jpeg-recompress'),

  srcStylesPath = './src/scss/*.scss',
  destStylePath = './public/css/',

  srcScriptsPath = './src/js/**/*.js',
  destScriptsPath = './public/js/',

  srcHtmlPath = './src/html/**/*.html',
  destHtmlPath = './public/',

  srcImgPath = './src/img/**/*.+(png|jpg|jpeg|gif|svg|ico)',
  destImgPath = './public/img/',

  argv = require('yargs').argv,

  isDev = (argv.dev !== undefined)

gulp.task('scss', () => {
  const a = gulp.src(srcStylesPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destStylePath))

  if (isDev) {
    a.pipe(
      browserSync.reload({
        stream: true
      })
    )
  }

  return a
})

gulp.task('js', () => {
  const a = gulp.src(srcScriptsPath)
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(concat('main.js'))

  if (!isDev) {
    a.pipe(uglify())
  }

  a.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(destScriptsPath))

  if (isDev) {
    a.pipe(
      browserSync.reload({
        stream: true
      })
    )
  }

  return a
})

gulp.task('html', () => {
  const a = gulp.src('./src/html/*.html')
    .pipe(include())
    .pipe(gulp.dest(destHtmlPath))

  if (isDev) {
    a.pipe(
      browserSync.reload({
        stream: true
      })
    )
  }

  return a
})

gulp.task('img', () => {
  return gulp
    .src(srcImgPath)
    .pipe(size())
    .pipe(
      imagemin([
        recompress({
          loops: 4,
          min: 70,
          max: 80,
          quality: 'high'
        }),
        imagemin.gifsicle(),
        imagemin.optipng(),
        imagemin.svgo()
      ])
    )
    .pipe(gulp.dest('./public/img/'))
    .pipe(size())
})

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './public'
    },
    browser: ['chrome'],
    host: '192.168.0.103'
  })
})

gulp.task('watch', () => {
  gulp.watch(srcStylesPath, gulp.parallel('scss'))
  gulp.watch(srcScriptsPath, gulp.parallel('js'))
  gulp.watch(srcImgPath, gulp.parallel('img'))
  gulp.watch(srcHtmlPath, gulp.parallel('html'))
})

gulp.task('build',
  gulp.parallel(
    'scss',
    'js',
    'img',
    'html'
  )
)

gulp.task('default',
  gulp.parallel(
    'browser-sync',
    'watch',
    'scss',
    'js',
    'img',
    'html'
  )
)
