var url = require("url");

/******************************************************************************
* Routing function                                                            *
******************************************************************************/
function route(handle,request,response) {
  var path = url.parse(request.url).pathname;
  
  if(typeof handle[path] === 'function') {
    handle[path](request,response);
  } else if(typeof handle['not_found'] === 'function') {
    handle['not_found'](request,response);
  } else {
    // default error message
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 not found \n");
    response.write("additionally, the error page could not be found");
    response.end();
  }
}

/******************************************************************************
* Exports                                                                     *
******************************************************************************/
exports.route = route;

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
