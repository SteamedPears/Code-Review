/******************************************************************************
* editor.js                                                                   *
* Copyright 2013                                                              *
* For details about the copyright holders, see the COPYRIGHT file.            *
* This software is freely distributed under the ISC License.                  *
* For details about the license, see the LICENSE file.                        *
*                                                                             *
* This module provides an API for interacting with the code editor.           *
******************************************************************************/

define([
    "jquery",
    "CodeMirror",
    "language"
], function($,CodeMirror) {
    var editor = {};
    var inst = null, diff_inst = null;
    var languages = require("language").langs;
    
    var codeOptions = {
		lineNumbers: true,
		lineWrapping: true,
		fixedGutter: true,
		readOnly: false
	};
	var diffOptions = {
		lineNumbers: true,
		lineWrapping: true,
		fixedGutter: true,
		readOnly: false,
		smartIndent:false
	};

    var resolveRequirements = function(languages,lang) {
        var resolveReqs = function(languages,language,requirements,req_list) {
		    var lang = languages[language];
		    var requires = lang.requires;
		    if(requires){
			    for(var requirement in requires){
				    var name = requires[requirement];
				    if(!requirements[name]){
					    requirements[name] = true;
					    resolveReqs(languages,name,requirements,req_list);
					    req_list.push(name);
				    }
			    }
		    }
	    }
        var reqs = [], reqs_ob = {};
        reqs.push(lang);
        reqs_ob[lang] = true;
        resolveReqs(languages.data,lang,reqs_ob,reqs);
        return reqs;
    };

    editor.onCursorActivity = function(callback) {
        inst.on("cursorActivity",callback);
    };
    
    editor.setHighlighting = function(lang) {
        var reqs = resolveRequirements(languages,lang);
        var files = ["CodeMirror"];
        for(var i in reqs) {
            var language = reqs[i];
            if(languages.data[language].file)
                files.push(languages.include_path + languages.data[language].file);
        }
        require(files,function(CodeMirror) {
            for(var i in files)
                require(files[i]);
            editor.setOption('mode',languages.data[lang].mode);
        });
    };

    editor.fromTextArea = function(textarea) {
        if(inst === null)
            inst = CodeMirror.fromTextArea(textarea,codeOptions);
    };

    editor.diffFromTextArea = function(textarea) {
        if(diff_inst === null)
            diff_inst = CodeMirror.fromTextArea(textarea,diffOptions);
    };

    editor.setOption = function(name,val) {
        if(inst === null) return;
        inst.setOption(name,val);
    };

    editor.setValue = function(val) {
        if(inst === null) return;
        inst.setValue(val);
    };

    editor.somethingSelected = function() {
        if(inst === null) return;
        return inst.somethingSelected();
    };

    editor.getCursor = function(start) {
        if(inst === null) return;
        return inst.getCursor(start);
    };

    editor.setSelected = function(start,end) {
        if(diff_inst === null) return;
        diff_inst.setOption("firstLineNumber",start+1);
        diff_inst.setOption("mode",inst.getOption("mode"));
        diff_inst.setValue(inst.getRange({line:start,ch:0},{line:end,ch:999999}));
        diff_inst.refresh();
    };

    editor.getLinePosition = function(line) {
        if(inst === null) return;
		var pos = inst.charCoords({line:line,ch:0}).top;
		var parent = $(inst.getTextArea()).parent();
		if(parent.position()){
			pos-=parent.position().top;
		}
        return pos;
    };

    return editor;
});
