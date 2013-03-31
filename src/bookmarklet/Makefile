# Copyright by Steamed Pears, 2013. For licensing information, 
# see the LICENCE file in the root directory of this project.

# Root folder where the bookmarklet will be built. Typically, this would be the
# folder that would be pushed to production.
TARGET=../client/bookmarklet

# Where raw dependencies/vendor code are stored. This folder is populated by the
# getvendor target
LIB=lib

# Where the code that will wrap vendor deps or build them will be stored
VENDORS_SRC=vendors_src

# Where vendors are built to. 
VENDORS=vendors

###############################################################################
# BUILDING
###############################################################################

#Initialize the bookmarklet after cloning Code Review
.PHONY: install
install: reset build

#Build locally (do not move to TARGET)
.PHONY: build-local
build-local: buildvendors

# Build the bookmarklet, compile/wrap the vendors, move everything to the
# TARGET directory. This makes a test build that keeps all debugging code and
# does not minify the source.
.PHONY: build
build: build-local make-target-dirs move-to-target
	cp bookmarklet.js $(TARGET)

# Build the production version of the bookmarklet to $TARGET
.PHONY: build-production
build-production: make-target-dirs buildvendors 
	bin/build_production.sh $(TARGET)


#Reset bookmarklet by deleting all generated files and redownloading dependencies
.PHONY: reset
reset: clean make-local-dirs getvendors 

.PHONY: clean
clean:
	rm -rf *.min.js lib/* vendors/* $(TARGET)

###############################################################################
# VENDORS 
###############################################################################

# Download all the vendors
# TODO: Refactor this target into a separate script which read a text file that
# contains a list of dependencies/vendors.
.PHONY: getvendors
getvendors:
	@echo "Downloading vendors"
	cd $(LIB); git clone git@github.com:fb55/readabilitySAX.git

# Build all the vendors locally. As we get more, add them as target
# dependencies.
.PHONY: buildvendors
buildvendors: readability

# Build the readability vendor
.PHONY: readability
readability:
	@echo "Wrapping $@ and compiling to $(VENDORS)"
	cat $(VENDORS_SRC)/readability_header.js \
			$(LIB)/readabilitySAX/readabilitySAX.js \
			$(LIB)/readabilitySAX/browsers/DOMasSAX.js \
			$(VENDORS_SRC)/readability_footer.js \
			> $(VENDORS)/readability.js

###############################################################################
# HELPERS
###############################################################################

.PHONY: lint
lint:
	jshint bookmarklet.js

.PHONY: make-local-dirs
make-local-dirs:
	mkdir -p $(LIB)
	mkdir -p $(VENDORS)

.PHONY: make-target-dirs
make-target-dirs:
	mkdir -p $(TARGET)
	mkdir -p $(TARGET)/$(VENDORS)

.PHONY: move-to-target
move-to-target:
	cp style.css $(TARGET)
	cp vendors/* $(TARGET)/$(VENDORS)
