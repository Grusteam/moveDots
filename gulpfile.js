'use strict';

// Поключение зависимостей
var gulp        = require('gulp'),
    cleanCSS    = require('gulp-clean-css'),
    rigger      = require('gulp-rigger'),
    postcss     = require('gulp-postcss'),
    sourcemaps  = require('gulp-sourcemaps'),
    imagemin    = require('gulp-imagemin'),
    gnf         = require('gulp-npm-files'),
    rimraf      = require('rimraf'),
    browserSync = require('browser-sync').create();

// Пути
var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html:    'build/',
        js:      'build/js/',
        data:    'build/data/',
        styles:  'build/styles/',
        content: 'build/content/',
        images:  'build/images/',
        fonts:   'build/fonts/',
        modules: 'build/node_modules'
    },

    src: { //Пути откуда брать исходники
        html:    'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js:      'src/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
        data:    'src/data/*.json', //Папка для тестовых данных в формате json
        styles:  'src/styles/*.css',
        content: 'src/content/**/*.*',
        images:  'src/images/**/*.*', //Синтаксис images/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts:   'src/fonts/**/*.*',
        favicon: 'src/favicon.png'
    },

    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html:   'src/**/*.html',
        js:     'src/js/**/*.js',
        data:   'src/data/*.json',
        styles: 'src/styles/**/*.css',
        images: 'src/images/**/*.*',
        fonts:  'src/fonts/**/*.*'
    },

    clean: './build'
};

// Сборка html и фавикон
gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(browserSync.stream());

    gulp.src(path.src.favicon)
        .pipe(gulp.dest('build/'));
});

// Сборка стилей
gulp.task('style:build', function () {
    gulp.src(path.src.styles)
        .pipe(sourcemaps.init())
        .pipe(postcss([ require('autoprefixer'), require('precss') ]))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.build.styles))
        .pipe(browserSync.stream());
});

// Сборка шрифтов
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browserSync.stream());
});

// Сборка и сжатие изображений
gulp.task('image:build', function () {
    gulp.src(path.src.images) //Выберем наши картинки
        .pipe(gulp.dest(path.build.images)) //И бросим в build
        .pipe(browserSync.stream());

    gulp.src(path.src.content) //Выберем наши картинки
        .pipe(gulp.dest(path.build.content)) //И бросим в build
        .pipe(browserSync.stream());
});

// Сборка js и json
gulp.task('js:build', function () {
    gulp.src(path.src.data) //Найдем наш main файл
        .pipe(gulp.dest(path.build.data))
        .pipe(browserSync.stream());

    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(browserSync.stream());
});

// Перенос зависимостей в build
gulp.task('clean-module', function (cb) {
    return rimraf(path.build.modules, cb);
});

gulp.task('module', ['clean-module'], function() {
    gulp.src(gnf(), {base:'./'})
        .pipe(gulp.dest('./build'));
});

gulp.task('re-module', ['module'], function() {
    gulp.src('./package.json')
        .pipe(browserSync.stream());
});

// Построение структуры Build
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    're-module'
]);

// Отслеживание изменений файлов
gulp.task('watch', ['server'], function(){
    gulp.watch([path.watch.html], ['html:build']);
    gulp.watch([path.watch.styles], ['style:build']);
    gulp.watch([path.watch.js, path.watch.data], ['js:build']);
    gulp.watch([path.watch.images], ['image:build']);
    gulp.watch([path.watch.fonts], ['fonts:build']);

    gulp.watch('./package.json', function(event) {
        if (event.path.indexOf('package.json') > -1) {
            gulp.start('re-module');
        }
    });
});

// Удаление папки build
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

// Запуск сервера
gulp.task('server', ['build'], function() {
    var
        argv = process.argv, // Берем аргументы из строки запуска команды
        open = argv.indexOf('--open') > -1,
        spa  = argv.indexOf('--spa') > -1,
        routes = {
            '/test': '/index.html',
        };

    console.log('argv', argv);

    browserSync.init({
        open: open,

        server: {
            baseDir: './build',
            routes: routes
        },

        middleware: function(req, res, next) {
            // Нужен для редиректа всех ссылок (кроме ресурсов) на index.html: https://vinaygopinath.me/blog/tech/url-redirection-with-browsersync/
            // console.log('req.url', req.url);
            
            /*if (!spa) { 
            // временно отключил. Проверить необходимость. 
            // В данном случае будут работать все ссылки на файлы + те, что прописаны в роуте
                return next();
            }*/

            for (var key in routes) {
                if (req.url === key) {
                    req.url = routes[key];
                }
            }

            return next();
        },

        port: 8080
    });
});

// Сжатие изображений
gulp.task('image', function() {
    gulp.src(path.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.images))
});

// Команда Gulp
gulp.task('default', ['watch']);
