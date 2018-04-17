/**
 * Created by HH_Girl on 2018/4/3.
 */
AMD.module('modules/Fx', function () {
    console.log('已加载Fx模块');
    var html = `
        <div id="taxiway" style="position: relative;width:800px;height:800px;">
        <div id="move" 
        style="
        position: absolute;
        top:10px;
        left:10px;
        width:200px;
        height:200px;
        background: #333"
        ></div>
</div>
    `;
    let div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);
    let el = document.getElementById('move'),
        parent = document.getElementById('taxiway'),
        change = parent.offsetHeight - el.offsetHeight,
        begin = parseFloat(window.getComputedStyle(el, null).top),
        end = begin + change,
        fps = 30,
        interval = 1000 / fps,
        duration = 2000,
        bounce = function (per) {
            if (per < (1 / 2.75)) {
                return (7.5625 * per * per)
            } else if (per < (2 / 2.75)) {
                return (7.5625 * (per -= (1.5 / 2.75)) * per + 0.75);
            } else if (per < (2.5 / 2.75)) {
                return (7.5625 * (per -= (2.25 / 2.75)) * per + 0.9375)
            } else {
                return (7.5625 * (per -= (2.625 / 2.75)) * per + 0.984375)
            }
        };
    console.log(change,begin,end);
    el.onclick = function () {
        let beginTime = new Date;
        let id = setInterval(function () {
            let per = (new Date - beginTime) / duration;
            if (per >= 1) {
                el.style.top = end + 'px';
                clearInterval(id);
            } else {
                el.style.top = begin + bounce(per) * change + 'px';
            }
        }, interval)
    }
});
