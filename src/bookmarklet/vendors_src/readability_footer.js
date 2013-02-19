
dbg("readability.js: Readability loaded");


window.codeReview.vendor = {
	getContent : function () {
		var readable = new Readability();
		readable.setSkipLevel(3); //XXX
		saxParser(document.childNodes[document.childNodes.length-1], readable);
		return readable.getArticle("text");
	}
}

})(window,document);

/* To wrapped around ../lib/readabilitySAX.js and ../lib/browsers/DOMasSax.js*/
