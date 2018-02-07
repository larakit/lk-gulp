module.exports = function(lkGulp) {
    return function() {
        //css
        lkGulp.gulp.src([
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.css',
        ])
        .pipe(lkGulp.concat('bootstrap.css'))
        .pipe(lkGulp.replace('\'../fonts/', '\'/!/dist/fonts/bootstrap/'))
        .pipe(lkGulp.gulp.dest('storage/gulp/vendor'));
        //fonts
        lkGulp.gulp.src([
            'node_modules/bootstrap/dist/fonts/**/*',
        ])
        .pipe(lkGulp.gulp.dest('public/!/dist/fonts/bootstrap'));
        
    };
};
