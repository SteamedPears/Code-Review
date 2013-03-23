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
* Configuration
******************************************************************************/
var serverPort = 20193;

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
var routes = {
  '/':           requestHandlers.start,
  '/code':       requestHandlers.code,
  '/comment':    requestHandlers.comment,
  '/newcode':    requestHandlers.newcode,
  '/newcomment': requestHandlers.newcomment,
  '/comments':   requestHandlers.comments
};

/******************************************************************************
* Start the server                                                            *
******************************************************************************/
var app = connect()
  .use(connect.logger(devMode?'dev':'short'));

for(var route in routes) {
  app.use(route,{handle:routes[route]});
}

app.listen(serverPort);

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
