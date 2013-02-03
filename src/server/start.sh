#!/bin/bash

# absolute path to the node executable
NODE=/home/sdp/bin/node

# absolute path to the index script
APP=/home/sdp/webapps/review_dynamic/index.js

# a file in which to store a running pid
SERVER_FILE=server.pid

# a file in which to store server logs
SERVER_LOG=server.log

# stop if already running
if [[ -f $SERVER_FILE ]]; then
    kill -9 `cat server.pid`
    rm server.pid
fi

# start server
echo "Review server started at `date`" >> $SERVER_LOG
NODE_ENV=production $NODE $APP >> $SERVER_LOG 2>> $SERVER_LOG &
echo $! > $SERVER_FILE # write pid to file

