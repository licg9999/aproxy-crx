var PROTPORTS = {
    'http': '80',
    'https': '443'
};

var RemoteHosts = {
    'g.alicdn.com': true,
    'g-assets.daily.taobao.net': true,
    'g.tbcdn.cn': true,
    'g.assets.daily.taobao.net': true
};
var RemotePrPts = {
    'http': '80',
    'https': '443'
};

var ProxyAddrs = {
    '127.0.0.1': true
};
var ProxyPrPts = {
    'http': '80',
    'https': '443'
};
var ProxyHosts = {
    '127.0.0.1:9999': true
};

var ProxyStats = {
    'started': false
};

define('main', function(require) {
    require('_');
    require('URI');

    var object = require('object'),
        nw = require('nw');

    var notifier = object.create({
        initialize: function(){
            var _self = this;
            setInterval(function() {
                nw.json({
                    url: '/ping',
                    timeout: 200
                }, function(err, dt) {
                    if (err || !dt.success) {
                        if (ProxyStats.started) {
                            ProxyStats.started = false;
                            chrome.browserAction.setIcon({
                                path: './imgs/icon_disabled.png'
                            });
                            _self.trigger('stop');
                        }
                    } else {
                        if (!ProxyStats.started) {
                            ProxyStats.started = true;
                            chrome.browserAction.setIcon({
                                path: './imgs/icon_128.png'
                            });
                            _self.trigger('start');
                        }
                    }
                });
            }, 1000);
        }
    });
    window.notifier = notifier;


    var inspector = object.create({

        formatUrlPars: function(urlPars) {
            if (!urlPars.port) {
                urlPars.port = PROTPORTS[urlPars.protocol];
            }
            return urlPars;
        },

        normalUrlPars: function(urlPars) {
            if (urlPars.port === PROTPORTS[urlPars.protocol]) {
                urlPars.port = null;
            }
            return urlPars;
        },

        onBeforeRequest: function(details) {
            console.log('a');
            var _self = this;

            var urlPars = _self.formatUrlPars(URI.parse(details.url));
            if (RemoteHosts[urlPars.hostname] && urlPars.port === RemotePrPts[urlPars.protocol]) {
                urlPars.hostname = _.keys(ProxyAddrs)[0];
                urlPars.port = ProxyPrPts[urlPars.protocol];
            }
            _self.normalUrlPars(urlPars);
            return {
                redirectUrl: URI.build(urlPars)
            };
        },

        onBeforeSendHeaders: function(details) {
            console.log('b');
            var _self = this;

            var urlPars = _self.formatUrlPars(URI.parse(details.url));
            if (ProxyAddrs[urlPars.hostname] && urlPars.port === ProxyPrPts[urlPars.protocol]) {
                details.requestHeaders.push({
                    name: 'ahost',
                    value: _.keys(RemoteHosts)[0] + ':' + RemotePrPts[urlPars.protocol]
                });
                return {
                    requestHeaders: details.requestHeaders
                };
            }
        },

        onStart: function() {
            var _self = this;

            chrome.webRequest.onBeforeRequest.addListener(_self.onBeforeRequest, {
                urls: ['http://*/*', 'https://*/*']
            }, ['blocking']);

            chrome.webRequest.onBeforeSendHeaders.addListener(_self.onBeforeSendHeaders, {
                urls: ['http://*/*', 'https://*/*']
            }, ['blocking', 'requestHeaders']);
        },

        onStop: function() {
            var _self = this;

            chrome.webRequest.onBeforeRequest.removeListener(_self.onBeforeRequest);

            chrome.webRequest.onBeforeSendHeaders.removeListener(_self.onBeforeSendHeaders);
        },

        initialize: function() {
            var _self = this;

            notifier.on('start', _self.onStart).on('stop', _self.onStop);
        }
    });
});

seajs.use('main');
