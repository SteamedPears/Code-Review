#!/bin/bash
######################################################################
# Server Start Script
#
# Project: Code Review
# By:      Steamed Pears
#
# This script should start a server serving the front and back ends 
# via node.
######################################################################

ROOT_DIR=`pwd`
TIME=`date +%Y-%m-%dT%H%M%S%Z`

######################################################################
# Configuration
NODE_BIN=$ROOT_DIR/bin/exe/node/bin
NPM=$NODE_BIN/npm
NODE=$NODE_BIN/node

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

INDEX_SCRIPT=$SERVER_DIR/index.js

PROD_CONF=$ROOT_DIR/etc/server_prod.yml
DEVEL_CONF=$ROOT_DIR/etc/server_devel.yml

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
if [ "`$NPM outdated 2> /dev/null`" ]; then
	echo "Updating server dependencies"
	$NPM update
fi

######################################################################
# Database start
echo "Starting database"
$DB $DB_CONF $DB_OPTIONS &> $DB_LOG.$TIME.log &
echo $! > $DB_PID
ln -s -f $DB_LOG.$TIME.log $DB_LINK

######################################################################
# Server initialization
echo "Starting server"

if [[ "$1" == "--prod" ]]; then
	export SERVER_CONF=$PROD_CONF
	export NODE_ENV=
elif [[ -n "$1" ]]; then
	echo "Aborting; unrecognized parameter: $1"
	exit 1;
else
	export SERVER_CONF=$DEVEL_CONF
	export NODE_ENV=development
fi

$NODE $INDEX_SCRIPT &> $SERVER_LOG.$TIME.log &

echo $! > $SERVER_PID
ln -s -f $SERVER_LOG.$TIME.log $SERVER_LINK




