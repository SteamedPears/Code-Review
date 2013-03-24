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

######################################################################
# Configuration

SERVER_DIR="src/server"
DB_INFO_FILE="models/db_info.js"
PID_FILE="var/server.pid"
LOG_FILE="var/server.log"
ARCHIVE_FILE="var/logs/server.log_"
TIMESTAMP_FILE="var/last_start.time"
NODE_EXE="node"
BUILD_DB_SCRIPT="models/build_db.js"
TEST_DATA_SCRIPT="models/test_data.js"
INDEX_SCRIPT="index.js"

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

ROOT_DIR=`pwd`

cd $SERVER_DIR

echo "Installing needed packages"
npm install

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
# Rotate logs
if [ -f $ROOT_DIR/$TIMESTAMP_FILE ]; then
    TIME=`cat $ROOT_DIR/$TIMESTAMP_FILE`
    mv $ROOT_DIR/$LOG_FILE $ROOT_DIR/$ARCHIVE_FILE.$TIME
fi

######################################################################
# Server initialization

echo Starting development server
NODE_ENV=development $NODE_EXE $INDEX_SCRIPT &> $ROOT_DIR/$LOG_FILE &
echo $! > $ROOT_DIR/$PID_FILE
date +%s > $ROOT_DIR/$TIMESTAMP_FILE
