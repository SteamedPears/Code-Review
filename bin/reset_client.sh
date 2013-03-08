#!/bin/bash

######################################################################
# Configuration

CLIENT_DIR="src/client"
LIB_DIR="scripts/lib/"

######################################################################
# Check valid starting directory

if [ ! -d $CLIENT_DIR ]; then
	echo "Please run this file from the root directory of the project"
	exit 1
fi

######################################################################
# remove all files in the lib directory

cd $CLIENT_DIR
cd $LIB_DIR
rm -rf *
