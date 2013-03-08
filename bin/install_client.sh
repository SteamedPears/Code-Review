#!/bin/bash

######################################################################
# Configuration

CLIENT_DIR="src/client"
LIB_DIR="scripts/lib/"
RAW_DEPS_FILE="raw.deps.dev.txt"
ZIP_DEPS_FILE="zip.deps.dev.txt"

######################################################################
# Check valid starting directory

if [ ! -d $CLIENT_DIR ]; then
	echo "Please run this file from the root directory of the project"
	exit 1
fi

######################################################################
# Get dependencies

cd $CLIENT_DIR

if [ ! -f $RAW_DEPS_FILE ]; then
	echo "$RAW_DEPS_FILE not found"
	exit 2
fi

if [ ! -f $ZIP_DEPS_FILE ]; then
	echo "$ZIP_DEPS_FILE not found"
	exit 3
fi

RAW_DEPS=`cat $RAW_DEPS_FILE`
ZIP_DEPS=`cat $ZIP_DEPS_FILE`

######################################################################
# Helper functions

function extractFilename() {
	sed -e 's!.*/!!' <<< "$1"
}

function download() {
	filename=`extractFilename $1`
	if [ -f $filename ]; then
		return 0
	fi
	echo "Downloading $filename..."
	wget --no-verbose $f >> /dev/null 2>> /dev/null
	return $?
}

function unzipCarefully() {
	filename=`extractFilename $1`
	if [ ! -f $filename ]; then
		return 0
	fi
	echo "Unzipping $filename..."
	unzip -q $filename
	return $?
}

function exitIfFailed() {
	ret=$?
	if [ $ret -ne 0 ]; then
		echo $1
		exit $ret
	fi
}

######################################################################
# Install dependencies

cd $LIB_DIR

for f in $RAW_DEPS; do
	download $f
	exitIfFailed "Failed to get $f"
done

for f in $ZIP_DEPS; do
	download $f
	exitIfFailed "Failed to get $f"
	unzipCarefully $f
	exitIfFailed "There was an error unzipping `extractFilename $f`"
done
