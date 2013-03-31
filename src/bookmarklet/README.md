#Code Review Bookmarklet

##Usage

Open `index.html` and drag one of the bookmarklet links to you bookmarks bar.
Boom!  You can now use it.

##Development

After cloning the project, run `make install` to get the bookmarklet to a
working state. It will download all the vendor dependencies, build them, and
move everything to them to where they can be served.

Run `make build` to build the test-build version of the bookmarklet and vendors
and move them to where files are are served. 

Run `make build-local` to build the project locally.

All vendors must be built before they can be used. Use `make buildvendors`.

To prepare the bookmarklet for production (eg. minification, concatenation,
etc), use `make build-production`.

Use `make clean` to delete all built files and `make reset` to clean and
redownload dependencies.

##Vendors

Vendors are different strategies used to scrape or extract content from a site.
They're dynamically loaded depending on which site the user is visiting.
It will default to readability when no other suitable vendor is found.

All vendors must return an object to `window.codeReview.vendor` of the form 
`{ getContent: function() { ... } }` where `getContent` is the abstraction used 
by the rest of the program to get the page's content.

Compiled/prepared vendor files are located in `vendors/`. The files used to
prepare/wrap them are located in `vendors_src/`.

##Vendor Dependencies

* [ReadabilitySAX](https://github.com/fb55/readabilitySAX) is a readability
  fork that extracts the textual from a page using a system of heuristics.

Vendor source files are located in `lib/`.

##Build Dependencies

* uglifyjs for minifying.
* jshint for linting.

All dependencies are optional. They're only used in the makefile. Use npm's
`-g` flag to install uglify and jshint as terminal commands. 

vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80:
