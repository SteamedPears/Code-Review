Installation Instructions
=========================

Development
-----------

Requirements:
(tested versions appear in parentheses)

* unix (OS X 10.6.8, OS X 10.8.2, Fedora 18, Ubuntu 12.10)
* node (v0.10.1)
* npm (1.2.11)
* node-gyp (v0.8.4)
* redis (2.6.10)
* gcc (4.7.2)
* GNU Wget (1.14)


Installation Instructions:

1. open a terminal
2. `git clone --recurse-submodules git@github.com:CarletonU-COMP2406-W2013/Steamed-Pears.git CodeReview`
3. cd into `CodeReview`
4. Run `bin/install_server.sh`

This will clone the project into a folder and initialize its git submodules.


Usage Instructions:

1. cd into CodeReview, the root directory of the project.
2. Run `bin/start.sh` 

Now you should be able to access the server running on localhost:8080.

If you would like to stop the server, follow the above instructions
but instead run bin/stop.sh as the final step.

If you would like to restart the server, simply run bin/start.sh again.

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
2. Be sure to copy the client files into your static http folder.
3. Run `bin/install_server.sh`
4. Run `bin/build_production_all.sh`
5. Run `bin/start.sh --prod`

Note that for steps 3 and 5 you may specify a PREFIX which is a prefix
for installing files.  For example, binary executables will be
installed in $PREFIX/bin
  e.g.  `PREFIX="/home/steamed-pears" bin/install_server.sh`

Note that for steps 3 and 4 you may specify a TEMP in which to store
temporary files.
  e.g.  `TEMP="/home/steamed-pears/tmp" bin/install_server.sh`

Note that for step 4 you may specify a TARGET which is where the
production files will be built.
  e.g.  `TARGET="~/webapps/cr_front" bin/build_production_all.sh`

vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80:
