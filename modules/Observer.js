/*
 * 观察者模式：又被称作发布-订阅者模式或信息机制，定义了一种依赖关系
 * 解决了主体对象与观察者之间功能的耦合
 * */
AMD.module('modules/Observer',function(){
    console.log('已加载Observer');
    //将观察者模式放在闭包中，当页面加载就立即执行
    var Observer = (function () {
        //防止信息队列暴露而被篡改故将信息容器作为静态私有变量保存
        var __messages = {};
        return {
            //订阅接口
            regist: function (type, fn) {
                //如果此消息不存在则应该创建一个消息类型
                if (typeof __messages[type] === 'undefined') {
                    //将动作推入到改消息对应的动作执行队列中
                    __messages[type] = [fn];
                } else {//如果存在
                    //将动作方法推入该消息对应的动作执行序列中
                    __messages[type].push(fn);
                }
                return this;
            },
            //发布接口
            fire: function (type, args) {
                //如果该信息没有被注册，则返回
                if (!__messages[type]) return;
                //定义消息信息
                var events = {
                        type: type,//消息类型
                        args: args || {}//消息携带数据
                    },
                    i = 0,//消息动作循环变量
                    len = __messages[type].length;//消息动作长度
                //遍历消息动作
                for (; i < len; i++) {
                    //依次执行注册消息对应的序列
                    __messages[type][i].call(this, events);
                }
                return this;
            },
            //注销接口
            remove: function (type, fn) {
                //如果消息动作队列存在
                if (__messages[type] instanceof Array) {
                    //从最后一个消息动作遍历
                    var i = __messages[type].length - 1;
                    for (; i >= 0; i--) {
                        //如果存在该动作则在消息动作序列中移出相应动作
                        __messages[type][i] === fn && __messages[type].splice(i, 1);
                    }
                }
                return this;
            }
        }
    })();
    return Observer;
});