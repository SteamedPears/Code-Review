/* Copyright by Steamed Pears, 2013. For licensing information, 
   see the LICENCE file in the root directory of this project. */

/* 
 * This file, along with ./readability_footer.js, will wrap
 * ../lib/readabilitySAX/readabilitySAX.js and
 * ../lib/readabilitySAX/browsers/DOMasSax.js. The resulting file will be
 * located in ../vendors. 
 */

(function(window,document,undefined) { 
  'use strict';

  if (!window.codeReview) {
    throw new Error('codeReview object not loaded.');
  }

  var dbg = codeReview.dbg;

  /* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
