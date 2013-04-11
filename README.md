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


# Documentation

Most documentation is in comments in the code. These are the key exceptions:
* Installation instructions are in `./INSTALL.md`.
* Bookmarklet instructions are in `./src/bookmarklet/README.md`.
* End-user documentation currently consists of the tutorial only.
* The web-facing API is described in `./http_api`.

All remaining [required documentation](http://homeostasis.scs.carleton.ca/wiki/index.php/WebFund_2013W_Final_Project)
is located in the `./docs` folder. This folder is included as a git submodule to
avoid polluting the project's commit history.

All of Code Review's code adheres to a strict
[coding standard](https://github.com/CarletonU-COMP2406-W2013/Steamed-Pears/wiki/Coding-Standards)
and
[development process](https://github.com/CarletonU-COMP2406-W2013/Steamed-Pears/wiki/Process). 


# Milestones

The recommended milestones do not make as much sense for our project as for a
completely new project, because we already have a working prototype.

These correspond to the Fridays beginning 8 February 2013, skipping 22
February (Reading Week).

1. Architecture design and goals for Sprint 1.
2. Sprint 1.
3. Goals for Sprint 2.
4. Sprint 2.
5. Goals for Sprint 3.
6. Sprint 3.
7. Goals for Sprint 4 and draft documentation.
8. Sprint 4.
9. Final code and documentation.


# Administrivia

COMP 2406 W2013 Project for Steamed Pears

TA: Furkan Alaca (@falaca)

By Peter Simonyi, Christian Delahousse, Simon Pratt, and Bheesham Persaud.

vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80:
