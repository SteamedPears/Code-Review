/******************************************************************************
* language.js                                                                 *
* Copyright 2013                                                              *
* For details about the copyright holders, see the COPYRIGHT file.            *
* This software is freely distributed under the ISC License.                  *
* For details about the license, see the LICENSE file.                        *
*                                                                             *
* This module provides an API for interacting with the language model.        *
******************************************************************************/

define([
    "jquery"
], function($) {
    var language = {};

    language.getLanguages = function(callback) {
        $.get('/do/languages',function(data) {
            callback(data.languages);
        });
    };

    return language;
});