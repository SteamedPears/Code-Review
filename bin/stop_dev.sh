#!/bin/bash
######################################################################
# Development Server Stop Script
#
# Project: Code Review
# By:      Steamed Pears
#
# This script should stop a development server serving the front and
# back ends via node.
######################################################################

######################################################################
# Configuration

SERVER_PID="var/server.pid"
DB_PID="var/db.pid"

######################################################################
# Stop server and db

kill -SIGKILL $(< $SERVER_PID)
kill -SIGKILL $(< $DB_PID)
