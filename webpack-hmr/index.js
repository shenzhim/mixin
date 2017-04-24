var a = require('./a.js');
var b = require('./b.js');
console.log('index');

if (module.hot) {
	module.hot.accept(); // 热替换代码
}