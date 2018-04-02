/**
 * Created by HH_Girl on 2018/3/29.
 */
AMD.module('test/testMvvm',['modules/Mvvm'], function (Mvvm) {
    console.log('已加载testVue');
    let html = `<input type="text" v-model="msg"><span>{{msg}}</span><p>{{test2}}</p>`;
    let div=document.createElement('div');
    div.id='app';
    div.innerHTML=html;
    document.body.appendChild(div);
    new Mvvm({
        el:'#app',
        data:{
            'msg':'hello world',
            'test2':'this is test2'
        }
    });
});