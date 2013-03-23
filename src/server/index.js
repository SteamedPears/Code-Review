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

// development mode options
var staticPort = 8888;
var proxyPort  = 8080;
var staticDirectory = '../client/';

// check NODE_ENV environment variable
var startDevProxy = (process.env.NODE_ENV === 'development');

/******************************************************************************
 * Load Modules                                                                *
 ******************************************************************************/
var server = require("./server");
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
handle["not_found"] = requestHandlers.not_found;

/******************************************************************************
 * Start the server                                                            *
 ******************************************************************************/
try{

  //////////////////////////////////////////////////////////////////////
  // Development Static Server and Proxy
  if (startDevProxy) {
    console.log('Developement Mode');

    require('./static-server').start(staticPort,staticDirectory);

    require("./proxy").start(proxyPort,{
      router: { 
        'localhost/do/' : 'localhost:' + serverPort,
        'localhost/'    : 'localhost:' + staticPort
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

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
