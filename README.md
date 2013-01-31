# Code Review

Code Review is for reviewing code.
Someone uploads code; then people can comment on selections of the code.
Later reviewers can see previous comments, too, and comment on those, forming
comment threads.

* The web client will request resources and make JSON queries. It will render
the UI.
* The web server will respond to JSON queries with JSON descriptions of the
stored data, and translate JSON commands to a database command language for the
backend store. Also, it will serve web resources -- hence the name.
* The backend store will keep the code and comments. It may also store extra
data such as reserved usernames, if we implement that.

See http://codereview.steamedpears.com for the prototype.


# Milestones

The recommended milestones do not make as much sense for our project as for a
completely new project, because we already have a working prototype.

These correspond to the Thursdays beginning 7 February 2013, skipping 21
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

TA: Josh Beltram

By Peter Simonyi, Christian Delahousse, Simon Pratt, and Bheesham Persaud.

