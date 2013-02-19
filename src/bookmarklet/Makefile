
.PHONY=main

main:
	python -m SimpleHTTPServer

lint:
	jshint bookmarklet.js

readability:
	cat ./vendors_src/readability_header.js \
			./lib/readabilitySAX/readabilitySAX.js \
			./lib/readabilitySAX/browsers/DOMasSAX.js \
			./vendors_src/readability_footer.js \
			> ./vendors/readability.js
