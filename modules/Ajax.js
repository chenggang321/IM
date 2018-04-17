/**
 * Created by HH_Girl on 2018/4/2.
 */
AMD.module('modules/Ajax', function () {
    console.log('已加载Ajax模块');
    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define(blazy);
        } else if (typeof exports === 'object') {
            module.exports = blazy();
        } else {
            root.ajax = factory();
        }
    })(window, function () {
        let __option__ = {
            method: 'GET',//请求方式
            url: '',//请求地址
            async: true,//是否异步
            dataType: 'json',//解析方式
            data: '',//参数
            success: function () {
            },//请求成功回调
            error: function () {
            }//请求失败回调
        };
        //继承
        function extend(target, source) {
            for (let pro in source) {
                target[pro] = source[pro];
            }
            return target;
        }
        //格式化参数
        function params_format(obj){
            let str = '';
            for(let i in obj){
                str += i + '=' + obj[i] + '&'
            }
            return str.split('').splice(0,-1).join('');
        }
        function ajax(opt) {
            let options = extend(__option__,opt);
            //创建ajax对象
            let xhr = new XMLHttpRequest(),
                method = options.method.toUpperCase();
            //连接服务器open(方法GET/POST,请求地址，异步传输)
            if (method === 'GET') {
                xhr.open(method, options.url + '?' + params_format(options.data), options.async);
                xhr.send();
            }else{
                xhr.open(method,options.url,options.async);
                xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                xhr.send(options.data);
            }
            /*
             ** 每当readyState改变时，就会触发onreadystatechange事件
             ** readyState属性存储有XMLHttpRequest的状态信息
             ** 0 ：请求未初始化
             ** 1 ：服务器连接已建立
             ** 2 ：请求已接受
             ** 3 : 请求处理中
             ** 4 ：请求已完成，且相应就绪
             */
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)){
                    switch (options.dataType){
                        case 'json':
                            let json = JSON.parse(xhr.responseText);
                            options.success(json);
                            break;
                        case 'xml':
                            options.success(xhr.responseXML);
                            break;
                        default:
                            options.success(xhr.responseText);
                            break;
                    }
                }
            };

            xhr.onerror = function(err){
                options.error(err);
            }
        }
        return ajax;
    });
    ajax({
        url: 'data/data.json',
        success: function (res) {
            console.log(res);
        }
    });
});