/******************************************************************************
* Requirements                                                                *
******************************************************************************/
var http = require('http');

/******************************************************************************
* Server function                                                             *
******************************************************************************/
function start(port,route,handle) {
    
  function onRequest(request, response) {
    route(handle,request,response);
  }
  
  var server = http.createServer(onRequest);

  server.addListener('connection',function(socket) {
    console.log('===CONNECTION===');
    //console.log(socket);
  });

  server.addListener('close',function() {
    console.log('===CLOSE===');
  });

  server.addListener('checkContinue',function(request,response) {
    console.log('===CHECKCONTINUE===');
    response.end();
  });

  server.addListener('connect',function(request,socket,head) {
    console.log('===CONNECT===');
  });

  server.addListener('upgrade',function(request,socket,head) {
    console.log('===UPGRADE===');
  });

  server.addListener('clientError',function(e) {
    console.log('===ERROR===');
    console.log(e);
  });

  server.listen(port, function() {
    console.log('Server started on port ' + port);
  });
}

/******************************************************************************
* Exports                                                                     *
******************************************************************************/
exports.start = start;

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
