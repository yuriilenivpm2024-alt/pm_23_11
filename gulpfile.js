const { src, dest, watch, series, parallel } = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();

// Шляхи до файлів
const paths = {
    html: { src: "app/html/*.html", dest: "dist/" },
    scss: { src: "app/scss/**/*.scss", dest: "dist/css/" },
    js:   { src: "app/js/*.js", dest: "dist/js/" },
    img:  { src: "app/img/**/*.{png,jpg,jpeg,svg,gif,webp}", dest: "dist/img/" }
};

// Просте копіювання HTML файлів без використання include
function html() {
    return src(paths.html.src)
        .pipe(dest(paths.html.dest))
        .pipe(browserSync.stream());
}

// SCSS → CSS з мініфікацією
function styles() {
    return src(paths.scss.src)
        .pipe(sass().on("error", sass.logError))
        .pipe(cssnano())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest(paths.scss.dest))
        .pipe(browserSync.stream());
}

// JS (об’єднання + мініфікація)
function scripts() {
    return src(paths.js.src)
        .pipe(concat("bundle.js"))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest(paths.js.dest))
        .pipe(browserSync.stream());
}

// Оптимізація картинок
function images() {
    return src(paths.img.src)
        .pipe(imagemin())
        .pipe(dest(paths.img.dest));
}

// BrowserSync + watcher
function serve() {
    browserSync.init({
        server: { baseDir: "dist" },
        open: false,
        notify: false
    });

    // Відслідковуємо зміни в HTML, SCSS, JS та зображеннях
    watch(paths.html.src, series(html, reload));
    watch(paths.scss.src, styles);
    watch(paths.js.src, scripts);
    watch(paths.img.src, series(images, reload));
}

// Функція для перезавантаження браузера
function reload(done) {
    browserSync.reload();
    done();
}

// Збірка
const build = series(parallel(html, styles, scripts, images));

// Експортуємо задачі
exports.default = series(build, serve);
exports.images = images;
exports.serve = serve;
