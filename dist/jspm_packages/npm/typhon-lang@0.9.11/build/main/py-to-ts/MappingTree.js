/* */ 
(function(process) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var asserts_1 = require('../pytools/asserts');
  var MappingTree = (function() {
    function MappingTree(source, target, children) {
      this.children = children;
      asserts_1.assert(source, "source must be defined");
      asserts_1.assert(target, "target must be defined");
      this.source = source;
      this.target = target;
    }
    MappingTree.prototype.offset = function(rows, cols) {
      if (this.target) {
        this.target.offset(rows, cols);
      }
      if (this.children) {
        for (var _i = 0,
            _a = this.children; _i < _a.length; _i++) {
          var child = _a[_i];
          child.offset(rows, cols);
        }
      }
    };
    return MappingTree;
  }());
  exports.MappingTree = MappingTree;
})(require('process'));
