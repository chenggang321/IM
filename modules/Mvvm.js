/**
 * Created by HH_Girl on 2018/3/30.
 */
AMD.module('modules/Mvvm', function () {
    console.log('已加载Mvvm');
    function Mvvm(opt) {
        this.el = opt.el;
        this.data = opt.data;
        let el = document.querySelector(this.el);
        //监视数据和对象
        observer(this.data, this);
        //劫持el传入数据
        let dom = nodeToFragment(el, this);
        //重新加载入dom
        el.appendChild(dom);
    }

    function observer(data, Mv) {
        Object.keys(data).forEach(function (key) {
            defineReactive(Mv, key, data[key]);
        })
    }

    function defineReactive(Mv, key, val) {
        let dep = new Dep();
        Object.defineProperty(Mv, key, {
            get: function () {
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return val;
            },
            set: function (newVal) {
                if (newVal === val) return;
                val = newVal;
                dep.notify();
            }
        });
    }

    function Dep() {
        this.subs = [];
        this.addSub = function (sub) {
            this.subs.push(sub);
        };
        this.notify = function () {
            this.subs.forEach(function (sub) {
                sub.update();
            })
        }
    }

    function nodeToFragment(el, Mv) {
        //创建空白文档
        let frag = document.createDocumentFragment(), child;
        //将el传入frag
        while (child = el.firstChild) {
            //对劫持的dom进行修改
            compile(child, Mv);
            frag.appendChild(child);
        }
        return frag;
    }

    function watch(Mv, el, name, nodeType) {
        Dep.target = this;
        this.name = name;
        this.node = el;
        this.Mv = Mv;
        this.nodeType = nodeType;
        this.update = function () {
            this.get();
            if (this.nodeType === 'text') {
                this.node.nodeValue = this.value;
            }
            if (this.nodeType === 'input') {
                this.node.value = this.value;
            }
        };
        this.get = function () {
            this.value = this.Mv[this.name];
        };
        this.update();
        Dep.target = null;
    }

    //对传入的dom进行解析返回解析后的dom
    /*
     * 如果节点是元素节点，则 nodeType 属性将返回 1。
     * 如果节点是属性节点，则 nodeType 属性将返回 2。
     * 如果节点是文本节点，则 nodeType 属性将返回 3。
     * */
    function compile(child, Mv) {
        //如果是元素节点
        if (child.nodeType === 1) {
            let childNodes = child.childNodes || [];
            childNodes.forEach(function (node) {
                if (node) {
                    compile(node, Mv);
                }
            });
            //获取该节点的所有属性
            let attrs = child.attributes;
            //遍历所有属性
            [].forEach.call(attrs, function (item) {
                if (item.nodeName === 'v-model') {
                    //获取v-model中存储的值
                    var name = item.nodeValue;
                    child.addEventListener('input', function (e) {
                        Mv[name] = e.target.value;
                    });
                    child.value = Mv[name];
                    //移除v-model属性
                    child.removeAttribute('v-model');
                    new watch(Mv, child, name, 'input')
                }
            });
        }
        //如果是文本节点
        if (child.nodeType === 3) {
            if (/\{\{(.*)\}\}/.test(child.nodeValue)) {
                let name = RegExp.$1;
                name = name.trim();
                new watch(Mv, child, name, 'text');
            }
        }
    }

    return Mvvm;
});
