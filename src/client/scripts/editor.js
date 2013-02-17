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
    var inst = null;
    var languages = require("language").langs;
    var codeOptions = {
		lineNumbers: true,
		lineWrapping: true,
		fixedGutter: true,
		readOnly: false
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
    
    editor.setHighlighting = function(lang) {
        // TODO: finish this
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

    editor.setOption = function(name,val) {
        if(inst === null) return;
        inst.setOption(name,val);
    };

    editor.setValue = function(val) {
        if(inst === null) return;
        inst.setValue(val);
    };

    return editor;
});
