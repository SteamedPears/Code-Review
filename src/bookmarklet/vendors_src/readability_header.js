/* To wrapped around ../lib/readabilitySAX.js and ../lib/browsers/DOMasSax.js*/
(function(window,document,undefined) {
'use strict';

if (!window.codeReview)
	throw new Error("codeReview object not loaded.");

var dbg = codeReview.dbg;

