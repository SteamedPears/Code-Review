(function(window,document,undefined) {
'use strict';

//Object that will be built up
var codeReview = {};
//Expose API
window.codeReview = codeReview;

var g = {}; //Globals
g.debug = true; //Debug mode
g.vendors = {
  gist: /https?:\/\/gist.github.com/  //Github gists
};
g.vendorDefault = 'readability';
g.baseUrl = g.debug ? '//localhost:8080' : '//review.steamedpears.com';
g.bookmarkletUri =  '/bookmarklet';
g.vendorUri = g.debug ? '/bookmarklet/vendors/' : '/bookmarklet/vendors/';
g.newCodeApi = '/do/newcode';

function dbg() { if (g.debug) console.log.apply(console,arguments); }
codeReview.dbg = dbg;


/*******************************************************************************
* Asset loader                                                                 *
*******************************************************************************/
var assetLoader = (function() {
  var assets = {};
  
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
   *  var tag = createTag('http://example.com/style.css');
   *  var tag = createTag('http://example.com/someJSfile', 'js');
   *
   */
  var createTag = function createTag(url, t) {
    var ext_re = /\.[0-9a-zA-Z]+$/; // matches a URL's extension
    var tag;
    var type;

    var matches = url.match(ext_re);
    type = t || matches && matches[0].substr(1) || 'default';

    switch (type) {
      case 'css':
        tag = document.createElement('link');
        tag.type = 'text/css';
        tag.rel = 'stylesheet';
        tag.href = url;
        break;

      case 'js': // FALLTHROUGH
      case 'javascript': // FALLTHROUGH
      default:
        tag = document.createElement('script');
        tag.src = url;
        break;
    }
    return tag;
  };

  //API
  return {
    /* Loads assets
     * USAGE:
     * Just load asset
     *  assetLoader.load('//example.ca/st.css'); 
     *
     * Call callback when loaded
     *  assetLoader.load('//example.ca/script.js',callback)
     */
    load: function (url, callback) {

      if (assets[url]) return;

      var tag = createTag(url);
      dbg('assetLoader.load: ', tag);
      assets[url] = tag;
      if (callback !== undefined) this.runOnLoad(tag, callback);
      document.head.appendChild(tag);
    },
    /* Invoke callback when asset is loaded
    * USAGE:
    * runOnLoad(someTag, function() { //do stuff });
    */
    runOnLoad: function (asset, callback) {
      if (asset.addEventListener) { //W3C
        asset.addEventListener('load',callback);
      } else if (asset.readyState) { //IE
        asset.onreadystatechange = (function() {

          if (asset.readyState === 'loaded' || 
            asset.readyState === 'complete') {

            asset.onreadystatechange = null;
            return callback();
          }
        });
      } else { 
        throw 'runOnLoad: Can not attach event.';
      }
    },
    deleteAssets: function () {
      var a;
      for (var asset in assets) {
        if (assets.hasOwnProperty(asset)) {
          a = assets[asset];
          a.parentNode.removeChild(a);
          delete assets[asset];
        }
      }
    }
  };
})();

/*******************************************************************************
* Helpers                                                                      *
*******************************************************************************/
var helpers = {
  //Figure out if this url uses a known vendor
  vendorGetFromUrl: function(url) {
    var matches;
    var regex;

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
  loadVendor: function (vendor, callback) {
    dbg('helpers.loadVendor: ' + vendor);
    assetLoader.load(g.baseUrl + g.vendorUri + vendor + '.js', callback);
  }, 
  //Returns an XML HTTP request object
  request: function (method, url, type) {
    var xhr = new XMLHttpRequest();
    xhr.open(method || 'POST', url, true);
    xhr.setRequestHeader('Content-type', type || 'application/json');
    return xhr;
  }
};

/*******************************************************************************
* Global API                                                                   *
*******************************************************************************/

codeReview.exit = function () {
  dbg('Exiting...');
  assetLoader.deleteAssets();
};

/*******************************************************************************
* Main code                                                                    *
*******************************************************************************/

//Sketch of what's to come
helpers.loadVendor('readability', function () {
  var content = codeReview.vendor.getContent();
  
  var req = helpers.request(null,g.baseUrl + g.newCodeApi);

  var obj = JSON.stringify({
    language_id: 1,
    text: content.text
  });
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      console.log(req.responseText);
    }
  };
  req.send(obj);

});



})(window,document);
/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
