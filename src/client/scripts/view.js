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
/******************************************************************************
* Configuration                                                               *
******************************************************************************/
    var editor = null;
    var codeOptions = {
		lineNumbers: true,
		lineWrapping: true,
		fixedGutter: true,
		readOnly: false
	};
    
    view.setHighlighting = function(lang) {
        // TODO: finish this
    };

/******************************************************************************
* Initialization                                                              *
******************************************************************************/
    var init = function() {
        // never run again
        init = function() {};
        
        editor = CodeMirror.fromTextArea($('#code-view')[0],codeOptions);
        editor.refresh();
    };

    view.initCodeMode = function() {
        // never run again
        view.initCodeMode = codeMode;
        
        init();
        var select = $('#language_id');
        select.change(function(eventOb) {
            view.setHighlighting(select
								 .children('[value='+selected_lang_id+']')
								 .data('lang'));
        });
        codeMode();
    };

    view.initCommentMode = function() {
        // never run again
        view.initCommentMode = commentMode;
        
        init();
        commentMode();
    };

/******************************************************************************
* View Modes                                                                  *
******************************************************************************/
    var codeMode = function() {
        $('#code_instructions').show();
        $('#comment_instructions').hide();
        $('#code_controls').show();
        $('#comment_controls').hide();
    };

    var commentMode = function() {
        editor.setOption('readOnly',true);
        $('#code_instructions').hide();
        $('#comment_instructions').show();
        $('#code_controls').hide();
        $('#comment_controls').show();
    };

/******************************************************************************
* Display                                                                     *
******************************************************************************/
    view.displayError = function(err_html) {
        $('#error').html(err_html);
    };

    view.displayCode = function(code) {
        editor.setValue(code.text);
        editor.refresh();
    };

    view.displayComments = function(comments_array) {
        // TODO: finish this
    };

/******************************************************************************
* Controls                                                                    *
******************************************************************************/
    view.populateLanguageList = function(langs_array) {
        var lang_list = $('#language_id');
		for(var index in langs_array) {
			var language = langs_array[index];
			var option = $('<option>');
			option.data('lang',language.mode);
			option.val(language.id);
			option.text(language.description);
			lang_list.append(option);
		}
    };

/******************************************************************************
* End                                                                         *
******************************************************************************/
    return view;
});