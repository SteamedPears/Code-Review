/* Copyright by Steamed Pears, 2013. For licensing information, 
   see the LICENCE file in the root directory of this project. */
/******************************************************************************
* login.js                                                                    *
*                                                                             *
* This sets up the client side of persona login.                              *
******************************************************************************/

define([
  'jquery'
], function login_main($) {
  $.getScript('https://login.persona.org/include.js', ready);
  $('#persona-login').click(function login_persona_click() {
    navigator.id.request();
    return false;
  });
  $('#persona-logout').click(function login_persona_click() {
    navigator.id.logout();
  });
  function ready() {
    navigator.id.watch({
      loggedInUser: null,
      onlogin: function (assertion) {
	console.log('Logged in: ' + assertion);
	// This should pass the assertion on to the server.
      },
      onlogout: function () {
	console.log('Logged out.');
	// This should tell the server...
      }
    });
  }
});

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
