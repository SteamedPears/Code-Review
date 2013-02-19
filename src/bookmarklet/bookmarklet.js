(function(window,undefined) {
'use strict';

var assetLoader = (function() {
	var assets = {},
			doc = document,
			head = document.getElementsByTagName('head')[0];

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
				tag = document.createElement('link');
				tag.type= 'text/css';
				tag.rel='stylesheet';
				tag.href=url;
				break;

			case 'js':
			case 'javascript':
				tag = document.createElement('script');
				tag.src = url;
				break;

			default:
				tag = document.createElement('link');
				tag.href=url;
				break;
		}

		return tag;
	};

	var addToHead = function(tag) {
		head.appendChild(tag);
	};

	/* Invoke callback when asset is loaded
	 * USAGE:
	 *	runOnLoad(someTag, function() { //do stuff });
	 */
	var runOnLoad = function runOnLoad (asset, callback) {
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
	};

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

			var tag = createTag(url);
			assets[url] = tag;
			if (callback !== undefined) this.runOnLoad(tag, callback);
			addToHead(tag);
		},
		runOnLoad: runOnLoad
	};
})();

})(window);
