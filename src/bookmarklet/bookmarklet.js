(function(window,document,undefined) {
'use strict';

var g = {}; //Globals
g.debug = true; //Debug mode
g.vendors = {
  gist : /https?:\/\/gist.github.com/  //Github gists
};
g.vendorDefault = "readability";
g.baseUrl = g.debug ? '//localhost:8080' : '//review.steamedpears.com';
g.bookmarkletUri =  '/bookmarklet/';
g.vendorUri = g.debug ? '/vendors/' : '/bookmarklet/vendors/';
g.newCodeApi = '/do/newcode';


//Will be the exposed API
var that, 
    codeReview;

codeReview = that = {};

function dbg() { if (g.debug) console.log.apply(console,arguments); }

var assetLoader = (function() {
  var assets = {},
      head = document.getElementsByTagName('head')[0];
  
  /* 
   * Create a tag that will be appended to head. If you input only a URL, the
   * file's extension will be matched to the appropriate tag. If no match is
   * found, the tag used will be the default type.
   *
   * Returns an HTML element
   *
   * Default type: javascript
   *
   * Usage:
   *  var tag = createTag("http://example.com/style.css");
   *  var tag = createTag("http://example.com/someJSfile", "js");
   *
   */
  var ext_re= /\.[0-9a-zA-Z]+$/; // matches a URL's extension
  var createTag = function createTag(url, t) {
    var tag, type;

    var matches = url.match(ext_re);
    type = t || matches && matches[0].substr(1) || "default";

    switch (type) {
      case 'css' :
        tag = document.createElement('link');
        tag.type = 'text/css';
        tag.rel = 'stylesheet';
        tag.href = url;
        break;

      case 'js' : // FALLTHROUGH
      case 'javascript' : // FALLTHROUGH
      default :
        tag = document.createElement('script');
        tag.src = url;
        break;
    }
    return tag;
  };

  var addToHead = function(tag) {
    head.appendChild(tag);
  };

  //API
  return {
    /* Loads assets
     * USAGE :
     * Just load asset
     *  assetLoader.load('//example.ca/st.css'); 
     *
     * Call callback when loaded
     *  assetLoader.load('//example.ca/script.js',callback)
     */
    load : function (url, callback) {

      if (assets[url]) return;

      var tag = createTag(url);
      dbg("assetLoader.load: ", tag);
      assets[url] = tag;
      if (callback !== undefined) this.runOnLoad(tag, callback);
      addToHead(tag);
    },
    /* Invoke callback when asset is loaded
    * USAGE:
    * runOnLoad(someTag, function() { //do stuff });
    */
    runOnLoad : function (asset, callback) {
      if (asset.addEventListener) { //W3C
        asset.addEventListener('load',callback);
      }
      else if (asset.readyState){ //IE
        asset.onreadystatechange = (function() {
          if (asset.readyState === "loaded" || asset.readyState === "complete"){
            asset.onreadystatechange = null;
            return callback();
          }
        });
      } else { 
        throw "runOnLoad: Can't attach event.";
      }
    }
  };
})();

var helpers = {
  //Figure out if this url uses a known vendor
  vendorGetFromUrl : function(url) {
    var matches,
    regex;

    for (var vendor in g.vendors) {
      if (g.vendors.hasOwnProperty(vendor)) {
        regex = g.vendors[vendor];
        matches = regex.test(url);
        if (matches) return vendor;
      }
    }
    return null;
  },
  //Load a given vendor
  vendorLoad: function (vendor, callback) {
    dbg("helpers.vendorLoad: " + vendor);
    assetLoader.load(g.baseUrl + g.vendorUri + vendor + ".js", callback);
  }, 
  //Returns an XML HTTP request object
  request : function (method, url, type){
    var xhr = new XMLHttpRequest();
    xhr.open(method || 'POST', url, true);
    xhr.setRequestHeader("Content-type", type || "application/json");
    return xhr;
  }
};

//Expose API
that.dbg = dbg;
window.codeReview = that;

//Sketch of what's to come
helpers.vendorLoad("readability", function () {
  var content = that.vendor.getContent();
  
  var req = helpers.request(null,g.baseUrl + g.newCodeApi);

  var obj = JSON.stringify({
    language_id : 1,
    text : content.text
  });
  req.onreadystatechange = function() {
    if (req.readyState === 4){
      console.log(req.responseText);
    }
  };
  req.send(obj);

});

})(window,document);
/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
