/**
 * Created by HH_Girl on 2018/4/2.
 */
AMD.module('modules/Storage', function () {
    console.log('已加载Storage模块');
    class Storage {
        constructor() {
            this.ls = window.localStorage;
            this.ss = window.sessionStorage;
        }

        /*************************************** cookies ***************************************/
        setCookie(name, value, day) {
            let setting = arguments[0];
            console.log(this.getType(setting));
            if (this.getType(setting) === 'Object') {
                let _this = this;
                day = arguments[1];
                Object.keys(setting).forEach(function (key) {
                    _this.setOneCookie(key, setting[key], day);
                })
            } else {
                this.setOneCookie(name, value, day);
            }
        }

        setOneCookie(name, value, day) {
            let oDate = new Date();
            oDate.setDate(oDate.getDate() + day);
            document.cookie = name + '=' + value + ';expires=' + oDate;
        }

        getType(any) {
            return Object.prototype.toString.call(any).slice(8, -1)
        }

        //获取cookies
        getCookie(name) {
            let arr = document.cookie.split(';');
            for (let i = 0; i < arr.length; i++) {
                let arr2 = arr[i].split('=');
                if (arr2[0] === name) {
                    return arr2[1];
                }
            }
        }

        //删除cookies
        removeCookies(name) {
            this.setCookie(name, 1, -1)
        }

        /************************************** localStorage ****************************************/
        //设置localStorage
        setLocal(key, val) {
            let setting = arguments[0];
            if (this.getType(setting) === 'Object') {
                let _this = this;
                Object.keys(setting).forEach(function (key) {
                    _this.ls.setItem(key, JSON.stringify(setting[key]));
                })
            } else {
                this.ls.setItem(key, JSON.stringify(val));
            }
        }

        //获取localStorage
        getLocal(key) {
            if (key) return JSON.parse(this.ls.getItem(key));
            return null;
        }

        //移除localStorage
        removeLocal(key) {
            this.ls.removeItem(key);
        }

        //移除所有localStorage
        clearLocal() {
            this.ls.clear();
        }

        /******************************  sessionStorage *******************************/
        //set sessionStorage
        setSession(key, val) {
            let setting = arguments[0];
            if (this.getType(setting) === 'Object') {
                let _this = this;
                Object.keys(setting).forEach(function (key) {
                    _this.ss.setItem(key, JSON.stringify(setting[key]));
                })
            } else {
                this.ss.setItem(key, JSON.stringify(val));
            }
        }

        //获取sessionStorage
        getSession(key) {
            if (key) return JSON.parse(this.ss.getItem(key));
        }

        //移除sessionStorage
        removeSession(key) {
            this.ss.removeItem(key);
        }

        //移除所有sessionStorage
        clearSession() {
            this.ss.clear();
        }
    }
    let storage = new Storage();
    storage.setCookie('test', '111', 1);
    storage.setCookie({
        name: 'aaa',
        id: 'bbb'
    }, 1);
    console.log(storage.getCookie('test'));
    storage.removeCookies('test');
    storage.setLocal('test', '111');
    console.log(storage.getLocal('test'));
    storage.removeLocal('test');
    storage.clearLocal();
});