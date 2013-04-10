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

source bin/helpers.sh
ROOT_DIR=`pwd`
TIME=`timestamp`

######################################################################
# Configuration

if $PROD; then
  NPM=$PREFIX/usr/bin/npm
  NODE=$PREFIX/usr/bin/node
  DB=$PREFIX/bin/redis-server
  export SERVER_CONF=$ROOT_DIR/etc/server_prod.yml
  export NODE_ENV=
else
  NPM=npm
  NODE=node
  DB=redis-server
  export SERVER_CONF=$ROOT_DIR/etc/server_devel.yml
  export NODE_ENV=development
fi

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

######################################################################
# Silently stop server, in case it's running
bin/stop.sh &> /dev/null

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

$NODE $INDEX_SCRIPT &> $SERVER_LOG.$TIME.log &

echo $! > $SERVER_PID
ln -s -f $SERVER_LOG.$TIME.log $SERVER_LINK
