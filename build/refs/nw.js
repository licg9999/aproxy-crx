define(function(a,b,c){a("$"),a("_");var d=a("object"),e=d.create({_background:chrome.extension.getBackgroundPage(),_getProxyHost:function(){var a=this;return _.keys(a._background.ProxyHosts)[0]},json:function(a,b){var c=this;a.url="http://"+c._getProxyHost()+a.url,$.ajax(_.extend(a,{type:"GET",cache:!1,success:function(a,c,d){b(null,a)},error:function(a,c,d){b(d)}}))}});c.exports=e});