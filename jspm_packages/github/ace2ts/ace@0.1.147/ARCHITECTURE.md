Ace ARCHITECTURE
================

Browser Code Editor targeting ES6 written in TypeScript

# Overview #

The physical architecture is split into (at least) two bundles. The 'Ace2ts/ace' bundle is loaded in the browser UI thread and provides the UX by making changes to the DOM and by responding to keyboard and mouse events. The 'Ace2ts/ace-workers' bundle is loaded into Web Worker threads and is responsible for background processing such as linting. Note that this physical separation is reflected in the development environments.

TODO: There are some common components such as Annotation, Delta, Document, Position, Range and applyDelta that could be factored into a third, shared bundle.

The 'Ace2ts/ace-workers' bundle contains the implementations of several LanguageMode(s) as well as a TypeScript language service implementation.

TODO: The 'Ace2ts/ace-workers' could be broken down into language-specific bundles. This would improve load times of Web Workers. This should be done after the common components have been extracted.
