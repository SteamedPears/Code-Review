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
  "editor",
  "diff",
  "tutorial"
], function($) {
  var editor = require('editor');
  var diff = require('diff');
  var tutorial = require('tutorial');
  
  var view = {};
  var languages = null;

  var noSelect = false;

  var noop = function() {};

/******************************************************************************
* Initialization                                                              *
******************************************************************************/
  view.init = function() {
    // never run again
    view.init = noop;
    
    editor.codeFromTextArea($('#code-view')[0]);
    editor.diffFromTextArea($('#diffs')[0]);
  };

  view.initCodeMode = function() {
    // never run again
    view.initCodeMode = codeMode;
    
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

    tutorial.codeMode();
    
    editor.onCursorActivity(noop);
  };

  var commentMode = function(id) {
    editor.setOption('readOnly',true);
    $('#code_instructions').hide();
    $('#comment_instructions').show();
    $('#code_controls').hide();
    $('#comment_controls').show();

    tutorial.commentMode();

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
          tutorial.commentInputMode();
        } else {
          view.hideCommentEditor();
          view.showComments();
          tutorial.commentDisplayMode();
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
    $("#comment-info").text('');
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
      view.showComments();
      view.displayComments(callback(line));
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

  var computeDiff = function(originalText,newText) {
    var rawDiffs = diff.diff_main(originalText,newText);
    diff.diff_cleanupSemantic(rawDiffs);
    return rawDiffs;
  }

  var computeDiffText = function(rawDiffs) {
    var str = "";
    for(var index = 0; index<rawDiffs.length; index++){
      var diff = rawDiffs[index];
      str+=diff[1];
    }
    return str;
  };

  view.addComment = function(comment) {
    var commentDiv = $("<div class='comment-box'>");
    var title = $("<div class='comment-title'>");
    title.text(comment.user);
    var body = $("<div class='comment-body'>");
    body.text(comment.text);
    commentDiv.append(title).append(body);
    $('#comment-old').append(commentDiv);
    if(comment.diffs) {
      var originalText = editor.getText(comment.line_start,
                        comment.line_end);
      var newText = comment.diffs.replace(/\r/gm,'');
      if(originalText !== newText) {
        var rawDiffs = computeDiff(originalText,newText);
        var diff_text = computeDiffText(rawDiffs)
        var area = editor.appendTo(commentDiv[0],comment.line_start+1);
        area.setValue(diff_text);
        editor.styleDiffArea(area,rawDiffs);
      }
    }
    commentDiv.mouseover(function() {
      noSelect = true;
      editor.setSelected(comment.line_start,comment.line_end+1);
      noSelect = false;
    });
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

  return view;
});

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
