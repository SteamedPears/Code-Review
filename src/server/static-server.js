exports.start = function(port,folder,next) {
  console.log('Serving app on port ' + port);

  var static = require('node-static');

  var file = new (static.Server)(folder, { cache : 0 });

  require('http').createServer(function (request, response) {
    request.addListener('end', function () {
      console.log('Serving file');

      file.serve(request, response);
    });
  }).listen(port);
  
  //Callback
  next && next();
};

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
