module.exports = function(lkGulp) {
    return function() {
        console.log('deploy jquery');
        //css
        lkGulp.gulp.src([
                './node_modules/jquery/dist/jquery.js',
            ]).
            pipe(lkGulp.concat('jquery.js')).
            pipe(lkGulp.gulp.dest('storage/gulp/vendor'));
    };
};
