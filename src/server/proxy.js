/******************************************************************************
 * Requirements                                                                *
 ******************************************************************************/
var proxyServer = require('http-proxy');

/******************************************************************************
 * proxy function                                                             *
 ******************************************************************************/
function start(port,options,next) {

	proxyServer.createServer(options).listen(port, function() {

		var routeStr = "";
		for (route in options.router) {
			routeStr += '\t' + route + ' -> ' + options.router[route] + '\n';
		}

		console.log('Proxy server started and routing:\n', routeStr);
	});
    
    //Callback
	next && next();
	
}

/******************************************************************************
 * Exports                                                                     *
 ******************************************************************************/
exports.start = start;
