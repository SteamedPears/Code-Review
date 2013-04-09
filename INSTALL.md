Installation Instructions
=========================

Development
-----------

Requirements:
(tested versions appear in parentheses)

* unix (OS X 10.6.8, OS X 10.8.2, Fedora 18, Ubuntu 12.10)
* node (v0.8.17, v0.8.20)
* npm (1.2.11)
* node-gyp (v0.8.4)
* redis (2.6.10)
* gcc (4.7.2)
* GNU Wget (1.14)


Installation Instructions:

1. open a terminal
2. `git clone --recursive-submodules git@github.com:CarletonU-COMP2406-W2013/Steamed-Pears.git CodeReview`
3. Run `bin/install_server.sh`

This will clone the project into a folder and initialize its git submodules.


Usage Instructions:

1. cd into CodeReview, the root directory of the project.
2. Run `bin/start_dev.sh`

Now you should be able to access the server running on localhost:8080.

If you would like to stop the server, follow the above instructions
but instead run bin/stop_dev.sh as the final step.

If you would like to restart the server, simply run bin/start_dev.sh again.

If something has gone horribly wrong, follow the above instructions
but instead run bin/reset_dev.sh as the final step.  WARNING!!!  This
will destroy your development database and delete the locally
installed npm modules.  This is the best way to bring your
installation back to a known state, but you will lose all the data in
your copy of the application.


Production
----------

Requirements:

* unix (Server uses CentOS release 5.8 (Final))
* node (Server uses v0.6.18)
* nginx (Server uses ??)
* Redis (Server uses 2.6.10)


Instructions:

(Assuming ssh'd into server, pulled latest repo and reading this.)

1. cd to root directory (CodeReview)
2. Run `bin/update_server.sh`

vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80:
