'use strict';

var gulp           = require('gulp');
var config         = require('./gulp/config.js');
var $              = require('gulp-load-plugins')(config.options.gulpLoadPlugins);
var browserSync    = require('browser-sync').create();
var reload         = browserSync.reload;

gulp.task('bower:build', function() {
    const jsFilter = $.filter('**/*.js', {restore: true});
    const cssFilter = $.filter(['**/*.css', '**/*.less'], {restore: true});

    return gulp.src($.mainBowerFiles())
        .pipe($.plumber(config.options.plumber))
        // Сначала перенесем скрипты
        .pipe(jsFilter)
        .pipe($.order(["**/jquery.js", "**/*.js"]))
        .pipe($.concat('vendor.js'))
        .pipe($.sourcemaps.init())
        .pipe($.uglify())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(config.path.build.js))
        .pipe(jsFilter.restore)
        // Затем перенесем стили
        .pipe(cssFilter)
        .pipe($.rename({extname: '.less'}))
        .pipe($.concat('vendor.less'))
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.autoprefixer())
        .pipe($.csso())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(config.path.build.css))
        .pipe(cssFilter.restore)
        .pipe(reload({stream: true}));
});

gulp.task('php:build', function () {
    gulp.src(config.path.src.php)                 //Выберем файлы по нужному пути
        .pipe($.plumber(config.options.plumber))
        .pipe($.newer(config.path.build.php))
        .pipe(gulp.dest(config.path.build.php))   //Выплюнем их в папку build
        .pipe(reload({stream: true}));      //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', function () {
    gulp.src(config.path.src.js)                   //Найдем наш main файл
        .pipe($.plumber(config.options.plumber))
        .pipe($.order([
            "**/init-app.js",
            "**/helpers.js",
            "**/controls/**/*.js",
            "**/page/**/*.js",
            "**/app.js"
        ]))
        .pipe($.concat('app.js'))
        .pipe($.sourcemaps.init())          //Инициализируем sourcemap
        .pipe($.uglify())                   //Сожмем наш js
        .pipe($.sourcemaps.write('.'))         //Пропишем карты
        .pipe(gulp.dest(config.path.build.js))     //Выплюнем готовый файл в build
        .pipe(reload({stream: true}));      //И перезагрузим сервер
});

gulp.task('style:build', function () {
    gulp.src(config.path.src.style)                //Выберем наш main.scss
        .pipe($.plumber(config.options.plumber))
        .pipe($.sourcemaps.init())          //То же самое что и с js
        .pipe($.less())                     //Скомпилируем
        .pipe($.autoprefixer())             //Добавим вендорные префиксы
        .pipe($.csso())                     //Сожмем
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(config.path.build.css))    //И в build
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(config.path.src.img)                  //Выберем наши картинки
        .pipe($.plumber(config.options.plumber))
        .pipe($.newer(config.path.build.img))
        .pipe($.imagemin({                  //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [$.pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(config.path.build.img))    //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(config.path.src.fonts)
        .pipe($.plumber(config.options.plumber))
        .pipe(gulp.dest(config.path.build.fonts))
});

gulp.task('clean', function (cb) {
    $.rimraf(config.path.clean, cb);
});

gulp.task('build', function (cb) {
    $.sequence(
        'clean',
        [
            'php:build',
            'bower:build',
            'js:build',
            'style:build',
            'fonts:build',
            'image:build'
        ],
        cb
    );
});

gulp.task('watch', function(){
    $.watch(config.path.watch.php, function(event, cb) {
        gulp.start('php:build');
    });

    $.watch(config.path.watch.style, function(event, cb) {
        gulp.start('style:build');
    });

    $.watch(config.path.watch.js, function(event, cb) {
        gulp.start('js:build');
    });

    $.watch(config.path.watch.img, function(event, cb) {
        gulp.start('image:build');
    });

    $.watch(config.path.watch.fonts, function(event, cb) {
        gulp.start('fonts:build');
    });

    $.watch(config.path.watch.bower, function(event, cb) {
        gulp.start('bower:build');
    });
});

gulp.task('webserver', function () {
    browserSync.init(config.options.browserSync);
});

gulp.task('default', [
    'build',
    'webserver',
    'watch'
]);