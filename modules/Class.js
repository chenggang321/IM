/**
 * Created by HH_Girl on 2018/3/24.
 */
//类工厂模块
AMD.module('modules/Class', function () {
    console.log('已加载类工厂模块');
    function bridge() {
    }

    var Class = {
        inherit: function (parent, init) {
            //继承一个父类，并将它放入_init列表中，并添加setOptions原型方法
            if (typeof parent === 'function') {
                for (var i in parent) {//继承类成员
                    this[i] = parent[i];
                }
                birdeg.prototype = parent.prototype;
                //继承原型成员
                this.prototype = new bridge();
                //指定父类
                this._super = parent;
                if (!this.__init__) {
                    this.__init__ = [parent];
                }
            }
            this.__init__ = (this.__init__ || []).concat();
            if (init) {
                this.__init__.push(init);
            }
            this.toString = function () {
                return (init || bridge) + '';
            };
            var proto = this.fn = this.prototype;
        },
        extend: function (module) {
            //添加一组原型方法
            var target = this;
            Object.keys(module).forEach(function (name) {
                var fn = target[name], fn2 = module[name];
                if (typeof fn === "function" && typeof fn2 === "function") {
                    var __super = function () { //创建方法链
                        return fn.apply(this, arguments);
                    };
                    var __superApply = function (args) {
                        return fn.apply(this, args);
                    };
                    target[name] = function () {
                        var t1 = this._super;
                        var t2 = this._superApply;
                        this._super = __super;
                        this._superApply = __superApply;
                        var ret = fn2.apply(this, arguments);
                        this._super = t1;
                        this._superApply = t2;
                        return ret;
                    };
                } else {
                    target[name] = fn2;
                }
            });
            return this;
        }
    };

    function getSubClass(obj) {
        return Class.factory(this, obj);
    }

    Class.factory = function (parent, obj) {
        if (arguments.length === 1) {
            obj = parent;
            parent = null;
        }
        var statics = obj.statics;//静态成员扩展包
        var init = obj.init; //构造器
        delete obj.init;
        delete obj.statics;
        var klass = function () {
            for (var i = 0, init; init = klass.__init__[i++];) {
                init.apply(this, arguments);
            }
        };
        Class.inherit.call(klass, parent, init);//继承了父类原型成员与类成员
        var fn = klass.fn;
        var __init__ = klass.__init__;
        $.mix(klass, statics);//添加类成员
        klass.prototype = klass.fn = fn;
        klass.__init__ = __init__;
        klass.fn.extend(obj);
        klass.mix = $.mix;
        klass.extend = getSubClass;
        return klass;
    };
    return Class;
});