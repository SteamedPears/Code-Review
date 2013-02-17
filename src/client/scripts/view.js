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
    "editor"
], function($) {
    var editor = require('editor');
    
    var view = {};
    var languages = null;

/******************************************************************************
* Initialization                                                              *
******************************************************************************/
    var init = function() {
        // never run again
        init = function() {};
        
        editor.fromTextArea($('#code-view')[0]);
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
        editor.setHighlighting(code.lang);
    };

    view.displayComments = function(comments_array) {
        for(var i in comments_array) {
            view.displayComment(comments_array[i]);
        }
    };

    view.displayComment = function(comment) {
        // TODO: finish this
    };

/******************************************************************************
* Controls                                                                    *
******************************************************************************/
    view.populateLanguageList = function(langs_ob) {
        langs_array = langs_ob.data;
        var lang_list = $('#lang');
		for(var index in langs_array) {
			var language = langs_array[index];
            if(language.mode) {
			    var option = $('<option>');
			    option.data('lang',index);
			    option.val(index);
			    option.text(language.description);
			    lang_list.append(option);
            }
		}
    };

/******************************************************************************
* End                                                                         *
******************************************************************************/
    return view;
});