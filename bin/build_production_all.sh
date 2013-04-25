#!/bin/bash

# Copyright by Steamed Pears, 2013. For licensing information, 
# see the LICENCE file in the root directory of this project.

###############################################################################
# Configuration                                                               #
###############################################################################

CLIENT_DIR="$PWD/src/client"
CLIENT_SCRIPTS_DIR="$CLIENT_DIR/scripts"

BOOKMARKLET_DIR="$PWD/src/bookmarklet"

#Allow production-build directory to be specified by command line args
# Defaults to `production/`
TARGET=${TARGET:-$PWD/production}

#Temporary folder for the build
TARGET_TMP=`mktemp -d -t codereview-XXXX`

RJS="$TARGET_TMP/node_modules/requirejs/bin/r.js"
RJS_BUILD_PROFILE="$CLIENT_SCRIPTS_DIR/app.build.js"

HELPERS="bin/helpers.sh"
source $HELPERS

###############################################################################
# Sanity check                                                                #
###############################################################################

for DIR in "$CLIENT_DIR" "$BOOKMARKLET_DIR"; do
  test -d "$DIR"
  exitIfFailed "Cannot find" `basename "$DIR"` ". Try running this \
    script from the project root."
done

type uglifyjs >/dev/null 2>&1
exitIfFailed "UglifyJS is not installed."

###############################################################################
# Let's get down to business                                                  #
###############################################################################

echo "Deleting previous build"
rm -rf "$TARGET"/*

echo "Building vanilla client"
bin/install_client.sh

echo "Installing r.js"
cd "$TARGET_TMP"; npm install requirejs

echo "Optimizing client using r.js, saving to `basename $TARGET_TMP`"
cd "$CLIENT_DIR"; node "$RJS" -o "$RJS_BUILD_PROFILE" dir="$TARGET_TMP"

echo "Copying important client files to `basename $TARGET`"
cp -av "$TARGET_TMP/scripts"  "$TARGET/scripts"
cp -av "$TARGET_TMP/styles"  "$TARGET/styles"
cp -av "$TARGET_TMP/images"  "$TARGET/images"
cp -av "$TARGET_TMP/index.html"  "$TARGET/index.html"

echo "Resetting Bookmarklet"
cd "$BOOKMARKLET_DIR"; make reset

echo "Building Bookmarklet for production"
cd "$BOOKMARKLET_DIR"; make TARGET="$TARGET/bookmarklet" build-production 

echo "Deleting TARGET_TMP"
rm -rf "$TARGET_TMP"

echo "The production ready build is located at $TARGET."

# vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80:
