module.exports = function(lkGulp, section, config) {
    return function() {
        return lkGulp.gulp.src(config.js).
            pipe(lkGulp.angularEmbedTemplates()).
            pipe(lkGulp.concat(section + 'app-prod.js')).
            pipe(lkGulp.uglify()).
            pipe(lkGulp.gulp.dest('public'));
    };
};

