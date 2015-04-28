package.json
------------
Will allow us to supply development dependencies.

Gruntfile.js
------------
Provides the configuration for the `$lineman run` command.

This file loads the boilerplate ./config/lineman module.

Once the configuration has been loaded, `$lineman run` attempts to generate the site into ./generated.
We must add ./app/pages/index.us (our first piece of source code) in order to get index.html as a generated file.

We don't put a HOWITWORKS.md in the ./app/pages folder because it would be converted into HOWITWORKS.html in the generated output.

Authentication
--------------
The server provides the client with a cookie representing the GitHub application client ID.
