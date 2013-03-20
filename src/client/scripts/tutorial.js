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
  var tutorialBtn, codeArea, commentArea;

  // initialization
  $(document).ready(function() {
    tutorialBtn = $('#tutorial-btn');
    codeArea = $('#code');
    commentArea = $('#comment-new');
  });

  function removeAllAttributes() {
    codeArea.removeAttr('data-intro');
    commentArea.removeAttr('data-intro');
    codeArea.removeAttr('data-step');
    commentArea.removeAttr('data-step');
  }

  tutorial.codeMode = function tutorialCodeMode() {
    $(document).ready(function() {
      // set up the code mode of the tutorial
      tutorialBtn.click(function() {
        removeAllAttributes();

        codeArea.attr('data-step','1');
        codeArea.attr('data-intro',
                      'Enter the text you would like to be reviewed');
        
        intro().start();
      });
    });
  }

  tutorial.commentMode = function tutorialCommentMode() {
    $(document).ready(function() {
      // set up the comment mode of the tutorial
      tutorialBtn.click(function() {
        removeAllAttributes();
        
        codeArea.attr('data-step','1');
        codeArea.attr('data-intro','Select the text you would like to review');
        
        commentArea.attr('data-step','2');
        commentArea.attr('data-intro','Review the text you have selected');
        
        intro().start();
      });
    });
  }
  
  return tutorial;
});

/* Local Variables:         */
/* espresso-indent-level: 2 */
/* tab-width: 8             */
/* indent-tabs-mode: nil    */
/* fill-column: 80          */
/* End:                     */
/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
