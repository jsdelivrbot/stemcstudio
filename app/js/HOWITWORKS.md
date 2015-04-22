app.js | app.coffee | app.ts
------------------------------
Specifies ngResource and ngRoute as a dependency.

router.js | router.coffee | router.ts
-------------------------------------
Specifies the controllers and templates for any given route.

Comments
--------
The naming/ordering of files is important! If app.ts is renamed to xyz.ts then its contents are placed at the bottom of app.ts.js causing the module to be referenced before it is defined. This behavior could be corrected by a more
tightly defined typescript.coffee plugin.