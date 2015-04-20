'use strict';

var gulp = require('gulp'),
    less = require('gulp-less'),
    prefixer = require('gulp-autoprefixer'),
    prefixerOptions = { browsers: ['last 4 versions'] },
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    connect = require('gulp-connect'),
    opn = require('opn'),
    rigger = require('gulp-rigger');
    
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
        js: 'src/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
        data: 'src/data/*.json', //Папка для тестовых данных в формате json 
        styles: 'src/styles/main.less',
        content: 'src/content/**/*.*', 
        images: 'src/images/**/*.*', //Синтаксис images/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        data: 'src/data/*.json',
        styles: 'src/styles/**/*.less',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var server = {
    host: 'localhost',
    port: '9000'
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(connect.reload()); //И перезагрузим наш сервер для обновлений
});

gulp.task('style:build', function () {
    gulp.src(path.src.styles) //Выберем наш main.less
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(less()) //Скомпилируем
        .pipe(sourcemaps.write())
        //.pipe(prefixer(prefixerOptions))
        .pipe(gulp.dest(path.build.styles)) //И в build
        .pipe(connect.reload());
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('image:build', function () {
    gulp.src(path.src.images) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.images)) //И бросим в build
        .pipe(connect.reload());

    gulp.src(path.src.content) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.content)) //И бросим в build
        .pipe(connect.reload());
});

gulp.task('js:build', function () {
    gulp.src(path.src.data) //Найдем наш main файл
        .pipe(gulp.dest(path.build.data));
    
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(connect.reload()); //И перезагрузим сервер
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

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

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
    gulp.start('build');
});

gulp.task('openbrowser', function() {
    opn( 'http://' + server.host + ':' + server.port + '/build' );
});

gulp.task('webserver', function() {
    connect.server({
        host: server.host,
        port: server.port,
        livereload: true
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);
gulp.task('open', ['build', 'webserver', 'watch', 'openbrowser']);
