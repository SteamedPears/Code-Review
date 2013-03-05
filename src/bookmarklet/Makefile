
.PHONY=main

TARGET=../client
LIB=lib
VENDORS_SRC=vendors_src
VENDORS=vendors

main:
	python -m SimpleHTTPServer

lint:
	jshint bookmarklet.js

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

buildvendors: getvendors readability

makedirs:
	mkdir -p $(LIB)
	mkdir -p $(VENDORS)

#Build the bookmarklet, get all vendors and compile them
build: makedirs buildvendors

clean:
	rm -rf *.min.js vendors/* 

#TODO: minify vendors too.
#TODO: figure out where this will be served on the production server.
production:
	@echo "Minifying and moving to $(TARGET)"
	cat bookmarklet.js |\
		sed 's/\(g\.debug\s*=\s*\)true/\1false/' |\
		uglify
		> $(TARGET)/bookmarklet.min.js
