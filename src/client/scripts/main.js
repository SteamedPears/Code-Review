/******************************************************************************
* main.js                                                                     *
* Copyright 2013                                                              *
* For details about the copyright holders, see the COPYRIGHT file.            *
* This software is freely distributed under the ISC License.                  *
* For details about the license, see the LICENSE file.                        *
*                                                                             *
* This module is the main entry point for CodeReview.                         *
******************************************************************************/

require.config({
	// specify the paths for the various libraries
	paths:{
		'QUnit':'lib/qunit-1.9.0',
        'underscore':'lib/underscore',
        'URI':'lib/URI'
	},
    shim:{
		'QUnit':{
			exports:'QUnit',
            init:function() {
				return this.QUnit;
			}
		},
		'underscore':{
			exports:'underscore',
            init:function() {
				return this._;
			}
		},
        'URI':{
            exports:'URI',
            init:function() {
                return this.URI;
            }
        }
    }
});

require([
    // external libs
    "jquery",
    "underscore",
    "URI",
    // internal modules
    "view"
], function($,_,URI) {
    var view = require("view");

    // dispatch based on query
    var query = URI(document.URL).query(true);
    if(query.error !== undefined)
        view.displayError(query.error);
    if(query.id === undefined)
        view.initNewCodeMode();
    else
        view.initNewCommentMode();
});
