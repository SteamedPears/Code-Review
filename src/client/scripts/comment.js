/******************************************************************************
* comment.js                                                                  *
* Copyright 2013                                                              *
* For details about the copyright holders, see the COPYRIGHT file.            *
* This software is freely distributed under the ISC License.                  *
* For details about the license, see the LICENSE file.                        *
*                                                                             *
* This module provides an API for interacting with the comment model.         *
******************************************************************************/

define([
    "jquery"
], function($) {
    var comment = {};

    var comments = null;

    comment.getCommentCounts = function(code_id,callback,error_fn) {
	comments = {};
	$.ajax('/do/comments',{
	    data:	 {code_id:code_id},
	    dataType: 'json',
	    error:	error_fn,
	    success:  function(data) {
                var counts = {};
                for(var i in data.comments) {
                    var c = data.comments[i];
                    var line_start = c.line_start;
                    if(!counts[line_start])
                        counts[line_start] = 0;
                    ++(counts[line_start]);
                    if(!comments[line_start])
                        comments[line_start] = [];
                    comments[line_start].push(c);
                }
                callback(counts,comment.getCommentsOnLine);
            }
	});
    };

    comment.getCommentsOnLine = function(line) {
        if(comments === null) return;
        return comments[line];
    };
    
    return comment;
});
