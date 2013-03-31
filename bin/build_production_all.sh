#!/bin/bash

###############################################################################
# Configuration																																#
###############################################################################

HELPERS="bin/helpers.sh"
CLIENT_DIR="$PWD/src/client"
CLIENT_SCRIPTS_DIR="$CLIENT_DIR/scripts"

BOOKMARKLET_DIR="$PWD/src/bookmarklet"

#Allow production-build directory to be specified by command line args
TARGET="$PWD/$1"
if [ -z "$1" ]
then
	#Defaults to `production/`
	TARGET="$PWD/production"
fi
#Temporary folder for the build
TARGET_TMP="$TARGET""_tmp"

RJS="$TARGET_TMP/node_modules/requirejs/bin/r.js"
RJS_BUILD_PROFILE="$CLIENT_SCRIPTS_DIR/app.build.js"

source $HELPERS

###############################################################################
# Sanity check																																#
###############################################################################

for DIR in "$CLIENT_DIR" "$BOOKMARKLET_DIR"; do
	test -d "$DIR"
	echo "Cannot find" `basename "$DIR"` "."
	exitIfFailed "Please run this file from the root directory of the project"
done

type uglifyjs >/dev/null 2>&1
exitIfFailed "UglifyJS is not installed"

###############################################################################
# Let's get down to business																									#
###############################################################################

echo "Resetting client"
bash bin/reset_client.sh

echo "Building vanilla client"
bash bin/install_client.sh

echo "Deleting previous build"
rm -rf "$TARGET"
rm -rf "$TARGET_TMP"

echo "Building production version to $TARGET"

echo "Creating TARGET directory"
mkdir -p "$TARGET"
mkdir -p "$TARGET_TMP"

echo "Installing r.js"
cd "$TARGET_TMP"; npm install requirejs

echo "Optimizing client using r.js"
cd "$CLIENT_DIR"; node "$RJS" -o "$RJS_BUILD_PROFILE" dir="$TARGET"
