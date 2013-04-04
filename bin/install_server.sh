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
TIME=`date +%Y-%m-%dT%H%M%S%Z`

######################################################################
# Configuration
######################################################################
BIN_DIR=$ROOT_DIR/bin/exe

# A valid node version
NODE_VERSION=0.10.2

# Can be either 64 or 86
NODE_ARCH=64

######################################################################

NODE_F=node-v$NODE_VERSION-linux-x$NODE_ARCH
NODE_BINS=$BIN_DIR/node/bin

cd $BIN_DIR
echo Downloading node.js
wget -q http://nodejs.org/dist/v$NODE_VERSION/$NODE_F.tar.gz

echo Download complete, extracting node.js
tar -xf $NODE_F.tar.gz -C $BIN_DIR/
rm $NODE_F.tar.gz
mv $NODE_F node
