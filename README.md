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

See http://review.steamedpears.com for the prototype.

# Documentation

Our project's documentation is spread out through the project in a component
specific way. Installation instructions for the server side component is located
in `./INSTALL`. All docs relating to building and developing the bookmarklet are
in `./src/bookmarklet/README.md`. Usage instructions for the client component
can be found in the tutorial available to new users.

All of Code Review's code adheres to a strict [coding
standard](https://github.com/CarletonU-COMP2406-W2013/Steamed-Pears/wiki/Coding-Standards).
We've documented our [development
process](https://github.com/CarletonU-COMP2406-W2013/Steamed-Pears/wiki/Process)
and [server
API](https://github.com/CarletonU-COMP2406-W2013/Steamed-Pears/wiki/Server-API).
Please visit the
[wiki](https://github.com/CarletonU-COMP2406-W2013/Steamed-Pears/wiki) for more details.

All remaining [required
documentation](http://homeostasis.scs.carleton.ca/wiki/index.php/WebFund_2013W_Final_Project) is located in the `./docs` folder.

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
