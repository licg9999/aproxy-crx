var RemoteHosts={"g.alicdn.com":!0,"g-assets.daily.taobao.net":!0,"g.tbcdn.cn":!0,"g.assets.daily.taobao.net":!0},RemotePrPts={http:"80",https:"443"},ProxyAddrs={"127.0.0.1":!0},ProxyPrPts={http:"80",https:"443"};define("main",function(a){function b(a){return a.port||(a.port=d[a.protocol]),a}function c(a){return a.port===d[a.protocol]&&(a.port=null),a}a("_"),a("URI");var d={http:"80",https:"443"};chrome.webRequest.onBeforeRequest.addListener(function(a){var d=b(URI.parse(a.url));return RemoteHosts[d.hostname]&&d.port===RemotePrPts[d.protocol]&&(d.hostname=_.keys(ProxyAddrs)[0],d.port=ProxyPrPts[d.protocol]),c(d),{redirectUrl:URI.build(d)}},{urls:["http://*/*","https://*/*"]},["blocking"]),chrome.webRequest.onBeforeSendHeaders.addListener(function(a){var c=b(URI.parse(a.url));return ProxyAddrs[c.hostname]&&c.port===ProxyPrPts[c.protocol]?(a.requestHeaders.push({name:"ahost",value:_.keys(RemoteHosts)[0]+":"+RemotePrPts[c.protocol]}),{requestHeaders:a.requestHeaders}):void 0},{urls:["http://*/*","https://*/*"]},["blocking","requestHeaders"])}),seajs.use("main");