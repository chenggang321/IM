/**
 * Created by HH_Girl on 2018/3/28.
 */
//数据缓存模块
AMD.module('modules/Data', ['modules/Lang'], function (Lang) {
    console.log('已加载数据缓存模块');
    var owners = [],//原始数据
        caches = [];//缓存
    /*
     * 为目标对象指定一个缓存体
     * @param {Any} owner
     * @return {Object} 缓存体
     * @api private
     * */
    function add(owner) {
        var index = owners.push(owner);
        return caches[index - 1] = {
            data: {}
        }
    }

    /*
     * 为目标对象读写数据
     * @param {Any} owner
     * @param {Object|String} name ? 要处理的数据或数据包
     * @param {Any} data ? 要写入的数据
     * @param {Boolean} pvt ? 标识为内部数据
     * @return {Any}
     * @api private
     * */
    function innerData(owner, name, data, pvt) {
        var index = owners.indexOf(owner);
        var table = index === -1 ? add(owner) : caches[index];
        //取得单个属性
        var getOne = typeof name === 'string';
        var cache = table;
        //私有数据都是直接放到table中，普通数据放到table.data中
        if (!pvt) {
            table = table.data;
        }
        if (name && typeof name === 'object') {
            IM.mix(table, name);//写入一组属性
        } else if (getOne && data !== void 0) {
            table[name] = data;//写入单个属性
        }
        if (getOne) {
            if (name in table) {
                return table[name];
            } else if (!pvt && owner && owner.nodeType === 1) {
                //可访问HTML data-*属性保存的数据，如<input id="test" data-full-name="Planet Earth"/>
                Data.parseData(owner, name, cache);
            } else {
                return table;
            }
        }
    }

    /*
     * 为目标对象移除数据
     * @param {Any} owner
     * @param {Any} name ? 要移除的数据
     * @param {Boolean} pvt ? 标识为内部数据
     * @return {Any}
     * @api private
     * */
    function innerRemoveData(owner, name, pvt) {
        var index = owners.indexOf(owner);
        if (index > -1) {
            var delOne = typeof name === 'string',
                table = caches[index],
                cache = table;
            if (delOne) {
                if (!pvt) {
                    table = table.data;
                }
                if (table) {
                    delOne = table[name];
                    delete table[name];
                }
                if (JSON.stringify(cache) === '{"data":{}') {
                    owners.splice(index, 1);
                    caches.splice(index, 1);
                }
            }
            //返回被删除的数据
            return delOne;
        }
    }

    var rparse = /^(?:null|false|true|NaN|\{.*\}|\[.*\])$/;
    var Data = {
        //判定是否关联了数据
        hasData: function (owner) {
            return owners.indexOf(owner) > -1;
        },
        //读写用户数据
        data: function (target, name, data) {
            return innerData(target, name, data)
        },
        //读写内部数据
        _data: function (target, name, data) {
            console.log('success');
            return innerData(target, name, data, true);
        },
        //删除用户数据
        removeData: function (target, name) {
            return innerRemoveData(target, name);
        },
        //移除内部数据
        _removeData: function (target, name) {
            return innerRemoveData(target, name, true);
        },
        //将HTML5 data-*的属性转换为更丰富更有用的数据类型，并保存起来
        parseData: function (target, name, cache, value) {
            var data, _eval, key = Lang.String.camelize(name);
            if (cache && (key in cache)) {
                return cache[key];
            }
            if (arguments.length !== 4) {
                var attr = 'data-' + name.replace(/([A-Z])/g, '-$1').toLowerCase();
                value = target.getAttribute(attr);
            }
            if (typeof value === 'string') {
                //转换 /^(?:\{.*\}|null|false|true|NaN)$/
                if (rparse.test(value) || +value + '' === value) {
                    _eval = true;
                }
                try {
                    data = _eval ? eval('0,' + value) : value;
                } catch (e) {
                    data = value;
                }
                if (cache) {
                    cache[key] = data;
                }
            }
            return data;
        },
        //合并数据
        mergeData: function (cur, src) {
            console.log(src);
            if (this.hasData(cur)) {
                console.log(this);
                var oldData = this._data(src),
                    curData = this._data(cur);
                events = oldData.events;
                Lang.Object.merge(curData, oldData);
                if (events) {
                    curData.events = [];
                    for (var i = 0, item; item = events[i++];) {
                        console.log(cur, item);
                    }
                }
            }
        }
    };
    return Data;
});