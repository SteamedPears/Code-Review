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

DB_INFO_FILE="src/server/models/db_info.js"
PID_FILE="var/server.pid"
LOG_FILE="var/server.log"

######################################################################
# Database setup

if [ ! -f $DB_INFO_FILE ]; then
    echo "DB info file not found, installing sqlite version"
    cp $DB_INFO_FILE.sqlite $DB_INFO_FILE

    echo "Building needed databases"
    # TODO: build databases
fi

######################################################################
# Server initialization

ROOT_DIR=`pwd`

cd src/server/
npm install
NODE_ENV=development node index.js \
    1>> $ROOT_DIR/$LOG_FILE 2>> $ROOT_DIR/$LOG_FILE &
echo $! > $ROOT_DIR/$PID_FILE
