'use strict';
var util = require('gulp-util');
module.exports = {
    path: {
        build: { //Тут мы укажем куда складывать готовые после сборки файлы
            php: './build/',
            js: './build/js/',
            css: './build/css/',
            img: './build/images/',
            fonts: './build/fonts/'
        },
        src: { //Пути откуда брать исходники
            php: './src/**/*.php',               //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
            js: './src/js/**/*.js',              //В стилях и скриптах нам понадобятся только main файлы
            style: './src/style/style.less',    //
            img: './src/images/**/*.*',         //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
            fonts: './src/fonts/**/*.*'
        },
        watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
            php: ['./src/**/*.php'],
            js: ['./src/js/**/*.js'],
            style: ['./src/style/**/*.less'],
            img: ['./src/images/**/*.*'],
            fonts: ['./src/fonts/**/*.*'],
            bower: ['./bower_components/**', './bower.json']
        },
        clean: './build/**'
    },
    options: {
        plumber: {
            errorHandler: function (err) {
                util.log([(err.name + ' in ' + err.plugin).bold.red, '', err.message, ''].join('\n'));
                if (util.env.beep) {
                    util.beep();
                }
                this.emit('end');
            }
        },
        browserSync: {
            // server: {
            //     baseDir: "./build"
            // },
            // tunnel: true,
            // host: 'one.local',
            proxy: "one.local",
            port: 9000,
            logPrefix: "browserSync"
        },
        gulpLoadPlugins: {
            pattern: ['gulp-*', 'gulp.*', 'imagemin-pngquant', 'main-bower-files', 'rimraf', 'run-sequence'],
            rename: {
                'imagemin-pngquant': 'pngquant',
                'run-sequence': 'sequence'
            }
        },
        mainBowerFiles: {
            // main options
            options: {
                base: 'bower_components'
            }
        }
    }
};
