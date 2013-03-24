/* Copyright by Steamed Pears, 2013. For licensing information, 
   see the LICENCE file in the root directory of this project. */
/******************************************************************************
* Server entry point (index)                                                  *
*                                                                             *
* This is the node script that pulls together the various modules and         *
* starts the Code Review server.                                              *
******************************************************************************/

var connect = require('connect');

/******************************************************************************
* Configuration                                                               *
******************************************************************************/
var serverPort = 20193;
var requestTimeout = 3000; // ms

// check if this app is being run in development or production environment
var devMode = (process.env.NODE_ENV === 'development');

if(devMode) {
  require('./dev_mode')(serverPort);
}

/******************************************************************************
* Load Modules                                                                *
******************************************************************************/
var requestHandlers = require('./requestHandlers');

/******************************************************************************
* Connect the request handlers, aka. Routes                                   *
******************************************************************************/
var getRoutes = {
  '/code':       requestHandlers.code,
  '/comment':    requestHandlers.comment,
  '/comments':   requestHandlers.comments
};
var postRoutes = {
  '/newcode':    requestHandlers.newcode,
  '/newcomment': requestHandlers.newcomment,
};

/******************************************************************************
* Start the server                                                            *
******************************************************************************/
var app = connect()
  .use(connect.logger(devMode?'dev':'short'))
  .use(connect.timeout(requestTimeout))
  .use(function(request,response,next) {
    // Preflight OPTIONS requests -- CORS
    if (request.method && request.method.toUpperCase() === 'OPTIONS') {
      response.writeHead(
        '204',
        'No Content',
        {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'content-type, accept',
          'Access-Control-Max-Age': 10, // Seconds.
          'Content-Length': 0
        });
      return response.end();
    }
    next();
  });

for(var route in getRoutes) {
  app.use(route,{handle:getRoutes[route]});
}

app.use(connect.bodyParser());

for(var route in postRoutes) {
  app.use(route,{handle:postRoutes[route]});
}


app.listen(serverPort);

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
