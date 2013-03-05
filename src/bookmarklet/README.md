#Code Review Bookmarklet

##Development Usage

Run `make main` to start serving the  bookmarklet for development.

All vendors must be built before they can be used. Use `make vendorname`.

To prepare the bookmarklet for production (eg. minification, concatenation, etc), use `make production`.

##Dependencies

* Python for a static file server. Node's static file server caches static files. Using python's HTTP server is a work around.
* uglifyjs for minifying.
* jshint for linting.

All dependencies are optional. They're only used in the makefile. Use npm's `-g` flag to install uglify and jshint as terminal commands. 
