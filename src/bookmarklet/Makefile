
.PHONY=main

TARGET=../client/

main:
	python -m SimpleHTTPServer

lint:
	jshint bookmarklet.js

readability:
	@echo "Compiling $@ to vendor"
	cat ./vendors_src/readability_header.js \
			./lib/readabilitySAX/readabilitySAX.js \
			./lib/readabilitySAX/browsers/DOMasSAX.js \
			./vendors_src/readability_footer.js \
			> ./vendors/readability.js

build:
	@echo "Building project to $(TARGET)"
	cp bookmarklet.js $(TARGET)
	mkdir -p $(TARGET)vendors/
	cp vendors/* $(TARGET)vendors/

clean:
	rm -rf *.min.js $(TARGET)bookmarklet.js $(TARGET)bookmarklet.min.js \
		$(TARGET)vendors/

production:
	cat bookmarklet.js |\
		sed 's/\(g\.debug\s*=\s*\)true/\1false/' |\
		uglify
		> ../client/bookmarklet.min.js
