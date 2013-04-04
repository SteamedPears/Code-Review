##############################################################################
# Helper functions                                                           #
##############################################################################
# To be sourced into other bash scripts

function download() {
  filename=`basename $1`
  if [ -f $filename ]; then
    return 0
  fi
  echo "Installing $filename..."
  wget --quiet $1
}

function exitIfFailed() {
  ret=$?
  if [ $ret -ne 0 ]; then
    echo $1
    exit $ret
  fi
}

# vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80:
