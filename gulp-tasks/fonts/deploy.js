module.exports = function (lkGulp) {
    return function () {
        var Fontmin = require('fontmin');
        var fontmin = new Fontmin()
            .src('public/!/source/fonts/**/*.ttf')
            .use(Fontmin.css())
            .use(Fontmin.ttf2eot())
            .use(Fontmin.ttf2woff({
                deflate: true
            }))
            .use(Fontmin.ttf2svg())
            .dest('public/!/dist/fonts/webfont');
        fontmin.run();
        lkGulp.gulp.src('public/!/dist/fonts/**/*.css')
            .pipe(lkGulp.concat('fonts.css'))
            .pipe(lkGulp.replace('url("', 'url("/!/dist/fonts/webfont/'))
            .pipe(lkGulp.gulp.dest('storage/gulp/vendor'));
        // path.src.app.push('storage/gulp/app/fonts.css');
    };
};

