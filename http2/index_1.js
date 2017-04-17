var http = require('http');
var handler = require('./handler');

http.createServer(handler).listen('8081', function(){
  console.log('http1.1 listen on 8081');
});