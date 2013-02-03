exports.start = function(port,folder,next) {
    console.log('Serving app on port' + proxyPort);

    var static = require('node-static');

    var file = new (static.Server)(folder);

    require('http').createServer(function (request, response) {
	    request.addListener('end', function () {
		    console.log('Serving file');
            
		    file.serve(request, response);
	    });
    }).listen(port);
    
    //Callback
	next && next();
};