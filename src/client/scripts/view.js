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
    "jquery.form",
    "editor"
], function($) {
    var editor = require('editor');
    
    var view = {};
    var languages = null;

    var noSelect = false;

    var noop = function() {};

/******************************************************************************
* Initialization                                                              *
******************************************************************************/
    var init = function() {
        // never run again
        init = noop;
        
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

    view.initCommentMode = function(id) {
        // never run again
        view.initCommentMode = commentMode;
        
        init();
        editor.diffFromTextArea($('#diffs')[0]);
        $('#comment-form').ajaxForm(function(ob) {
            view.hideCommentEditor();
            $('#comment-form').resetForm();
            // TODO: reload comments
        });
        commentMode(id);
    };

/******************************************************************************
* View Modes                                                                  *
******************************************************************************/
    var codeMode = function() {
        $('#code_instructions').show();
        $('#comment_instructions').hide();
        $('#code_controls').show();
        $('#comment_controls').hide();

        editor.onCursorActivity(noop);
    };

    var commentMode = function(id) {
        editor.setOption('readOnly',true);
        $('#code_instructions').hide();
        $('#comment_instructions').show();
        $('#code_controls').hide();
        $('#comment_controls').show();

        editor.onCursorActivity(function() {
            if(!noSelect) {
                if(editor.somethingSelected()) {
                    var line_start = editor.getCursor(true).line;
                    var line_end = editor.getCursor(false).line;
		            if(editor.getCursor(false).ch === 0){
			            --line_end;
		            }
                    view.hideComments();
                    view.showCommentEditor(line_start,line_end);
                } else {
                    view.hideCommentEditor();
                    view.showComments();
                }
            }
        });
        $('#code-id').val(id);
    };

/******************************************************************************
* Display                                                                     *
******************************************************************************/
    view.hideComments = function() {
        $('#comment-old').hide();
    };

    view.showComments = function() {
        $('#comment-old').show();
    };

    view.hideCommentEditor = function() {
        $('#comment-new').hide();
    };

    view.showCommentEditor = function(start,end) {
        $('#comment-new').show();
		$('input#line-start').val(start);
		$('input#line-end').val(end);
		$('#line-start-num').text(start+1);
		$('#line-end-num').text(end+1);
        editor.setDiffSelected(start,end);
        var pos = editor.getLinePosition(start);
        $('#comment-new').css('top',pos);
		$('#comment-new').slideDown();
    };

    view.displayError = function(err_html) {
        $('#error').html(err_html);
    };

    view.displayCode = function(code) {
        editor.setValue(code.text);
        editor.setHighlighting(code.lang);
    };

    view.addCommentButtons = function(comment_counts,callback) {
        for(var i in comment_counts) {
            view.addCommentButton(i,comment_counts[i],callback);
        }
    };

    view.addCommentButton = function(line,count,callback) {
		var commentInfo = $("#comment-info");
		var commentInfoBtn =  $('<button type="button" class="commentButton">');
		commentInfoBtn.text(count+" comments");
        var pos = editor.getLinePosition(line);
        commentInfoBtn.css('top',pos);
        commentInfoBtn.click(function() {
            view.hideCommentEditor();
            view.displayComments(callback(line));
            view.showComments();
        });
        commentInfo.append(commentInfoBtn);
    };

    view.displayComments = function(comments) {
        view.clearComments();
        var pos = editor.getLinePosition(comments[0].line_start);
        $('#comment-old').css('top',pos);
        for(var i in comments) {
            view.addComment(comments[i]);
        }
    };

    view.clearComments = function() {
        $('#comment-old').html('');
    };

    view.addComment = function(comment) {
        // TODO: finish this
		var commentDiv = $("<div class='comment-box'>");
		var title = $("<div class='comment-title'>");
		title.text(comment.user);
		var body = $("<div class='comment-body'>");
		body.text(comment.text);
		commentDiv.mouseover(function() {
            noSelect = true;
            editor.setSelected(comment.line_start,comment.line_end+1);
            noSelect = false;
        });
        commentDiv.append(title).append(body);
        $('#comment-old').append(commentDiv);
    };

/******************************************************************************
* Controls                                                                    *
******************************************************************************/
    view.populateLanguageList = function(langs_ob) {
        view.populateLanguageList = noop;
        
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

        lang_list.change(function(eo) {
            editor.setHighlighting(lang_list.val());
        });
    };

/******************************************************************************
* End                                                                         *
******************************************************************************/
    return view;
});