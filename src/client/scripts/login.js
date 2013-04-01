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
  var user_display = null;
  $(document).ready(function() {
    user_display = $('#comment-user');
  });

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
        $.ajax('/do/login', {
          method: 'POST',
          data: {assertion: assertion},
          error: login_error,
          success: login_success
        });
      },
      onlogout: function () {
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
  function login_success(data) {
    if(user_display !== null) {
      user_display.text(data.email);
    }
  }
  function logout_success(data) {
    if(user_display !== null) {
      user_display.text('Anonymous');
    }
  }
});

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
