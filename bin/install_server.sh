#!/bin/bash
######################################################################
# Development server install script
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

NODE_F=node-v$NODE_VERSION-linux-x$NODE_ARCH
NODE_BIN=/tmp/node/bin/node
NPM_BIN=/tmp/node/bin/npm

REDIS_F=redis-$REDIS_VERSION
REDIS_BIN=/tmp/redis/src/redis-server

cd /tmp

######################################################################
# nodejs and npm
######################################################################

echo Installing component: node.js

echo - downloading...
wget -O /tmp/node.tar.gz -q http://nodejs.org/dist/v$NODE_VERSION/$NODE_F.tar.gz

echo - extracting...
tar -xf node.tar.gz

echo - installing...
mkdir -p $PREFIX/usr/bin
cp /tmp/$NODE_F/bin/node $PREFIX/usr/bin/node
cp /tmp/$NODE_F/bin/npm $PREFIX/usr/bin/npm

echo - complete!

######################################################################
# redis-server
######################################################################

echo Installing component: redis

echo - downloading...
wget -O redis.tar.gz -q http://redis.googlecode.com/files/$REDIS_F.tar.gz

echo - extracting redis...
tar -xf redis.tar.gz
cd /tmp/$REDIS_F 

echo - compiling redis...
make

echo - installing redis...
cp /tmp/$REDIS_F/src/redis-server $PREFIX/usr/bin/redis-server

echo - complete!

echo The installation has been successful
