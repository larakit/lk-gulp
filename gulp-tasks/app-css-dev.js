module.exports = function(lkGulp, section, config) {
    return function() {
        return lkGulp.gulp.src(config.css).
            pipe(lkGulp.concat(section + 'app-dev.css')).
            pipe(lkGulp.autoprefixer()).
            pipe(lkGulp.gulp.dest('public'));
    };
};

