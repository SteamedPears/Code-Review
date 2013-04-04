/* Copyright by Steamed Pears, 2013. For licensing information, 
   see the LICENCE file in the root directory of this project. */
/******************************************************************************
* tutorial.js                                                                 *
*                                                                             *
* This module provides an API for interacting with the tutorial model.        *
******************************************************************************/

define([
  'jquery',
  'intro'
], function($,intro) {
  var tutorial = {};

  // save some DOM elements
  var tutorialBtn, codeArea, commentInputArea, commentDisplayArea;

  // initialization
  $(document).ready(function() {
    tutorialBtn = $('#tutorial-btn');
    codeArea = $('#code');
    commentInputArea = $('#comment-new');
    commentDisplayArea = $('#comment-old');
    
    tutorialBtn.click(function() {
      intro().start();
    });
  });

  function removeCodeAttributes() {
    codeArea.removeAttr('data-intro');
    codeArea.removeAttr('data-step');
  }

  function removeCommentAttributes() {
    commentInputArea.removeAttr('data-step');
    commentInputArea.removeAttr('data-intro');
    commentDisplayArea.removeAttr('data-step');
    commentDisplayArea.removeAttr('data-intro');
  }

  tutorial.codeMode = function tutorialCodeMode() {
    $(document).ready(function() {
      // set up the code mode of the tutorial
      removeCodeAttributes();

      codeArea.attr('data-step','1');
      codeArea.attr('data-intro',
                    'Enter the text you would like to be reviewed');
    });
  }

  tutorial.commentMode = function tutorialCommentMode() {
    $(document).ready(function() {
      // set up the comment mode of the tutorial
      removeCodeAttributes();
      
      codeArea.attr('data-step','1');
      codeArea.attr('data-intro','Select the text you would like to review');
    });
  }

  tutorial.commentInputMode = function tutorialCommentInputMode() {
    $(document).ready(function() {
      removeCommentAttributes();
      
      commentInputArea.attr('data-step','2');
      commentInputArea.attr('data-intro','Review the text you have selected');
    });
  };

  tutorial.commentDisplayMode = function tutorialCommentDisplayMode() {
    $(document).ready(function() {
      removeCommentAttributes();
    });
  };
  
  return tutorial;
});

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
