define(function(a,b,c){a("$"),a("_"),a("overlay.css");var d=a("object"),e={toast:'<div class="overlay toast">   <div class="mask"></div>   <div class="pure-g dialog">       <div class="pure-u-1 tip"><h2><%=tip%></h2></div>   </div></div>',alert:'<div class="overlay alert">    <div class="mask"></div>    <div class="pure-g dialog">        <div class="pure-u-1 tip"><h2><%=tip%></h2></div>        <div class="pure-u-1 action">            <a href="#" class="pure-button ok">确定</a>        </div>    </div></div>',prompt:'<div class="overlay prompt">    <div class="mask"></div>    <div class="pure-g dialog">        <div class="pure-u-1 question"><h2><%=question%></h2></div>        <div class="pure-u-1 pure-form answer">            <input type="text" value="" placeholder="<%=description%>" />        </div>        <div class="pure-u-1 action">            <a href="#" class="pure-button ok">确定</a>            <a href="#" class="pure-button cancel">取消</a>        </div>    </div></div>'};_.each(e,function(a,b,c){c[b]=_.template(a)});var f=d.create({toast:function(a,b){a=_.extend({tip:""},a),b=b||function(){};var c=$(e.toast(a)).appendTo("body"),d=c.children(".dialog");return d.css("margin-left","-"+d.width()/2+"px"),_.delay(function(){c.fadeOut({duration:500,complete:function(){c.remove(),b(null)}})},500),c},alert:function(a,b){a=_.extend({tip:""},a),b=b||function(){};var c=$(e.alert(a)).appendTo("body");return _.extend(c,{ok:function(){var a=b(null);(a||_.isUndefined(a))&&c.remove()}}),_.bindAll(c,"ok"),c.delegate(".ok","click",c.ok),c},prompt:function(a,b){a=_.extend({question:"",description:""},a),b=b||function(){};var c=$(e.prompt(a)).appendTo("body");return c.find(".answer input").focus(),_.extend(c,{ok:function(){var a=c.find(".answer > input").val(),d=b(null,a);(d||_.isUndefined(d))&&c.remove()},cancel:function(){var a=b(null,null);(a||_.isUndefined(a))&&c.remove()}}),_.bindAll(c,"ok","cancel"),c.delegate(".ok","click",c.ok).delegate(".cancel","click",c.cancel),c}});c.exports=f});