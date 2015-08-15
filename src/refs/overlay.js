define(function(require, exports, module) {
    require('$');
    require('_');
    require('overlay.css');

    var object = require('object');

    var tmpls = {
        toast: '<div class="overlay toast">' + 
            '   <div class="mask"></div>' + 
            '   <div class="pure-g dialog">' + 
            '       <div class="pure-u-1 tip"><h2><%=tip%></h2></div>' + 
            '   </div>' + 
            '</div>',
        alert: '<div class="overlay alert">' +
            '    <div class="mask"></div>' +
            '    <div class="pure-g dialog">' +
            '        <div class="pure-u-1 tip"><h2><%=tip%></h2></div>' +
            '        <div class="pure-u-1 action">' +
            '            <a href="#" class="pure-button ok">确定</a>' +
            '        </div>' +
            '    </div>' +
            '</div>',
        prompt: '<div class="overlay prompt">' +
            '    <div class="mask"></div>' +
            '    <div class="pure-g dialog">' +
            '        <div class="pure-u-1 question"><h2><%=question%></h2></div>' +
            '        <div class="pure-u-1 pure-form answer">' +
            '            <input type="text" value="" placeholder="<%=description%>" />' +
            '        </div>' +
            '        <div class="pure-u-1 action">' +
            '            <a href="#" class="pure-button ok">确定</a>' +
            '            <a href="#" class="pure-button cancel">取消</a>' +
            '        </div>' +
            '    </div>' +
            '</div>'
    };

    _.each(tmpls, function(v, k, l) {
        l[k] = _.template(v);
    });

    var overlay = object.create({
        toast: function(args, callback){
            args = _.extend({
                tip: ''
            }, args);
            callback = callback || function() {};

            var $elm = $(tmpls['toast'](args)).appendTo('body');

            var $dialog = $elm.children('.dialog');
            $dialog.css('margin-left', '-' + $dialog.width() / 2 + 'px');

            _.delay(function(){
                $elm.fadeOut({
                    duration: 500,
                    complete: function(){
                        $elm.remove();
                        callback(null);
                    }
                });
            }, 500);

            return $elm;
        },

        alert: function(args, callback) {
            args = _.extend({
                tip: ''
            }, args);
            callback = callback || function() {};

            var $elm = $(tmpls['alert'](args)).appendTo('body');

            _.extend($elm, {
                ok: function(){
                    var v = callback(null);
                    if (v || _.isUndefined(v)) {
                        $elm.remove();
                    }
                }
            });
            _.bindAll($elm, 'ok');

            $elm.delegate('.ok', 'click', $elm.ok);

            return $elm;
        },

        prompt: function(args, callback) {
            args = _.extend({
                question: '',
                description: ''
            }, args);
            callback = callback || function() {};

            var $elm = $(tmpls['prompt'](args)).appendTo('body');

            $elm.find('.answer input').focus();

            _.extend($elm, {
                ok: function(){
                    var answer = $elm.find('.answer > input').val();
                    var v = callback(null, answer);
                    if (v || _.isUndefined(v)) {
                        $elm.remove();
                    }
                },
                cancel: function(){
                    var v = callback(null, null);
                    if (v || _.isUndefined(v)) {
                        $elm.remove();
                    }
                }
            });
            _.bindAll($elm, 'ok', 'cancel');

            $elm.delegate('.ok', 'click', $elm.ok)
                .delegate('.cancel', 'click', $elm.cancel);

            return $elm;
        },
    });

    module.exports = overlay;
});
