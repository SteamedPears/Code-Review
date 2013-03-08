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
# Install dependencies

cd $LIB_DIR

for f in $RAW_DEPS; do
	filename=`echo $f | sed -e 's!.*/!!'`
	if [ -f $filename ]; then
		continue
	fi
	wget $f
	if [ $? -ne 0 ]; then
		echo "There was an error getting $f"
		exit 4
	fi
done

for f in $ZIP_DEPS; do
	filename=`echo $f | sed -e 's!.*/!!'`
	if [ -f $filename ]; then
		continue
	fi
	wget $f
	if [ $? -ne 0 ]; then
		echo "There was an error getting $f"
		exit 5
	fi
	unzip $filename
	if [ $? -ne 0 ]; then
		echo "There was an error unzipping $filename"
		exit 6
	fi
done
