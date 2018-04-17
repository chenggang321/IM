/**
 * Created by HH_Girl on 2018/4/2.
 */
AMD.module('modules/Node',function(){
    console.log('已加载Node模块');
    function $ (a,b){//第一个构造器
        return new $.fn.init(a,b);//第二个构造器
    }
    //将原型对象放到一个名字更好记的属性名中
    //这是jQuery人性化的体现，也方便扩张原型方法
    $.fn = $.prototype ={
        init:function (a,b) {
            this.a = a;
            this.b = b;
        }
    };
    //共用一个原型
    $.fn.init.prototype = $.fn;

    var a=$(1,2);
    console.log(a instanceof $);
    console.log(a instanceof $.fn.init);
});