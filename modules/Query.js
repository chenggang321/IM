/**
 * Created by HH_Girl on 2018/3/27.
 */
//选择器模块
AMD.module('modules/Query', function () {
    console.log('已加载选择器模块');
    var get = {
        getbyId: function(id) {
            return typeof id === "string" ? document.getElementById(id) : id
        },
        getbyClass: function(sClass, oParent) {
            var aClass = [];
            var reClass = new RegExp("(^| )" + sClass + "( |$)");
            var aElem = this.byTagName("*", oParent);
            for (var i = 0; i < aElem.length; i++) reClass.test(aElem[i].className) && aClass.push(aElem[i]);
            return aClass
        },
        getbyTagName: function(elem, obj) {
            return (obj || document).getElementsByTagName(elem)
        }
    };
    return get;
});