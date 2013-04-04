#!/bin/bash
######################################################################
# Development server install script
#
# Project: Code Review
# By:      Steamed Pears
#
# This script should install nodejs, and use the default configuration
# for npm.
######################################################################

ROOT_DIR=`pwd`

######################################################################
# Configuration
######################################################################

CLIENT_TARGET_DIR=~/webapps/cr_front

BIN_DIR=$ROOT_DIR/bin/exe

# A valid node version
NODE_VERSION=0.10.2

# Can be either 64 or 86
NODE_ARCH=64

REDIS_VERSION=2.6.12

######################################################################

NODE_F=node-v$NODE_VERSION-linux-x$NODE_ARCH
NODE_BINS=$BIN_DIR/node/bin

REDIS_F=redis-$REDIS_VERSION

cd $BIN_DIR

echo Installing component: node.js

echo - downloading...
wget -q http://nodejs.org/dist/v$NODE_VERSION/$NODE_F.tar.gz

echo - extracting...
tar -xf $NODE_F.tar.gz -C $BIN_DIR/
rm $NODE_F.tar.gz
mv -f $NODE_F node

echo - complete!

echo Installing component: redis

echo - downloading...
wget -q http://redis.googlecode.com/files/$REDIS_F.tar.gz

echo Download complete, extracing redis
tar -xf $REDIS_F.tar.gz -C $BIN_DIR/
rm $REDIS_F.tar.gz
mv -f $REDIS_F redis
cd $BIN_DIR/redis 

echo Compiling redis
make

echo Copying client files into the specified directory 
cp -R $ROOT_DIR/src/client/* $CLIENT_TARGET_DIR/
