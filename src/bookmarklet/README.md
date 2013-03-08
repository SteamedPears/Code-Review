#Code Review Bookmarklet

##Development Usage

Run `make init` to get the bookmarklet to a working state. It will download all
the vendor dependencies, build them, and move everything to the static file
server.

Run `make build` to build the bookmarklet and vendors and move them to the
static file server.

All vendors must be built before they can be used. Use `make buildvendors`.

To prepare the bookmarklet for production (eg. minification, concatenation,
etc), use `make production`.

Use `make clean` to delete all built files. 

##Vendors

Vendors are different strategies used to scrape or extract content. They're
dynamically loaded depending on which site the user is visiting. Currently, it
will default to readability.

All vendors must return an object to `window.codeReview.vendor` of the form 
`{ getContent: function() { ... } }` where `getContent` is the abstraction used 
by the rest of the program to get the page's content.

Compiled/prepared vendor files are located in `vendors/`. The files used to
prepare/wrap them are located in `vendors_src/`.

##Vendor Dependencies

* [ReadabilitySAX](https://github.com/fb55/readabilitySAX) is a readability
  fork that extracts the textual from a page using a system of heuristics.

Vendor source files are located in `libs/`.

##Build Dependencies

* uglifyjs for minifying.
* jshint for linting.

All dependencies are optional. They're only used in the makefile. Use npm's
`-g` flag to install uglify and jshint as terminal commands. 

vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80:
