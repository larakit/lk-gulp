module.exports = {
    apps: {},
    init: function() {
        this.gulp = require('gulp');
        this.concat = require('gulp-concat');
        this.filter = require('gulp-custom-filter');
        this.gulpCopy = require('gulp-copy');
        this.autoprefixer = require('gulp-autoprefixer');
        this.cleanCss = require('gulp-clean-css');
        this.uglify = require('gulp-uglify');
        this.watch = require('gulp-watch');
        this.angularEmbedTemplates = require('gulp-angular-embed-templates');
        this.replace = require('gulp-replace');
        this.plugins = require('gulp-load-plugins')();
        this.gulp.task('sprites', require('./gulp-tasks/sprites')(this));
        this.gulp.task('fonts', require('./gulp-tasks/fonts')(this));
    },
    /**
     * Формируем основной таск из зарегистрированных приложений
     */
    start: function() {
        var app_names = Object.keys(this.apps), self = this;
        this.gulp.task('default', app_names, function() {
            // console.log(app_names);
            // console.log('default!');
            // console.log(self.apps);
        });
    },
    registerTaskPrepare: function(task, section) {
        console.log(section + '-prepare-' + task);
        this.gulp.task(section + '-prepare-' + task,
            require('./gulp-tasks/' + task + '/deploy')(this));
    },
    /**
     * Регистрация приложения
     * @param name
     * @param config
     */
    registerApp: function(name, config) {
        var self = this;
        /**
         * зарегистрировали задачи по предобработке
         */
        config.tasks.forEach(function(task) {
            self.registerTaskPrepare(task, name);
        });
        this.gulp.task(name, function() {
            self.section(config, name);
        });
        this.apps[name] = config;
        
    },
    section: function(config, name) {
        var self = this;
        self.apps[name] = config;
        config.tasks.forEach(function(task) {
            self.gulp.start(name + '-prepare-' + task);
        });
        var module;
        config.tasks.forEach(function(task) {
            meta = require('./gulp-tasks/' + task +
                '/register.json');
            if (undefined != meta.css) {
                config.css = config.css.concat(meta.css);
            }
            if (undefined != meta.js) {
                config.js = config.js.concat(meta.js);
            }
            if (undefined != meta.ng) {
                config.ng = config.ng.concat(meta.ng);
            }
        });
        //css
        this.gulp.src(config.css).
            pipe(this.concat(name + '.css')).
            pipe(this.gulp.dest('storage/gulp/'));
        //js
        this.gulp.src(config.js).
            pipe(this.concat(name + '.js')).
            pipe(this.gulp.dest('storage/gulp/'));
        //ng-app
        this.gulp.src('./vendor/larakit/lk-gulp/template_app.js').
            pipe(this.concat(name + '-app.js')).
            pipe(this.replace('[]', JSON.stringify(config.ng))).
            pipe(this.gulp.dest('storage/gulp/'));
        //ng-app-routes
        var routes = '$routeProvider', translate_template = '',
            translate_prefix,
            translate_fallback,
            translate = config.translate;
        if (undefined != translate) {
            translate_prefix = config.translate.prefix;
            translate_fallback = config.translate.fallback;
            translate_template = '$translateProvider.useStaticFilesLoader({\n' +
                '                prefix: \'' + translate_prefix + '\',\n' +
                '                suffix: \'.json\'\n' +
                '            });\n' +
                '            $translateProvider\n' +
                '                .preferredLanguage(\'' + translate_fallback +
                '\')\n' +
                '                .fallbackLanguage(\'' + translate_fallback +
                '\');\n' +
                '            $translateProvider.useCookieStorage();\n' +
                '            $translateProvider.useSanitizeValueStrategy(null);';
        }
        
        Object.keys(config.routes).map(function(url, data) {
            routes += '.when(\'' + url + '\',';
            routes += JSON.stringify(config.routes[url]);
            routes += ')';
        });
        this.gulp.src('./vendor/larakit/lk-gulp/template_app_routes.js').
            pipe(this.concat(name + '-app-routes.js')).
            pipe(this.replace('/*translate*/', translate_template)).
            pipe(this.replace('/*otherwise*/', config.otherwise)).
            pipe(this.replace('/*routes*/', routes)).
            pipe(this.gulp.dest('storage/gulp/'));
    },
};