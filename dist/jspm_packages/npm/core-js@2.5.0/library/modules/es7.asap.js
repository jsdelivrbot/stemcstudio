/* */ 
(function(process) {
  var $export = require('./_export');
  var microtask = require('./_microtask')();
  var process = require('./_global').process;
  var isNode = require('./_cof')(process) == 'process';
  $export($export.G, {asap: function asap(fn) {
      var domain = isNode && process.domain;
      microtask(domain ? domain.bind(fn) : fn);
    }});
})(require('process'));
