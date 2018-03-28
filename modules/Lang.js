/**
 * Created by HH_Girl on 2018/3/24.
 */
//语言扩展模块
AMD.module('modules/Lang', function () {
    console.log('已加载Lang模块');
    var Lang ={};
    //判断类型与转换
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
        isNative: function (method, obj) {
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
            if (!this.type(obj, 'Object') || this.isNative('reload', obj)) {
                return false;
            }
            //不存在hasOwnProperty的对象肯定是IE的BOM对象或DOM对象
            try {
                //只有一个方法是来自其原型立即返回false
                for (var key in obj) {
                    //不能用obj.hasOwnProperty自己查自己
                    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
                        return false;
                    }
                }
            } catch (e) {
                return false;
            }
            return true;
        },
        /*
         * 是否为空对象
         * @param {Object} obj
         * @return {Boolean}
         * */
        isEmptyObject: function (obj) {
            for (var i in obj) {
                return false;
            }
            return true;
        },
        /*
         * 是否为类数组(Array，Arguments，NodeList与拥有非负数的length属性的Object对象)
         * 如果第二个参数为true，则包含有字符串
         * @param {Object} obj
         * @param {Boolean} includeString
         * @return {Boolean}
         * */
        isArrayLike: function (obj, includeString) {
            if (includeString && typeof obj === 'string') {
                return false
            }
            if (obj && typeof obj === 'object') {
                var n = obj.length;
                if (+n === n && !(n % 1) && n >= 0) {//检测length属性是否为非负数
                    try {
                        // 如果是原生对象
                        if ({}.propertyIsEnumerable.call(obj, 'length') === false) {
                            return Array.isArray(obj) || /^\s?function/.test(obj.item || obj.callee);
                        }
                        return true;
                    } catch (e) {//Ie的NodeList直接抛错
                        return true;
                    }
                }
            }
        },
        isFunction: function (fn) {
            return "[object Function]" === tools.toString.call(fn);
        },
        isArray: Array.isArray,
        /*
         * 取得对象的键值对，依次放进回调中执行,并收集其结果，视第四个参数的真伪表现为可中断的forEach操作或map操作
         * @param {Object} obj
         * @param {Function} fn
         * @param {Any} scope ? 默认为当前遍历的元素或属性值
         * @param {Boolean} map ? 是否表现为map操作
         * @return {Object|Array}
         */
        each: function (obj, fn, scope, map) {
            var value, i = 0,
                isArray = this.isArrayLike(obj),
                ret = [];
            if (isArray) {
                for (var n = obj.length; i < n; i++) {
                    value = fn.call(scope || obj[i], i, obj[i]);
                    if (map) {
                        if (value !== null) {
                            ret[ret.length] = value;
                        }
                    } else if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = fn.call(scope || obj[i], i, obj[i]);
                    if (map) {
                        if (value !== null) {
                            ret[ret.length] = value;
                        }
                    } else if (value === false) {
                        break;
                    }
                }
            }
            return map ? ret : obj;
        },
        /*
         * 取得对象的键值对，依次放进回调中执行,并收集其结果，以数组形式返回。
         * @param {Object} obj
         * @param {Function} fn
         * @param {Any} scope ? 默认为当前遍历的元素或属性值
         * @return {Array}
         */
        map: function (obj, fn, scope) {
            return this.each(obj, fn, scope, true);
        },
        /*
         * 过滤数组中不合要求的元素
         * @param {Object} obj
         * @param {Function} fn 如果返回true则放进结果集中
         * @param {Any} scope ? 默认为当前遍历的元素或属性值
         * @return {Array}
         */
        filter: function (obj, fn, scope) {
            for (var i = 0, n = obj.length, ret = []; i < n; i++) {
                var val = fn.call(scope || obj[i], obj[i], i);
                if (!!val) {
                    ret[ret.length] = obj[i];
                }
            }
            return ret;
        },
        /*
         * 字符串插值，有两种插值方法。
         * 第一种，第二个参数为对象，#{}里面为键名，替换为键值，适用于重叠值够多的情况
         * 第二种，把第一个参数后的参数视为一个数组，#{}里面为索引值，从零开始，替换为数组元素
         * @param {String}
         * @param {Object|Any} 插值包或某一个要插的值
         * @return {String}
         */
        format: function (str, object) {
            var rformat = /\\?\#{([^{}]+)\}/gm;
            var array = $.slice(arguments, 1);
            return str.replace(rformat, function (match, name) {
                if (match.charAt(0) === "\\")
                    return match.slice(1);
                var index = Number(name);
                if (index >= 0)
                    return array[index];
                if (object && object[name] !== void 0)
                    return object[name];
                return '';
            });
        },
        /*
         * 生成一个整数数组
         * @param {Number} start ? 默认为0
         * @param {Number} end ? 默认为0
         * @param {Number} step ? 默认为1
         * @return {Array}
         */
        range: function (start, end, step) {
            step || (step = 1);
            if (end == null) {
                end = start || 0;
                start = 0;
            }
            var index = -1,
                length = Math.max(0, Math.ceil((end - start) / step)),
                result = Array(length);

            while (++index < length) {
                result[index] = start;
                start += step;
            }
            return result;
        },
        /*
         * 为字符串两端添上双引号,并对内部需要转义的地方进行转义
         * @param {String} str
         * @return {String}
         */
        quote: String.quote || JSON.stringify,
        /*
         * 查看对象或数组的内部构造
         * @param {Any} obj
         * @return {String}
         */
        dump: function (obj) {
            var space = this.isNative("parse", window.JSON) ? 4 : "\r\t", cache = [],
                text = JSON.stringify(obj, function (key, value) {
                    if (typeof value === 'object' && value !== null) {//防止环引用
                        if (cache.indexOf(value) !== -1) {
                            return;
                        }
                        cache.push(value);
                    }
                    return typeof value === "function" ? value + "" : value;
                }, space);
            cache = [];//GC回收
            return text;
        },
        /*
         * 将字符串当作JS代码执行
         * @param {String} code
         */
        parseJS: function (code) {
            var seval = root.execScript ? "execScript" : "eval";
            //IE中，global.eval()和eval()一样只在当前作用域生效。
            //Firefox，Safari，Opera中，直接调用eval()为当前作用域，global.eval()调用为全局作用域。
            //window.execScript 在IE下一些限制条件
            if (code && /\S/.test(code)) {
                try {
                    root[seval](code);
                } catch (e) {
                }
            }
        },
        /*
         * 将字符串解析成JSON对象
         * @param {String} data
         * @return {JSON}
         */
        parseJSON: function (data) {
            try {
                return root.JSON.parse(data.trim());
            } catch (e) {
                this.error("Invalid JSON: " + data, TypeError);
            }
        },
        /*
         * 将字符串解析成XML文档对象
         * @param {String} data
         * @return {XML}
         */
        parseXML: function (data, xml, tmp) {
            try {
                var mode = document.documentMode;
                if (root.DOMParser && (!mode || mode > 8)) { // Standard
                    tmp = new DOMParser();
                    xml = tmp.parseFromString(data, "text/xml");
                } else { // IE
                    xml = new ActiveXObject("Microsoft.XMLDOM"); //"Microsoft.XMLDOM"
                    xml.async = "false";
                    xml.loadXML(data);
                }
            } catch (e) {
                xml = undefined;
            }
            if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                this.error("Invalid XML: " + data, TypeError);
            }
            return xml;
        },
        /*
         * 抛出错误,方便调试
         * @param {String} str
         * @param {Error}  e ? 具体的错误对象构造器
         * EvalError: 错误发生在eval()中
         * SyntaxError: 语法错误,错误发生在eval()中,因为其它点发生SyntaxError会无法通过解释器
         * RangeError: 数值超出范围
         * ReferenceError: 引用不可用
         * TypeError: 变量类型不是预期的
         * URIError: 错误发生在encodeURI()或decodeURI()中
         */
        error: function (str, e) {
            throw new (e || Error)(str);
        }
    };
    IM.mix(Lang,tools);
    /*
     * Object.defineProperty() 方法会直接在一个对象上定义一个新属性，
     *  或者修改一个对象的现有属性， 并返回这个对象。
     * configurable
     *  当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，
     *  同时该属性也能从对应的对象上被删除。默认为 false。
     *enumerable
     * 当且仅当该属性的enumerable为true时，
     *  该属性才能够出现在对象的枚举属性中。默认为 false。
     *  数据描述符同时具有以下可选键值：
     *value
     *  该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
     *writable
     *  当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 false。
     * */
    function method(obj, name, val) {
        if (!obj[name]) {
            Object.defineProperty(obj, name, {
                configurable: true,
                enumerable: false,
                writable: true,
                value: val
            })
        }
    }

    //IE8的Object.defineProperty只对Dom有效
    try {
        Object.defineProperty({}, 'a', {
            get: function () {
            }
        });
        IM.supportDefineProperty = true;
    } catch (e) {
        method = function (obj, name, method) {
            if (!obj[name]) {
                obj[name] = method;
            }
        }
    }
    //循环定义对象属性方法
    function methods(obj, map) {
        for (var name in map) {
            method(obj, name, map[name]);
        }
    }

    //为String扩展方法
    methods(String.prototype, {
        //将字符串重复n遍
        repeat: function (n) {
            var result = "",
                target = this;
            while (n > 0) {
                if (n & 1)
                    result += target;
                target += target;
                n >>= 1;
            }
            return result;
        },
        //判定是否以给定字符串开头
        startsWith: function (str) {
            return this.indexOf(str) === 0;
        },
        //判定是否以给定字符串结尾
        endsWith: function (str) {
            return this.lastIndexOf(str) === this.length - str.length;
        },
        //判断一个字符串是否包含另一个字符
        contains: function (s, position) {
            return ''.indexOf.call(this, s, position >> 0) !== -1;
        }
    });

    //构建四个工具方法
    /*
    * Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，
    * 数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致
    * （两者的主要区别是 一个 for-in 循环还会枚举其原型链上的属性）。
    * */
    'String,Array,Number,Object'.replace(/[^, ]+/g, function (Type) {//以逗号分隔
        Lang[Type] = function (pack) {
            var isNative = typeof pack === 'string',
                methods = isNative ? pack.match(/[^, ]+/g) : Object.keys(pack);
            methods.forEach(function (method) {
                Lang[Type][method] = isNative ?
                    function (obj) {
                        return obj[method].apply(obj, Lang.slice(arguments, 1))
                    } : pack[method];
            })
        }
    });
    //对字符串的扩展
    Lang.String({
        /*取得一个字符串所有字节的长度。这是一个后端过来的方法，如果将一个英文字符插
         *入数据库 char、varchar、text 类型的字段时占用一个字节，而一个中文字符插入
         *时占用两个字节，为了避免插入溢出，就需要事先判断字符串的字节长度。在前端，
         *如果我们要用户填空的文本，需要字节上的长短限制，比如发短信，也要用到此方法。
         *随着浏览器普及对二进制的操作，这方法也越来越常用。
         */
        byteLen: function(target, fix) {
            fix = fix ? fix: 2;
            var str = new Array(fix+1).join("-")
            return target.replace(/[^\x00-\xff]/g, str).length;
        },
        //length，新字符串长度，truncation，新字符串的结尾的字段,返回新字符串
        truncate: function(target, length, truncation) {
            length = length || 30;
            truncation = truncation === void(0) ? "..." : truncation;
            return target.length > length ? target.slice(0, length - truncation.length) + truncation : String(target);
        },
        //转换为驼峰风格
        camelize: function(target) {
            if (target.indexOf("-") < 0 && target.indexOf("_") < 0) {
                return target; //提前判断，提高getStyle等的效率
            }
            return target.replace(/[-_][^-_]/g, function(match) {
                return match.charAt(1).toUpperCase();
            });
        },
        //转换为下划线风格
        underscored: function(target) {
            return target.replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/\-/g, "_").toLowerCase();
        },
        //首字母大写
        capitalize: function(target) {
            return target.charAt(0).toUpperCase() + target.substring(1).toLowerCase();
        },
        //移除字符串中的html标签，但这方法有缺陷，如里面有script标签，会把这些不该显示出来的脚本也显示出来了
        stripTags: function(target) {
            return target.replace(/<[^>]+>/g, "");
        },
        //移除字符串中所有的 script 标签。弥补stripTags方法的缺陷。此方法应在stripTags之前调用。
        stripScripts: function(target) {
            return target.replace(/<script[^>]*>([\S\s]*?)<\/script>/img, '');
        },
        //将字符串经过 html 转义得到适合在页面中显示的内容, 例如替换 < 为 &lt;
        escapeHTML: function(target) {
            return target.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        },
        //还原为可被文档解析的HTML标签
        unescapeHTML: function(target) {
            return target.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&") //处理转义的中文和实体字符
                .replace(/&#([\d]+);/g, function($0, $1) {
                    return String.fromCharCode(parseInt($1, 10));
                });
        },
        //将字符串安全格式化为正则表达式的源码
        escapeRegExp: function(target) {
            return(target + "").replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
        },
        //在左边补上一些字符,默认为0
        pad: function(target, n, filling, right, radix) {
            var num = target.toString(radix || 10);
            filling = filling || "0";
            while (num.length < n) {
                if (!right) {
                    num = filling + num;
                } else {
                    num += filling;
                }
            }
            return num;
        }
    });
    //字符串的原生原型方法
    Lang.String("charAt,charCodeAt,concat,indexOf,lastIndexOf,localeCompare,match," + "contains,endsWith,startsWith,repeat," + //es6
        "replace,search,slice,split,substring,toLowerCase,toLocaleLowerCase,toUpperCase,trim,toJSON");

    //对数组的扩展
    Lang.Array({
        //判定数组是否包含指定目标。
        contains: function(target, item) {
            return !!~target.indexOf(item);
        },
        //移除数组中指定位置的元素，返回布尔表示成功与否。
        removeAt: function(target, index) {
            return !!target.splice(index, 1).length
        },
        //移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否。
        remove: function(target, item) {
            var index = target.indexOf(item);
            if (~index)
                return $.Array.removeAt(target, index);
            return false;
        },
        //对数组进行洗牌。若不想影响原数组，可以先拷贝一份出来操作。
        shuffle: function(target) {
            var ret = [],
                i = target.length,
                n;
            target = target.slice(0);
            while (--i >= 0) {
                n = Math.floor(Math.random() * i);
                ret[ret.length] = target[n];
                target[n] = target[i];
            }
            return ret;
        },
        //从数组中随机抽选一个元素出来。
        random: function(target) {
            return target[Math.floor(Math.random() * target.length)];
        },
        //对数组进行平坦化处理，返回一个一维的新数组。
        flatten: function(target) {
            var result = [],
                self = IM.Array.flatten;
            target.forEach(function(item) {
                if (Array.isArray(item)) {
                    result = result.concat(self(item));
                } else {
                    result.push(item);
                }
            });
            return result;
        },
        // 过滤数组中的null与undefined，但不影响原数组。
        compact: function(target) {
            return target.filter(function(el) {
                return el !== null;
            });
        },
        //根据指定条件进行排序，通常用于对象数组。
        sortBy: function(target, fn, scope) {
            var array = target.map(function(item, index) {
                return {
                    el: item,
                    re: fn.call(scope, item, index)
                };
            }).sort(function(left, right) {
                var a = left.re,
                    b = right.re;
                return a < b ? -1 : a > b ? 1 : 0;
            });
            return IM.Array.pluck(array, 'el');
        },
        //取得对象数组的每个元素的指定属性，组成数组返回。
        pluck: function(target, name) {
            return target.filter(function(item) {
                return item[name] !== null;
            });
        },
        // 对数组进行去重操作，返回一个没有重复元素的新数组。
        unique: function(target) {
            var ret = [],
                n = target.length,
                i, j; //by abcd
            for (i = 0; i < n; i++) {
                for (j = i + 1; j < n; j++)
                    if (target[i] === target[j])
                        j = ++i;
                ret.push(target[i]);
            }
            return ret;
        },
        //合并参数二到参数一
        merge: function(first, second) {
            var i = ~~first.length,
                j = 0;
            for (var n = second.length; j < n; j++) {
                first[i++] = second[j];
            }
            first.length = i;
            return first;
        },
        //对两个数组取并集。
        union: function(target, array) {
            return IM.Array.unique(IM.Array.merge(target, array));
        },
        //对两个数组取交集
        intersect: function(target, array) {
            return target.filter(function(n) {
                return ~array.indexOf(n);
            });
        },
        //对两个数组取差集(补集)
        diff: function(target, array) {
            var result = target.slice();
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < array.length; j++) {
                    if (result[i] === array[j]) {
                        result.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
            return result;
        },
        //返回数组中的最小值，用于数字数组。
        min: function(target) {
            return Math.min.apply(0, target);
        },
        //返回数组中的最大值，用于数字数组。
        max: function(target) {
            return Math.max.apply(0, target);
        },
        //深拷贝当前数组
        clone: function(target) {
            var i = target.length,
                result = [];
            while (i--)
                result[i] = cloneOf(target[i]);
            return result;
        },
        //只有当前数组不存在此元素时只添加它
        ensure: function(target, el) {
            if (!~target.indexOf(el)) {
                target.push(el);
            }
            return target;
        },
        //将数组划分成N个分组，其中小组有number个数，最后一组可能小于number个数,
        //但如果第三个参数不为undefine时,我们可以拿它来填空最后一组
        inGroupsOf: function(target, number, fillWith) {
            var t = target.length,
                n = Math.ceil(t / number),
                fill = fillWith !== void 0,
                groups = [],
                i, j, cur;
            for (i = 0; i < n; i++) {
                groups[i] = [];
                for (j = 0; j < number; j++) {
                    cur = i * number + j;
                    if (cur === t) {
                        if (fill) {
                            groups[i][j] = fillWith;
                        }
                    } else {
                        groups[i][j] = target[cur];
                    }
                }
            }
            return groups;
        }
    });
    //数组原型方法
    Lang.Array("concat,join,pop,push,shift,slice,sort,reverse,splice,unshift," + "indexOf,lastIndexOf,every,some,filter,reduce,reduceRight");
    function cloneOf(item){
        var name = IM.type(item);
        switch (name){
            case 'Array':
            case 'Object':
                return IM[name].clone(item);
            default:
                return item;
        }
    }

    //对数字的扩展
    var NumberPack = {
        //确保数值在[n1,n2]闭区间之内,如果超出限界,则置换为离它最近的最大值或最小值
        limit: function(target, n1, n2) {
            var a = [n1, n2].sort();
            if (target < a[0])
                target = a[0];
            if (target > a[1])
                target = a[1];
            return target;
        },
        //求出距离指定数值最近的那个数
        nearer: function(target, n1, n2) {
            var diff1 = Math.abs(target - n1),
                diff2 = Math.abs(target - n2);
            return diff1 < diff2 ? n1 : n2
        },
        round: function(target, base) {
            if (base) {
                base = Math.pow(10, base);
                return Math.round(target * base) / base;
            } else {
                return Math.round(target);
            }
        }
    };
    "abs,acos,asin,atan,atan2,ceil,cos,exp,floor,log,pow,sin,sqrt,tan".replace(/[^, ]+/g, function(name) {
        NumberPack[name] = Math[name];
    });
    Lang.Number(NumberPack);
    Lang.Number("toFixed,toExponential,toPrecision,toJSON");

    //对对象的扩展
    Lang.Object({
        //根据传入数组取当前对象相关的键值对组成一个新对象返回
        subset: function(target, props) {
            var result = {};
            props.forEach(function(prop) {
                result[prop] = target[prop];
            });
            return result;
        },
        //将参数一的键值都放入回调中执行，如果回调返回false中止遍历
        forEach: function(obj, fn) {
            Object.keys(obj).forEach(function(name) {
                fn(obj[name], name)
            })
        },
        //将参数一的键值都放入回调中执行，收集其结果返回
        map: function(obj, fn) {
            return  Object.keys(obj).map(function(name) {
                return fn(obj[name], name)
            })
        },
        //进行深拷贝，返回一个新对象
        clone: function(target) {
            var clone = {};
            for (var key in target) {
                clone[key] = cloneOf(target[key]);
            }
            return clone;
        },
        //将多个对象合并到第一个参数中或将后两个参数当作键与值加入到第一个参数
        merge: function(target, k, v) {
            var obj, key;
            //为目标对象添加一个键值对
            if (typeof k === "string")
                return mergeOne(target, k, v);
            //合并多个对象
            for (var i = 1, n = arguments.length; i < n; i++) {
                obj = arguments[i];
                for (key in obj) {
                    if (obj[key] !== void 0) {
                        mergeOne(target, key, obj[key]);
                    }
                }
            }
            return target;
        }
    });
    //对象原型方法
    Lang.Object("hasOwnProperty,isPrototypeOf,propertyIsEnumerable");
    function mergeOne(source, key, current) {
        //使用深拷贝方法将多个对象或数组合并成一个
        if (IM.isPlainObject(source[key])) { //只处理纯JS对象，不处理window与节点
            IM.Object.merge(source[key], current);
        } else {
            source[key] = cloneOf(current)
        }
        return source;
    }
    return Lang;
});