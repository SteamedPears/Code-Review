/******************************************************************************
* code.js                                                                     *
* Copyright 2013                                                              *
* For details about the copyright holders, see the COPYRIGHT file.            *
* This software is freely distributed under the ISC License.                  *
* For details about the license, see the LICENSE file.                        *
*                                                                             *
* This module provides an API for interacting with the code model.            *
******************************************************************************/

define([
  "jquery"
], function($) {
  var code = {};

  code.getCode = function(id,callback,error_fn) {
    $.ajax('/do/codeByID',{
      data:   {id:id},
      dataType: 'json',
      error:  error_fn,
      success:  callback
    });
  };

  return code;
});

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
