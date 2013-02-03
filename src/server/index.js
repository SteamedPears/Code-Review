/******************************************************************************
 * Server entry point (index)                                                  *
 *                                                                             *
 * Project: Code Review                                                        *
 * By:      Steamed Pears                                                      *
 *                                                                             *
 * This is the node script that pulls together the various modules and         *
 * starts the Code Review server.                                              *
 ******************************************************************************/

/******************************************************************************
 * Configuration
 ******************************************************************************/
var serverPort = 20193;
var proxyPort = 3000;

/******************************************************************************
 * Load Modules                                                                *
 ******************************************************************************/
var server = require("./server");
var proxyServer = require("./proxy");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

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

    //////////////////////////////////////////////////////////////////////
    // Development Static Server and Proxy
    if (process.env.NODE_ENV === 'development') {
		console.log('Developement Mode');
		console.log('Serving app on port' + proxyPort);
        
		var static = require('node-static');
        
		var file = new (static.Server)('./public');
        
		require('http').createServer(function (request, response) {
			request.addListener('end', function () {
				console.log('Serving file');
                
				file.serve(request, response);
			});
		}).listen(proxyPort);
        
		proxyServer.start(proxyPort,{
            router: { 
				'localhost/do/' : 'localhost:' + serverPort,
				'localhost/' : 'localhost:' + proxyPort
			}
		});
	}

    //////////////////////////////////////////////////////////////////////
    // Server
    server.start(serverPort, router.route, handle);

} catch(e) {
    console.log("===ERROR===");
    console.log(e);
}
