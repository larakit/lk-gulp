module.exports = function (lkGulp) {
    return function () {
        var spritesmith = require('gulp.spritesmith');
        var spriteData = lkGulp.gulp
            .src('public/!/source/sprites/**/*.png')
            .pipe(spritesmith({
                imgName: 'sprite-icons.png',
                cssName: 'sprite-icons.css'
            }));

        spriteData.img
        // DEV: We must buffer our stream into a Buffer for `imagemin`
        //     .pipe(buffer())
        //     .pipe(plugins.imagemin())
            .pipe(lkGulp.gulp.dest('public/!/dist/img/'));
        spriteData.css
            // .pipe(csso())
            .pipe(lkGulp.replace('url(', 'url(/!/dist/img/'))
            .pipe(lkGulp.gulp.dest('storage/gulp/app'));
        // var imgStream = spriteData.img.pipe('public/!/sprites');
        // var cssStream = spriteData.css.pipe('public/!/sprites');
        // lkGulp.path.src.app.push('storage/gulp/app/sprite-icons.css');
    };
};

