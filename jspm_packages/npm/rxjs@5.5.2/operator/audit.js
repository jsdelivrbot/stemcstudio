/* */ 
(function(process) {
  "use strict";
  var audit_1 = require('../operators/audit');
  function audit(durationSelector) {
    return audit_1.audit(durationSelector)(this);
  }
  exports.audit = audit;
})(require('process'));
