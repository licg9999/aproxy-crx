define(function(require, exports, module){
    require('$');
    require('_');

    module.exports = {
        create: function(props){
            var obj =  _.extend($('<div></div>'), props);

            var funcs = _.functions(obj);
            funcs.unshift(obj);
            _.bindAll.apply(_, funcs);

            if(_.isFunction(obj.initialize)){
                obj.initialize();
            }

            return obj;
        }
    };
});
