/******************************************************************************
 * language.js                                                                 *
 * Copyright 2013                                                              *
 * For details about the copyright holders, see the COPYRIGHT file.            *
 * This software is freely distributed under the ISC License.                  *
 * For details about the license, see the LICENSE file.                        *
 *                                                                             *
 * This module provides an API for interacting with the language model.        *
 ******************************************************************************/

define([
    "jquery"
], function($) {
    var language = {};

    language.langs = {
	    "include_path":"lib/codemirror-3.02/mode/",
	    "data":{
		    "none":{"description":"Plain Text",
                    "mode":"text/plain",
				    "requires":[]},
		    "asp":{"description":"ASP.NET",
                   "mode":"application/x-aspx",
			       "requires":["htmlmixed","clike","htmlembedded"]},
		    "clike":{"file":"clike/clike"},
		    "c":{"description":"C",
                 "mode":"text/x-csrc",
			     "options":{"useCPP":true},
			     "requires":["clike"]},
		    "cpp":{"description":"C++",
                   "mode":"text/x-c++src",
			       "options":{"useCPP":true},
			       "requires":["clike"]},
		    "csharp":{"description":"C#",
                      "mode":"text/x-csharp",
				      "requires":["clike"]},
		    "clojure":{"description":"Clojure",
                       "file":"clojure/clojure",
				       "mode":"text/x-clojure"},
		    "coffeescript":{"description":"CoffeeScript",
                            "file":"coffeescript/coffeescript",
						    "mode":"text/x-coffeescript"},
		    "css":{"description":"CSS",
                   "file":"css/css",
			       "mode":"text/css"},
		    "diff":{"description":"diff",
                    "file":"diff/diff",
				    "mode":"text/x-diff"},
		    "ecl":{"description":"ECL",
                   "file":"ecl/ecl",
			       "mode":"text/x-ecl"},
		    "ejs":{"description":"Embedded Javascript",
                   "mode":"application/x-ejs",
			       "requires":["htmlmixed","htmlembedded"]},
		    "erlang":{"description":"Erlang",
                      "file":"erlang/erlang",
				      "mode":"text/x-erlang"},
		    "gfm":{"description":"Github Flavored Markdown",
                   "file":"gfm/gfm",
			       "mode":"gfm",
			       "requires":["markdown",
						       "asp",
						       "c",
						       "cpp",
						       "csharp",
						       "clojure",
						       "coffeescript",
						       "diff",
						       "ecl",
						       "erlang",
						       "go",
						       "groovy",
						       "haskell",
						       "haxe",
						       "html",
						       "java",
						       "javascript",
						       "jinja2",
						       "json",
						       "jsp",
						       "stex",
						       "less",
						       "lua",
						       "markdown",
						       "mysql",
						       "ntriples",
						       "ocaml",
						       "pascal",
						       "perl",
						       "php",
						       "pig",
						       "plsql",
						       "properties",
						       "python",
						       "r",
						       "rpm-spec",
						       "rpm-changes",
						       "rst",
						       "ruby",
						       "rust",
						       "scala",
						       "scheme",
						       "shell",
						       "smalltalk",
						       "smarty",
						       "sparql",
						       "stex",
						       "tiddlywiki",
						       "tikiwiki",
						       "vbscript",
						       "velocity",
						       "verilog",
						       "xml",
						       "xquery",
						       "yaml"]},
		    "go":{"description":"Go",
                  "file":"go/go",
			      "mode":"text/x-go"},
		    "groovy":{"description":"Groovy",
                      "file":"groovy/groovy",
				      "mode":"text/x-groovy"},
		    "haskell":{"description":"Haskell",
                       "file":"haskell/haskell",
				       "mode":"text/x-haskell"},
		    "haxe":{"description":"Haxe",
                    "file":"haxe/haxe",
				    "mode":"text/x-haxe"},
		    "html":{"description":"HTML",
                    "mode":"text/html",
				    "requires":["xml"],
				    "options":{"htmlMode":true}},
		    "htmlmixed":{"description":"HTML/Javascript/CSS",
                         "file":"htmlmixed/htmlmixed",
					     "mode":"text/html",
					     "requires":["xml","javascript","css"]},
		    "htmlembedded":{"description":"Embedded HTML",
                            "file":"htmlembedded/htmlembedded"},
		    "java":{"description":"Java",
                    "mode":"text/x-java",
				    "requires":["clike"]},
		    "javascript":{"description":"Javascript",
                          "file":"javascript/javascript",
					      "mode":"text/javascript"},
		    "jinja2":{"description":"Jinja2",
                      "file":"jinja2/jinja2",
				      "mode":"jinja2"},
		    "json":{"description":"JSON",
                    "mode":"application/json",
				    "requires":["javascript"],
				    "options":{"json":true}},
		    "jsp":{"description":"JSP",
                   "mode":"application/x-jsp",
			       "requires":["htmlmixed","clike","htmlembedded"]},
		    "latex":{"requires":["stex"]},
		    "less":{"description":"LESS",
                    "file":"less/less",
				    "mode":"text/x-less"},
		    "lua":{"description":"Lua",
                   "file":"lua/lua",
			       "mode":"text/x-lua"},
		    "markdown":{"description":"Markdown",
                        "file":"markdown/markdown",
					    "mode":"text/x-markdown",
					    "requires":["xml"]},
		    "mysql":{"description":"MySQL",
                     "file":"mysql/mysql",
				     "mode":"text/x-mysql"},
		    "ntriples":{"description":"N-Triples",
                        "file":"ntriples/ntriples",
					    "mode":"text/n-triples"},
		    "ocaml":{"description":"OCaml",
                     "file":"ocaml/ocaml",
				     "mode":"text/x-ocaml"},
		    "pascal":{"description":"Pascal",
                      "file":"pascal/pascal",
				      "mode":"text/x-pascal"},
		    "perl":{"description":"Perl",
                    "file":"perl/perl",
				    "mode":"text/x-perl"},
		    "php":{"description":"PHP",
                   "file":"php/php",
			       "mode":"application/x-httpd-php",
			       "requires":["xml","javascript","css","clike"]},
		    "pig":{"description":"Pig Latin",
                   "file":"pig/pig",
			       "mode":"text/x-pig"},
		    "plsql":{"description":"PL/SQL",
                     "file":"plsql/plsql",
				     "mode":"text/x-plsql"},
		    "properties":{"description":"Properties file (ini)",
                          "file":"properties/properties",
					      "mode":"text/x-properties"},
		    "python":{"description":"Python",
                      "file":"python/python",
				      "mode":"text/x-python"},
		    "python2":{"description":"Python 2",
                       "mode":"text/x-python",
				       "requires":["python"],
				       "options":{"version":2}},
		    "python3":{"description":"Python 3",
                       "mode":"text/x-python",
				       "requires":["python"],
				       "options":{"version":3}},
		    "r":{"description":"R",
                 "file":"r/r",
			     "mode":"text/x-rsrc"},
		    "rpm-spec":{"description":"RPM (spec)",
                        "file":"rpm/spec/spec",
					    "mode":"text/x-rpm-spec"},
		    "rpm-changes":{"description":"RPM (changes)",
                           "file":"rpm/changes/changes",
					       "mode":"text/x-rpm-changes"},
		    "rst":{"description":"reStructuredText",
                   "file":"rst/rst",
			       "mode":"text/x-rst"},
		    "ruby":{"description":"Ruby",
                    "file":"ruby/ruby",
				    "mode":"text/x-ruby"},
		    "rust":{"description":"Rust",
                    "file":"rust/rust",
				    "mode":"text/x-rustsrc"},
		    "scala":{"description":"Scala",
                     "mode":"text/x-scala",
				     "requires":["clike"]},
		    "scheme":{"description":"Scheme",
                      "file":"scheme/scheme",
				      "mode":"text/x-scheme"},
		    "shell":{"description":"Shell",
                     "file":"shell/shell",
				     "mode":"text/x-sh"},
		    "smalltalk":{"description":"Smalltalk",
                         "file":"smalltalk/smalltalk",
					     "mode":"text/x-stsrc"},
		    "smarty":{"description":"Smarty",
                      "file":"smarty/smarty",
				      "mode":"text/x-smarty"},
		    "sparql":{"description":"SPARQL",
                      "file":"sparql/sparql",
				      "mode":"application/x-sparql-query"},
		    "stex":{"description":"sTex",
                    "file":"stex/stex",
				    "mode":"text/x-stex"},
		    "tiddlywiki":{"description":"Tiddlywiki",
                          "file":"tiddlywiki/tiddlywiki",
					      "mode":"text/x-tiddlywiki"},
		    "tikiwiki":{"description":"Tiki wiki",
                        "file":"tiki/tiki",
					    "mode":"tiki"},
		    "vbscript":{"description":"VBScript",
                        "file":"vbscript/vbscript",
					    "mode":"text/vbscript"},
		    "velocity":{"description":"Velocity",
                        "file":"velocity/velocity",
					    "mode":"text/velocity"},
		    "verilog":{"description":"Verilog",
                       "file":"verilog/verilog",
				       "mode":"text/x-verilog"},
		    "xml":{"description":"XML",
                   "file":"xml/xml",
			       "mode":"application/xml"},
		    "xquery":{"description":"XQuery",
                      "file":"xquery/xquery",
				      "mode":"application/xquery"},
		    "yaml":{"description":"YAML",
                    "file":"yaml/yaml",
				    "mode":"text/x-yaml"}
	    }
    }

    return language;
});