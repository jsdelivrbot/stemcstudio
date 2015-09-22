# Build
# -----

# Why don't I see this?
echo $DEPLOYMENT_SOURCE

# 1. Select node version
# selectNodeVersion

# 2. NPM
if [ -e "package.json" ]; then
  echo Skipping NPM install
  # npm install
  # eval $NPM_CMD install
  # npm install
  # exitWithMessageOnError "npm failed"
fi

# 3. Bower
if [ -e "bower.json" ]; then
  echo Skipping Bower install
  # bower install
  #./node_modules/.bin/bower install
  # exitWithMessageOnError "npm failed"
fi

# 4. Run Lineman
# Why can't I make "$DEPLOYMENT_SOURCE/Gruntfile.js" work? 
if [ -e "Gruntfile.js" ]; then
  # Specify `--no-color` as the first argument if it causes trouble.
  lineman clean
  lineman build
  lineman run
  # exitWithMessageOnError "lineman failed"
fi

