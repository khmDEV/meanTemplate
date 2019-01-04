
module.exports = (function(module) {

  /*
   * Public functions
   */
   module.hashing=hashing;
   module.randomSecret=randomSecret;
   
  /*
   * Encript
   */
  var crypto = require('crypto');

  function hashing(val) {
    var hashFunction = crypto.createHash('sha256');
    hashFunction.update(val, 'base64');
    return hashFunction.digest().toJSON().toString();
  }

  function randomSecret() {
    return crypto.randomBytes(48).toJSON().toString();
  }

  return module;
})({});
