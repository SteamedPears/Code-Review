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
    var commentOptions = {
	lineNumbers: true,
	lineWrapping: true,
	fixedGutter: true,
	readOnly: true
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

    editor.fromTextArea = function(textarea,firstLine) {
	var this_inst = CodeMirror.fromTextArea(textarea,commentOptions);
	if(inst !== null)
	    this_inst.setOption("mode",inst.getOption("mode"));
	this_inst.setOption("firstLineNumber",firstLine);
	return this_inst;
    };

    editor.codeFromTextArea = function(textarea) {
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

    editor.getText = function(start,end) {
	return inst.getRange({line:start,ch:0},{line:end,ch:999999});
    };

    editor.setDiffSelected = function(start,end) {
        if(diff_inst === null) return;
        diff_inst.setOption("firstLineNumber",start+1);
        diff_inst.setOption("mode",inst.getOption("mode"));
        diff_inst.setValue(editor.getText(start,end));
        diff_inst.refresh();
    };

    editor.setSelected = function(start,end) {
        if(inst === null) return;
        inst.setSelection({line:start,ch:0},{line:end,ch:0});
    };

    editor.unsetSelected = function() {
        if(inst === null) return;
        inst.setSelection({line:0});
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
    
    var getPosFromIndex = function(area,index) {
	var pos = area.posFromIndex(index);
	if(pos.ch==0 && pos.line!=0){
	    pos.line--;
	    pos.ch=999999;
	}
	return pos;
    }

    editor.styleDiffArea = function(area,rawDiffs) {
	var curIndex = 0;
	var curPos = getPosFromIndex(area,curIndex);
	for(var index = 0; index<rawDiffs.length; index++){
	    var diff = rawDiffs[index];
	    var type = diff[0];
	    var text = diff[1];
	    var newIndex = curIndex+text.length;
	    var newPos = getPosFromIndex(area,newIndex);
	    area.markText(curPos,newPos,{className:"diffStyle_"+type});
	    curIndex = newIndex;
	    curPos = newPos;
	}
    };

    editor.saveCode = function() {
	if(inst === null) return;
	inst.save();
    };

    editor.saveComment = function() {
	if(diff_inst === null) return;
	diff_inst.save();
    };

    editor.appendTo = function(container,firstLine) {
	var this_inst = CodeMirror(container,commentOptions);
	if(inst !== null)
	    this_inst.setOption("mode",inst.getOption("mode"));
	this_inst.setOption("firstLineNumber",firstLine);
	return this_inst;
    };

    return editor;
});
