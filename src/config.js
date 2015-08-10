(function(seajs) {
    seajs.config({
        base: './refs/',
        alias: {
            'pure.css': '../libs/pure-min.css',

            '$': '../libs/jquery.min.js',
            '_': '../libs/underscore-min.js',
            'URI': '../libs/URI.min.js'
        }
    });
}(seajs));
