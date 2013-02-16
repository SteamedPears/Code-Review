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
        'URI':'lib/URI',
        'CodeMirror':'lib/CodeMirror-3.02/lib/codemirror'
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
        },
        'CodeMirror':{
            exports:'CodeMirror',
            init:function() {
                return this.CodeMirror;
            }
        }
    }
});

require([
    // external libs
    "jquery",
    "URI",
    // internal modules
    "view",
    "code",
    "comment",
    "language"
], function($,URI) {
    var view = require("view");
    var code = require("code");
    var comment = require("comment");
    var language = require("language");

    // dispatch based on query
    var query = URI(document.URL).query(true);
    if(query.error !== undefined)
        view.displayError(query.error);
    if(query.id === undefined) {
        view.initCodeMode();
        language.getLanguages(view.populateLanguageList);
    } else {
        view.initCommentMode();
        code.getCode(query.id,view.displayCode,view.displayError);
        comment.getComments(query.id,view.displayComments);
    }
});
