#!/bin/bash
######################################################################
# Development Server Reset Script
#
# Project: Code Review
# By:      Steamed Pears
#
# This script should reset the state of the development environment.
######################################################################

bin/stop_dev.sh 2> /dev/null
git clean -qxdff
