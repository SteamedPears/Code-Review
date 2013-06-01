# Code Review

Code Review is for reviewing code.
Someone uploads code; then people can comment on selections of the code.
Later reviewers can see previous comments, too, and comment on those, forming
comment threads.

Code Review comprises three major components:
* The "server" is a Node.js server, with Connect middleware. It does very little
  work, mostly acting as an interface to a Redis data structure server.
* The "client" is the web front end, running in a user's browser. It displays
  and allows editing text with CodeMirror. Several common web libraries,
  including jQuery and Bootstrap, make coding the user interface easier.
* The "bookmarklet" is a simple bookmarklet that loads a module for submitting
  to Code Review, and a module for extracting the code from a page (currently
  just Readability).

See http://review.steamedpears.com for the prototype.


# Authors

* Alexis Beingessner
* Christian Delahousse
* Bheesham Persaud
* Simon Pratt
* Peter Simonyi


vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80:
