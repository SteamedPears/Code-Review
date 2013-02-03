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

PID_FILE="var/server.pid"

######################################################################
# Stop server

kill -9 `cat $PID_FILE`

