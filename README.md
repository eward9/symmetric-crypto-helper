# Symmetric Crypto Helper                                                                                                                                                                    
'symmetric-crypto-helper' is a wrapper around the node 'crypto' + 'pbkdf2' packages that provdes a simple API with a default secure configuration for the *AES* algorithm using 256 bit key size and *GCM* block mode of operation.

The motivation for this module is because I have seen a few guides on setting up symmetric crypto that use an insecure configuration. This aims to provide a secure configuration from key generation to message authentication. I also needed to factor out some crypto code on a project I am working on.

My Node/JS isn't perfect so if you see anything wrong feel free to open an issue / PR and let me know. Likewise, if any cryptologists see any mistakes in the configurations, please let me know. The only potential flaw I can currently see is if the same key is used and *generateRandomIv* returns a duplicate that has already been used with the same key.

### Installation

We use the built-in crypto libary, however we currently use the *pbkdf2* package for key generation. I belive the built in libary also provides a pbkdf2 implementation, so I need to look into this and potentially remove the external requirment.

Currently the module is not on NPM, but if there is any interest then I will push it up.

Install the dependencies.

```sh
$ npm install pbkdf2
```

### Example Usage
```javascript
var helper = require('./symmetric-crypto-helper');

// Generate a salt and secret 256 bit AES key using PBKDF2
// the salt does not have to be secret and can be stored in cleartext
var salt = helper.generateSalt();
var key = helper.generateSecretKey256("password", salt);

// Generate an IV and pass it and the key + plaintext to the encrypt routine.
// The encrypt routine uses AES 256 bit with 96 bit IV in GCM mode. It is
// critical that the same IV is never reused with the same key!
var iv = helper.generateRandomIv();
var encrypted = helper.encryptAes256Gcm(
    key,
    iv,
    Buffer.from('Input can be string or buffer.')
  );

if (encrypted.error) {
  // An error has occured, see 'error' for more info and dont continue
  console.log("An error occured during the encryption");
  return;
}

var message = helper.decryptAes256Gcm(
    key,
    iv,
    encrypted.ciphertext,
    encrypted.authenticationTag
  );

if (message.error) {
  // An error has occured, see 'error' for more info and dont continue
  console.log("An error occured during the decryption");
  return;
}

console.log(message.plaintext.toString('utf8'));
```

### Todos

 - Add function to increment an IV / counter for initalizing GCM mode
 - Add unit tests
 - Clean up the code


License
----

MIT

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
