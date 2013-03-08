#!/bin/bash
######################################################################
# Development Server Restart Script
#
# Project: Code Review
# By:      Steamed Pears
#
# This script should stop then start a development server serving the
# front and back ends via node.
######################################################################

bin/stop_dev.sh 2>> /dev/null
bin/start_dev.sh
