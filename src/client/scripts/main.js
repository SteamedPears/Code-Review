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
        'CodeMirror':'lib/codemirror-3.02/lib/codemirror',
        'jquery.form':'lib/jquery.form',
	'diff':'lib/diff_match_patch'
    },
    shim:{
	'QUnit':{
	    exports:'QUnit'
	},
	'underscore':{
	    exports:'underscore'
	},
        'URI':{
            exports:'URI'
        },
        'CodeMirror':{
            exports:'CodeMirror'
        },
        'jquery.form':{
            deps:['jquery'],
            init:function($) {
                return $.ajaxForm;
            }
        },
	'diff':{
	    exports:'diff',
	    init:function() {
		return new diff_match_patch();
	    }
	}
    }
});

require([
    // external libs
    "jquery",
    "URI",
    "jquery.form",
    // internal modules
    "view",
    "code",
    "comment",
    "language",
    "editor"
], function($,URI) {
    var view = require("view");
    var code = require("code");
    var comment = require("comment");
    var language = require("language");
    var editor = require("editor");

    // initialize the view
    view.init();

    // ajaxify forms
    $('#code-form').ajaxForm({
	success: function(ob) {
	    history.pushState({},"CodeReview","index.html?id="+ob.uuid);
	    view.initCommentMode(ob.uuid);
	},
	error: function(ob) {
	    view.displayError("Failed to upload code");
	}
    });
    $('#comment-form').ajaxForm({
	success: function(ob) {
	    view.hideCommentEditor();
	    $('#comment-form').resetForm();
	    comment.getCommentCounts(ob.code_id,
				     view.addCommentButtons,
				     view.displayError);
	}
    });

    // dispatch based on query
    var query = URI(document.URL).query(true);
    if(query.error !== undefined)
        view.displayError(query.error);
    if(query.id === undefined) {
        view.initCodeMode();
        view.populateLanguageList(language.langs);
    } else {
        view.initCommentMode(query.id);
        code.getCode(query.id,function(ob) {
            view.displayCode(ob);
            comment.getCommentCounts(query.id,
                                     view.addCommentButtons,
                                     view.displayError);
        },view.displayError);
    }
});