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
    "jquery",
    "CodeMirror"
], function($,CodeMirror) {
    var view = {};

    var cm_inst = null;

    var codeOptions = {
		lineNumbers: true,
		lineWrapping: true,
		fixedGutter: true,
		readOnly: false,
		//mode: language.mode,
		//onCursorActivity: handleSelection
	},
	diffOptions = {
		lineNumbers: true,
		lineWrapping: true,
		fixedGutter: true,
		readOnly: false,
		smartIndent:false,
		//mode: language.mode
	},
	commentOptions = {
		lineNumbers: true,
		lineWrapping: true,
		fixedGutter: true,
		readOnly: true,
		//mode: language.mode
	};

    view.displayError = function(err_html) {
        $('#error').html(err_html);
    };

    var init = function() {
        cm_inst = CodeMirror.fromTextArea($('#code-view')[0],codeOptions);

        // never run again
        init = function() {};
    };

    view.initCodeMode = function() {
        init();
        // TODO: finish this
    };

    view.initCommentMode = function() {
        init();
        // TODO: finish this
        cm_inst.setOption('readOnly',true);
    };

    view.displayCode = function(code) {
        // TODO: finish this
    };

    view.displayComments = function(comments_array) {
        // TODO: finish this
    };

    return view;
});