define('main', function(require) {
    require('pure.css');
    require('font-awesome.css');
    require('customize.css');

    require('$');
    require('_');

    var overlay = require('overlay'),
        itemUtil = require('itemUtil'),
        object = require('object'),
        validator = require('validator');


    var inspector = object.create({

        _backgroundPage: chrome.extension.getBackgroundPage(),

        _$overlay: null,

        initialize: function() {
            var _self = this;

            _self._backgroundPage.notifier.on('start', _self.onStart)
                                          .on('stop' , _self.onStop);

            if (_self._backgroundPage.ProxyStats.started) {
                _self.onStart();
            } else {
                _self.onStop();
            }
        },

        onStart: function() {
            var _self = this;

            if(_self._$overlay){
                _self._$overlay.ok();
            }

            itemUtil.reloadItems(function(err) {
                itemUtil.checkEmpty();
            });
        },

        onStop: function() {
            var _self = this;
            itemUtil.cleanItems();
            itemUtil.checkEmpty();
            _self._$overlay = overlay.alert({
                tip: '没有检测到代理服务器'
            }, function(){
                _self._$overlay = null;
            });
        }
    });


    $('.rules > .title > .add').on('click', function() {
        if ($('.rules > .wrap > .pair .add').length === 0) {
            overlay.prompt({
                question: '规则名称',
                description: '例：小二平台'
            }, function(err, name) {
                if (name === null) {
                    // when cancelled
                    return;
                }

                if (validator.nonEmp(name, '规则名称不能为空') &&
                    validator.maxLen(name, '规则名称长度不能超过32字', 32)) {

                    var $item = itemUtil.addItem({
                        name: name
                    }, true);
                    itemUtil.editItem($item);
                    itemUtil.checkEmpty();
                }else {
                    return false;
                }
            });
        } else {
            overlay.alert({
                tip: '请先保存当前项'
            });
        }
    });
});

seajs.use('main');
