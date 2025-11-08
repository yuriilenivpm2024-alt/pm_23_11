const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const gulpIf = require('gulp-if');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const { deleteAsync } = require('del');

const isProd = process.argv.includes('--prod');

const paths = {
    root: 'dist',
    html: {
        src: ['app/html/*.html', '!app/html/_*.html'],
        watch: 'app/html/**/*.html',
        dest: 'dist/'
    },
    scss: {
        src: 'app/scss/main.scss',
        watch: 'app/scss/**/*.scss',
        dest: 'dist/css/'
    },
    js: {
        src: ['app/js/**/*.js', '!app/js/**/*.test.js'],
        watch: 'app/js/**/*.js',
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

const plumberNotify = (title) =>
    plumber({
        errorHandler: notify.onError({
            title,
            sound: false,
            message: 'Error: <%= error.message %>'
        })
    });

function clean() {
    return deleteAsync([paths.root]);
}

function html() {
    return src(paths.html.src)
        .pipe(plumberNotify('HTML'))
        .pipe(fileInclude({ prefix: '@@', basepath: '@file', indent: true }))
        .pipe(dest(paths.html.dest))
        .pipe(browserSync.stream());
}

function styles() {
    return src(paths.scss.src, { sourcemaps: !isProd })
        .pipe(plumberNotify('SCSS'))
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(gulpIf(isProd, cleanCSS({ level: 2 })))
        .pipe(rename({ basename: 'main', suffix: '.min' }))
        .pipe(dest(paths.scss.dest, { sourcemaps: '.' }))
        .pipe(browserSync.stream());
}

function scripts() {
    return src(paths.js.src, { sourcemaps: !isProd })
        .pipe(plumberNotify('Scripts'))
        .pipe(concat('resume.js'))
        .pipe(
            babel({
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: '> 0.25%, not dead'
                        }
                    ]
                ]
            })
        )
        .pipe(gulpIf(isProd, terser()))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest(paths.js.dest, { sourcemaps: '.' }))
        .pipe(browserSync.stream());
}

function images() {
    return src(paths.img.src).pipe(gulpIf(isProd, imagemin())).pipe(dest(paths.img.dest));
}

function bootstrapCss() {
    return src(paths.bootstrap.css.src).pipe(dest(paths.bootstrap.css.dest));
}

function bootstrapJs() {
    return src(paths.bootstrap.js.src).pipe(dest(paths.bootstrap.js.dest));
}

function reload(done) {
    browserSync.reload();
    done();
}

function serve() {
    browserSync.init({
        server: { baseDir: paths.root },
        notify: false,
        open: false,
        ui: false,
        ghostMode: false
    });

    watch(paths.html.watch, html);
    watch(paths.scss.watch, styles);
    watch(paths.js.watch, scripts);
    watch(paths.img.src, series(images, reload));
}

const assets = parallel(html, styles, scripts, images, bootstrapCss, bootstrapJs);
const build = series(clean, assets);

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.bootstrap = parallel(bootstrapCss, bootstrapJs);
exports.build = build;
exports.serve = serve;
exports.default = series(build, serve);