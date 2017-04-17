var path = require('path');
var url = require('url');
var fs = require('fs');
var mine=require('./mine');

module.exports = function(request, response) {
	
	var pathname = url.parse(request.url).pathname;

	if (pathname === '/favicon.ico') {
		response.end('404');
	} else if (pathname === '/xhrtest') {
		response.write("success");
		setTimeout(()=>{
			response.end();
		}, 500);
	} else {
		var realPath = path.join("./", pathname);

		var pushArray = [];
		var ext = path.extname(realPath);
		ext = ext ? ext.slice(1) : 'unknown';
		var contentType = mine[ext] || "text/plain";

		if (request.httpVersion === '2.0') {
			var pushItem = response.push('/public/jquery.min.js', {
			       request: {
			            accept: '*/\*'
			       },
			      response: {
			            'content-type': 'application/javascript'
			     }
			});
			pushItem.end(fs.readFileSync('public/jquery.min.js'));
		}

		response.writeHead(200, {
			'Content-Type': contentType
		});

		response.write(fs.readFileSync(realPath));
		response.end();	
	}
}