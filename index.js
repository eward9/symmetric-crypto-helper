'use strict';

var pbkdf2 = require('pbkdf2');
var crypto = require('crypto');

function SymmetricCryptoHelper() {

    /**
    * generateSecretKey256 Derives 256 bit symmetric encryption key using
      PBKDF2(Password Based Key Derivation Function 2) with 20k iterations
    * @param  {string} password - secret password used by PBKDF2 to dervice key
    * @param  {string} salt - salt for the PBKDF2 function
    * @return {buffer} Buffer containing the derived key
    */
    this.generateSecretKey256 = function(password, salt) {
        return pbkdf2.pbkdf2Sync(
          password,
          salt,
          20000,
          32,
          'sha512'
        );
    }

    /**
     * generateSalt Generates a random 64 byte salt
     * @return {buffer} Buffer containing the generated salt
     */
    this.generateSalt = function() {
        return crypto.randomBytes(64);
    }

    /**
     * generateRandomIv Generates a random 12 byte initalization vector
     * for use in the GCM block mode of operation. This is the recommended size.
     * It is CRITICAL that the IV for GCM is NEVER reused with the same key.
     * Due to the chance of generating a duplicate in the 96 bit IV being
     * 2n/2=248 (see birthday problem), a random IV is not suitable for gcm
     * as this must be globally unique. If a key is to be reused, this Function
     * should not be used. An increment function will be added to increment a
     * 96 byte value each time a new message is encrypted.
     *
     */
    this.generateRandomIv = function() {
        return crypto.randomBytes(12);
    }

    /**
     * encryptAes256Gcm Encrypts a given plaintext using a provided 256 bit key
     * and 96 bit initalization vector in GCM block mode of operation. This
     * provides encryption and authentication of the message.
     * @param {buffer} key - 256 bit encryption key
     * @param {buffer} iv - 96 bit initalization vector
     * @param {buffer|string} plaintext - plaintext value to encrypt
     * @return {object} Object that represents the ciphertext, IV and
     * authentication tag
     */
    this.encryptAes256Gcm = function(key, iv, plaintext) {
      try {
        if (iv.length != 12) {
          throw ("IV for GCM mode should be 12 bytes");
        }

        if (key.length != 32) {
          throw ("Only 256 bit key size is supported");
        }

        var cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        var ciphertext = Buffer.concat(
          [cipher.update(plaintext, 'utf8'), cipher.final()]
        );
        var tag = cipher.getAuthTag();

        return {
          "error": null,
          "ciphertext": ciphertext,
          "iv": iv,
          "authenticationTag": tag
        };
      }
      catch (err) {
        return {
          "error": err
        };
      }
    }

    /**
     * decryptAes256Gcm Decrypts a given ciphertext using a provided 256 bit key
     * and 96 bit initalization vector in GCM block mode of operation. This
     * provides decryption and authentication of the message.
     * @param {buffer} key - 256 bit encryption key
     * @param {buffer} iv - 96 bit initalization vector
     * @param {buffer} ciphertext - Buffer containing ciphertext to decrypt
     * @param {buffer} authenticationTag - Authenticaiton tag to verify message
     * @return {object} Object holding error details and plaintext message
     */
    this.decryptAes256Gcm = function(key, iv, ciphertext, authenticationTag) {
      try {
        var decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authenticationTag);
        var plaintext = Buffer.concat(
            [decipher.update(ciphertext, 'utf8'), decipher.final()]
        );
        //        return decipher.update(ciphertext, 'binary', 'utf8') + decipher.final('utf8');
        return {
            "error":null,
            "plaintext": plaintext
        };

      }
      catch(err) {
        return {
          "error": err
        };
      }
    }
}

module.exports = new SymmetricCryptoHelper();
