#!/bin/bash
######################################################################
# Server Stop Script
#
# Project: Code Review
# By:      Steamed Pears
#
# This script should kill node and redis-server.
######################################################################

######################################################################
# Configuration

SERVER_PID="var/server.pid"
DB_PID="var/db.pid"

######################################################################
# Stop server and db

kill -SIGTERM $(< $SERVER_PID)
kill -SIGTERM $(< $DB_PID)
