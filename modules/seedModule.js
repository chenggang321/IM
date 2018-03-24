/**
 * Created by HH_Girl on 2018/3/24.
 */
;(function (root, doc, moduleName) {
    //数据于参数存储
    var __default__ = {
            html: doc.documentElement,//html元素
            head: doc.head || doc.getElementsByTagName('head')[0],//head元素
            isMoreIE9: doc.dispatchEvent,//ie9开始支持w3c的事件模型（用于判断浏览器是否在ie8以上）
            loadedModules: {},//存储加载列表
            requestedUrl: {},
            reg_module_name: /(?:^|\/)([^(\/]+)(?=\(|$)/,// 匹配/后面的字符串
            reg_module_url: /\(([^)]+)\)/,
            reg_multi_module: /\s*,\s*/g,//以逗号分隔
        },
        //方法定义
        __method__ = {
            extend: function(receiver, supplier){
                var args = [].slice.call(arguments),
                    i = 1,
                    key, //如果最后参数是布尔，判定是否覆写同名属性
                    ride = typeof args[args.length - 1] === "boolean" ? args.pop() : true;
                if (args.length === 1) { //处理$.mix(hash)的情形
                    receiver = !this.window ? this : {};
                    i = 0;
                }
                while ((supplier = args[i++])) {
                    for (key in supplier) { //允许对象糅杂，用户保证都是对象
                        if (Object.prototype.hasOwnProperty.call(supplier, key) && (ride || !(key in receiver))) {
                            receiver[key] = supplier[key];
                        }
                    }
                }
                return receiver;
            },
            slice: this.isMoreIE9 ? function (nodes, start, end) {
                return [].slice.call(nodes, start, end);
            } : function (nodes, start, end) {
                var ret = [],
                    n = nodes.length;
                if (end === void 0 || typeof end === "number" && isFinite(end)) {
                    start = parseInt(start, 10) || 0;
                    end = end === void 0 ? n : parseInt(end, 10);
                    if (start < 0) {
                        start += n;
                    }
                    if (end > n) {
                        end = n;
                    }
                    if (end < 0) {
                        end += n;
                    }
                    for (var i = start; i < end; ++i) {
                        ret[i - start] = nodes[i];
                    }
                }
                return ret;
            },
            //定义模块(函数名，依赖列表，回调)
            define: function (moduleName, dependList, callback) {
                var hash = this.loadedModules;
                this.require(dependList, function () {
                    callback();
                    hash[moduleName] = 1
                })
            },
            //使用模块（依赖列表，回调）
            require: function (dependList, callback) {
                var i = 0,
                    moduleNames = [],
                    hash = this.loadedModules,
                    moduleName,//存储要加载的模块名称
                    str;
                //获取到模块名称
                if (typeof dependList === "string") {
                    dependList = dependList.split(this.reg_multi_module);
                }
                //循环获取依赖列表
                while (str = dependList[i++]) {
                    moduleName = str.match(this.reg_module_name)[1];
                    if (!hash[moduleName]) {
                        moduleNames.push(moduleName);
                        this.appendScript(str);
                    }
                }
                this.provide(moduleNames, hash, callback)
            },
            //提供模块
            provide: function (array, hash, callback) {
                var flag = true, i = 0, args = arguments, fn = args.callee, el;
                while (el = array[i++]) {
                    if (!hash[el]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    callback && callback();
                } else {
                    setTimeout(function () {
                        fn.apply(null, args)
                    }, 32);
                }
            },
            getBasePath: function () {
                var stack, url;
                try {
                    a.b.c(); //强制报错,以便捕获e.stack
                } catch (e) { //safari的错误对象只有line,sourceId,sourceURL
                    stack = e.stack;
                    if (!stack && window.opera) {
                        //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
                        stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
                    }
                }
                if (stack) {
                    stack = stack.split(/[@ ]/g).pop(); //取得最后一行,最后一个空格或@之后的部分
                    stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, ""); //去掉换行符
                    url = stack.replace(/(:\d+)?:\d+$/i, ""); //去掉行号与或许存在的出错字符起始位置
                }
                url = stack;
                if (!url) {
                    var script = (function (e) {
                        if (!e) return null;
                        if (e.nodeName.toLowerCase() == 'script') return e;
                        return arguments.callee(e.lastChild)
                    })(doc);//取得核心模块所在的script标签
                    url = script.hasAttribute ? script.src : script.getAttribute('src', 4);
                }
                url = url.substr(0, url.lastIndexOf('/'));
                this.getBasePath = function () {
                    return url;//缓存结果，第一次之后直接返回，再不用计算
                };
                return url;
            },
            appendScript: function (str) {
                var reg = this.reg_module_url, url;
                //处理dom.node(http://www.cnblogs.com/rubylouvre/dom/node.js)的情形
                var _u = str.match(reg);//匹配([XXXX])
                //获得路径
                url = _u && _u[1] ? _u[1] : this.getBasePath() + "/" + str + ".js";
                if (!this.requestedUrl[url]) {
                    this.requestedUrl[url] = 1;
                    var script = doc.createElement("script");
                    script.charset = "utf-8";
                    script.defer = true;
                    //  script.async = true;//不能保证多个script标签的执行顺序
                    script.src = url;
                    //避开IE6的base标签bug
                    //http://www.cnblogs.com/rubylouvre/archive/2010/05/18/1738034.html
                    //放入head标签中
                    doc.documentElement.firstChild.insertBefore(script, null);
                    // 移除加入的临时节点
                    this.removeScript(script);
                }

            },
            //移除临时生成的节点
            removeScript: function (script) {
                var parent = script.parentNode;
                /*
                 * 如果节点是元素节点，则 nodeType 属性将返回 1。
                 * 如果节点是属性节点，则 nodeType 属性将返回 2。
                 * */
                if (parent && parent.nodeType === 1) {
                    //script节点加载完成执行
                    script.onload = script.onreadystatechange = function () {
                        //var ie = !-[1,]; IE下为true,其他标准浏览器则为false
                        if (-[1,] || this.readyState === "loaded" || this.readyState === "complete") {//加载完成
                            if (this.clearAttributes) {
                                this.clearAttributes();//IE 清除自定义属性
                            } else {
                                this.onload = this.onreadystatechange = null;
                            }
                            //移除节点
                            parent.removeChild(this)
                        }
                    }
                }
            }
        };
    //核心对象
    root[moduleName] = __method__.extend({}, __default__, __method__);
})(window, window.document, 'IM');