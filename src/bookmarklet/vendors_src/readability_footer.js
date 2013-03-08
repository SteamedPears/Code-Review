
  dbg('readability.js: Readability loaded');

  //Pass vendor to codeReview object. Will be used in bookmarklet.js
  window.codeReview.vendor = {
    getContent: function () {
      var readable = new Readability();
      //XXX To review. Not sure about these defaults.
      readable.setSkipLevel(3); 
      saxParser(document.childNodes[document.childNodes.length-1], readable);
      return readable.getArticle('text');
    }
  };

})(window,document);
/* End of wrapper. See readability_header.js for more details */

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
