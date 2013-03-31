({
  appDir: '../', //Where the client is located
  baseUrl: 'scripts/', //Where look for scripts by default
  dir: '../../../production', //Where to built the optimized project
  modules: [
    //Optimize the application files. jQuery is not 
    //included since it is already in require-jquery.js
    {
      name: 'main'
    }
  ],
  paths:{ //Dependencies NOT in the root of baseURL.
    'QUnit':'lib/qunit-1.11.0',
    'underscore':'lib/underscore-min',
    'IPv6':'lib/IPv6',
    'SecondLevelDomains':'lib/SecondLevelDomains',
    'punycode':'lib/punycode',
    'URI':'lib/URI',
    'CodeMirror':'lib/codemirror-3.1/lib/codemirror',
    'jquery.form':'lib/jquery.form',
    'diff':'lib/diff_match_patch',
    'jquery':'lib/jquery-1.9.1.min',
    'intro':'lib/intro.js-0.2.1/minified/intro.min'
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
    },
    'intro':{
      exports:'introJs'
    }
  },
  //optimizeCss: "standard.keepLines",
  optimize: "none"
})
/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
