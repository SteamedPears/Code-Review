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
NODE_EXE=REPLACE_NODE_EXE
NPM_EXE=REPLACE_NPM_EXE
BUILD_DB_SCRIPT="models/build_db.js"
TEST_DATA_SCRIPT="models/test_data.js"
INDEX_SCRIPT="index.js"

######################################################################
# Configuration
NODE=node

DB=redis-server
DB_DIR=$ROOT_DIR/var/db/
DB_OPTIONS="--dir $DB_DIR"
DB_CONF=$ROOT_DIR/etc/redis.conf
DB_LOG=$ROOT_DIR/var/logs/db
DB_LINK=$ROOT_DIR/var/db.log
DB_PID=$ROOT_DIR/var/db.pid

SERVER_PID=$ROOT_DIR/var/server.pid
SERVER_LINK=$ROOT_DIR/var/server.log
SERVER_LOG=$ROOT_DIR/var/logs/server
SERVER_DIR=$ROOT_DIR/src/server

echo "Installing needed packages"
$NPM_EXE install

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
if [ "`npm outdated 2> /dev/null`" ]; then
    echo "Updating server dependencies"
    npm update
fi

######################################################################
# Database start
echo "Starting database"
$DB $DB_CONF $DB_OPTIONS &> $DB_LOG.$TIME.log &
echo $! > $DB_PID
ln -s -f $DB_LOG.$TIME.log $DB_LINK

######################################################################
# Server initialization
echo "Starting development server"
NODE_ENV=development $NODE $INDEX_SCRIPT &> $SERVER_LOG.$TIME.log &
echo $! > $SERVER_PID
ln -s -f $SERVER_LOG.$TIME.log $SERVER_LINK
