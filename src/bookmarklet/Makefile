
TARGET=../client/bookmarklet
LIB=lib
VENDORS_SRC=vendors_src
VENDORS=vendors

#Initialize the bookmarklet
.PHONY: install
install: makedirs getvendors build

.PHONY: lint
lint:
	jshint bookmarklet.js

.PHONY: readability
readability:
	@echo "Wrapping $@ and compiling to $(VENDORS)"
	cat $(VENDORS_SRC)/readability_header.js \
			$(LIB)/readabilitySAX/readabilitySAX.js \
			$(LIB)/readabilitySAX/browsers/DOMasSAX.js \
			$(VENDORS_SRC)/readability_footer.js \
			> $(VENDORS)/readability.js

.PHONY: getvendors
getvendors:
	@echo "Downloading vendors"
	cd $(LIB); git clone git@github.com:fb55/readabilitySAX.git

.PHONY: buildvendors
buildvendors: readability

.PHONY: makedirs
makedirs:
	mkdir -p $(LIB)
	mkdir -p $(VENDORS)

.PHONY: makeproductiondirs
makeproductiondirs:
	mkdir -p $(TARGET)
	mkdir -p $(TARGET)/$(VENDORS)

#Build the bookmarklet, compile/wrap the vendors, move everything to the
#TARGET directory
.PHONY: build
build: makeproductiondirs buildvendors
	cp bookmarklet.js $(TARGET)
	cp vendors/* $(TARGET)/$(VENDORS)

.PHONY: clean
clean:
	rm -rf *.min.js vendors/* $(TARGET)

#TODO: minify vendors too.
.PHONY: production
production: makeproductiondirs
	@echo "Minifying and moving to $(TARGET)"
	cat bookmarklet.js |\
		sed 's/\(g\.debug\s*=\s*\)true/\1false/' |\
		uglify \
		> $(TARGET)/bookmarklet.min.js

