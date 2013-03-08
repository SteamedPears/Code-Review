#!/bin/bash

######################################################################
# Configuration

ROOT_DIR=$PWD
CLIENT_DIR="$ROOT_DIR/src/client"
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
	echo "Downloading $filename..."
	wget --quiet $f
}

function unzipCarefully() {
	filename=`basename $1`
	if [ -d `basename -s .zip $f` ]; then
		return 0
	fi
	echo "Unzipping $filename..."
	unzip -q $filename
}

function exitIfFailed() {
	ret=$?
	if [ $ret -ne 0 ]; then
		echo $1
		exit $ret
	fi
}

######################################################################
# Check valid starting directory

if [ ! -d $CLIENT_DIR ]; then
	echo "Please run this file from the root directory of the project"
	exit 1
fi

######################################################################
# Get dependencies

if [ ! -f $RAW_DEPS_FILE ]; then
	echo "$RAW_DEPS_FILE not found"
	exit 2
fi

if [ ! -f $ZIP_DEPS_FILE ]; then
	echo "$ZIP_DEPS_FILE not found"
	exit 3
fi

######################################################################
# Install dependencies

cd $LIB_DIR

for f in `cat $RAW_DEPS_FILE`; do
	download $f
	exitIfFailed "Failed to get $f"
done

for f in `cat $ZIP_DEPS_FILE`; do
	download $f
	exitIfFailed "Failed to get $f"
	unzipCarefully $f
	exitIfFailed "There was an error unzipping `basename $f`"
done
