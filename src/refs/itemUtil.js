define(function(require, exports, module) {
    require('$');
    require('_');

    var object = require('object'),
        overlay = require('overlay'),
        nw = require('nw'),
        validator = require('validator');

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
            '        <a href="#" class="pure-button edit" title="编辑" draggable="false"><i class="fa fa-pencil"></i></a>' +
            '        <a href="#" class="pure-button save" title="保存" draggable="false" hidden><i class="fa fa-floppy-o"></i></a>' +
            '        <a href="#" class="pure-button disa" title="禁用" draggable="false"><i class="fa fa-stop"></i></a>' +
            '        <a href="#" class="pure-button enab" title="启用" draggable="false" hidden><i class="fa fa-play"></i></a>' +
            '        <a href="#" class="pure-button remo" title="删除" draggable="false"><i class="fa fa-trash-o"></i></a>' +
            '        <a href="#" class="move" title="<%=index%>. <%=name%>" draggable="false"><i class="fa fa-bars"></i></a>' +
            '    </div>' +
            '</div>'),

        _$wrap: $('.rules > .wrap'),

        _$empt: $('.rules > .empty'),

        addItem: function(args, isNew) {
            var _self = this;

            args = _.extend({
                fromGroup: '',
                fromProject: '',
                to: '',
                index: '',
                name: ''
            }, _self.parseRuleFrom(args));
            if (isNew) {
                args.index = '0';
            }
            args.json = JSON.stringify(args);

            var $item = $(_self._tmpl(args)).prependTo(_self._$wrap);
            if (isNew) {
                $item.find('.disa').addClass('add');
                $item.find('.save').addClass('add');
                $item.find('.remo').addClass('add');
                $item.prop('draggable', false);
            }


            $item.delegate('.disa.add', 'click', function(e) {
                e.stopImmediatePropagation();
            });

            $item.delegate('.disa', 'click', function(e) {
                _self.disableItem($item);
            });


            $item.delegate('.enab', 'click', function(e) {
                _self.enableItem($item);
            });

            $item.delegate('.edit', 'click', function(e) {
                _self.editItem($item);
            });


            $item.delegate('.save.add', 'click', function(e) {
                e.stopImmediatePropagation();
                _self.insertItem($item, function(err) {
                    if (!err) {
                        $item.find('.add').removeClass('add');
                        _self.setDraggable($item, true);
                        _self.setDroppable($item, true);
                    }
                });
            });

            $item.delegate('.save', 'click', function(e) {
                _self.saveItem($item);
            });


            $item.delegate('.remo.add', 'click', function(e) {
                e.stopImmediatePropagation();
                _self._removeItem($item);
            });

            $item.delegate('.remo', 'click', function(e) {
                _self.removeItem($item);
            });

            $item.on('dragstart', function(e) {
                e.originalEvent.dataTransfer.effectAllowed = 'all';
                e.originalEvent.dataTransfer.setData('text/plain', $item.data('json').index);
            });

            if (!isNew) {
                _self.setDraggable($item, true);
                _self.setDroppable($item, true);
            }

            $item.on('drop', function(e) {
                var $sitem = _self._$wrap.children('.pair').eq(+$.parseJSON(e.originalEvent.dataTransfer.getData('text/plain')));

                _self.adjustItemPos($sitem, $item);
            });

            return $item;
        },

        _onDragover: function(e) {
            e.preventDefault();
        },

        setDroppable: function($item, b) {
            var _self = this;
            if (b) {
                $item.on('dragover', _self._onDragover);
            } else {
                $item.off('dragover', _self._onDragover);
            }
        },

        setDraggable: function($item, b) {
            $item.prop('draggable', true);
        },

        _adjustPriority: function(sindex, tindex, callback) {
            var _self = this;

            if (sindex !== tindex) {

                nw.json({
                    url: '/rule/priorityAdjust',
                    data: {
                        sindex: sindex,
                        tindex: tindex
                    },
                }, function(err, dt) {
                    if (err || !dt.success) {
                        callback(err || dt);
                    } else {
                        var temp, i, data,
                            $items = _self._$wrap.children('.pair');

                        if (sindex < tindex) {
                            for (i = sindex + 1; i <= tindex; i++) {
                                data = $items.eq(i).data('json');
                                data.index = data.index - 1;
                                $items.eq(i).data('json', data);
                                _self._syncMoveIndex($items.eq(i));
                            }
                            data = $items.eq(sindex).data('json');
                            data.index = tindex;
                            $items.eq(sindex).data('json', data);
                            _self._syncMoveIndex($items.eq(sindex));

                            $items.eq(sindex).insertAfter($items.eq(tindex));
                        } else {
                            for (i = sindex - 1; i >= tindex; i--) {
                                data = $items.eq(i).data('json');
                                data.index = data.index + 1;
                                $items.eq(i).data('json', data);
                                _self._syncMoveIndex($items.eq(i));
                            }
                            data = $items.eq(sindex).data('json');
                            data.index = tindex;
                            $items.eq(sindex).data('json', data);
                            _self._syncMoveIndex($items.eq(sindex));

                            $items.eq(sindex).insertBefore($items.eq(tindex));
                        }

                        callback(null);
                    }
                });
            } else {
                callback(null);
            }
        },

        adjustItemPos: function($sitem, $titem) {
            var _self = this;
            _self._adjustPriority($sitem.data('json').index, $titem.data('json').index, function(err) {
                if (err) {
                    overlay.alert({
                        tip: '更新优先级失败'
                    });
                }
            });
        },

        _addValue: function($item, fromGroup, fromProject, to, callback) {
            var _self = this;

            var data = $item.data('json');
            data.fromGroup = fromGroup;
            data.fromProject = fromProject;
            data.to = to;

            _self.buildRuleFrom(data);
            nw.json({
                url: '/rule/add',
                data: {
                    name: data.name,
                    from: data.from,
                    to: data.to
                }
            }, function(err, dt) {
                if (err || !dt.success) {
                    callback(err || dt);
                } else {
                    _self.parseRuleFrom(data);
                    $item.data('json', data);
                    callback(null);
                }
            });
        },

        _syncMoveIndex: function($item) {
            var data = $item.data('json');
            $item.find('.move').attr('title', data.index + '. ' + data.name);
        },

        validateItemFields: function($fromGroup, $fromProject, $to) {
            var fromGroup = $fromGroup.val(),
                fromProject = $fromProject.val(),
                to = $to.val();

            if (validator.nonEmp(fromGroup, '组名不能为空') &&
                validator.maxLen(fromGroup, '组名长度不能超过32字', 32) &&
                validator.format(fromGroup, '组名不能以斜杠开始或结束', /^([^\/].*[^\/]|[^\/])$/) &&
                validator.nonEmp(fromProject, '项目名不能为空') &&
                validator.maxLen(fromProject, '项目名不能超过64字', 64) &&
                validator.format(fromProject, '项目名不能以斜杠开始或结束', /^([^\/].*[^\/]|[^\/])$/) &&
                validator.nonEmp(to, '目录Path不能为空') &&
                validator.maxLen(to, '目录Path长度不能超过512字', 512) &&
                validator.format(to, '目录Path不能为相对路径', /^(\w:)?\//)
            ) {

                if (!validator.format(to, '', /\/$/)) {
                    to = to + '/';
                    $to.val(to);
                }

                return true;

            } else {
                return false;
            }
        },

        insertItem: function($item, callback) {
            var _self = this;
            var $fromGroup = $item.find('.from > .group'),
                $fromProject = $item.find('.from > .project'),
                $to = $item.find('.to > input');

            if (_self.validateItemFields($fromGroup, $fromProject, $to)) {

                _self._addValue($item, $fromGroup.val(), $fromProject.val(), $to.val(), function(err) {
                    if (err) {
                        overlay.alert({
                            tip: '添加规则失败'
                        });
                    } else {
                        $item.nextAll().filter(function() {
                            return $(this).find('.add').length === 0;
                        }).each(function() {
                            var $item = $(this),
                                data = $item.data('json');
                            data.index = data.index + 1;
                            $item.data('json', data);
                            _self._syncMoveIndex($item);
                        });
                        _self._saveItem($item);
                    }
                    callback(err);
                });
            }
        },

        _setDisabled: function($item, disabled, callback) {
            var _self = this;

            var data = $item.data('json');
            if (data.disabled !== disabled) {

                data.disabled = disabled;

                nw.json({
                    url: '/rule/set',
                    data: {
                        index: data.index,
                        disabled: data.disabled
                    },
                }, function(err, dt) {
                    if (err || !dt.success) {
                        callback(err || dt);
                    } else {
                        $item.data('json', data);
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

            _self.buildRuleFrom(data);
            nw.json({
                url: '/rule/set',
                data: {
                    index: data.index,
                    from: data.from,
                    to: data.to
                }
            }, function(err, dt) {
                if (err || !dt.success) {
                    callback(err || dt);
                } else {
                    $item.data('json', data);
                    callback(null);
                }
            });
        },

        _saveItem: function($item) {
            $item.find('.edit').removeAttr('hidden');
            $item.find('.save').attr('hidden', '');
            $item.find('.from > input').attr('disabled', '');
            $item.find('.to > input').attr('disabled', '');
        },

        saveItem: function($item) {
            var _self = this;
            var $fromGroup = $item.find('.from > .group'),
                $fromProject = $item.find('.from > .project'),
                $to = $item.find('.to > input');

            if (_self.validateItemFields($fromGroup, $fromProject, $to)) {

                _self._setMatch($item, $fromGroup.val(), $fromProject.val(), $to.val(), function(err) {
                    if (err) {
                        overlay.alert({
                            tip: '保存规则失败'
                        });
                    } else {
                        _self._saveItem($item);
                    }
                });
            }
        },

        _removeValue: function($item, callback) {
            var _self = this;

            var data = $item.data('json');

            nw.json({
                url: '/rule/remove',
                data: {
                    index: data.index
                }
            }, function(err, dt) {
                if (err || !dt.success) {
                    callback(err || dt);
                } else {
                    callback(null);
                }
            });
        },

        _removeItem: function($item) {
            var _self = this;
            $item.remove();
            _self.checkEmpty();
        },

        removeItem: function($item) {
            var _self = this;
            _self._removeValue($item, function(err) {
                if (err) {
                    overlay.alert({
                        tip: '删除规则失败'
                    });
                } else {
                    $item.nextAll().filter(function() {
                        return $(this).find('.add').length === 0;
                    }).each(function() {
                        var $item = $(this),
                            data = $item.data('json');
                        data.index = data.index - 1;
                        $item.data('json', data);
                        $item.find('.move').attr('title', data.index + '. ' + data.name);
                    });
                    _self._removeItem($item);
                }
            });
        },

        reloadItems: function(callback) {
            var _self = this;

            _self.cleanItems();

            nw.json({
                url: '/rule/load'
            }, function(err, dt) {
                if (err || !dt.success) {
                    overlay.alert({
                        tip: '获取规则失败'
                    });
                    callback(err || dt);
                } else {
                    var i, rule;
                    for (i = dt.rules.length - 1; i >= 0; i--) {
                        rule = dt.rules[i];
                        _.extend(rule, {
                            index: i
                        });
                        var $item = _self.addItem(rule);
                        if (rule.disabled) {
                            _self.disableItem($item);
                        }
                    }
                    callback(null);
                }
            });
        },

        cleanItems: function() {
            var _self = this;
            _self._$wrap.children('.pair').remove();
        },

        parseRuleFrom: function(rule) {
            if (rule.from) {
                var fromPars = rule.from.split('/');
                rule.fromGroup = fromPars[1];
                rule.fromProject = fromPars[2];
                delete rule.from;
            }
            return rule;
        },

        buildRuleFrom: function(rule) {
            if (rule.fromGroup && rule.fromProject) {
                rule.from = '/' + rule.fromGroup + '/' + rule.fromProject + '/((\\d+\\.){2}\\d+)/';
                delete rule.fromGroup;
                delete rule.fromProject;
            }
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
