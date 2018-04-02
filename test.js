/**
 * Created by HH_Girl on 2018/3/29.
 */
var options={
  modules:[
      'test/testMvvm'
  ]
};
AMD.module(options.modules,function(){
    console.log('test success!');
});