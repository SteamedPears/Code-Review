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
		$.ajax('/do/comments',{
			data:	 {code_id:code_id},
			dataType: 'json',
			error:	error_fn,
			success:  function(data) {
                var counts = {};
                for(var i in data.comments) {
                    var line_start = data.comments[i].line_start;
                    if(!counts[line_start])
                        counts[line_start] = 0;
                    ++(counts[line_start]);
                }
                comments = data.comments;
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
