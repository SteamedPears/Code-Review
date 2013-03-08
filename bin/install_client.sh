#!/bin/bash

######################################################################
# Configuration

CLIENT_DIR="$PWD/src/client"
LIB_DIR="$CLIENT_DIR/scripts/lib"
RAW_DEPS_FILE="$CLIENT_DIR/raw.deps.dev.txt"
ZIP_DEPS_FILE="$CLIENT_DIR/zip.deps.dev.txt"

######################################################################
# Helper functions

function download() {
	filename=`basename $1`
	if [ -f $filename ]; then
		return 0
	fi
	echo "Installing $filename..."
	wget --quiet $1
}

function exitIfFailed() {
	ret=$?
	if [ $ret -ne 0 ]; then
		echo $1
		exit $ret
	fi
}

######################################################################
# Sanity check

test -d "$CLIENT_DIR"
exitIfFailed "Please run this file from the root directory of the project"

test -f "$RAW_DEPS_FILE"
exitIfFailed "$RAW_DEPS_FILE not found"

test -f "$ZIP_DEPS_FILE"
exitIfFailed "$ZIP_DEPS_FILE not found"

######################################################################
# Install dependencies

cd "$LIB_DIR"

for f in `cat "$RAW_DEPS_FILE"`; do
	download $f
	exitIfFailed "Failed to get $f"
done

for f in `cat "$ZIP_DEPS_FILE"`; do
	download $f
	exitIfFailed "Failed to get $f"
	unzip -quo `basename $f`
	exitIfFailed "There was an error unzipping `basename $f`"
done
