#!/bin/bash
######################################################################
# Development Server Reset Script
#
# Project: Code Review
# By:      Steamed Pears
#
# This script should reset the state of the development environment.
######################################################################

######################################################################
# Configuration

DB_INFO_FILE="models/db_info.js"
DEV_DB="models/data.db"
NODE_MODULES="node_modules"

######################################################################
# kill the server if running
bin/stop_dev.sh

######################################################################
# reset the client side
bin/reset_client.sh

######################################################################
# delete metadata and data so db rebuilds next start
cd src/server
rm -f $DB_INFO_FILE
rm -f $DEV_DB

######################################################################
# delete node modules so modules reinstalled next start
rm -rf $NODE_MODULES
