const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// === HTML ===
const html_task = () => {
    return src('app/**/*.html')
        .pipe(dest('dist'));
};

// === SCSS ===
const scss_task = () => {
    return src('app/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/css'));
};

// === JS ===
const js_task = () => {
    return src('app/js/*.js')
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'));
};

// === Images ===
const img_task = () => {
    return src('app/img/*')
        .pipe(imagemin())
        .pipe(dest('dist/img'));
};

// === Bootstrap CSS ===
const bootstrapCSS = () => {
    return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(dest('dist/css'));
};

// === Bootstrap JS ===
const bootstrapJS = () => {
    return src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(dest('dist/js'));
};

// === BrowserSync (separate task) ===
const browserSync_task = (done) => {
    browserSync.init({
        server: {
            baseDir: 'dist',
        },
        notify: false,
        open: true,
    });
    done();
};

// === Watch task ===
const watch_task = () => {
    watch('app/**/*.html', series(html_task, reload));
    watch('app/scss/**/*.scss', series(scss_task, reload));
    watch('app/js/**/*.js', series(js_task, reload));
    watch('app/img/*', series(img_task, reload));
};

// === Reload helper ===
const reload = (done) => {
    browserSync.reload();
    done();
};

// === Default task ===
exports.default = series(
    parallel(html_task, scss_task, js_task, img_task, bootstrapCSS, bootstrapJS),
    browserSync_task,
    watch_task
);