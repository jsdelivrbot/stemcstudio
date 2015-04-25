
##History

**v0.13.7**

* No API modifications
* Minification and bundling will now use version >= 0.5.0 of Abridge. This version removes Java dependencies and no longer spawns child processes. It's much faster. 

**v0.13.6**

* Lactate now sets charsets by default
* Added a test for minification (Note: would prefer faster minification without use of child process)
* Significant refactor

**v0.13.3**

* Added Lactate.define(extension, mimeType). Accepts an object or key/value for defining custom mime types.
* Added new option `charset`. Lactate.enable('charset') for automatically setting charset using `node-mime`, or define a custom charset using Lactate.set('charset', <charset>)

**v0.13.2**

* No API removals
* Add Lactate.gzip(pattern) for extending opts.gzip_patterns. These patterns are tested against mime types.
* Lactate status event listeners are given a `FileRequest` object
* Remove function binding wherever possible
* Reuse `FileRequest` object for Lactate.emit, remove a bunch of *crud* related to the previous solution
