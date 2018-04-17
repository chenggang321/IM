/**
 * Created by HH_Girl on 2018/3/24.
 */
;(function (root, factory) {
    factory.call(root);
})(window, function () {
    //框架配置
    var __OPT__ = {
        modules: [
            'modules/Lang',
            'modules/Class',
            'modules/Query',
            'modules/Observer',
            'modules/Data',
            'modules/Mvvm',
            'modules/Support',
            'modules/Node',
            'modules/Fx',
            'modules/Ajax',
            'modules/Storage'
        ]
    };
    //框架对象
    var IM = {
        //杂糅
        mix: function (receiver, supplier) {
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
        }
    };
    //导入模块
    AMD.module(__OPT__.modules, function () {
        [].forEach.call(arguments, function (item, index) {
            var moduleUrl = __OPT__.modules[index],
                moduleName = moduleUrl.substring(moduleUrl.lastIndexOf('/') + 1, moduleUrl.length);
            IM[moduleName] = item;
        });
    });
    //挂到window上
    window.IM = IM;
});