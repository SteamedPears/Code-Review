/* Copyright by Steamed Pears, 2013. For licensing information,
   see the LICENCE file in the root directory of this project. */
/******************************************************************************
* anticsrf.js                                                                 *
*                                                                             *
* This provides an anti-CSRF token from the server.                           *
******************************************************************************/

define([
  'jquery',
], function anticsrf($) {
  var anticsrf = {};
  var callbacks = $.Callbacks();

  // Pass functions to onReady; they will be called as soon as the token is set.
  anticsrf.onReady = callbacks.add;
  anticsrf.token = undefined;

  function ready(data) {
    anticsrf.token = data.csrf_token;
    setFilter();
    anticsrf.onReady = function (fn) { fn(); };
    callbacks.fire();
  }

  // Make all same-origin (with relative URLs) AJAX requests include the token.
  function setFilter() {
    $.ajaxPrefilter(function (options) {
      if (!options.crossDomain && options.url[0] === '/') {
        if (!options.headers) options.headers = {};
        options.headers['X-CSRF-Token'] = anticsrf.token;
      }
    });
  }

  $.ajax({
    url: '/do/anticsrf',
    dataType: 'json',
    success: ready
  });

  return anticsrf;
});

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
