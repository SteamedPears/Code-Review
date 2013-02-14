(function(window,undefined) {
'use strict';

//RUNTIME SCRIPT - Script body runs here and calls functions that reside lower down
//PART 1

// Google object
var	google,

//Created document and UI elements
		google_tag,
		css_tag,
		skimr_div,//container div
		loading_div,
		list_table,
		dashboard_div,
		exit_anchor,
		next_anchor,
		prev_anchor;

//Initilisation
function init () {

	var fragment = document.createDocumentFragment();

	
	//Scroll to top
	//window.scroll(0,0);
	
	skimr_div = buildSkimrDiv();//Veil
	fragment.appendChild( skimr_div );
	css_tag = buildCss(); 	//Add CSS style tag 
	loading_div = buildLoadingDiv(); //Add loading message to body tag
	dashboard_div = buildDashboard();

	skimr_div.appendChild( loading_div );
	skimr_div.appendChild( dashboard_div );
	skimr_div.appendChild( css_tag );

	document.body.appendChild(fragment);

	////Set events
	//eventDelegation();
}
//What to do once feed has been initialised
//var results is passed for the google feed api (see initFeed)
function postFeedInit (results) {
	var entries;
	

	//TODO WE NEED TO IMPLEMENT PROPER ERROR HANDLING
	//TODO If we do implement error handling, move to program code, not methods. I think...
	// If feed doesn't load or doesn't exist, exit app
	if (results.status.code === 400){
		alert('Woops, there is a problem with the feed'); 
		exitApp();
		//throw 'Feed 404';// TODO MUST CATCH
	}
	
	//Once the feed is initialissed, no need for loading msg
	remNode(loading_div);
	
	//Update skimr class properties
	current_results = results.feed.entries; 

	//Element that houses feed links
	list_table = buildListTable();
	//Append to main element
	skimr_div.appendChild(list_table);


	//Preload remaining for pagination
	initFeed(num_max_entries,function (){
		//For some reason, when sending this fucntion as a callback,
		//the returned results object is 'this'. The old results object
		//is still return. There are now two result objects within the
		//scope. Weird, huh?
		current_results = this.feed.entries;

		//Allow Pagination via next button
		 current_results.length >= entries_per_page && (next_anchor.className = 'show');
		 });
}

function pagination (offset) {

	current_offset += offset;

	next_anchor.className = offset >= (current_results.length - current_offset) ? 'hide': 'show';
	prev_anchor.className = current_offset > 0 ? 'show' : 'hide';
	remNode(document.getElementById('skimr-table'));
	list_table = buildListTable(offset); //Rebuild link list
	skimr_div.appendChild(list_table);
	
}

//Create loading div element
function buildLoadingDiv (){
	var div = document.createElement('div');

	div.id = 'skimr-loading';
	(div.innerContent) ?
		div.innerContent = 'Loading...' : //W3C  
		div.innerText = 'Loading...'; //IE (ewwww)

	return div;
}

function buildSkimrDiv (){ //Veil
	var div = document.createElement('div');
	div.id = 'skimr';
	return div;
}

function buildCss () {
	var css,
			css_tag;

		css = 
			//RESETS		
		'html {position: relative;}\n'//For full page veil

		+ 'html,head,body {width: 100% !important; padding: 0 !important; '
			+ 'min-width: 100% !important; margin: 0 !important; '
			+ 'max-width: 100% !important; min-height: 100%;}\n'//For full page veil

		+ '#skimr, #skimr * {padding: 0; margin: 0;color:#000; font-weight: normal;'
			+ 'border:0; text-transform: none; text-shadow:none; text-align: left;' // reset
			+ 'font: normal normal 16px/1.2 Helvetica, Arial, Sans-Serif;}\n'//cont'd


		+ '#skimr {position:absolute;top:0;left:0;min-height:100%;width:100%; '
			+ 'zoom:100%;'
			+ 'background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAE'
			+ 'AAAABCAYAAAAfFcSJAAAADUlEQVQI12NgYGC4DAAA2ADUwvUnWwAAAABJRU5E'
			+ 'rkJggg==) transparent repeat; '
			+ 'z-index: 99999999; '
			+ 'padding:0 0 30px;'//For Dashbar
			+ ' }\n'//cont'd

			//+ 'font: normal normal 16px/1.2 Helvetica, Arial, Sans-Serif; }\n'//cont'd

		+ '#skimr-loading {width: 100%; background-color: #FFF; color: #000;' 
			+ 'text-align: center;}\n'//cont'd

		+ '#skimr-dashboard {width: 100%; background-color: #fff; color: #ddd;' 
			+ 'position: fixed; bottom: 0; left: 0; text-align: center; }\n'

		+ '#skimr a {text-decoration: underline;}'

		+ '#skimr-dashboard a {margin-left: 5px;}'

		+ '#skimr-dashboard .hide {visibility: hidden;}'

		+ '#skimr-table {background-color: #EFEFEF; max-width: 1000px; margin: 0 auto; '
			+ '-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;'
			+ 'margin-top:20px;width:auto;'
			+ 'border-collapse: separate;border-spacing: 0;'
			+ 'background-image: -webkit-gradient( linear, left 40, left top, color-stop(0.34, rgb(239,239,239)), color-stop(0.77, rgb(221,221,221)), color-stop(0.94, rgb(222,222,222))); background-image: -moz-linear-gradient( center 40, rgb(239,239,239) 34%, rgb(221,221,221) 77%, rgb(222,222,222) 94%);'
			+ '}\n' ;


	css_tag = document.createElement('style'); 

	try {
		css_tag.appendChild(document.createTextNode(css) ); //W3C
	} catch (e) {
		if (css_tag.styleSheet) { //IE. Ew.
			css_tag.styleSheet.cssText =  css;
		}
	}
	return css_tag;
}


function buildDashboard () {
	var fragment = document.createDocumentFragment(),
			dashboard_div = document.createElement('div');

	fragment.appendChild(dashboard_div);
	dashboard_div.id = 'skimr-dashboard';
	
	exit_anchor = buildAnchor('Exit','skimr-exit'); 
	//Default: hide class while preloading the next google feed results 
	next_anchor = buildAnchor('Next','skimr-next','hide');
	prev_anchor = buildAnchor('Prev','skimr-prev','hide');

	dashboard_div.appendChild(prev_anchor);
	dashboard_div.appendChild(exit_anchor);
	dashboard_div.appendChild(next_anchor);

	return fragment; 

}

function exitApp () {

	remNode(skimr_div);
	remNode(css_tag);
	remNode(google_tag);
	remNode(window.codeReview_script);

	//Delete global object;
	window.codeReview && (delete window.skimr);
	

	//Delete script tag created by outside run script
	window.skimr_script && (delete window.skimr_script); 
	//For outside run script test (window.skmir.exitApp)
	return true;

}

//Helper functions
function remNode(elem) {//If fails, returns false
	return elem && elem.parentNode.removeChild(elem);
}
function buildAnchor (title,id,className) {
	var document = window.document,
			anchor = document.createElement('a');
	anchor.href = '#';
	anchor.appendChild(document.createTextNode(title));
	id && (anchor.id = id);
	className && (anchor.className = className);
	return anchor;
}
//Run fn when given asset is  loaded
function assetReady(asset,fn) {
	if (asset.readyState){  //IE
		asset.onreadystatechange = function(){
		if (asset.readyState == "loaded" ||asset.readyState == "complete"){
				asset.onreadystatechange = null;
				return fn();
			}
		};
	} else {  //Other browsers, the decent and good ones (not IE)
		asset.addEventListener('load',fn);
	}
}

//Expose skimr methods to the global namespace
window.skimr = {
	exitApp : exitApp,
	init:	init,
	assetReady: assetReady
}

//INIT
init();

})(window);
