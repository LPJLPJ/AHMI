/**
 * create by lixiang in 2017/11/15
 * 双向绑定模型,sx_Scope对象维护一个watchers数组，watchers存放检查的表达式和对应的回调函数,详见设计文档与example
 * 用例：
 * 在html中使用sx-model指令绑定值，例如：
 * <input type="text",sx-model="user.name">
 *
 * 在js中实例化一个sx_Scope，例如：
 * var sx_Scope = new sx_Scope({reciprocal:true})//开启双向绑定。此时input中的变化会反应到sx_Scope.user.name中。
 * sx_Scope.user = {
 *     name:'AHMI'
 * };
 * Scope.digest();//手动进行一次循环检查，更新视图。
 *
 * 开发者在后期需要通过更新model来更新视图时，出于性能考虑，需要手动触发sx_Scope.digest()
 */

/**
 * sx_Scope构造函数
 * @param {obj} options   选项，目前支持是否双向绑定。
 * @param {obj} dataModel 数据对象，通过这个方式初始化的数据模型，可以自动调用digest()
 */
var sx_Scope = function(options) {
    this.watchers = [];

    var self = this;
    var reciprocal = options&&options.reciprocal||false;//是否支持视图到模型的绑定
    var elements = document.querySelectorAll('[sx-model]');//获取所有包含sx-model属性的元素

    for(var i = 0, len =elements.length; i < len; i++){

        (function(i) {
            self.watch(function() {
                //获取属性名
                return self.str2PropGet(elements[i].getAttribute('sx-model'));
            }, function() {
                var args = Array.prototype.slice.call(arguments);
                var elementType = elements[i].tagName.toLowerCase();
                //设置属性值
                if(elementType === 'input' || elementType === 'textarea' || elementType === 'select') {
                    elements[i].value = args[0]||self.str2PropGet(elements[i].getAttribute('sx-model'));;
                } else {
                    elements[i].innerHTML = args[0]||self.str2PropGet(elements[i].getAttribute('sx-model'));
                }
            });
        })(i);

    }

    //事件处理与监听
    function pageElementEventHandler(e) {
        var target = e.target || e.srcElemnt;
        var fullPropName = target.getAttribute('sx-model');

        if(fullPropName && fullPropName !== '') {
            self.str2PropSet(target.getAttribute('sx-model'), target.value);
            self.digest();
        }

    }

    //开启视图监听，更新模型
    if(reciprocal){
        document.addEventListener('keyup', pageElementEventHandler, false);
        document.addEventListener('change', pageElementEventHandler, false);
    }
};


Object.assign(sx_Scope.prototype,{
    watch:function(watchExp, callback) {
        this.watchers.push({
            watchExp: watchExp,
            callback: callback || function() {}
        });
    },
    digest:function(){
        var dirty;
        do {
            dirty = false;
            for(var i = 0; i < this.watchers.length; i++) {
                var newVal = this.watchers[i].watchExp(),
                    oldVal = this.watchers[i].last;
                if(newVal !== oldVal) {
                    this.watchers[i].callback(newVal, oldVal);
                    dirty = true;
                    this.watchers[i].last = newVal;
                }
            }
        } while(dirty);
    },
    // 获取sx_Scope下的相关属性值
    //edit by LH in 2017/11/16:原本的函数只支持对象，修改后可以支持数组
    str2PropGet:function(propPath){
        var props = propPath.split('.');
        var result = this;

        for(var i = 0; i < props.length; i++) {
            var pattern=/\[/g;
            if(props[i].match(pattern)){

                var arrays = props[i].split('[');
                var arrayNum=parseInt(arrays[1].split(']'));
                result=result[arrays[0]][arrayNum];
            }else{
                result = result[props[i]];
            }
        }
        return result;
    },
    // 设置sx_Scope下的相关属性值
    //edit by LH in 2017/11/16:原本的函数只支持对象，修改后可以支持数组
    str2PropSet:function(propPath,value){
        var props = propPath.split('.');
        var result = this;
        try{
            for(var i = 0; i < props.length - 1; i++) {
                var pattern=/\[/g;
                if(props[i].match(pattern)){

                    var arrays = props[i].split('[');
                    var arrayNum=parseInt(arrays[1].split(']'));
                    result=result[arrays[0]][arrayNum];
                }else{
                    result = result[props[i]];
                }
            }
        }catch(err){
            throw new Error('sx-model reference err',err);
        }
        result[props[i]] = value;
    }
})