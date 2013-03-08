#!/bin/bash

######################################################################
# Configuration

LIB_DIR="src/client/scripts/lib"

######################################################################
# Check valid starting directory

if [ ! -d $LIB_DIR ]; then
	echo "Please run this file from the root directory of the project"
	exit 1
fi

######################################################################
# remove all files in the lib directory

rm -rf $LIB_DIR/*
