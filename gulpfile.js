	// Определяем переменную "preprocessor"
    let preprocessor = 'sass'; 
 
    // Определяем константы Gulp
    const { src, dest, parallel, series, watch } = require('gulp');
     
    // Подключаем Browsersync
    const browserSync = require('browser-sync').create();
     
    // Подключаем gulp-concat
    const concat = require('gulp-concat');
     
    // Подключаем gulp-uglify-es
    const uglify = require('gulp-uglify-es').default;
     
    // Подключаем модули gulp-sass и gulp-less
    const sass = require('gulp-sass');
    // const less = require('gulp-less');
     
    // Подключаем Autoprefixer
    const autoprefixer = require('gulp-autoprefixer');
     
    // Подключаем модуль gulp-clean-css
    const cleancss = require('gulp-clean-css');
     
    // // Подключаем gulp-imagemin для работы с изображениями
    // const imagemin = require('gulp-imagemin');
     
    // Подключаем модуль gulp-newer
    const newer = require('gulp-newer');
     
    // Подключаем модуль del
    const del = require('del');

    //Подключаем модуль Pug
    const pugg = require('gulp-pug');

    //Подключаем модуль include
    const fileinclude  = require('gulp-file-include');



    //Вставка файлов с кодом в код (JS)
    // var fileinclude  = require('gulp-file-include');




     
    // Определяем логику работы Browsersync
    function browsersync() {
        browserSync.init({ // Инициализация Browsersync
            server: { baseDir: 'dist/' }, // Указываем папку сервера
            notify: false, // Отключаем уведомления
            online: true // Режим работы: true или false
        })
    }
     
    // function html() {
    //     return src(['app/*.html', '!app/_*.html'])// Берём файлы из источников
    //             .pipe(dest('dist/'))// Выгружаем готовый файл в папку назначения
    //             .pipe(browserSync.stream())// Триггерим Browsersync для обновления страницы
    // };
    



    function pug() {
        return src([
            'app/**/*.pug', '!app/**/_*.pug', '!app/components/**/*.pug'  // Берём файлы из источников
        ]) // Параметр "base" сохраняет структуру проекта при копировании
        .pipe(pugg({
            pretty: true //Расшифровываем в классический HTML
        }))
        .pipe(dest('dist/')) // Выгружаем готовый файл в папку назначения
        .pipe(browserSync.stream())// Триггерим Browsersync для обновления страницы
    }


    
    function scripts() {
        return src([ // Берём файлы из источников
            // 'node_modules/jquery/dist/jquery.min.js', // Пример подключения библиотеки
            '!app/components/**/*.js', 
            '!app/js/**/_*.js', 
            'app/js/libs*.js',
            'app/js/index.js' // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
            ])
        .pipe(fileinclude({   // Оюьединяем (инклюде) файлы в один
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .pipe(concat('index.min.js')) // Конкатенируем в один файл
        // .pipe(uglify()) // Сжимаем JavaScript
        .pipe(dest('dist/js')) // Выгружаем готовый файл в папку назначения
        .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
    }
     
    function styles() {
        // return src('app/' + preprocessor + '/main.' + preprocessor + '') // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
        return src([
            '!app/sass/libs*.scss',
			'!app/sass/**/*.scss',
			'!app/sass/**/_*.scss',
			'!app/sass/**/__*.scss',
			'app/sass/**/*.sass',
			'!app/sass/**/_*.sass',
			'!app/sass/**/*.scss'
		]) // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
        .pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
        .pipe(concat('index.min.css')) // Конкатенируем в файл app.min.js
        .pipe(autoprefixer({ overrideBrowserslist: ['last 15 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
        // .pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
        .pipe(dest('dist/css')) // Выгрузим результат в папку "app/css/"
        .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
    }
     
    // function images() {
    //     return src('app/images/src/**/*') // Берём все изображения из папки источника
    //     .pipe(newer('app/images/dest/')) // Проверяем, было ли изменено (сжато) изображение ранее
    //     .pipe(imagemin()) // Сжимаем и оптимизируем изображеня
    //     .pipe(dest('app/images/dest/')) // Выгружаем оптимизированные изображения в папку назначения
    // }
     
    // function cleanimg() {
    //     return del('app/images/dest/**/*', { force: true }) // Удаляем всё содержимое папки "app/images/dest/"
    // }
     
    function assets() {
        return src([ // Выбираем нужные файлы
            // 'app/css/**/*.min.css',
            // 'app/js/**/*.min.js',
            // 'app/images/dest/**/*',
            'app/assets/**/*',
            // 'app/**/*.html',
            ], { base: 'app' }) // Параметр "base" сохраняет структуру проекта при копировании
        .pipe(dest('dist/')) // Выгружаем в папку с финальной сборкой
    }
     
    function cleandist() {
        return del('dist/**/*', { force: true }) // Удаляем всё содержимое папки "dist/"
    }
     
    function startwatch() {
     
        // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
        watch(['app/**/*.js', 'app/pages/**/*.js', 'app/js/libs*.js', 'app/components/**/*.js', 'app/elements/**/*.js'], scripts);
        
        // Мониторим файлы препроцессора на изменения
        watch(['app/**/*.scss', 'app/**/*.sass'], styles);
     
        // // Мониторим файлы HTML на изменения
        // watch('app/**/*.html', html);

     
        // // Мониторим папку-источник изображений и выполняем images(), если есть изменения
        // watch('app/images/src/**/*', images);

        // Мониторим файлы PUG
        watch('app/**/*.pug', pug);

        // Мониторим файлы assets
        watch('app/assets/**/*.*', assets);


     
    }
     
    // Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
    exports.browsersync = browsersync;
     
    // Экспортируем функцию scripts() в таск scripts
    exports.scripts = scripts;
     
    // Экспортируем функцию styles() в таск styles
    exports.styles = styles;
     
    // // Экспорт функции images() в таск images
    // exports.images = images;
     
    // // Экспортируем функцию cleanimg() как таск cleanimg
    // exports.cleanimg = cleanimg;

    // Экспортируем функцию pug() как таск pug
    exports.pug = pug;

    // // Экспортируем функцию html() как таск html
    // exports.html = html;

    // Экспортируем функцию pug() как таск assets
    exports.assets = assets;


     
    // Создаём новый таск "build", который последовательно выполняет нужные операции
    exports.build = series(cleandist, pug, styles, scripts, assets);
     
    // Экспортируем дефолтный таск с нужным набором функций
    exports.default = parallel(browsersync, startwatch);