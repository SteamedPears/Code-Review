#!/bin/bash

# Copyright by Steamed Pears, 2013. For licensing information, 
# see the LICENCE file in the root directory of this project.

###############################################################################
# Configuration																																#
###############################################################################

#TODO
# test if running in bookmarklet root
# test if project has been built before minifying

#Needs directory to build 
if [ -z "$1" ];
then
	echo "Please choose a TARGET directory as a command line argument"
	exit 1
fi

TARGET=$1
VENDORS="$TARGET/vendors"

###############################################################################
# Building for production													                            #
###############################################################################

echo "Creating TARGET directories"
mkdir -pv $TARGET
mkdir -pv $VENDORS

echo "Minifying bookmarklet.js"
cat bookmarklet.js |\
	sed 's/\(g\.debug\s*=\s*\)true/\1false/' |\
	uglifyjs \
	> "$TARGET"/bookmarklet.min.js


for VENDOR in `ls vendors`;
do
	echo "Minifying vendors/$VENDOR"
	uglifyjs -o "$TARGET/vendors/$VENDOR" "vendors/$VENDOR"
done

#TODO Minify CSS
