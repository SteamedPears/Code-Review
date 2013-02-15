/******************************************************************************
* view.js                                                                     *
* Copyright 2013                                                              *
* For details about the copyright holders, see the COPYRIGHT file.            *
* This software is freely distributed under the ISC License.                  *
* For details about the license, see the LICENSE file.                        *
*                                                                             *
* This module provides an API for interacting with the user interface.        *
******************************************************************************/

define([
    "jquery"
], function($) {
    var view = {};

    var mode = null;

    view.displayError = function(err_html) {
        $('#error').html(err_html);
    };

    view.initNewCodeMode = function() {
        //
    };

    view.initNewCommentMode = function() {
        //
    };

    return view;
});