/* */ 
var core = require('../../modules/_core');
var $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
module.exports = function stringify(it) {
  return $JSON.stringify.apply($JSON, arguments);
};
