/* Copyright by Steamed Pears, 2013. For licensing information, 
   see the LICENCE file in the root directory of this project. */
/******************************************************************************
* Developer Mode Stuff (dev_mode)                                             *
*                                                                             *
* This module handles all the extra code to run a nice development            *
* environment.                                                                *
******************************************************************************/
var connect = require('connect');
var url = require('url');
var proxy = require('proxy-middleware');

console.log('Development Mode');

module.exports = function(serverPort) {
  // Configuration
  var staticPort = 8888;
  var staticDirectory = '../client/';

  var proxyPort  = 8080;
  var proxyRoutes = {
    '/do' : 'http://localhost:' + serverPort,
    '/'   : 'http://localhost:' + staticPort
  };

  // Static server
  console.log('Starting static server serving: ' + staticDirectory);

  var staticServer = connect()
    .use(connect.logger('dev'))
    .use(connect.static(staticDirectory))
    .listen(staticPort);

  // Proxy Server
  console.log('Starting proxy server proxying:');

  var proxyServer = connect();
  for (var route in proxyRoutes) {
    console.log('\t' + route + ' -> ' + proxyRoutes[route]);
    proxyServer.use(route, proxy(url.parse(proxyRoutes[route])));
  }
  proxyServer.listen(proxyPort);
};
