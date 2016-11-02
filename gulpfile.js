'use strict';

var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    rigger = require('gulp-rigger'),
    clean = require('gulp-dest-clean'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    gnf = require('gulp-npm-files'),
    browserSync = require('browser-sync').create();
// Пути
var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        data: 'build/data/',
        styles: 'build/styles/',
        content: 'build/content/',
        images: 'build/images/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        modules: 'node_modules/*.*', // подключенные модули
        js: 'src/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
        data: 'src/data/*.json', //Папка для тестовых данных в формате json
        styles: 'src/styles/*.css',
        content: 'src/content/**/*.*',
        images: 'src/images/**/*.*', //Синтаксис images/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*',
        favicon: 'src/favicon.png'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        data: 'src/data/*.json',
        styles: 'src/styles/**/*.css',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(browserSync.reload({stream:true})); //И перезагрузим наш сервер для обновлений
        
    gulp.src(path.src.favicon)
        .pipe(gulp.dest('build/'));
});

gulp.task('style:build', function () {
    gulp.src(path.src.styles)
        .pipe(sourcemaps.init())
        .pipe(postcss([ require('autoprefixer'), require('precss') ]))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.styles))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('image:build', function () {
    gulp.src(path.src.images) //Выберем наши картинки
        .pipe(gulp.dest(path.build.images)) //И бросим в build
        .pipe(browserSync.reload({stream:true}));

    gulp.src(path.src.content) //Выберем наши картинки
        .pipe(gulp.dest(path.build.content)) //И бросим в build
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.data) //Найдем наш main файл
        .pipe(gulp.dest(path.build.data));

    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(browserSync.reload({stream:true})); //И перезагрузим сервер
});
// Построение структуры Build
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);
// Отслеживание изменений файлов
gulp.task('watch', function(){
    gulp.watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    gulp.watch([path.watch.styles], function(event, cb) {
        gulp.start('style:build');
    });
    gulp.watch([path.watch.js, path.watch.data], function(event, cb) {
        gulp.start('js:build');
    });
    gulp.watch([path.watch.images], function(event, cb) {
        gulp.start('image:build');
    });
    gulp.watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});
// Очистка папки build
gulp.task('clean', function () {
    gulp.src(path.clean).pipe(clean(path.clean));
});
// Запуск сервера
gulp.task('server', function() {
    browserSync.init({ 
        server: {
            baseDir: "./build"
        },
        port: 8080, 
        tunnel: true
    });
});
// Сжатие изображений
gulp.task('image', function() {
    gulp.src(path.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.images))
});
// Команда Gulp
gulp.task('default', ['build', 'server', 'watch']);
