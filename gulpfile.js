const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');

const paths = {
  html: {
    src: ['app/html/*.html', '!app/html/_*.html'],
    watch: 'app/html/**/*.html',
    dest: 'dist/'
  },
  scss: {
    src: 'app/scss/*.scss',
    watch: 'app/scss/**/*.scss',
    dest: 'dist/css/'
  },
  js: {
    src: 'app/js/*.js',
    dest: 'dist/js/'
  },
  img: {
    src: 'app/img/**/*.{png,jpg,jpeg,svg,gif,webp}',
    dest: 'dist/img/'
  },
  bootstrap: {
    css: {
      src: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
      dest: 'dist/css/'
    },
    js: {
      src: 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
      dest: 'dist/js/'
    }
  }
};

function html() {
  return src(paths.html.src)
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
    .pipe(dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function styles() {
  return src(paths.scss.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(paths.js.src)
    .pipe(concat('resume.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream());
}

function images() {
  return src(paths.img.src)
    .pipe(imagemin())
    .pipe(dest(paths.img.dest));
}

function bootstrapCss() {
  return src(paths.bootstrap.css.src)
    .pipe(dest(paths.bootstrap.css.dest));
}

function bootstrapJs() {
  return src(paths.bootstrap.js.src)
    .pipe(dest(paths.bootstrap.js.dest));
}

function reload(done) {
  browserSync.reload();
  done();
}

function serve() {
  browserSync.init({
    server: { baseDir: 'dist' },
    open: false,
    notify: false
  });

  watch(paths.html.watch, series(html, reload));
  watch(paths.scss.watch, styles);
  watch(paths.js.src, scripts);
  watch(paths.img.src, series(images, reload));
}

const build = series(parallel(html, styles, scripts, images, bootstrapCss, bootstrapJs));

exports.default = series(build, serve);
exports.build = build;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.bootstrap = parallel(bootstrapCss, bootstrapJs);
exports.serve = serve;
