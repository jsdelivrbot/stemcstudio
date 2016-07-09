System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "@angular/router": "npm:@angular/router@0.2.0",
    "ace2ts/ace-workers": "github:ace2ts/ace-workers@1.0.1",
    "angular": "github:angular/bower-angular@1.5.7",
    "angular-animate": "github:angular/bower-angular-animate@1.5.7",
    "angular-bootstrap": "github:angular-ui/bootstrap-bower@1.3.3",
    "angular-material-icons": "npm:angular-material-icons@0.7.1",
    "angular-sanitize": "github:angular/bower-angular-sanitize@1.5.7",
    "angular-ui-router": "github:angular-ui/ui-router@0.2.18",
    "angular2": "npm:angular2@2.0.0-beta.17",
    "bootstrap": "vendor/bootstrap/dist/js/npm",
    "bootstrap-dialog": "npm:bootstrap-dialog@1.34.6",
    "clipboard": "npm:clipboard@1.5.12",
    "davinci-mathscript": "github:geometryzen/davinci-mathscript@1.0.11",
    "geometryzen/davinci-mathscript": "github:geometryzen/davinci-mathscript@1.0.11",
    "jquery": "npm:jquery@2.2.4",
    "showdown": "npm:showdown@1.4.2",
    "socket.io": "npm:socket.io@1.4.6",
    "socket.io-client": "npm:socket.io-client@1.4.8",
    "ui-select": "npm:ui-select@0.17.1",
    "underscore": "npm:underscore@1.8.3",
    "github:angular-ui/ui-router@0.2.18": {
      "angular": "github:angular/bower-angular@1.5.7"
    },
    "github:angular/bower-angular-animate@1.5.7": {
      "angular": "github:angular/bower-angular@1.5.7"
    },
    "github:angular/bower-angular-sanitize@1.5.7": {
      "angular": "github:angular/bower-angular@1.5.7"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-constants@0.1.0": {
      "constants-browserify": "npm:constants-browserify@0.0.1"
    },
    "github:jspm/nodelibs-crypto@0.1.0": {
      "crypto-browserify": "npm:crypto-browserify@3.11.0"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.5"
    },
    "github:jspm/nodelibs-querystring@0.1.0": {
      "querystring": "npm:querystring@0.2.0"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-string_decoder@0.1.0": {
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "github:jspm/nodelibs-tty@0.1.0": {
      "tty-browserify": "npm:tty-browserify@0.0.0"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "github:jspm/nodelibs-zlib@0.1.0": {
      "browserify-zlib": "npm:browserify-zlib@0.1.4"
    },
    "npm:@angular/router@0.2.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:accepts@1.3.1": {
      "mime-types": "npm:mime-types@2.1.11",
      "negotiator": "npm:negotiator@0.6.0"
    },
    "npm:angular-material-icons@0.7.1": {
      "angular": "npm:angular@1.5.7"
    },
    "npm:angular2@2.0.0-beta.17": {
      "reflect-metadata": "npm:reflect-metadata@0.1.2",
      "rxjs": "npm:rxjs@5.0.0-beta.10",
      "zone.js": "npm:zone.js@0.6.12"
    },
    "npm:asn1.js@4.6.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "bn.js": "npm:bn.js@4.11.3",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.1",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:base64id@0.1.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0"
    },
    "npm:benchmark@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:better-assert@1.0.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "callsite": "npm:callsite@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bindings@1.2.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bn.js@4.11.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:bootstrap-dialog@1.34.6": {
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:browserify-aes@1.0.6": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "buffer-xor": "npm:buffer-xor@1.0.3",
      "cipher-base": "npm:cipher-base@1.0.2",
      "create-hash": "npm:create-hash@1.1.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:browserify-cipher@1.0.0": {
      "browserify-aes": "npm:browserify-aes@1.0.6",
      "browserify-des": "npm:browserify-des@1.0.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.0"
    },
    "npm:browserify-des@1.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "cipher-base": "npm:cipher-base@1.0.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "des.js": "npm:des.js@1.0.0",
      "inherits": "npm:inherits@2.0.1"
    },
    "npm:browserify-rsa@4.0.1": {
      "bn.js": "npm:bn.js@4.11.3",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "constants": "github:jspm/nodelibs-constants@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "randombytes": "npm:randombytes@2.0.3"
    },
    "npm:browserify-sign@4.0.0": {
      "bn.js": "npm:bn.js@4.11.3",
      "browserify-rsa": "npm:browserify-rsa@4.0.1",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "create-hmac": "npm:create-hmac@1.1.4",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "elliptic": "npm:elliptic@6.2.8",
      "inherits": "npm:inherits@2.0.1",
      "parse-asn1": "npm:parse-asn1@5.0.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:browserify-zlib@0.1.4": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "pako": "npm:pako@0.2.8",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "readable-stream": "npm:readable-stream@2.1.4",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:buffer-shims@1.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:buffer-xor@1.0.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:bufferutil@1.2.1": {
      "bindings": "npm:bindings@1.2.1",
      "nan": "npm:nan@2.3.3"
    },
    "npm:cipher-base@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0"
    },
    "npm:clipboard@1.5.12": {
      "good-listener": "npm:good-listener@1.1.7",
      "select": "npm:select@1.0.6",
      "tiny-emitter": "npm:tiny-emitter@1.1.0"
    },
    "npm:cliui@3.2.0": {
      "string-width": "npm:string-width@1.0.1",
      "strip-ansi": "npm:strip-ansi@3.0.1",
      "wrap-ansi": "npm:wrap-ansi@2.0.0"
    },
    "npm:closest@0.0.1": {
      "matches-selector": "npm:matches-selector@0.0.1"
    },
    "npm:code-point-at@1.0.0": {
      "number-is-nan": "npm:number-is-nan@1.0.0"
    },
    "npm:constants-browserify@0.0.1": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:create-ecdh@4.0.0": {
      "bn.js": "npm:bn.js@4.11.3",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "elliptic": "npm:elliptic@6.2.8"
    },
    "npm:create-hash@1.1.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "cipher-base": "npm:cipher-base@1.0.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.1",
      "ripemd160": "npm:ripemd160@1.0.1",
      "sha.js": "npm:sha.js@2.4.5"
    },
    "npm:create-hmac@1.1.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:crypto-browserify@3.11.0": {
      "browserify-cipher": "npm:browserify-cipher@1.0.0",
      "browserify-sign": "npm:browserify-sign@4.0.0",
      "create-ecdh": "npm:create-ecdh@4.0.0",
      "create-hash": "npm:create-hash@1.1.2",
      "create-hmac": "npm:create-hmac@1.1.4",
      "diffie-hellman": "npm:diffie-hellman@5.0.2",
      "inherits": "npm:inherits@2.0.1",
      "pbkdf2": "npm:pbkdf2@3.0.4",
      "public-encrypt": "npm:public-encrypt@4.0.0",
      "randombytes": "npm:randombytes@2.0.3"
    },
    "npm:debug@0.7.4": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tty": "github:jspm/nodelibs-tty@0.1.0"
    },
    "npm:debug@2.2.0": {
      "ms": "npm:ms@0.7.1"
    },
    "npm:delegate@3.0.1": {
      "closest": "npm:closest@0.0.1"
    },
    "npm:des.js@1.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
    },
    "npm:diffie-hellman@5.0.2": {
      "bn.js": "npm:bn.js@4.11.3",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "miller-rabin": "npm:miller-rabin@4.0.0",
      "randombytes": "npm:randombytes@2.0.3",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:elliptic@6.2.8": {
      "bn.js": "npm:bn.js@4.11.3",
      "brorand": "npm:brorand@1.0.5",
      "hash.js": "npm:hash.js@1.0.3",
      "inherits": "npm:inherits@2.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:engine.io-client@1.6.11": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "component-emitter": "npm:component-emitter@1.1.2",
      "component-inherit": "npm:component-inherit@0.0.3",
      "debug": "npm:debug@2.2.0",
      "engine.io-parser": "npm:engine.io-parser@1.2.4",
      "has-cors": "npm:has-cors@1.1.0",
      "indexof": "npm:indexof@0.0.1",
      "parsejson": "npm:parsejson@0.0.1",
      "parseqs": "npm:parseqs@0.0.2",
      "parseuri": "npm:parseuri@0.0.4",
      "yeast": "npm:yeast@0.1.2"
    },
    "npm:engine.io-client@1.6.9": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "component-emitter": "npm:component-emitter@1.1.2",
      "component-inherit": "npm:component-inherit@0.0.3",
      "debug": "npm:debug@2.2.0",
      "engine.io-parser": "npm:engine.io-parser@1.2.4",
      "has-cors": "npm:has-cors@1.1.0",
      "indexof": "npm:indexof@0.0.1",
      "parsejson": "npm:parsejson@0.0.1",
      "parseqs": "npm:parseqs@0.0.2",
      "parseuri": "npm:parseuri@0.0.4",
      "yeast": "npm:yeast@0.1.2"
    },
    "npm:engine.io-parser@1.2.4": {
      "after": "npm:after@0.8.1",
      "arraybuffer.slice": "npm:arraybuffer.slice@0.0.6",
      "base64-arraybuffer": "npm:base64-arraybuffer@0.1.2",
      "blob": "npm:blob@0.0.4",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "has-binary": "npm:has-binary@0.1.6",
      "utf8": "npm:utf8@2.1.0"
    },
    "npm:engine.io@1.6.9": {
      "accepts": "npm:accepts@1.3.1",
      "base64id": "npm:base64id@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "debug": "npm:debug@2.2.0",
      "engine.io-parser": "npm:engine.io-parser@1.2.4",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "querystring": "github:jspm/nodelibs-querystring@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "ws": "npm:ws@1.0.1",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:evp_bytestokey@1.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0"
    },
    "npm:good-listener@1.1.7": {
      "delegate": "npm:delegate@3.0.1"
    },
    "npm:has-binary@0.1.6": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "isarray": "npm:isarray@0.0.1"
    },
    "npm:has-binary@0.1.7": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "isarray": "npm:isarray@0.0.1"
    },
    "npm:hash.js@1.0.3": {
      "inherits": "npm:inherits@2.0.1"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:is-fullwidth-code-point@1.0.0": {
      "number-is-nan": "npm:number-is-nan@1.0.0"
    },
    "npm:lcid@1.0.0": {
      "invert-kv": "npm:invert-kv@1.0.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:miller-rabin@4.0.0": {
      "bn.js": "npm:bn.js@4.11.3",
      "brorand": "npm:brorand@1.0.5"
    },
    "npm:mime-db@1.23.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:mime-types@2.1.11": {
      "mime-db": "npm:mime-db@1.23.0",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:nan@2.3.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:options@0.0.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:os-locale@1.4.0": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "lcid": "npm:lcid@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:pako@0.2.8": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:parse-asn1@5.0.0": {
      "asn1.js": "npm:asn1.js@4.6.2",
      "browserify-aes": "npm:browserify-aes@1.0.6",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
      "pbkdf2": "npm:pbkdf2@3.0.4",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:parsejson@0.0.1": {
      "better-assert": "npm:better-assert@1.0.2"
    },
    "npm:parseqs@0.0.2": {
      "better-assert": "npm:better-assert@1.0.2"
    },
    "npm:parseuri@0.0.4": {
      "better-assert": "npm:better-assert@1.0.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:pbkdf2@3.0.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "create-hmac": "npm:create-hmac@1.1.4",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:process-nextick-args@1.0.7": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.5": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:public-encrypt@4.0.0": {
      "bn.js": "npm:bn.js@4.11.3",
      "browserify-rsa": "npm:browserify-rsa@4.0.1",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "create-hash": "npm:create-hash@1.1.2",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "parse-asn1": "npm:parse-asn1@5.0.0",
      "randombytes": "npm:randombytes@2.0.3"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:randombytes@2.0.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:readable-stream@1.1.14": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:readable-stream@2.1.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "buffer-shims": "npm:buffer-shims@1.0.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "process-nextick-args": "npm:process-nextick-args@1.0.7",
      "string_decoder": "npm:string_decoder@0.10.31",
      "util-deprecate": "npm:util-deprecate@1.0.2"
    },
    "npm:reflect-metadata@0.1.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:ripemd160@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:rxjs@5.0.0-beta.10": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "symbol-observable": "npm:symbol-observable@1.0.1"
    },
    "npm:sha.js@2.4.5": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:showdown@1.4.2": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "yargs": "npm:yargs@3.32.0"
    },
    "npm:socket.io-adapter@0.4.0": {
      "debug": "npm:debug@2.2.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "socket.io-parser": "npm:socket.io-parser@2.2.2"
    },
    "npm:socket.io-client@1.4.6": {
      "backo2": "npm:backo2@1.0.2",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "component-bind": "npm:component-bind@1.0.0",
      "component-emitter": "npm:component-emitter@1.2.0",
      "debug": "npm:debug@2.2.0",
      "engine.io-client": "npm:engine.io-client@1.6.9",
      "has-binary": "npm:has-binary@0.1.7",
      "indexof": "npm:indexof@0.0.1",
      "object-component": "npm:object-component@0.0.3",
      "parseuri": "npm:parseuri@0.0.4",
      "socket.io-parser": "npm:socket.io-parser@2.2.6",
      "to-array": "npm:to-array@0.1.4"
    },
    "npm:socket.io-client@1.4.8": {
      "backo2": "npm:backo2@1.0.2",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "component-bind": "npm:component-bind@1.0.0",
      "component-emitter": "npm:component-emitter@1.2.0",
      "debug": "npm:debug@2.2.0",
      "engine.io-client": "npm:engine.io-client@1.6.11",
      "has-binary": "npm:has-binary@0.1.7",
      "indexof": "npm:indexof@0.0.1",
      "object-component": "npm:object-component@0.0.3",
      "parseuri": "npm:parseuri@0.0.4",
      "socket.io-parser": "npm:socket.io-parser@2.2.6",
      "to-array": "npm:to-array@0.1.4"
    },
    "npm:socket.io-parser@2.2.2": {
      "benchmark": "npm:benchmark@1.0.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "component-emitter": "npm:component-emitter@1.1.2",
      "debug": "npm:debug@0.7.4",
      "isarray": "npm:isarray@0.0.1",
      "json3": "npm:json3@3.2.6"
    },
    "npm:socket.io-parser@2.2.6": {
      "benchmark": "npm:benchmark@1.0.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "component-emitter": "npm:component-emitter@1.1.2",
      "debug": "npm:debug@2.2.0",
      "isarray": "npm:isarray@0.0.1",
      "json3": "npm:json3@3.3.2"
    },
    "npm:socket.io@1.4.6": {
      "debug": "npm:debug@2.2.0",
      "engine.io": "npm:engine.io@1.6.9",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "has-binary": "npm:has-binary@0.1.7",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "socket.io-adapter": "npm:socket.io-adapter@0.4.0",
      "socket.io-client": "npm:socket.io-client@1.4.6",
      "socket.io-parser": "npm:socket.io-parser@2.2.6",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.14"
    },
    "npm:string-width@1.0.1": {
      "code-point-at": "npm:code-point-at@1.0.0",
      "is-fullwidth-code-point": "npm:is-fullwidth-code-point@1.0.0",
      "strip-ansi": "npm:strip-ansi@3.0.1"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:strip-ansi@3.0.1": {
      "ansi-regex": "npm:ansi-regex@2.0.0"
    },
    "npm:ui-select@0.17.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:ultron@1.0.2": {
      "events": "github:jspm/nodelibs-events@0.1.1"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:utf-8-validate@1.2.1": {
      "bindings": "npm:bindings@1.2.1",
      "nan": "npm:nan@2.3.3"
    },
    "npm:utf8@2.1.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:util-deprecate@1.0.2": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    },
    "npm:window-size@0.1.4": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "tty": "github:jspm/nodelibs-tty@0.1.0"
    },
    "npm:wrap-ansi@2.0.0": {
      "string-width": "npm:string-width@1.0.1"
    },
    "npm:ws@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "bufferutil": "npm:bufferutil@1.2.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "options": "npm:options@0.0.6",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "tls": "github:jspm/nodelibs-tls@0.1.0",
      "ultron": "npm:ultron@1.0.2",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "utf-8-validate": "npm:utf-8-validate@1.2.1",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:y18n@3.2.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:yargs@3.32.0": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "camelcase": "npm:camelcase@2.1.1",
      "cliui": "npm:cliui@3.2.0",
      "decamelize": "npm:decamelize@1.2.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "os-locale": "npm:os-locale@1.4.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "string-width": "npm:string-width@1.0.1",
      "window-size": "npm:window-size@0.1.4",
      "y18n": "npm:y18n@3.2.1"
    },
    "npm:zone.js@0.6.12": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
