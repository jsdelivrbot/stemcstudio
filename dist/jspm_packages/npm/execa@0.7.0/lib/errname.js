/* */ 
(function(process) {
  'use strict';
  let uv;
  try {
    uv = process.binding('uv');
    if (typeof uv.errname !== 'function') {
      throw new TypeError('uv.errname is not a function');
    }
  } catch (err) {
    console.error('execa/lib/errname: unable to establish process.binding(\'uv\')', err);
    uv = null;
  }
  function errname(uv, code) {
    if (uv) {
      return uv.errname(code);
    }
    if (!(code < 0)) {
      throw new Error('err >= 0');
    }
    return `Unknown system error ${code}`;
  }
  module.exports = (code) => errname(uv, code);
  module.exports.__test__ = errname;
})(require('process'));
