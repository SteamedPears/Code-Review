(function(win,doc,undefined) {
'use strict';

var g = {}; //Globals
g.debug = true; //Debug mode
g.vendors = {
	gist : /https?:\/\/gist.github.com/  //Github gists
};
g.vendorDefault = "readability";
g.baseUrl = g.debug ? '//localhost:8000' : 'http://review.steamedpears.com';
g.bookmarkletUri = g.debug ? '/' : '/bookmarklet/';
g.vendorUri = g.debug ? '/': '/bookmarklet/vendors/';

function dbg() { if (g.debug) console.log.apply(console,arguments); }

var assetLoader = (function() {
	var assets = {},
			head = doc.getElementsByTagName('head')[0];

	var ext_re= /\.[0-9a-zA-Z]+$/; // matches a URL's extension
	
	/* 
	 * Create tag that will be appended to head
	 * Returns an HTML element
	 * Usage:
	 *	var tag = createTag("http://example.com/style.css");
	 *	var tag =  createTag("http://example.com/someJSfile", "js");
	 */
	var createTag = function createTag(url, t) {
		var tag, type;

		var matches = url.match(ext_re);
		type = t || matches &&  matches[0].substr(1) || "default";

		switch (type) {
			case 'css' :
				tag = doc.createElement('link');
				tag.type= 'text/css';
				tag.rel='stylesheet';
				tag.href=url;
				break;

			case 'js':
			case 'javascript':
				tag = doc.createElement('script');
				tag.src = url;
				break;

			default:
				tag = doc.createElement('link');
				tag.href=url;
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
		 * USAGE:
		 * Just load asset
		 *  assetLoader.load('//example.ca/st.css'); 
		 *
		 * Call callback when loaded
		 *	assetLoader.load('//example.ca/script.js',callback)
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
		*	runOnLoad(someTag, function() { //do stuff });
		*/
		runOnLoad  : function (asset, callback) {
			if (asset.readyState){  //IE
				asset.onreadystatechange = function(){
					if (asset.readyState == "loaded" ||asset.readyState == "complete"){
						asset.onreadystatechange = null;
						return callback();
					}
				};
			} else {  //W3C
				asset.addEventListener('load',callback);
			}
		}
	};
})();

var helpers = {
	vendorGetFromUrl : function(url) {
		var matches,
		regex;

		for (var vendor in g.vendors) {
			regex = g.vendors[vendor];
			matches = regex.test(url);
			if (matches) return vendor;
		}
		return null;
	},
	loadVendor : function (vendor, callback) {
		dbg("helpers.loadVendor: " + vendor);
		assetLoader.load(g.baseUrl + g.vendorUri + vendor + ".js", callback);
	}
};

})(window,document);
