define(function(require, exports, module){
    var object = require('object'),
        overlay = require('overlay');

    module.exports = object.create({
        is: function(val, tip, test){
            test = test(val);
            if(!test && tip){
                overlay.toast({
                    tip: tip
                });
            }
            return test;
        },

        maxLen: function(val, tip, len){
            return this.is(val, tip, function(){
                return val.length <= len;
            });
        },

        minLen: function(val, tip, len){
            return this.is(val, tip, function(){
                return val.length >= len;
            });
        },

        nonEmp: function(val, tip){
            return this.minLen(val, tip, 1);
        },

        format: function(val, tip, regexp){
            return this.is(val, tip, function(){
                console.log(regexp);
                return regexp.test(val);
            });
        },

        and: function(bs){
            var i, n;
            for(i = 0, n = bs.length; i < n; i++){
                if(!bs[i]){
                    return false;
                }
            }
            return true;
        },

        or: function(bs){
            var i, n;
            for(i = 0, n = bs.length; i < n; i++){
                if(bs[i]){
                    return true;
                }
            }
            return false;
        }
    });
});
