define(function(require, exports, module){
    require('jquery');
    require('underscore');

    module.exports = {
        create: function(props){
            return _.extend($('<div></div>'), props);
        }
    };
});
