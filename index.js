/**
 * Created by HH_Girl on 2018/3/24.
 */
;(function(root,factory){
    factory.call(root);
})(window,function(frameName){
    //框架配置
    var __default__={
        importModules:['modules/Lang']
    };
    //初始化方法
    var init=function(){
        console.log(IM.type({aaa:'bbbb'}));
    };
    //加载模块
    IM.require(__default__.importModules,init);
});