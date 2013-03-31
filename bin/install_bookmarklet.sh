#!/bin/bash

###############################################################################
# Configuration
###############################################################################
 
HELPERS="bin/helpers.sh"
BOOKMARKLET_DIR="$PWD/src/bookmarklet"

source $HELPERS 

###############################################################################
# Sanity check
###############################################################################

test -d "$BOOKMARKLET_DIR"
exitIfFailed "Please run this file from the root directory of the project"

###############################################################################
# Main
###############################################################################

#See `$BOOKMARKLET_DIR`/README for more details
cd $BOOKMARKLET_DIR; make install
