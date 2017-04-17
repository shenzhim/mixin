var http2 = require('http2');
var fs = require('fs');
var handler = require('./handler');

var server = http2.createServer({
  key: fs.readFileSync('./file/server.pass.key'),
  cert: fs.readFileSync('./file/server.crt'),
  passphrase: '1234'
}, handler);

server.listen(8080, function() {
  console.log('http2 listen on 8080');
});