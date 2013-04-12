/* Copyright by Steamed Pears, 2013. For licensing information, 
   see the LICENCE file in the root directory of this project. */

(function(window,document,undefined) {
'use strict';

/*******************************************************************************
* Globals                                                                      *
*******************************************************************************/

//Object that will be built up
var codeReview = {};
//Expose API
window.codeReview = codeReview;

var g = {}; //Globals
g.debug = true; //Debug mode
g.vendors = {
  gist: /https?:\/\/gist.github.com/  //Github gists
};
g.vendorUri = '/bookmarklet/vendors/';
g.vendorDefault = 'readability';
g.bookmarkletUri =  '/bookmarklet';
g.newCodeApi = '/do/newcode';
g.baseUrl = g.debug ? 'http://localhost:8080' : 'http://review.steamedpears.com';

function dbg() { if (g.debug) console.log.apply(console,arguments); }


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
      for (var asset in assets) {
        if (assets.hasOwnProperty(asset)) {
          var a = assets[asset];
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
//Figure out if this url uses a known vendor
function vendorGetFromUrl (url) {
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
}

//Load a given vendor
function loadVendor (vendor, callback) {
  dbg('helpers.loadVendor: ' + vendor);
  assetLoader.load(g.baseUrl + g.vendorUri + vendor + '.js', callback);
} 

//Returns an XML HTTP request object
function request (method, url, type) {
  var xhr = new XMLHttpRequest();
  xhr.open(method || 'POST', url, true);
  xhr.setRequestHeader('Content-type', type || 'application/json');
  return xhr;
}

/*******************************************************************************
* User interface                                                               *
*******************************************************************************/

function UI() {
  assetLoader.load(g.baseUrl + g.bookmarkletUri + '/style.css', function () {
    dbg('UI: stylesheet loaded');
  });

  var container = document.createElement('div'); 
  container.id = 'codeReview-container';

  var message = document.createElement('p');
  message.id = 'message';
  message.innerHTML = 'Initializing...';
  container.appendChild(message);

  document.body.appendChild(container);

  //Write messages to the user
  this.message = function (msg) {
    message.innerHTML = msg;
    dbg('UI: ', msg);
  };
  //Exit the UI
  this.exit = function() {
    container.parentNode.removeChild(container);
  };
}

var ui = new UI();

/*******************************************************************************
* Global API                                                                   *
*******************************************************************************/

codeReview.dbg = dbg;

//Exit and clean up
codeReview.exit = function () {
  dbg('Exiting CodeReview');
  assetLoader.deleteAssets();
  if (ui) ui.exit();
  delete window.codeReview;
};

/*******************************************************************************
* Main code                                                                    *
*******************************************************************************/

//Sketch of what's to come
loadVendor('readability', function () {

  ui.message('Sending content...');
  var content = codeReview.vendor.getContent();
  
  var req = request(null,g.baseUrl + g.newCodeApi);

  var obj = JSON.stringify({
    language_id: 1,
    text: content.text
  });
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      var res = req.responseText;
      var json_res = JSON.parse(res);
      ui.message('<a href="' + g.baseUrl + '/index.html?id=' + 
        json_res.uuid + '">View CodeReview Link<\a>');
    }
  };
  req.send(obj);
});


})(window,document);
/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
