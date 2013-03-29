/******************************************************************************
* comment.js                                                                  *
* Copyright 2013                                                              *
* For details about the copyright holders, see the COPYRIGHT file.            *
* This software is freely distributed under the ISC License.                  *
* For details about the license, see the LICENSE file.                        *
*                                                                             *
* This module provides an API for interacting with the comment model.         *
******************************************************************************/

define([
  "jquery"
], function($) {
  var comment = {};

  comment.getCommentCounts = function(code_id, callback, error_fn) {
    comments = {};
    $.ajax('/do/commentCount', {
      data:     {code_id: code_id},
      dataType: 'json',
      error:    error_fn,
      success:  callback
    });
  };

  comment.getCommentsOnLine = function(code_id, line, callback, error_fn) {
    $.ajax('/do/commentsOnLine', {
      data:     {code_id: code_id, line: line},
      dataType: 'json',
      error:    error_fn,
      success:  callback
    });
  };
  
  return comment;
});

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
