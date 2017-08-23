/* */ 
(function(Buffer) {
  var Buffer = require('safe-buffer').Buffer;
  var MD5 = require('md5.js');
  function EVP_BytesToKey(password, salt, keyLen, ivLen) {
    if (!Buffer.isBuffer(password))
      password = Buffer.from(password, 'binary');
    if (salt) {
      if (!Buffer.isBuffer(salt))
        salt = Buffer.from(salt, 'binary');
      if (salt.length !== 8)
        throw new RangeError('salt should be Buffer with 8 byte length');
    }
    var key = Buffer.alloc(keyLen);
    var iv = Buffer.alloc(ivLen);
    var tmp = Buffer.alloc(0);
    while (keyLen > 0 || ivLen > 0) {
      var hash = new MD5();
      hash.update(tmp);
      hash.update(password);
      if (salt)
        hash.update(salt);
      tmp = hash.digest();
      var used = 0;
      if (keyLen > 0) {
        var keyStart = key.length - keyLen;
        used = Math.min(keyLen, tmp.length);
        tmp.copy(key, keyStart, 0, used);
        keyLen -= used;
      }
      if (used < tmp.length && ivLen > 0) {
        var ivStart = iv.length - ivLen;
        var length = Math.min(ivLen, tmp.length - used);
        tmp.copy(iv, ivStart, used, used + length);
        ivLen -= length;
      }
    }
    tmp.fill(0);
    return {
      key: key,
      iv: iv
    };
  }
  module.exports = EVP_BytesToKey;
})(require('buffer').Buffer);
