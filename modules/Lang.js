/**
 * Created by HH_Girl on 2018/3/24.
 */
//语言扩展模块
IM.define('Lang', [], function () {
    console.log('已加载Lang模块');
    var tools = {
        //格式化类型
        class2type: {
            "[object HTMLDocument]": "Document",
            "[object HTMLCollection]": "NodeList",
            "[object StaticNodeList]": "NodeList",
            "[object DOMWindow]": "Window",
            "[object global]": "Window",
            "null": "Null",
            "NaN": "NaN",
            "undefined": "Undefined"
        },
        /*
         * 用于取得数据的类型（一个参数的情况下）或判定数据的类型（两个参数的情形下）
         * @param {Any} obj 要检测的东西
         * @param {String} str ? 要比较的类型
         * @return {String|Boolean}
         * @api public
         * */
        type: function (obj, str) {
            var result = this.class2type[(obj === null || obj !== obj) ? obj :
                    {}.toString.call(obj)] || obj.nodeName || '#';
            if (result.charAt(0) === '#') {//兼容旧式浏览器与处理个别情况，如：window.opera
                //利用IE678 window==document为true，document==window尽然为false的神奇特性
                if (obj === obj.document && obj.document != obj) {
                    result = 'Window';//返回构造器名字
                } else if (obj.nodeType === 9) {
                    result = 'Document';
                } else if (obj.callee) {
                    result = 'Arguments';
                } else if (isFinite(obj.length) && obj.item) {
                    result = 'NodeList';//处理节点集合
                } else {
                    result = {}.toString.call(obj).slice(8, -1);
                }
            }
            if (str) {
                return str === result;
            }
            return result;
        },
        /*
         * 判定method是否为obj的原生方法，如IM.isNative('JSON',window)
         * @param {Function} method
         * @param {Any} obj 对象
         * @return {Boolean}
         * */
        isNative: function (method,obj) {
            var sopen = (global.open + '').replace(/open/g, "");
            var m = obj ? obj[method] : false,
                r = new RegExp(method, 'g');
            return !!(m && typeof m != 'string' && sopen === (m + '').replace(r, ''));
        },
        /*
         * 判定是否是一个朴素的javascript对象（Object或JSON）
         * 不是DOM对象，不是BOM对象，不是自定义类的实现
         * @param {Object} obj
         * @param {Boolean}
         * */
        isPlainObject: function (obj) {
            if (!this.type(obj, 'Object')||this.isNative('reload',obj)) {
                return false;
            }
            //不存在hasOwnProperty的对象肯定是IE的BOM对象或DOM对象
            try{
                //只有一个方法是来自其原型立即返回false
               for(var key in obj){
                   //不能用obj.hasOwnProperty自己查自己
                   if(!Object.prototype.hasOwnProperty.call(obj,key)){
                     return false;
                   }
               }
            }catch (e){
                return false;
            }
            return true;
        },
        /*
        * 是否为空对象
        * @param {Object} obj
        * @return {Boolean}
        * */
        isEmptyObject:function(obj){
            for(var i in obj){
                return false;
            }
            return true;
        }
        /*
        * 是否为类数组
        * */
    };
    IM.extend(tools, false);
});