/******************************************************************************
* Import parts                                                                *
******************************************************************************/
var server = require("./server");
var proxyServer = require("./proxy");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var serverPort = 20193;
var proxyPort = 3000;

var NODE_ENV = process.env.NODE_ENV;

/******************************************************************************
* Connect the request handlers, aka. Routes                                   *
******************************************************************************/
var handle = {};
handle["/"] = requestHandlers.start;
handle["/code"] = requestHandlers.code;
handle["/comment"] = requestHandlers.comment;
handle["/newcode"] = requestHandlers.newcode;
handle["/newcomment"] = requestHandlers.newcomment;
handle["/comments"] = requestHandlers.comments;
handle["/language"] = requestHandlers.language;
handle["/languages"] = requestHandlers.languages;
handle["not_found"] = requestHandlers.not_found;

/******************************************************************************
* Start the server                                                            *
******************************************************************************/
try{

		//Running modes
    if (NODE_ENV === 'development') {
			console.log('Developement Mode');
			console.log('Serving app on port' + proxyPort);

			var static = require('node-static');

			var file = new(static.Server)('./public');

			require('http').createServer(function (request, response) {
				request.addListener('end', function () {
					console.log('Serving file');

					file.serve(request, response);
				});
			}).listen(8080);

			proxyServer.start(proxyPort
					, { router: { 
							'localhost/do/' : 'localhost:20193',
							'localhost/' : 'localhost:8080',
							}
					});
		}
		else if (NODE_ENV === 'production') {
    	console.log('Production Mode');
			//Do production stuff

		}
    
    
    server.start(serverPort, router.route, handle);

} catch(e) {
    console.log("===ERROR===");
    console.log(e);
}
