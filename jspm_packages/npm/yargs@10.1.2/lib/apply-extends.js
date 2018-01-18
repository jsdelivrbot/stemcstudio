/* */ 
'use strict';
const fs = require('fs');
const path = require('path');
const YError = require('./yerror');
let previouslyVisitedConfigs = [];
function checkForCircularExtends(path) {
  if (previouslyVisitedConfigs.indexOf(path) > -1) {
    throw new YError(`Circular extended configurations: '${path}'.`);
  }
}
function getPathToDefaultConfig(cwd, pathToExtend) {
  return path.resolve(cwd, pathToExtend);
}
function applyExtends(config, cwd) {
  let defaultConfig = {};
  if (config.hasOwnProperty('extends')) {
    if (typeof config.extends !== 'string')
      return defaultConfig;
    const isPath = /\.json$/.test(config.extends);
    let pathToDefault = null;
    if (!isPath) {
      try {
        pathToDefault = require.resolve(config.extends);
      } catch (err) {}
    } else {
      pathToDefault = getPathToDefaultConfig(cwd, config.extends);
    }
    if (!pathToDefault && !isPath)
      return config;
    checkForCircularExtends(pathToDefault);
    previouslyVisitedConfigs.push(pathToDefault);
    defaultConfig = isPath ? JSON.parse(fs.readFileSync(pathToDefault, 'utf8')) : require(config.extends);
    delete config.extends;
    defaultConfig = applyExtends(defaultConfig, path.dirname(pathToDefault));
  }
  previouslyVisitedConfigs = [];
  return Object.assign({}, defaultConfig, config);
}
module.exports = applyExtends;
