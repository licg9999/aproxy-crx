define('main', function(require) {
    require('pure.css');
    require('font-awesome.css');
    require('customize.css');

    require('$');
    require('_');

    var overlay  = require('overlay'),
        itemUtil = require('itemUtil');

    $('.rules > .title > .add').on('click', function(){
        overlay.prompt({
            question: '规则名称',
            description: '例：小二平台'
        }, function(err, name){
            if(name === null){
                return;
            }

            var $item = itemUtil.addItem({
                name: name
            });
            itemUtil.editItem($item);
            itemUtil.checkEmpty();
        });
    });

    itemUtil.reloadItems(function(){
        itemUtil.checkEmpty();
    });
});

seajs.use('main');
