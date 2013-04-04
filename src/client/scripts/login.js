/* Copyright by Steamed Pears, 2013. For licensing information, 
   see the LICENCE file in the root directory of this project. */
/******************************************************************************
* login.js                                                                    *
*                                                                             *
* This sets up the client side of persona login.                              *
******************************************************************************/

define([
  'jquery',
  'https://login.persona.org/include.js'
], function login_main($) {
  var label_span = null;
  var user_display = null;
  var button = null;
  
  $(document).ready(function() {
    user_display = $('#comment-user, #user-email');
    button = $('#persona-button-text');
    label_span = $('#user-label');
    $('#persona-login').click(function login_persona_click() {
      navigator.id.request();
      return false;
    });
    $('#persona-logout').click(function login_persona_click() {
      navigator.id.logout();
    });
  });
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
  function login_error() {
    console.error("Error while logging in");
  }
  function logout_error() {
    console.error("Error while logging out");
  }
  function login_success(data) {
    if(label_span !== null) {
      label_span.show();
    }
    if(user_display !== null) {
      user_display.text(data.email);
    }
    if(button !== null) {
      button.text('Sign Out');
    }
  }
  function logout_success(data) {
    if(label_span !== null) {
      label_span.hide();
    }
    if(user_display !== null) {
      user_display.text('Anonymous');
    }
    if(button !== null) {
      button.text('Sign In');
    }
  }
});

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
