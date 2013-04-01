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
        $.ajax('/do/login', {
          method: 'POST',
          data: {assertion: assertion},
          error: login_error,
          success: login_success
        });
      },
      onlogout: function () {
	console.log('Logged out.');
	// This should tell the server...
        $.ajax('/do/logout', {
          method: 'POST',
          error: logout_error,
          success: logout_success
        });
      }
    });
  }
  function login_error() {
    console.error("Error while logging in");
  }
  function logout_error() {
    console.error("Error while logging out");
  }
  function login_success() {
    console.log("Successfully logged in");
  }
  function logout_success() {
    console.log("Successfully logged out");
  }
});

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
