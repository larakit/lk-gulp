var lkGulp = require('./vendor/larakit/lk-gulp/lk-gulp');

lkGulp.init();
lkGulp.registerApp('frontend', require('./gulp_frontend.json'));
lkGulp.registerApp('backend', require('./gulp_backend.json'));
lkGulp.start();