.PHONY=main

TARGET=../client/bookmarklet
LIB=lib
VENDORS_SRC=vendors_src
VENDORS=vendors

lint:
	jshint bookmarklet.js

#Initialize the bookmarklet
init: makedirs getvendors build

readability:
	@echo "Wrapping $@ and compiling to $(VENDORS)"
	cat $(VENDORS_SRC)/readability_header.js \
			$(LIB)/readabilitySAX/readabilitySAX.js \
			$(LIB)/readabilitySAX/browsers/DOMasSAX.js \
			$(VENDORS_SRC)/readability_footer.js \
			> $(VENDORS)/readability.js

getvendors:
	@echo "Downloading vendors"
	cd $(LIB); git clone git@github.com:fb55/readabilitySAX.git

buildvendors: readability

makedirs:
	mkdir -p $(LIB)
	mkdir -p $(VENDORS)

makeproductiondirs:
	mkdir -p $(TARGET)
	mkdir -p $(TARGET)/$(VENDORS)

#Build the bookmarklet, compile/wrap the vendors, move everything to the
#TARGET directory
build: makeproductiondirs buildvendors
	cp bookmarklet.js $(TARGET)
	cp vendors/* $(TARGET)/$(VENDORS)

clean:
	rm -rf *.min.js vendors/* $(TARGET)

#TODO: minify vendors too.
#TODO: figure out where this will be served on the production server.
production: makeproductiondirs
	@echo "Minifying and moving to $(TARGET)"
	cat bookmarklet.js |\
		sed 's/\(g\.debug\s*=\s*\)true/\1false/' |\
		uglify
		> $(TARGET)/bookmarklet.min.js

# vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80:
