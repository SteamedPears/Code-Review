#!/bin/bash
######################################################################
# Sets up a development server
#
# Project: Code Review
# By:      Steamed Pears
#
# This script should reset the state of the development environment.
######################################################################

######################################################################
# Configuration

NODE_VERSION="0.8.20"

# The directory where the node.tar.gz file will be downloaded and
# extracted
HOME_DIR="CHANGEME"
EXTRACT_NODE="CHANGEME"
ROOT_DIR=`pwd`

# Can be x64 or x86
SYSTEM_ARCH="x64"

######################################################################
# Don't touch beyond here. Unless you know what you want to do.
######################################################################

# Make sure that they've edited the configuration above
if [[ "$HOME_DIR" == "CHANGEME" ]]; then
	echo "You need to change the location of your home directory"
	exit
fi
if [[ "$EXTRACT_NODE" == "CHANGEME" ]]; then
	echo "You need to change the location of your home directory"
	exit
fi

NODE_URL="http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-$SYSTEM_ARCH.tar.gz"

# Create the node extraction directory if it does not exist
if [ ! -d "$EXTRACT_NODE" ]; then
	mkdir $EXTRACT_NODE
fi

echo "Downloading version $NODE_VERSION of nodejs"
wget -O "$EXTRACT_NODE/node.tar.gz" "$NODE_URL"

echo "Extracting nodejs"
tar -xf "$EXTRACT_NODE/node.tar.gz" -C "$EXTRACT_NODE"

echo "Removing unneccessary files"
rm -f "$EXTRACT_NODE/node.tar.gz"
mv "$EXTRACT_NODE/node-v$NODE_VERSION-linux-$SYSTEM_ARCH" "$EXTRACT_NODE/node"

NODE_EXE=$EXTRACT_NODE/node/bin/node
NPM_EXE=$EXTRACT_NODE/node/bin/npm

echo "Creating npm configuration, using all default values"
$EXTRACT_NODE/node/bin/npm config ls -l > $HOME_DIR/.npmrc

echo "Replacing references to the node, and npm executables in other script files."
sed --expression "s@REPLACE_NODE_EXE@$NODE_EXE@" \
"$ROOT_DIR/bin/.start_dev.sh" > "$ROOT_DIR/bin/.temp_start_dev.sh"
sed --expression "s@REPLACE_NPM_EXE@$NPM_EXE@" \
"$ROOT_DIR/bin/.temp_start_dev.sh" > "$ROOT_DIR/bin/start_dev.sh"
rm -f "$ROOT_DIR/bin/.temp_start_dev.sh"
chmod +x "$ROOT_DIR/bin/start_dev.sh"
echo "Setup complete, you may now run a start script."
