define(function(require, exports, module){
    require('$');
    require('_');

    var object = require('object');

    var nw = object.create({

        _background: chrome.extension.getBackgroundPage(),

        _getProxyHost: function(){
            var _self = this;
            return _.keys(_self._background.ProxyHosts)[0];
        },

        json: function(options, callback){
            var _self = this;

            options.url = 'http://' + _self._getProxyHost() + options.url;

            $.ajax(_.extend(options, {
                type: 'GET',
                cache: false,
                success: function(data, textStatus, jqXHR){
                    callback(null, data);
                },
                error: function(jqXHR, textStatus, errorThrown){
                    callback(textStatus);
                }
            }));
        },
    });

    module.exports = nw;
});
