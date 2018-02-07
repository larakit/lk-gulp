module.exports = function(gulp, plugins) {
    return function() {
        console.log('deploy bootstrap');
        //css
        gulp.src([
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'bower_components/bootstrap/dist/css/bootstrap-theme.css',
        ])
        .pipe(plugins.concat('bootstrap.css'))
        .pipe(plugins.replace('\'../fonts/', '\'/!/dist/fonts/bootstrap/'))
        .pipe(gulp.dest('storage/gulp/vendor'));
        //js
        gulp.src([
            'bower_components/bootstrap/dist/js/bootstrap.js',
        ])
        .pipe(plugins.concat('bootstrap.js'))
        .pipe(gulp.dest('storage/gulp/vendor'));
        //fonts
        gulp.src([
            'bower_components/bootstrap/dist/fonts/**/*',
        ])
        .pipe(gulp.dest('public/!/dist/fonts/bootstrap'));
        
    };
};
