#Code Review Bookmarklet

##Development Usage

Rum `make build` to build the bookmarklet and vendors.

Run `make main` to start serving the bookmarklet for development.

All vendors must be built before they can be used. Use `make buildvendors`.

To prepare the bookmarklet for production (eg. minification, concatenation,
etc), use `make production`.

##Vendors

Vendors are different strategies used by the bookmarklet to scrape or extract
content. They're dynamically loaded depending on which site the user is
visiting. Currently, it will default to readability.

Compiled/prepared vendor files are located in `vendors/`. The files used to
prepare/wrap them are located in `vendors_src/`.

##Vendor Dependencies

* [ReadabilitySAX](https://github.com/fb55/readabilitySAX) is a readability
  fork that extracts the textual from a page using a system of heuristics.

Vendor source files are located in `libs/`.

##Build Dependencies

* Python for a static file server. `node-static` caches static files so
  reloading the browser didn't always fetch the newest version of the
  bookmarklet. Using python's HTTP server is a work around.
* uglifyjs for minifying.
* jshint for linting.

All dependencies are optional. They're only used in the makefile. Use npm's
`-g` flag to install uglify and jshint as terminal commands. 

vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80:
