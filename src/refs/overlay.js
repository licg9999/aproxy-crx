define(function(require, exports, module) {
    require('$');
    require('_');
    require('overlay.css');

    var object = require('object');

    var tmpls = {
        alert: '<div class="overlay alert">' +
            '    <div class="mask"></div>' +
            '    <div class="pure-g dialog">' +
            '        <div class="pure-u-1 tip"><h2><%=tip%></h2></div>' +
            '        <div class="pure-u-1 action">' +
            '            <a href="#" class="pure-button ok">确定</a>' +
            '        </div>' +
            '    </div>' +
            '</div>',
        confirm: '', //TODO
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
        prompt: function(args, callback) {
            args = _.extend({
                question: '',
                description: ''
            }, args);
            callback = callback || function() {};

            var $elm = $(tmpls['prompt'](args)).appendTo('body');

            $elm.find('.answer input').focus();

            $elm.delegate('.ok', 'click', function(e) {
                var answer = $elm.find('.answer > input').val();
                var v = callback(null, answer);
                if (v || _.isUndefined(v)) {
                    $elm.remove();
                }
            });

            $elm.delegate('.cancel', 'click', function(e) {
                var v = callback(null, null);
                if (v || _.isUndefined(v)) {
                    $elm.remove();
                }
            });
        },

        alert: function(args, callback) {
            args = _.extend({
                tip: ''
            }, args);
            callback = callback || function() {};

            var $elm = $(tmpls['alert'](args)).appendTo('body');

            $elm.delegate('.ok', 'click', function(e) {
                var v = callback(null);
                if (v || _.isUndefined(v)) {
                    $elm.remove();
                }
            });
        }
    });

    module.exports = overlay;
});
