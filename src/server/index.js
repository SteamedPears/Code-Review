/* Copyright by Steamed Pears, 2013. For licensing information, 
   see the LICENCE file in the root directory of this project. */
/******************************************************************************
* Server entry point (index)                                                  *
*                                                                             *
* This is the node script that pulls together the various modules and         *
* starts the Code Review server.                                              *
******************************************************************************/

var connect = require('connect');
var cors = require('cors');

/******************************************************************************
* Configuration                                                               *
******************************************************************************/
var host = 'review.steamedpears.com';
var clientPort = 80;
var serverPort = 20193;
var requestTimeout = 3000; // ms

// check if this app is being run in development or production environment
var devMode = (process.env.NODE_ENV === 'development');

if (devMode) {
  host = 'localhost';
  clientPort = 8080;
  require('./dev_mode')(host,serverPort,clientPort);
}

/******************************************************************************
* Load Modules                                                                *
******************************************************************************/
var requestHandlers = require('./requestHandlers')(host,clientPort);

/******************************************************************************
* Connect the request handlers, aka. Routes                                   *
******************************************************************************/
var getRoutes = {
  '/codeByID':       requestHandlers.codeByID,
  '/commentsOnLine': requestHandlers.commentsOnLine,
  '/commentCount':  requestHandlers.commentCount
};
var postRoutes = {
  '/newcode':    requestHandlers.newcode,
  '/newcomment': requestHandlers.newcomment,
  '/login':      requestHandlers.login,
  '/logout':     requestHandlers.logout
};
var corsRoutes = [
  '/newcode'
];

/******************************************************************************
* Start the server                                                            *
******************************************************************************/
var app = connect()
  .use(connect.logger(devMode ? 'dev' : 'short'))
  .use(connect.timeout(requestTimeout))
  .use(connect.cookieParser())
  .use(connect.session({secret: 'keyboard kitties'}));

for (var route in corsRoutes) {
  app.use(route, cors());
}

for (var route in getRoutes) {
  app.use(route, {handle:getRoutes[route]});
}

app.use(connect.bodyParser());

for (var route in postRoutes) {
  app.use(route, {handle:postRoutes[route]});
}

app.listen(serverPort);

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
