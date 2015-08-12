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

define('main', function(require) {
    require('_'); 
    require('URI');

    var PROTPORTS = {
        'http': '80',
        'https': '443'
    };

    function formatUrlPars(urlPars) {
        if (!urlPars.port) {
            urlPars.port = PROTPORTS[urlPars.protocol];
        }
        return urlPars;
    }

    function normalUrlPars(urlPars) {
        if (urlPars.port === PROTPORTS[urlPars.protocol]) {
            urlPars.port = null;
        }
        return urlPars;
    }

    chrome.webRequest.onBeforeRequest.addListener(function(details) {
        var urlPars = formatUrlPars(URI.parse(details.url));
        if (RemoteHosts[urlPars.hostname] && urlPars.port === RemotePrPts[urlPars.protocol]) {
            urlPars.hostname = _.keys(ProxyAddrs)[0];
            urlPars.port = ProxyPrPts[urlPars.protocol];
        }
        normalUrlPars(urlPars);
        return {
            redirectUrl: URI.build(urlPars)
        };
    }, {
        urls: ['http://*/*', 'https://*/*']
    }, ['blocking']);


    chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
        var urlPars = formatUrlPars(URI.parse(details.url));
        if (ProxyAddrs[urlPars.hostname] && urlPars.port === ProxyPrPts[urlPars.protocol]) {
            details.requestHeaders.push({
                name: 'ahost',
                value: _.keys(RemoteHosts)[0] + ':' + RemotePrPts[urlPars.protocol]
            });
            return {
                requestHeaders: details.requestHeaders
            };
        }
    }, {
        urls: ['http://*/*', 'https://*/*']
    }, ['blocking', 'requestHeaders']);

});

seajs.use('main');
