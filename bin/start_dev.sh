#!/bin/bash
######################################################################
# Development Server Start Script
#
# Project: Code Review
# By:      Steamed Pears
#
# This script should start a development server serving the front and
# back ends via node.
######################################################################

ROOT_DIR=`pwd`

######################################################################
# Configuration
TIMESTAMP_FORM="+%Y-%m-%dT%H%M%S%Z"
NODE_EXE="node"
PID_FILE=$ROOT_DIR/var/server.pid
LATEST_LINK=$ROOT_DIR/var/server.log
LOG_FILE=$ROOT_DIR/var/logs/server
SERVER_DIR=$ROOT_DIR/src/server
DB_INFO_FILE=$SERVER_DIR/models/db_info.js
BUILD_DB_SCRIPT=$SERVER_DIR/models/build_db.js
TEST_DATA_SCRIPT=$SERVER_DIR/models/test_data.js
INDEX_SCRIPT=$SERVER_DIR/index.js

######################################################################
# Silently stop server, in case it's running
bin/stop_dev.sh &> /dev/null

######################################################################
# Install Client-Side
bin/install_client.sh
if [ $? -ne 0 ]; then
	echo "There was an error resolving dependencies"
	exit 1
fi

######################################################################
# Install needed packages
cd $SERVER_DIR
OUTDATED=`npm outdated 2> /dev/null`
if [ ${#OUTDATED} -ne 0 ]; then
    echo "Updating server dependencies"
    npm udpate
fi

######################################################################
# Database setup
if [ ! -f $DB_INFO_FILE ]; then
    echo "DB info file not found, installing sqlite version"
    cp $DB_INFO_FILE.sqlite $DB_INFO_FILE

    echo "Building needed databases"
    $NODE_EXE $BUILD_DB_SCRIPT

    echo "Inserting test data"
    $NODE_EXE $TEST_DATA_SCRIPT
fi

######################################################################
# Server initialization
echo "Starting development server"
TIME=`date $TIMESTAMP_FORM`
NODE_ENV=development $NODE_EXE $INDEX_SCRIPT &> $LOG_FILE.$TIME.log &
echo $! > $PID_FILE
ln -s -f $LOG_FILE.$TIME.log $LATEST_LINK
