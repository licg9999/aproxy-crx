define(function(require, exports, module) {
    require('$');
    require('_');

    var object = require('object'),
        overlay = require('overlay'),
        nw = require('nw');

    var itemUtil = object.create({

        _tmpl: _.template('<div class="pure-g pair" data-json=<%=json%>>' +
            '    <div class="pure-u-9-24 from">' +
            '        <input class="group" type="text" placeholder="组名" value="<%=fromGroup%>" disabled/>' +
            '        <span>/</span>' +
            '        <input class="project" type="text" placeholder="项目名" value="<%=fromProject%>" disabled/>' +
            '        <div class="tip"></div>' +
            '    </div>' +
            '    <div class="pure-u-10-24 to">' +
            '        <input type="text" placeholder="目录Path" value="<%=to%>" disabled/>' +
            '    </div>' +
            '    <div class="pure-u-5-24 action">' +
            '        <a href="#" class="pure-button edit" title="编辑"><i class="fa fa-pencil"></i></a>' +
            '        <a href="#" class="pure-button save" title="保存" hidden><i class="fa fa-floppy-o"></i></a>' +
            '        <a href="#" class="pure-button disa" title="禁用"><i class="fa fa-stop"></i></a>' +
            '        <a href="#" class="pure-button enab" title="启用" hidden><i class="fa fa-play"></i></a>' +
            '        <a href="#" class="pure-button remo" title="删除"><i class="fa fa-trash-o"></i></a>' +
            '        <a href="#" class="move" title="<%=index%>. <%=name%>"><i class="fa fa-bars"></i></a>' +
            '    </div>' +
            '</div>'),

        _$wrap: $('.rules > .wrap'),

        _$empt: $('.rules > .empty'),

        addItem: function(args) {
            var _self = this;

            args = _.extend({
                fromGroup: '',
                fromProject: '',
                to: '',
                index: '',
                name: ''
            }, _self.parseRuleFrom(args));
            args.json = JSON.stringify(args);

            var $item = $(_self._tmpl(args)).appendTo(_self._$wrap);

            $item.delegate('.disa', 'click', function(e) {
                _self.disableItem($item);
            });

            $item.delegate('.enab', 'click', function(e) {
                _self.enableItem($item);
            });

            $item.delegate('.edit', 'click', function(e) {
                _self.editItem($item);
            });

            $item.delegate('.save', 'click', function(e) {
                _self.saveItem($item);
            });

            $item.delegate('.remo', 'click', function(e) {
                _self.removeItem($item);
            });

            return $item;
        },

        _setDisabled: function($item, disabled, callback) {
            var _self = this;

            var data = $item.data('json');
            if (data.disabled !== disabled) {

                data.disabled = disabled;
                $item.data('json', data);

                nw.json({
                    url: '/rule/set',
                    data: {
                        index: data.index,
                        disabled: data.disabled
                    },
                }, function(err, data) {
                    if (err || !data.success) {
                        callback(err || data);
                    } else {
                        callback(null);
                    }
                });
            } else {
                callback(null);
            }
        },

        disableItem: function($item) {
            var _self = this;
            _self._setDisabled($item, true, function(err) {
                if (err) {
                    overlay.alert({
                        tip: '禁用规则失败'
                    });
                } else {
                    $item.addClass('disabled');
                    $item.find('.disa').attr('hidden', '');
                    $item.find('.enab').removeAttr('hidden');
                }
            });
        },

        enableItem: function($item) {
            var _self = this;
            _self._setDisabled($item, false, function(err) {
                if (err) {
                    overlay.alert({
                        tip: '启用规则失败'
                    });
                } else {
                    $item.removeClass('disabled');
                    $item.find('.disa').removeAttr('hidden');
                    $item.find('.enab').attr('hidden', '');
                }
            });
        },

        editItem: function($item) {
            $item.find('.edit').attr('hidden', '');
            $item.find('.save').removeAttr('hidden');
            $item.find('.from > input').removeAttr('disabled').first().focus();
            $item.find('.to > input').removeAttr('disabled');
        },

        _setMatch: function($item, fromGroup, fromProject, to, callback) {
            var _self = this;

            var data = $item.data('json');
            data.fromGroup = fromGroup;
            data.fromProject = fromProject;
            data.to = to;
            $item.data(data);

            _self.buildRuleFrom(data);
            nw.json({
                url: '/rule/set',
                data: {
                    index: data.index,
                    from: data.from,
                    to: data.to
                }
            }, function(err, data) {
                if (err || !data.success) {
                    callback(err || data);
                } else {
                    callback(null);
                }
            });
        },

        saveItem: function($item) {
            var _self = this;
            var $fromGroup = $item.find('.from > .group'),
                $fromProject = $item.find('.from > .project'),
                $to = $item.find('.to > input');
            _self._setMatch($item, $fromGroup.val(), $fromProject.val(), $to.val(), function(err){
                if(err){
                    overlay.alert({
                        tip: '保存规则失败'
                    });
                }else {
                    $item.find('.edit').removeAttr('hidden');
                    $item.find('.save').attr('hidden', '');
                    $item.find('.from > input').attr('disabled', '');
                    $item.find('.to > input').attr('disabled', '');
                }
            });
        },

        _removeValue: function($item, callback){
            var _self = this;

            var data = $item.data('json');

            nw.json({
                url: '/rule/remove',
                data: {
                    index: data.index
                }
            }, function(err, data){
                if (err || !data.success) {
                    callback(err || data);
                } else {
                    callback(null);
                }
            });
        },

        removeItem: function($item) {
            var _self = this;
            _self._removeValue($item, function(err){
                if(err){
                    overlay.alert({
                        tip: '删除规则失败'
                    });
                }else {
                    $item.nextAll().each(function(){
                        var $item = $(this),
                            data  = $item.data('json');
                        data.index--;
                        $item.data(data);
                        $item.find('.move').attr('title', data.index + '. ' + data.name);
                    });
                    $item.remove();
                    _self.checkEmpty();
                }
            });
        },

        reloadItems: function(callback) {
            var _self = this;
            nw.json({
                url: '/rule/load'
            }, function(err, data) {
                if (!err && data.success) {
                    _.each(data.rules, function(rule, i) {
                        _.extend(rule, {
                            index: i
                        });
                        var $item = _self.addItem(rule);
                        if (rule.disabled) {
                            _self.disableItem($item);
                        }
                    });
                    callback(null);
                } else {
                    overlay.alert({
                        tip: '获取规则失败'
                    });
                }
            });
        },

        parseRuleFrom: function(rule) {
            var fromPars = rule.from.split('/');
            rule.fromGroup = fromPars[1];
            rule.fromProject = fromPars[2];
            delete rule.from;
            return rule;
        },

        buildRuleFrom: function(rule) {
            rule.from = '/' + rule.fromGroup + '/' + rule.fromProject + '/((\\d+\\.){2}\\d+)/';
            delete rule.fromGroup;
            delete rule.fromProject;
            return rule;
        },

        checkEmpty: function() {
            var _self = this;
            if (_self._$wrap.children('.pair').length > 0) {
                _self._$empt.attr('hidden', '');
            } else {
                _self._$empt.removeAttr('hidden');
            }
        }
    });

    module.exports = itemUtil;
});
