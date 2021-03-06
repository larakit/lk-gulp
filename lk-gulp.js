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
        this.build_app_dev_css = require('gulp-load-plugins')();
    },
    /**
     * Формируем основной таск из зарегистрированных приложений
     */
    start: function() {
        var app_names = Object.keys(this.apps), self = this;
        self.gulp.task('default', app_names, function() {
            // console.log(app_names);
            // console.log('default!');
            // console.log(self.apps);
        });
        self.gulp.task('watch', function() {
            self.watch('public/!/app/**/*.css', function() {
                app_names.forEach(function(app) {
                    self.gulp.start('app-css-dev-' + app);
                    self.gulp.start('app-css-prod-' + app);
                });
            });
            self.watch('public/!/app/**/*.js', function() {
                app_names.forEach(function(app) {
                    self.gulp.start('app-js-dev-' + app);
                    self.gulp.start('app-js-prod-' + app);
                });
            });
        });
    },
    registerTaskPrepare: function(task, section) {
        var fs = require('fs');
        var self = this;
        var t;
        this.gulp.task(section + '-prepare-' + task, function() {
            fs.access('vendor/larakit/lk-gulp/gulp-tasks/' + task +
                '/deploy.js', fs.constants.R_OK, function(err) {
                if (!err) {
                    t = require('./gulp-tasks/' + task + '/deploy')(self,
                        section)();
                }
            });
        });
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
        config.vendor.forEach(function(task) {
            self.registerTaskPrepare(task, name);
        });
        this.gulp.task(name, function() {
            self.section(config, name);
        });
        this.apps[name] = config;
        self.gulp.task('app-css-dev-' + name,
            require('./gulp-tasks/app-css-dev')(self, name, config));
        self.gulp.task('app-css-prod-' + name,
            require('./gulp-tasks/app-css-prod')(self, name, config));
        self.gulp.task('app-js-dev-' + name,
            require('./gulp-tasks/app-js-dev')(self, name, config));
        self.gulp.task('app-js-prod-' + name,
            require('./gulp-tasks/app-js-prod')(self, name, config));
        
    },
    section: function(config, name) {
        var self = this;
        self.apps[name] = config;
        config.vendor.forEach(function(task) {
            self.gulp.start(name + '-prepare-' + task);
        });
        self.gulp.start('app-css-dev-' + name);
        self.gulp.start('app-css-prod-' + name);
        self.gulp.start('app-js-dev-' + name);
        self.gulp.start('app-js-prod-' + name);
        var module;
        config.vendor.forEach(function(task) {
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
            pipe(this.concat(name + '-vendor.css')).
            pipe(this.gulp.dest('public'));
        //js
        this.gulp.src(config.js).
            pipe(this.concat(name + '-vendor.js')).
            pipe(this.gulp.dest('public'));
        //ng-app
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
        this.gulp.src('./vendor/larakit/lk-gulp/template_app.js').
            pipe(this.concat(name + '-app.js')).
            pipe(this.replace('/*ng-modules*/', JSON.stringify(config.ng))).
            pipe(this.replace('/*translate*/', translate_template)).
            pipe(this.replace('/*otherwise*/', config.otherwise)).
            pipe(this.replace('/*routes*/', routes)).
            pipe(this.gulp.dest('public'));
    },
};