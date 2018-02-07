module.exports = function(lkGulp, section, config) {
    return function() {
        return lkGulp.gulp.src(config.css).
            pipe(lkGulp.concat(section + 'app-prod.css')).
            pipe(lkGulp.autoprefixer()).
            pipe(lkGulp.cleanCss()).
            pipe(lkGulp.gulp.dest('public'));
    };
};