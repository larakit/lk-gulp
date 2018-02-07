module.exports = function(lkGulp, section, config) {
    return function() {
        return lkGulp.gulp.src(config.js).
            pipe(lkGulp.angularEmbedTemplates()).
            pipe(lkGulp.concat(section + 'app-dev.js')).
            pipe(lkGulp.gulp.dest('public'));
    };
};

