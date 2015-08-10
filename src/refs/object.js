define(function(require, exports, module){
    module.exports = {
        create: function(props){
            return _.extend($('<div></div>'), props);
        }
    };
});
