define(function(require, exports, module){
    require('$');
    require('_');

    module.exports = {
        create: function(props){
            return _.extend($('<div></div>'), props);
        }
    };
});
