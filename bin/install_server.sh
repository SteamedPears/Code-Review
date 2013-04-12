#!/bin/bash
######################################################################
# Server install script
#
# Project: Code Review
# By:      Steamed Pears
#
# Downloads and installs:
#   - nodejs and npm
#   - redis-server
######################################################################

ROOT_DIR=`pwd`

######################################################################
# Configuration
######################################################################

# A valid node version
NODE_VERSION=0.10.2

# Can be either 64 or 86
NODE_ARCH=64

# Redis version
REDIS_VERSION=2.6.12

######################################################################

TMP=${TEMP:-${TMP:-/tmp}}
BIN=$PREFIX/usr/bin

echo Creating directories...
mkdir -p $TMP 
mkdir -p $BIN

NODE_F=node-v$NODE_VERSION-linux-x$NODE_ARCH
REDIS_F=redis-$REDIS_VERSION

cd $TMP

######################################################################
# nodejs and npm
######################################################################

echo Installing component: node.js

echo - downloading...
wget -O $TMP/node.tar.gz -q http://nodejs.org/dist/v$NODE_VERSION/$NODE_F.tar.gz

echo - extracting...
tar -xf node.tar.gz
rm node.tar.gz

echo - installing...
cp $TMP/$NODE_F/bin/node $BIN/node
cp $TMP/$NODE_F/bin/npm $BIN/npm

echo - complete!

######################################################################
# redis-server
######################################################################

echo Installing component: redis

echo - downloading...
wget -O redis.tar.gz -q http://redis.googlecode.com/files/$REDIS_F.tar.gz

echo - extracting redis...
tar -xf redis.tar.gz
rm redis.tar.gz

cd $TMP/$REDIS_F 

echo - compiling redis...
make
make PREFIX=$PREFIX install

echo - installing redis...
cp $TMP/$REDIS_F/src/redis-server $BIN/redis-server
cp $TMP/$REDIS_F/src/redis-cli $BIN/redis-cli

echo - complete!

echo Cleaning up...
rm -rf $TMP/$REDIS_F
rm -rf $TMP/$NODE_F

echo The installation has been successful
