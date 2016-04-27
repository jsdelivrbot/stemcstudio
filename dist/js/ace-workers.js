System.register("src/mode/ExampleWorker.js", ["../worker/Mirror"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Mirror_1;
  var ExampleWorker;
  return {
    setters: [function(Mirror_1_1) {
      Mirror_1 = Mirror_1_1;
    }],
    execute: function() {
      ExampleWorker = (function(_super) {
        __extends(ExampleWorker, _super);
        function ExampleWorker(host) {
          _super.call(this, host, 500);
          this.setOptions();
        }
        ExampleWorker.prototype.setOptions = function(options) {
          this.doc.getValue() && this.deferredUpdate.schedule(100);
        };
        ExampleWorker.prototype.changeOptions = function(options) {
          this.doc.getValue() && this.deferredUpdate.schedule(100);
        };
        ExampleWorker.prototype.onUpdate = function() {
          var value = this.doc.getValue();
          var annotations = [];
          this.emitAnnotations(annotations);
        };
        return ExampleWorker;
      })(Mirror_1.default);
      exports_1("default", ExampleWorker);
    }
  };
});

System.register("src/mode/html/constants.js", [], function(exports_1) {
  var SVGTagMap,
      MATHMLAttributeMap,
      SVGAttributeMap,
      ForeignAttributeMap;
  return {
    setters: [],
    execute: function() {
      exports_1("SVGTagMap", SVGTagMap = {
        "altglyph": "altGlyph",
        "altglyphdef": "altGlyphDef",
        "altglyphitem": "altGlyphItem",
        "animatecolor": "animateColor",
        "animatemotion": "animateMotion",
        "animatetransform": "animateTransform",
        "clippath": "clipPath",
        "feblend": "feBlend",
        "fecolormatrix": "feColorMatrix",
        "fecomponenttransfer": "feComponentTransfer",
        "fecomposite": "feComposite",
        "feconvolvematrix": "feConvolveMatrix",
        "fediffuselighting": "feDiffuseLighting",
        "fedisplacementmap": "feDisplacementMap",
        "fedistantlight": "feDistantLight",
        "feflood": "feFlood",
        "fefunca": "feFuncA",
        "fefuncb": "feFuncB",
        "fefuncg": "feFuncG",
        "fefuncr": "feFuncR",
        "fegaussianblur": "feGaussianBlur",
        "feimage": "feImage",
        "femerge": "feMerge",
        "femergenode": "feMergeNode",
        "femorphology": "feMorphology",
        "feoffset": "feOffset",
        "fepointlight": "fePointLight",
        "fespecularlighting": "feSpecularLighting",
        "fespotlight": "feSpotLight",
        "fetile": "feTile",
        "feturbulence": "feTurbulence",
        "foreignobject": "foreignObject",
        "glyphref": "glyphRef",
        "lineargradient": "linearGradient",
        "radialgradient": "radialGradient",
        "textpath": "textPath"
      });
      exports_1("MATHMLAttributeMap", MATHMLAttributeMap = {definitionurl: 'definitionURL'});
      exports_1("SVGAttributeMap", SVGAttributeMap = {
        attributename: 'attributeName',
        attributetype: 'attributeType',
        basefrequency: 'baseFrequency',
        baseprofile: 'baseProfile',
        calcmode: 'calcMode',
        clippathunits: 'clipPathUnits',
        contentscripttype: 'contentScriptType',
        contentstyletype: 'contentStyleType',
        diffuseconstant: 'diffuseConstant',
        edgemode: 'edgeMode',
        externalresourcesrequired: 'externalResourcesRequired',
        filterres: 'filterRes',
        filterunits: 'filterUnits',
        glyphref: 'glyphRef',
        gradienttransform: 'gradientTransform',
        gradientunits: 'gradientUnits',
        kernelmatrix: 'kernelMatrix',
        kernelunitlength: 'kernelUnitLength',
        keypoints: 'keyPoints',
        keysplines: 'keySplines',
        keytimes: 'keyTimes',
        lengthadjust: 'lengthAdjust',
        limitingconeangle: 'limitingConeAngle',
        markerheight: 'markerHeight',
        markerunits: 'markerUnits',
        markerwidth: 'markerWidth',
        maskcontentunits: 'maskContentUnits',
        maskunits: 'maskUnits',
        numoctaves: 'numOctaves',
        pathlength: 'pathLength',
        patterncontentunits: 'patternContentUnits',
        patterntransform: 'patternTransform',
        patternunits: 'patternUnits',
        pointsatx: 'pointsAtX',
        pointsaty: 'pointsAtY',
        pointsatz: 'pointsAtZ',
        preservealpha: 'preserveAlpha',
        preserveaspectratio: 'preserveAspectRatio',
        primitiveunits: 'primitiveUnits',
        refx: 'refX',
        refy: 'refY',
        repeatcount: 'repeatCount',
        repeatdur: 'repeatDur',
        requiredextensions: 'requiredExtensions',
        requiredfeatures: 'requiredFeatures',
        specularconstant: 'specularConstant',
        specularexponent: 'specularExponent',
        spreadmethod: 'spreadMethod',
        startoffset: 'startOffset',
        stddeviation: 'stdDeviation',
        stitchtiles: 'stitchTiles',
        surfacescale: 'surfaceScale',
        systemlanguage: 'systemLanguage',
        tablevalues: 'tableValues',
        targetx: 'targetX',
        targety: 'targetY',
        textlength: 'textLength',
        viewbox: 'viewBox',
        viewtarget: 'viewTarget',
        xchannelselector: 'xChannelSelector',
        ychannelselector: 'yChannelSelector',
        zoomandpan: 'zoomAndPan'
      });
      exports_1("ForeignAttributeMap", ForeignAttributeMap = {
        "xlink:actuate": {
          prefix: "xlink",
          localName: "actuate",
          namespaceURI: "http://www.w3.org/1999/xlink"
        },
        "xlink:arcrole": {
          prefix: "xlink",
          localName: "arcrole",
          namespaceURI: "http://www.w3.org/1999/xlink"
        },
        "xlink:href": {
          prefix: "xlink",
          localName: "href",
          namespaceURI: "http://www.w3.org/1999/xlink"
        },
        "xlink:role": {
          prefix: "xlink",
          localName: "role",
          namespaceURI: "http://www.w3.org/1999/xlink"
        },
        "xlink:show": {
          prefix: "xlink",
          localName: "show",
          namespaceURI: "http://www.w3.org/1999/xlink"
        },
        "xlink:title": {
          prefix: "xlink",
          localName: "title",
          namespaceURI: "http://www.w3.org/1999/xlink"
        },
        "xlink:type": {
          prefix: "xlink",
          localName: "title",
          namespaceURI: "http://www.w3.org/1999/xlink"
        },
        "xml:base": {
          prefix: "xml",
          localName: "base",
          namespaceURI: "http://www.w3.org/XML/1998/namespace"
        },
        "xml:lang": {
          prefix: "xml",
          localName: "lang",
          namespaceURI: "http://www.w3.org/XML/1998/namespace"
        },
        "xml:space": {
          prefix: "xml",
          localName: "space",
          namespaceURI: "http://www.w3.org/XML/1998/namespace"
        },
        "xmlns": {
          prefix: null,
          localName: "xmlns",
          namespaceURI: "http://www.w3.org/2000/xmlns/"
        },
        "xmlns:xlink": {
          prefix: "xmlns",
          localName: "xlink",
          namespaceURI: "http://www.w3.org/2000/xmlns/"
        }
      });
    }
  };
});

System.register("src/mode/html/CharacterBuffer.js", ["./isWhitespace"], function(exports_1) {
  var isWhitespace_1;
  function CharacterBuffer(characters) {
    this.characters = characters;
    this.current = 0;
    this.end = this.characters.length;
  }
  exports_1("default", CharacterBuffer);
  return {
    setters: [function(isWhitespace_1_1) {
      isWhitespace_1 = isWhitespace_1_1;
    }],
    execute: function() {
      CharacterBuffer.prototype.skipAtMostOneLeadingNewline = function() {
        if (this.characters[this.current] === '\n')
          this.current++;
      };
      CharacterBuffer.prototype.skipLeadingWhitespace = function() {
        while (isWhitespace_1.default(this.characters[this.current])) {
          if (++this.current == this.end)
            return;
        }
      };
      CharacterBuffer.prototype.skipLeadingNonWhitespace = function() {
        while (!isWhitespace_1.default(this.characters[this.current])) {
          if (++this.current == this.end)
            return;
        }
      };
      CharacterBuffer.prototype.takeRemaining = function() {
        return this.characters.substring(this.current);
      };
      CharacterBuffer.prototype.takeLeadingWhitespace = function() {
        var start = this.current;
        this.skipLeadingWhitespace();
        if (start === this.current)
          return "";
        return this.characters.substring(start, this.current - start);
      };
      Object.defineProperty(CharacterBuffer.prototype, 'length', {get: function() {
          return this.end - this.current;
        }});
    }
  };
});

System.register("src/mode/html/ElementStack.js", [], function(exports_1) {
  var ElementStack;
  function isScopeMarker(node) {
    if (node.namespaceURI === "http://www.w3.org/1999/xhtml") {
      return node.localName === "applet" || node.localName === "caption" || node.localName === "marquee" || node.localName === "object" || node.localName === "table" || node.localName === "td" || node.localName === "th";
    }
    if (node.namespaceURI === "http://www.w3.org/1998/Math/MathML") {
      return node.localName === "mi" || node.localName === "mo" || node.localName === "mn" || node.localName === "ms" || node.localName === "mtext" || node.localName === "annotation-xml";
    }
    if (node.namespaceURI === "http://www.w3.org/2000/svg") {
      return node.localName === "foreignObject" || node.localName === "desc" || node.localName === "title";
    }
  }
  function isListItemScopeMarker(node) {
    return isScopeMarker(node) || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'ol') || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'ul');
  }
  function isTableScopeMarker(node) {
    return (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'table') || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'html');
  }
  function isTableBodyScopeMarker(node) {
    return (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'tbody') || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'tfoot') || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'thead') || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'html');
  }
  function isTableRowScopeMarker(node) {
    return (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'tr') || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'html');
  }
  function isButtonScopeMarker(node) {
    return isScopeMarker(node) || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'button');
  }
  function isSelectScopeMarker(node) {
    return !(node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'optgroup') && !(node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'option');
  }
  return {
    setters: [],
    execute: function() {
      ElementStack = (function() {
        function ElementStack() {
          this.elements = [];
          this.rootNode = null;
          this.headElement = null;
          this.bodyElement = null;
        }
        ElementStack.prototype._inScope = function(localName, isMarker) {
          for (var i = this.elements.length - 1; i >= 0; i--) {
            var node = this.elements[i];
            if (node.localName === localName)
              return true;
            if (isMarker(node))
              return false;
          }
        };
        ElementStack.prototype.push = function(item) {
          this.elements.push(item);
        };
        ElementStack.prototype.pushHtmlElement = function(item) {
          this.rootNode = item.node;
          this.push(item);
        };
        ElementStack.prototype.pushHeadElement = function(item) {
          this.headElement = item.node;
          this.push(item);
        };
        ElementStack.prototype.pushBodyElement = function(item) {
          this.bodyElement = item.node;
          this.push(item);
        };
        ElementStack.prototype.pop = function() {
          return this.elements.pop();
        };
        ElementStack.prototype.remove = function(item) {
          this.elements.splice(this.elements.indexOf(item), 1);
        };
        ElementStack.prototype.popUntilPopped = function(localName) {
          var element;
          do {
            element = this.pop();
          } while (element.localName != localName);
        };
        ElementStack.prototype.popUntilTableScopeMarker = function() {
          while (!isTableScopeMarker(this.top))
            this.pop();
        };
        ElementStack.prototype.popUntilTableBodyScopeMarker = function() {
          while (!isTableBodyScopeMarker(this.top))
            this.pop();
        };
        ElementStack.prototype.popUntilTableRowScopeMarker = function() {
          while (!isTableRowScopeMarker(this.top))
            this.pop();
        };
        ElementStack.prototype.item = function(index) {
          return this.elements[index];
        };
        ElementStack.prototype.contains = function(element) {
          return this.elements.indexOf(element) !== -1;
        };
        ElementStack.prototype.inScope = function(localName) {
          return this._inScope(localName, isScopeMarker);
        };
        ElementStack.prototype.inListItemScope = function(localName) {
          return this._inScope(localName, isListItemScopeMarker);
        };
        ElementStack.prototype.inTableScope = function(localName) {
          return this._inScope(localName, isTableScopeMarker);
        };
        ElementStack.prototype.inButtonScope = function(localName) {
          return this._inScope(localName, isButtonScopeMarker);
        };
        ElementStack.prototype.inSelectScope = function(localName) {
          return this._inScope(localName, isSelectScopeMarker);
        };
        ElementStack.prototype.hasNumberedHeaderElementInScope = function() {
          for (var i = this.elements.length - 1; i >= 0; i--) {
            var node = this.elements[i];
            if (node.isNumberedHeader())
              return true;
            if (isScopeMarker(node))
              return false;
          }
        };
        ElementStack.prototype.furthestBlockForFormattingElement = function(element) {
          var furthestBlock = null;
          for (var i = this.elements.length - 1; i >= 0; i--) {
            var node = this.elements[i];
            if (node.node === element)
              break;
            if (node.isSpecial())
              furthestBlock = node;
          }
          return furthestBlock;
        };
        ElementStack.prototype.findIndex = function(localName) {
          for (var i = this.elements.length - 1; i >= 0; i--) {
            if (this.elements[i].localName == localName)
              return i;
          }
          return -1;
        };
        ElementStack.prototype.remove_openElements_until = function(callback) {
          var finished = false;
          var element;
          while (!finished) {
            element = this.elements.pop();
            finished = callback(element);
          }
          return element;
        };
        Object.defineProperty(ElementStack.prototype, "top", {
          get: function() {
            return this.elements[this.elements.length - 1];
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ElementStack.prototype, "length", {
          get: function() {
            return this.elements.length;
          },
          enumerable: true,
          configurable: true
        });
        return ElementStack;
      })();
      exports_1("default", ElementStack);
    }
  };
});

System.register("src/mode/html/formatMessage.js", [], function(exports_1) {
  function formatMessage(format, args) {
    return format.replace(new RegExp('{[0-9a-z-]+}', 'gi'), function(match) {
      return args[match.slice(1, -1)] || match;
    });
  }
  exports_1("default", formatMessage);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/mode/html/isAllWhitespace.js", ["./isWhitespace"], function(exports_1) {
  var isWhitespace_1;
  function isAllWhitespace(characters) {
    for (var i = 0; i < characters.length; i++) {
      var ch = characters[i];
      if (!isWhitespace_1.default(ch))
        return false;
    }
    return true;
  }
  exports_1("default", isAllWhitespace);
  return {
    setters: [function(isWhitespace_1_1) {
      isWhitespace_1 = isWhitespace_1_1;
    }],
    execute: function() {}
  };
});

System.register("src/mode/html/isWhitespaceOrReplacementCharacter.js", ["./isWhitespace"], function(exports_1) {
  var isWhitespace_1;
  function isWhitespaceOrReplacementCharacter(ch) {
    return isWhitespace_1.default(ch) || ch === '\uFFFD';
  }
  exports_1("default", isWhitespaceOrReplacementCharacter);
  return {
    setters: [function(isWhitespace_1_1) {
      isWhitespace_1 = isWhitespace_1_1;
    }],
    execute: function() {}
  };
});

System.register("src/mode/html/isAllWhitespaceOrReplacementCharacters.js", ["./isWhitespaceOrReplacementCharacter"], function(exports_1) {
  var isWhitespaceOrReplacementCharacter_1;
  function isAllWhitespaceOrReplacementCharacters(characters) {
    for (var i = 0; i < characters.length; i++) {
      var ch = characters[i];
      if (!isWhitespaceOrReplacementCharacter_1.default(ch))
        return false;
    }
    return true;
  }
  exports_1("default", isAllWhitespaceOrReplacementCharacters);
  return {
    setters: [function(isWhitespaceOrReplacementCharacter_1_1) {
      isWhitespaceOrReplacementCharacter_1 = isWhitespaceOrReplacementCharacter_1_1;
    }],
    execute: function() {}
  };
});

System.register("src/mode/html/messages.js", [], function(exports_1) {
  var messages;
  return {
    setters: [],
    execute: function() {
      messages = {
        "null-character": "Null character in input stream, replaced with U+FFFD.",
        "invalid-codepoint": "Invalid codepoint in stream",
        "incorrectly-placed-solidus": "Solidus (/) incorrectly placed in tag.",
        "incorrect-cr-newline-entity": "Incorrect CR newline entity, replaced with LF.",
        "illegal-windows-1252-entity": "Entity used with illegal number (windows-1252 reference).",
        "cant-convert-numeric-entity": "Numeric entity couldn't be converted to character (codepoint U+{charAsInt}).",
        "invalid-numeric-entity-replaced": "Numeric entity represents an illegal codepoint. Expanded to the C1 controls range.",
        "numeric-entity-without-semicolon": "Numeric entity didn't end with ';'.",
        "expected-numeric-entity-but-got-eof": "Numeric entity expected. Got end of file instead.",
        "expected-numeric-entity": "Numeric entity expected but none found.",
        "named-entity-without-semicolon": "Named entity didn't end with ';'.",
        "expected-named-entity": "Named entity expected. Got none.",
        "attributes-in-end-tag": "End tag contains unexpected attributes.",
        "self-closing-flag-on-end-tag": "End tag contains unexpected self-closing flag.",
        "bare-less-than-sign-at-eof": "End of file after <.",
        "expected-tag-name-but-got-right-bracket": "Expected tag name. Got '>' instead.",
        "expected-tag-name-but-got-question-mark": "Expected tag name. Got '?' instead. (HTML doesn't support processing instructions.)",
        "expected-tag-name": "Expected tag name. Got something else instead.",
        "expected-closing-tag-but-got-right-bracket": "Expected closing tag. Got '>' instead. Ignoring '</>'.",
        "expected-closing-tag-but-got-eof": "Expected closing tag. Unexpected end of file.",
        "expected-closing-tag-but-got-char": "Expected closing tag. Unexpected character '{data}' found.",
        "eof-in-tag-name": "Unexpected end of file in the tag name.",
        "expected-attribute-name-but-got-eof": "Unexpected end of file. Expected attribute name instead.",
        "eof-in-attribute-name": "Unexpected end of file in attribute name.",
        "invalid-character-in-attribute-name": "Invalid character in attribute name.",
        "duplicate-attribute": "Dropped duplicate attribute '{name}' on tag.",
        "expected-end-of-tag-but-got-eof": "Unexpected end of file. Expected = or end of tag.",
        "expected-attribute-value-but-got-eof": "Unexpected end of file. Expected attribute value.",
        "expected-attribute-value-but-got-right-bracket": "Expected attribute value. Got '>' instead.",
        "unexpected-character-in-unquoted-attribute-value": "Unexpected character in unquoted attribute",
        "invalid-character-after-attribute-name": "Unexpected character after attribute name.",
        "unexpected-character-after-attribute-value": "Unexpected character after attribute value.",
        "eof-in-attribute-value-double-quote": "Unexpected end of file in attribute value (\").",
        "eof-in-attribute-value-single-quote": "Unexpected end of file in attribute value (').",
        "eof-in-attribute-value-no-quotes": "Unexpected end of file in attribute value.",
        "eof-after-attribute-value": "Unexpected end of file after attribute value.",
        "unexpected-eof-after-solidus-in-tag": "Unexpected end of file in tag. Expected >.",
        "unexpected-character-after-solidus-in-tag": "Unexpected character after / in tag. Expected >.",
        "expected-dashes-or-doctype": "Expected '--' or 'DOCTYPE'. Not found.",
        "unexpected-bang-after-double-dash-in-comment": "Unexpected ! after -- in comment.",
        "incorrect-comment": "Incorrect comment.",
        "eof-in-comment": "Unexpected end of file in comment.",
        "eof-in-comment-end-dash": "Unexpected end of file in comment (-).",
        "unexpected-dash-after-double-dash-in-comment": "Unexpected '-' after '--' found in comment.",
        "eof-in-comment-double-dash": "Unexpected end of file in comment (--).",
        "eof-in-comment-end-bang-state": "Unexpected end of file in comment.",
        "unexpected-char-in-comment": "Unexpected character in comment found.",
        "need-space-after-doctype": "No space after literal string 'DOCTYPE'.",
        "expected-doctype-name-but-got-right-bracket": "Unexpected > character. Expected DOCTYPE name.",
        "expected-doctype-name-but-got-eof": "Unexpected end of file. Expected DOCTYPE name.",
        "eof-in-doctype-name": "Unexpected end of file in DOCTYPE name.",
        "eof-in-doctype": "Unexpected end of file in DOCTYPE.",
        "expected-space-or-right-bracket-in-doctype": "Expected space or '>'. Got '{data}'.",
        "unexpected-end-of-doctype": "Unexpected end of DOCTYPE.",
        "unexpected-char-in-doctype": "Unexpected character in DOCTYPE.",
        "eof-in-bogus-doctype": "Unexpected end of file in bogus doctype.",
        "eof-in-innerhtml": "Unexpected EOF in inner html mode.",
        "unexpected-doctype": "Unexpected DOCTYPE. Ignored.",
        "non-html-root": "html needs to be the first start tag.",
        "expected-doctype-but-got-eof": "Unexpected End of file. Expected DOCTYPE.",
        "unknown-doctype": "Erroneous DOCTYPE. Expected <!DOCTYPE html>.",
        "quirky-doctype": "Quirky doctype. Expected <!DOCTYPE html>.",
        "almost-standards-doctype": "Almost standards mode doctype. Expected <!DOCTYPE html>.",
        "obsolete-doctype": "Obsolete doctype. Expected <!DOCTYPE html>.",
        "expected-doctype-but-got-chars": "Non-space characters found without seeing a doctype first. Expected e.g. <!DOCTYPE html>.",
        "expected-doctype-but-got-start-tag": "Start tag seen without seeing a doctype first. Expected e.g. <!DOCTYPE html>.",
        "expected-doctype-but-got-end-tag": "End tag seen without seeing a doctype first. Expected e.g. <!DOCTYPE html>.",
        "end-tag-after-implied-root": "Unexpected end tag ({name}) after the (implied) root element.",
        "expected-named-closing-tag-but-got-eof": "Unexpected end of file. Expected end tag ({name}).",
        "two-heads-are-not-better-than-one": "Unexpected start tag head in existing head. Ignored.",
        "unexpected-end-tag": "Unexpected end tag ({name}). Ignored.",
        "unexpected-implied-end-tag": "End tag {name} implied, but there were open elements.",
        "unexpected-start-tag-out-of-my-head": "Unexpected start tag ({name}) that can be in head. Moved.",
        "unexpected-start-tag": "Unexpected start tag ({name}).",
        "missing-end-tag": "Missing end tag ({name}).",
        "missing-end-tags": "Missing end tags ({name}).",
        "unexpected-start-tag-implies-end-tag": "Unexpected start tag ({startName}) implies end tag ({endName}).",
        "unexpected-start-tag-treated-as": "Unexpected start tag ({originalName}). Treated as {newName}.",
        "deprecated-tag": "Unexpected start tag {name}. Don't use it!",
        "unexpected-start-tag-ignored": "Unexpected start tag {name}. Ignored.",
        "expected-one-end-tag-but-got-another": "Unexpected end tag ({gotName}). Missing end tag ({expectedName}).",
        "end-tag-too-early": "End tag ({name}) seen too early. Expected other end tag.",
        "end-tag-too-early-named": "Unexpected end tag ({gotName}). Expected end tag ({expectedName}.",
        "end-tag-too-early-ignored": "End tag ({name}) seen too early. Ignored.",
        "adoption-agency-1.1": "End tag ({name}) violates step 1, paragraph 1 of the adoption agency algorithm.",
        "adoption-agency-1.2": "End tag ({name}) violates step 1, paragraph 2 of the adoption agency algorithm.",
        "adoption-agency-1.3": "End tag ({name}) violates step 1, paragraph 3 of the adoption agency algorithm.",
        "adoption-agency-4.4": "End tag ({name}) violates step 4, paragraph 4 of the adoption agency algorithm.",
        "unexpected-end-tag-treated-as": "Unexpected end tag ({originalName}). Treated as {newName}.",
        "no-end-tag": "This element ({name}) has no end tag.",
        "unexpected-implied-end-tag-in-table": "Unexpected implied end tag ({name}) in the table phase.",
        "unexpected-implied-end-tag-in-table-body": "Unexpected implied end tag ({name}) in the table body phase.",
        "unexpected-char-implies-table-voodoo": "Unexpected non-space characters in table context caused voodoo mode.",
        "unexpected-hidden-input-in-table": "Unexpected input with type hidden in table context.",
        "unexpected-form-in-table": "Unexpected form in table context.",
        "unexpected-start-tag-implies-table-voodoo": "Unexpected start tag ({name}) in table context caused voodoo mode.",
        "unexpected-end-tag-implies-table-voodoo": "Unexpected end tag ({name}) in table context caused voodoo mode.",
        "unexpected-cell-in-table-body": "Unexpected table cell start tag ({name}) in the table body phase.",
        "unexpected-cell-end-tag": "Got table cell end tag ({name}) while required end tags are missing.",
        "unexpected-end-tag-in-table-body": "Unexpected end tag ({name}) in the table body phase. Ignored.",
        "unexpected-implied-end-tag-in-table-row": "Unexpected implied end tag ({name}) in the table row phase.",
        "unexpected-end-tag-in-table-row": "Unexpected end tag ({name}) in the table row phase. Ignored.",
        "unexpected-select-in-select": "Unexpected select start tag in the select phase treated as select end tag.",
        "unexpected-input-in-select": "Unexpected input start tag in the select phase.",
        "unexpected-start-tag-in-select": "Unexpected start tag token ({name}) in the select phase. Ignored.",
        "unexpected-end-tag-in-select": "Unexpected end tag ({name}) in the select phase. Ignored.",
        "unexpected-table-element-start-tag-in-select-in-table": "Unexpected table element start tag ({name}) in the select in table phase.",
        "unexpected-table-element-end-tag-in-select-in-table": "Unexpected table element end tag ({name}) in the select in table phase.",
        "unexpected-char-after-body": "Unexpected non-space characters in the after body phase.",
        "unexpected-start-tag-after-body": "Unexpected start tag token ({name}) in the after body phase.",
        "unexpected-end-tag-after-body": "Unexpected end tag token ({name}) in the after body phase.",
        "unexpected-char-in-frameset": "Unepxected characters in the frameset phase. Characters ignored.",
        "unexpected-start-tag-in-frameset": "Unexpected start tag token ({name}) in the frameset phase. Ignored.",
        "unexpected-frameset-in-frameset-innerhtml": "Unexpected end tag token (frameset in the frameset phase (innerHTML).",
        "unexpected-end-tag-in-frameset": "Unexpected end tag token ({name}) in the frameset phase. Ignored.",
        "unexpected-char-after-frameset": "Unexpected non-space characters in the after frameset phase. Ignored.",
        "unexpected-start-tag-after-frameset": "Unexpected start tag ({name}) in the after frameset phase. Ignored.",
        "unexpected-end-tag-after-frameset": "Unexpected end tag ({name}) in the after frameset phase. Ignored.",
        "expected-eof-but-got-char": "Unexpected non-space characters. Expected end of file.",
        "expected-eof-but-got-start-tag": "Unexpected start tag ({name}). Expected end of file.",
        "expected-eof-but-got-end-tag": "Unexpected end tag ({name}). Expected end of file.",
        "unexpected-end-table-in-caption": "Unexpected end table tag in caption. Generates implied end caption.",
        "end-html-in-innerhtml": "Unexpected html end tag in inner html mode.",
        "eof-in-table": "Unexpected end of file. Expected table content.",
        "eof-in-script": "Unexpected end of file. Expected script content.",
        "non-void-element-with-trailing-solidus": "Trailing solidus not allowed on element {name}.",
        "unexpected-html-element-in-foreign-content": "HTML start tag \"{name}\" in a foreign namespace context.",
        "unexpected-start-tag-in-table": "Unexpected {name}. Expected table content."
      };
      exports_1("default", messages);
    }
  };
});

System.register("src/mode/html/StackItem.js", [], function(exports_1) {
  var SpecialElements,
      StackItem;
  function getAttribute(item, name) {
    for (var i = 0; i < item.attributes.length; i++) {
      if (item.attributes[i].nodeName == name)
        return item.attributes[i].nodeValue;
    }
    return null;
  }
  return {
    setters: [],
    execute: function() {
      SpecialElements = {
        "http://www.w3.org/1999/xhtml": ['address', 'applet', 'area', 'article', 'aside', 'base', 'basefont', 'bgsound', 'blockquote', 'body', 'br', 'button', 'caption', 'center', 'col', 'colgroup', 'dd', 'details', 'dir', 'div', 'dl', 'dt', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'iframe', 'img', 'input', 'isindex', 'li', 'link', 'listing', 'main', 'marquee', 'menu', 'menuitem', 'meta', 'nav', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'p', 'param', 'plaintext', 'pre', 'script', 'section', 'select', 'source', 'style', 'summary', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'track', 'ul', 'wbr', 'xmp'],
        "http://www.w3.org/1998/Math/MathML": ['mi', 'mo', 'mn', 'ms', 'mtext', 'annotation-xml'],
        "http://www.w3.org/2000/svg": ['foreignObject', 'desc', 'title']
      };
      StackItem = (function() {
        function StackItem(namespaceURI, localName, attributes, node) {
          this.localName = localName;
          this.namespaceURI = namespaceURI;
          this.attributes = attributes;
          this.node = node;
        }
        StackItem.prototype.isSpecial = function() {
          return this.namespaceURI in SpecialElements && SpecialElements[this.namespaceURI].indexOf(this.localName) > -1;
        };
        StackItem.prototype.isFosterParenting = function() {
          if (this.namespaceURI === "http://www.w3.org/1999/xhtml") {
            return this.localName === 'table' || this.localName === 'tbody' || this.localName === 'tfoot' || this.localName === 'thead' || this.localName === 'tr';
          }
          return false;
        };
        StackItem.prototype.isNumberedHeader = function() {
          if (this.namespaceURI === "http://www.w3.org/1999/xhtml") {
            return this.localName === 'h1' || this.localName === 'h2' || this.localName === 'h3' || this.localName === 'h4' || this.localName === 'h5' || this.localName === 'h6';
          }
          return false;
        };
        StackItem.prototype.isForeign = function() {
          return this.namespaceURI != "http://www.w3.org/1999/xhtml";
        };
        StackItem.prototype.isHtmlIntegrationPoint = function() {
          if (this.namespaceURI === "http://www.w3.org/1998/Math/MathML") {
            if (this.localName !== "annotation-xml")
              return false;
            var encoding = getAttribute(this, 'encoding');
            if (!encoding)
              return false;
            encoding = encoding.toLowerCase();
            return encoding === "text/html" || encoding === "application/xhtml+xml";
          }
          if (this.namespaceURI === "http://www.w3.org/2000/svg") {
            return this.localName === "foreignObject" || this.localName === "desc" || this.localName === "title";
          }
          return false;
        };
        StackItem.prototype.isMathMLTextIntegrationPoint = function() {
          if (this.namespaceURI === "http://www.w3.org/1998/Math/MathML") {
            return this.localName === "mi" || this.localName === "mo" || this.localName === "mn" || this.localName === "ms" || this.localName === "mtext";
          }
          return false;
        };
        return StackItem;
      })();
      exports_1("default", StackItem);
    }
  };
});

System.register("src/mode/html/TreeBuilder.js", ["./constants", "./CharacterBuffer", "./ElementStack", "./formatMessage", "./getAttribute", "./isWhitespace", "./isAllWhitespace", "./isAllWhitespaceOrReplacementCharacters", "./messages", "./StackItem", "./Tokenizer"], function(exports_1) {
  var constants_1,
      CharacterBuffer_1,
      ElementStack_1,
      formatMessage_1,
      getAttribute_1,
      isWhitespace_1,
      isAllWhitespace_1,
      isAllWhitespaceOrReplacementCharacters_1,
      messages_1,
      StackItem_1,
      Tokenizer_1;
  var Marker,
      TreeBuilder;
  return {
    setters: [function(constants_1_1) {
      constants_1 = constants_1_1;
    }, function(CharacterBuffer_1_1) {
      CharacterBuffer_1 = CharacterBuffer_1_1;
    }, function(ElementStack_1_1) {
      ElementStack_1 = ElementStack_1_1;
    }, function(formatMessage_1_1) {
      formatMessage_1 = formatMessage_1_1;
    }, function(getAttribute_1_1) {
      getAttribute_1 = getAttribute_1_1;
    }, function(isWhitespace_1_1) {
      isWhitespace_1 = isWhitespace_1_1;
    }, function(isAllWhitespace_1_1) {
      isAllWhitespace_1 = isAllWhitespace_1_1;
    }, function(isAllWhitespaceOrReplacementCharacters_1_1) {
      isAllWhitespaceOrReplacementCharacters_1 = isAllWhitespaceOrReplacementCharacters_1_1;
    }, function(messages_1_1) {
      messages_1 = messages_1_1;
    }, function(StackItem_1_1) {
      StackItem_1 = StackItem_1_1;
    }, function(Tokenizer_1_1) {
      Tokenizer_1 = Tokenizer_1_1;
    }],
    execute: function() {
      Marker = {};
      TreeBuilder = (function() {
        function TreeBuilder() {
          this.tokenizer = null;
          this.errorHandler = null;
          this.scriptingEnabled = false;
          this.document = null;
          this.head = null;
          this.form = null;
          this.openElements = new ElementStack_1.default();
          this.activeFormattingElements = [];
          this.insertionMode = null;
          this.insertionModeName = "";
          this.originalInsertionMode = "";
          this.inQuirksMode = false;
          this.compatMode = "no quirks";
          this.framesetOk = true;
          this.redirectAttachToFosterParent = false;
          this.selfClosingFlagAcknowledged = false;
          this.context = "";
          this.pendingTableCharacters = [];
          this.shouldSkipLeadingNewline = false;
          var tree = this;
          var modes = this.insertionModes = {};
          modes.base = {
            end_tag_handlers: {"-default": 'endTagOther'},
            start_tag_handlers: {"-default": 'startTagOther'},
            processEOF: function() {
              tree.generateImpliedEndTags();
              if (tree.openElements.length > 2) {
                tree.parseError('expected-closing-tag-but-got-eof');
              } else if (tree.openElements.length == 2 && tree.openElements.item(1).localName != 'body') {
                tree.parseError('expected-closing-tag-but-got-eof');
              } else if (tree.context && tree.openElements.length > 1) {}
            },
            processComment: function(data) {
              tree.insertComment(data, tree.currentStackItem().node);
            },
            processDoctype: function(name, publicId, systemId, forceQuirks) {
              tree.parseError('unexpected-doctype');
            },
            processStartTag: function(name, attributes, selfClosing) {
              if (this[this.start_tag_handlers[name]]) {
                this[this.start_tag_handlers[name]](name, attributes, selfClosing);
              } else if (this[this.start_tag_handlers["-default"]]) {
                this[this.start_tag_handlers["-default"]](name, attributes, selfClosing);
              } else {
                throw (new Error("No handler found for " + name));
              }
            },
            processEndTag: function(name) {
              if (this[this.end_tag_handlers[name]]) {
                this[this.end_tag_handlers[name]](name);
              } else if (this[this.end_tag_handlers["-default"]]) {
                this[this.end_tag_handlers["-default"]](name);
              } else {
                throw (new Error("No handler found for " + name));
              }
            },
            startTagHtml: function(name, attributes) {
              modes.inBody.startTagHtml(name, attributes);
            }
          };
          modes.initial = Object.create(modes.base);
          modes.initial.processEOF = function() {
            tree.parseError("expected-doctype-but-got-eof");
            this.anythingElse();
            tree.insertionMode.processEOF();
          };
          modes.initial.processComment = function(data) {
            tree.insertComment(data, tree.document);
          };
          modes.initial.processDoctype = function(name, publicId, systemId, forceQuirks) {
            tree.insertDoctype(name || '', publicId || '', systemId || '');
            if (forceQuirks || name != 'html' || (publicId != null && (["+//silmaril//dtd html pro v0r11 19970101//", "-//advasoft ltd//dtd html 3.0 aswedit + extensions//", "-//as//dtd html 3.0 aswedit + extensions//", "-//ietf//dtd html 2.0 level 1//", "-//ietf//dtd html 2.0 level 2//", "-//ietf//dtd html 2.0 strict level 1//", "-//ietf//dtd html 2.0 strict level 2//", "-//ietf//dtd html 2.0 strict//", "-//ietf//dtd html 2.0//", "-//ietf//dtd html 2.1e//", "-//ietf//dtd html 3.0//", "-//ietf//dtd html 3.0//", "-//ietf//dtd html 3.2 final//", "-//ietf//dtd html 3.2//", "-//ietf//dtd html 3//", "-//ietf//dtd html level 0//", "-//ietf//dtd html level 0//", "-//ietf//dtd html level 1//", "-//ietf//dtd html level 1//", "-//ietf//dtd html level 2//", "-//ietf//dtd html level 2//", "-//ietf//dtd html level 3//", "-//ietf//dtd html level 3//", "-//ietf//dtd html strict level 0//", "-//ietf//dtd html strict level 0//", "-//ietf//dtd html strict level 1//", "-//ietf//dtd html strict level 1//", "-//ietf//dtd html strict level 2//", "-//ietf//dtd html strict level 2//", "-//ietf//dtd html strict level 3//", "-//ietf//dtd html strict level 3//", "-//ietf//dtd html strict//", "-//ietf//dtd html strict//", "-//ietf//dtd html strict//", "-//ietf//dtd html//", "-//ietf//dtd html//", "-//ietf//dtd html//", "-//metrius//dtd metrius presentational//", "-//microsoft//dtd internet explorer 2.0 html strict//", "-//microsoft//dtd internet explorer 2.0 html//", "-//microsoft//dtd internet explorer 2.0 tables//", "-//microsoft//dtd internet explorer 3.0 html strict//", "-//microsoft//dtd internet explorer 3.0 html//", "-//microsoft//dtd internet explorer 3.0 tables//", "-//netscape comm. corp.//dtd html//", "-//netscape comm. corp.//dtd strict html//", "-//o'reilly and associates//dtd html 2.0//", "-//o'reilly and associates//dtd html extended 1.0//", "-//spyglass//dtd html 2.0 extended//", "-//sq//dtd html 2.0 hotmetal + extensions//", "-//sun microsystems corp.//dtd hotjava html//", "-//sun microsystems corp.//dtd hotjava strict html//", "-//w3c//dtd html 3 1995-03-24//", "-//w3c//dtd html 3.2 draft//", "-//w3c//dtd html 3.2 final//", "-//w3c//dtd html 3.2//", "-//w3c//dtd html 3.2s draft//", "-//w3c//dtd html 4.0 frameset//", "-//w3c//dtd html 4.0 transitional//", "-//w3c//dtd html experimental 19960712//", "-//w3c//dtd html experimental 970421//", "-//w3c//dtd w3 html//", "-//w3o//dtd w3 html 3.0//", "-//webtechs//dtd mozilla html 2.0//", "-//webtechs//dtd mozilla html//", "html"].some(publicIdStartsWith) || ["-//w3o//dtd w3 html strict 3.0//en//", "-/w3c/dtd html 4.0 transitional/en", "html"].indexOf(publicId.toLowerCase()) > -1 || (systemId == null && ["-//w3c//dtd html 4.01 transitional//", "-//w3c//dtd html 4.01 frameset//"].some(publicIdStartsWith)))) || (systemId != null && (systemId.toLowerCase() == "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd"))) {
              tree.compatMode = "quirks";
              tree.parseError("quirky-doctype");
            } else if (publicId != null && (["-//w3c//dtd xhtml 1.0 transitional//", "-//w3c//dtd xhtml 1.0 frameset//"].some(publicIdStartsWith) || (systemId != null && ["-//w3c//dtd html 4.01 transitional//", "-//w3c//dtd html 4.01 frameset//"].indexOf(publicId.toLowerCase()) > -1))) {
              tree.compatMode = "limited quirks";
              tree.parseError("almost-standards-doctype");
            } else {
              if ((publicId == "-//W3C//DTD HTML 4.0//EN" && (systemId == null || systemId == "http://www.w3.org/TR/REC-html40/strict.dtd")) || (publicId == "-//W3C//DTD HTML 4.01//EN" && (systemId == null || systemId == "http://www.w3.org/TR/html4/strict.dtd")) || (publicId == "-//W3C//DTD XHTML 1.0 Strict//EN" && (systemId == "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd")) || (publicId == "-//W3C//DTD XHTML 1.1//EN" && (systemId == "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"))) {} else if (!((systemId == null || systemId == "about:legacy-compat") && publicId == null)) {
                tree.parseError("unknown-doctype");
              }
            }
            tree.setInsertionMode('beforeHTML');
            function publicIdStartsWith(string) {
              return publicId.toLowerCase().indexOf(string) === 0;
            }
          };
          modes.initial.processCharacters = function(buffer) {
            buffer.skipLeadingWhitespace();
            if (!buffer.length)
              return;
            tree.parseError('expected-doctype-but-got-chars');
            this.anythingElse();
            tree.insertionMode.processCharacters(buffer);
          };
          modes.initial.processStartTag = function(name, attributes, selfClosing) {
            tree.parseError('expected-doctype-but-got-start-tag', {name: name});
            this.anythingElse();
            tree.insertionMode.processStartTag(name, attributes, selfClosing);
          };
          modes.initial.processEndTag = function(name) {
            tree.parseError('expected-doctype-but-got-end-tag', {name: name});
            this.anythingElse();
            tree.insertionMode.processEndTag(name);
          };
          modes.initial.anythingElse = function() {
            tree.compatMode = 'quirks';
            tree.setInsertionMode('beforeHTML');
          };
          modes.beforeHTML = Object.create(modes.base);
          modes.beforeHTML.start_tag_handlers = {
            html: 'startTagHtml',
            '-default': 'startTagOther'
          };
          modes.beforeHTML.processEOF = function() {
            this.anythingElse();
            tree.insertionMode.processEOF();
          };
          modes.beforeHTML.processComment = function(data) {
            tree.insertComment(data, tree.document);
          };
          modes.beforeHTML.processCharacters = function(buffer) {
            buffer.skipLeadingWhitespace();
            if (!buffer.length)
              return;
            this.anythingElse();
            tree.insertionMode.processCharacters(buffer);
          };
          modes.beforeHTML.startTagHtml = function(name, attributes, selfClosing) {
            tree.insertHtmlElement(attributes);
            tree.setInsertionMode('beforeHead');
          };
          modes.beforeHTML.startTagOther = function(name, attributes, selfClosing) {
            this.anythingElse();
            tree.insertionMode.processStartTag(name, attributes, selfClosing);
          };
          modes.beforeHTML.processEndTag = function(name) {
            this.anythingElse();
            tree.insertionMode.processEndTag(name);
          };
          modes.beforeHTML.anythingElse = function() {
            tree.insertHtmlElement();
            tree.setInsertionMode('beforeHead');
          };
          modes.afterAfterBody = Object.create(modes.base);
          modes.afterAfterBody.start_tag_handlers = {
            html: 'startTagHtml',
            '-default': 'startTagOther'
          };
          modes.afterAfterBody.processComment = function(data) {
            tree.insertComment(data, tree.document);
          };
          modes.afterAfterBody.processDoctype = function(data) {
            modes.inBody.processDoctype(data);
          };
          modes.afterAfterBody.startTagHtml = function(data, attributes) {
            modes.inBody.startTagHtml(data, attributes);
          };
          modes.afterAfterBody.startTagOther = function(name, attributes, selfClosing) {
            tree.parseError('unexpected-start-tag', {name: name});
            tree.setInsertionMode('inBody');
            tree.insertionMode.processStartTag(name, attributes, selfClosing);
          };
          modes.afterAfterBody.endTagOther = function(name) {
            tree.parseError('unexpected-end-tag', {name: name});
            tree.setInsertionMode('inBody');
            tree.insertionMode.processEndTag(name);
          };
          modes.afterAfterBody.processCharacters = function(data) {
            if (!isAllWhitespace_1.default(data.characters)) {
              tree.parseError('unexpected-char-after-body');
              tree.setInsertionMode('inBody');
              return tree.insertionMode.processCharacters(data);
            }
            modes.inBody.processCharacters(data);
          };
          modes.afterBody = Object.create(modes.base);
          modes.afterBody.end_tag_handlers = {
            html: 'endTagHtml',
            '-default': 'endTagOther'
          };
          modes.afterBody.processComment = function(data) {
            tree.insertComment(data, tree.openElements.rootNode);
          };
          modes.afterBody.processCharacters = function(data) {
            if (!isAllWhitespace_1.default(data.characters)) {
              tree.parseError('unexpected-char-after-body');
              tree.setInsertionMode('inBody');
              return tree.insertionMode.processCharacters(data);
            }
            modes.inBody.processCharacters(data);
          };
          modes.afterBody.processStartTag = function(name, attributes, selfClosing) {
            tree.parseError('unexpected-start-tag-after-body', {name: name});
            tree.setInsertionMode('inBody');
            tree.insertionMode.processStartTag(name, attributes, selfClosing);
          };
          modes.afterBody.endTagHtml = function(name) {
            if (tree.context) {
              tree.parseError('end-html-in-innerhtml');
            } else {
              tree.setInsertionMode('afterAfterBody');
            }
          };
          modes.afterBody.endTagOther = function(name) {
            tree.parseError('unexpected-end-tag-after-body', {name: name});
            tree.setInsertionMode('inBody');
            tree.insertionMode.processEndTag(name);
          };
          modes.afterFrameset = Object.create(modes.base);
          modes.afterFrameset.start_tag_handlers = {
            html: 'startTagHtml',
            noframes: 'startTagNoframes',
            '-default': 'startTagOther'
          };
          modes.afterFrameset.end_tag_handlers = {
            html: 'endTagHtml',
            '-default': 'endTagOther'
          };
          modes.afterFrameset.processCharacters = function(buffer) {
            var characters = buffer.takeRemaining();
            var whitespace = "";
            for (var i = 0; i < characters.length; i++) {
              var ch = characters[i];
              if (isWhitespace_1.default(ch))
                whitespace += ch;
            }
            if (whitespace) {
              tree.insertText(whitespace);
            }
            if (whitespace.length < characters.length)
              tree.parseError('expected-eof-but-got-char');
          };
          modes.afterFrameset.startTagNoframes = function(name, attributes) {
            modes.inHead.processStartTag(name, attributes);
          };
          modes.afterFrameset.startTagOther = function(name, attributes) {
            tree.parseError("unexpected-start-tag-after-frameset", {name: name});
          };
          modes.afterFrameset.endTagHtml = function(name) {
            tree.setInsertionMode('afterAfterFrameset');
          };
          modes.afterFrameset.endTagOther = function(name) {
            tree.parseError("unexpected-end-tag-after-frameset", {name: name});
          };
          modes.beforeHead = Object.create(modes.base);
          modes.beforeHead.start_tag_handlers = {
            html: 'startTagHtml',
            head: 'startTagHead',
            '-default': 'startTagOther'
          };
          modes.beforeHead.end_tag_handlers = {
            html: 'endTagImplyHead',
            head: 'endTagImplyHead',
            body: 'endTagImplyHead',
            br: 'endTagImplyHead',
            '-default': 'endTagOther'
          };
          modes.beforeHead.processEOF = function() {
            this.startTagHead('head', []);
            tree.insertionMode.processEOF();
          };
          modes.beforeHead.processCharacters = function(buffer) {
            buffer.skipLeadingWhitespace();
            if (!buffer.length)
              return;
            this.startTagHead('head', []);
            tree.insertionMode.processCharacters(buffer);
          };
          modes.beforeHead.startTagHead = function(name, attributes) {
            tree.insertHeadElement(attributes);
            tree.setInsertionMode('inHead');
          };
          modes.beforeHead.startTagOther = function(name, attributes, selfClosing) {
            this.startTagHead('head', []);
            tree.insertionMode.processStartTag(name, attributes, selfClosing);
          };
          modes.beforeHead.endTagImplyHead = function(name) {
            this.startTagHead('head', []);
            tree.insertionMode.processEndTag(name);
          };
          modes.beforeHead.endTagOther = function(name) {
            tree.parseError('end-tag-after-implied-root', {name: name});
          };
          modes.inHead = Object.create(modes.base);
          modes.inHead.start_tag_handlers = {
            html: 'startTagHtml',
            head: 'startTagHead',
            title: 'startTagTitle',
            script: 'startTagScript',
            style: 'startTagNoFramesStyle',
            noscript: 'startTagNoScript',
            noframes: 'startTagNoFramesStyle',
            base: 'startTagBaseBasefontBgsoundLink',
            basefont: 'startTagBaseBasefontBgsoundLink',
            bgsound: 'startTagBaseBasefontBgsoundLink',
            link: 'startTagBaseBasefontBgsoundLink',
            meta: 'startTagMeta',
            "-default": 'startTagOther'
          };
          modes.inHead.end_tag_handlers = {
            head: 'endTagHead',
            html: 'endTagHtmlBodyBr',
            body: 'endTagHtmlBodyBr',
            br: 'endTagHtmlBodyBr',
            "-default": 'endTagOther'
          };
          modes.inHead.processEOF = function() {
            var name = tree.currentStackItem().localName;
            if (['title', 'style', 'script'].indexOf(name) != -1) {
              tree.parseError("expected-named-closing-tag-but-got-eof", {name: name});
              tree.popElement();
            }
            this.anythingElse();
            tree.insertionMode.processEOF();
          };
          modes.inHead.processCharacters = function(buffer) {
            var leadingWhitespace = buffer.takeLeadingWhitespace();
            if (leadingWhitespace)
              tree.insertText(leadingWhitespace);
            if (!buffer.length)
              return;
            this.anythingElse();
            tree.insertionMode.processCharacters(buffer);
          };
          modes.inHead.startTagHtml = function(name, attributes) {
            modes.inBody.processStartTag(name, attributes);
          };
          modes.inHead.startTagHead = function(name, attributes) {
            tree.parseError('two-heads-are-not-better-than-one');
          };
          modes.inHead.startTagTitle = function(name, attributes) {
            tree.processGenericRCDATAStartTag(name, attributes);
          };
          modes.inHead.startTagNoScript = function(name, attributes) {
            if (tree.scriptingEnabled)
              return tree.processGenericRawTextStartTag(name, attributes);
            tree.insertElement(name, attributes);
            tree.setInsertionMode('inHeadNoscript');
          };
          modes.inHead.startTagNoFramesStyle = function(name, attributes) {
            tree.processGenericRawTextStartTag(name, attributes);
          };
          modes.inHead.startTagScript = function(name, attributes) {
            tree.insertElement(name, attributes);
            tree.tokenizer.setState(Tokenizer_1.default.SCRIPT_DATA);
            tree.originalInsertionMode = tree.insertionModeName;
            tree.setInsertionMode('text');
          };
          modes.inHead.startTagBaseBasefontBgsoundLink = function(name, attributes) {
            tree.insertSelfClosingElement(name, attributes);
          };
          modes.inHead.startTagMeta = function(name, attributes) {
            tree.insertSelfClosingElement(name, attributes);
          };
          modes.inHead.startTagOther = function(name, attributes, selfClosing) {
            this.anythingElse();
            tree.insertionMode.processStartTag(name, attributes, selfClosing);
          };
          modes.inHead.endTagHead = function(name) {
            if (tree.openElements.item(tree.openElements.length - 1).localName == 'head') {
              tree.openElements.pop();
            } else {
              tree.parseError('unexpected-end-tag', {name: 'head'});
            }
            tree.setInsertionMode('afterHead');
          };
          modes.inHead.endTagHtmlBodyBr = function(name) {
            this.anythingElse();
            tree.insertionMode.processEndTag(name);
          };
          modes.inHead.endTagOther = function(name) {
            tree.parseError('unexpected-end-tag', {name: name});
          };
          modes.inHead.anythingElse = function() {
            this.endTagHead('head');
          };
          modes.afterHead = Object.create(modes.base);
          modes.afterHead.start_tag_handlers = {
            html: 'startTagHtml',
            head: 'startTagHead',
            body: 'startTagBody',
            frameset: 'startTagFrameset',
            base: 'startTagFromHead',
            link: 'startTagFromHead',
            meta: 'startTagFromHead',
            script: 'startTagFromHead',
            style: 'startTagFromHead',
            title: 'startTagFromHead',
            "-default": 'startTagOther'
          };
          modes.afterHead.end_tag_handlers = {
            body: 'endTagBodyHtmlBr',
            html: 'endTagBodyHtmlBr',
            br: 'endTagBodyHtmlBr',
            "-default": 'endTagOther'
          };
          modes.afterHead.processEOF = function() {
            this.anythingElse();
            tree.insertionMode.processEOF();
          };
          modes.afterHead.processCharacters = function(buffer) {
            var leadingWhitespace = buffer.takeLeadingWhitespace();
            if (leadingWhitespace)
              tree.insertText(leadingWhitespace);
            if (!buffer.length)
              return;
            this.anythingElse();
            tree.insertionMode.processCharacters(buffer);
          };
          modes.afterHead.startTagHtml = function(name, attributes) {
            modes.inBody.processStartTag(name, attributes);
          };
          modes.afterHead.startTagBody = function(name, attributes) {
            tree.framesetOk = false;
            tree.insertBodyElement(attributes);
            tree.setInsertionMode('inBody');
          };
          modes.afterHead.startTagFrameset = function(name, attributes) {
            tree.insertElement(name, attributes);
            tree.setInsertionMode('inFrameset');
          };
          modes.afterHead.startTagFromHead = function(name, attributes, selfClosing) {
            tree.parseError("unexpected-start-tag-out-of-my-head", {name: name});
            tree.openElements.push(tree.head);
            modes.inHead.processStartTag(name, attributes, selfClosing);
            tree.openElements.remove(tree.head);
          };
          modes.afterHead.startTagHead = function(name, attributes, selfClosing) {
            tree.parseError('unexpected-start-tag', {name: name});
          };
          modes.afterHead.startTagOther = function(name, attributes, selfClosing) {
            this.anythingElse();
            tree.insertionMode.processStartTag(name, attributes, selfClosing);
          };
          modes.afterHead.endTagBodyHtmlBr = function(name) {
            this.anythingElse();
            tree.insertionMode.processEndTag(name);
          };
          modes.afterHead.endTagOther = function(name) {
            tree.parseError('unexpected-end-tag', {name: name});
          };
          modes.afterHead.anythingElse = function() {
            tree.insertBodyElement([]);
            tree.setInsertionMode('inBody');
            tree.framesetOk = true;
          };
          modes.inBody = Object.create(modes.base);
          modes.inBody.start_tag_handlers = {
            html: 'startTagHtml',
            head: 'startTagMisplaced',
            base: 'startTagProcessInHead',
            basefont: 'startTagProcessInHead',
            bgsound: 'startTagProcessInHead',
            link: 'startTagProcessInHead',
            meta: 'startTagProcessInHead',
            noframes: 'startTagProcessInHead',
            script: 'startTagProcessInHead',
            style: 'startTagProcessInHead',
            title: 'startTagProcessInHead',
            body: 'startTagBody',
            form: 'startTagForm',
            plaintext: 'startTagPlaintext',
            a: 'startTagA',
            button: 'startTagButton',
            xmp: 'startTagXmp',
            table: 'startTagTable',
            hr: 'startTagHr',
            image: 'startTagImage',
            input: 'startTagInput',
            textarea: 'startTagTextarea',
            select: 'startTagSelect',
            isindex: 'startTagIsindex',
            applet: 'startTagAppletMarqueeObject',
            marquee: 'startTagAppletMarqueeObject',
            object: 'startTagAppletMarqueeObject',
            li: 'startTagListItem',
            dd: 'startTagListItem',
            dt: 'startTagListItem',
            address: 'startTagCloseP',
            article: 'startTagCloseP',
            aside: 'startTagCloseP',
            blockquote: 'startTagCloseP',
            center: 'startTagCloseP',
            details: 'startTagCloseP',
            dir: 'startTagCloseP',
            div: 'startTagCloseP',
            dl: 'startTagCloseP',
            fieldset: 'startTagCloseP',
            figcaption: 'startTagCloseP',
            figure: 'startTagCloseP',
            footer: 'startTagCloseP',
            header: 'startTagCloseP',
            hgroup: 'startTagCloseP',
            main: 'startTagCloseP',
            menu: 'startTagCloseP',
            nav: 'startTagCloseP',
            ol: 'startTagCloseP',
            p: 'startTagCloseP',
            section: 'startTagCloseP',
            summary: 'startTagCloseP',
            ul: 'startTagCloseP',
            listing: 'startTagPreListing',
            pre: 'startTagPreListing',
            b: 'startTagFormatting',
            big: 'startTagFormatting',
            code: 'startTagFormatting',
            em: 'startTagFormatting',
            font: 'startTagFormatting',
            i: 'startTagFormatting',
            s: 'startTagFormatting',
            small: 'startTagFormatting',
            strike: 'startTagFormatting',
            strong: 'startTagFormatting',
            tt: 'startTagFormatting',
            u: 'startTagFormatting',
            nobr: 'startTagNobr',
            area: 'startTagVoidFormatting',
            br: 'startTagVoidFormatting',
            embed: 'startTagVoidFormatting',
            img: 'startTagVoidFormatting',
            keygen: 'startTagVoidFormatting',
            wbr: 'startTagVoidFormatting',
            param: 'startTagParamSourceTrack',
            source: 'startTagParamSourceTrack',
            track: 'startTagParamSourceTrack',
            iframe: 'startTagIFrame',
            noembed: 'startTagRawText',
            noscript: 'startTagRawText',
            h1: 'startTagHeading',
            h2: 'startTagHeading',
            h3: 'startTagHeading',
            h4: 'startTagHeading',
            h5: 'startTagHeading',
            h6: 'startTagHeading',
            caption: 'startTagMisplaced',
            col: 'startTagMisplaced',
            colgroup: 'startTagMisplaced',
            frame: 'startTagMisplaced',
            frameset: 'startTagFrameset',
            tbody: 'startTagMisplaced',
            td: 'startTagMisplaced',
            tfoot: 'startTagMisplaced',
            th: 'startTagMisplaced',
            thead: 'startTagMisplaced',
            tr: 'startTagMisplaced',
            option: 'startTagOptionOptgroup',
            optgroup: 'startTagOptionOptgroup',
            math: 'startTagMath',
            svg: 'startTagSVG',
            rt: 'startTagRpRt',
            rp: 'startTagRpRt',
            "-default": 'startTagOther'
          };
          modes.inBody.end_tag_handlers = {
            p: 'endTagP',
            body: 'endTagBody',
            html: 'endTagHtml',
            address: 'endTagBlock',
            article: 'endTagBlock',
            aside: 'endTagBlock',
            blockquote: 'endTagBlock',
            button: 'endTagBlock',
            center: 'endTagBlock',
            details: 'endTagBlock',
            dir: 'endTagBlock',
            div: 'endTagBlock',
            dl: 'endTagBlock',
            fieldset: 'endTagBlock',
            figcaption: 'endTagBlock',
            figure: 'endTagBlock',
            footer: 'endTagBlock',
            header: 'endTagBlock',
            hgroup: 'endTagBlock',
            listing: 'endTagBlock',
            main: 'endTagBlock',
            menu: 'endTagBlock',
            nav: 'endTagBlock',
            ol: 'endTagBlock',
            pre: 'endTagBlock',
            section: 'endTagBlock',
            summary: 'endTagBlock',
            ul: 'endTagBlock',
            form: 'endTagForm',
            applet: 'endTagAppletMarqueeObject',
            marquee: 'endTagAppletMarqueeObject',
            object: 'endTagAppletMarqueeObject',
            dd: 'endTagListItem',
            dt: 'endTagListItem',
            li: 'endTagListItem',
            h1: 'endTagHeading',
            h2: 'endTagHeading',
            h3: 'endTagHeading',
            h4: 'endTagHeading',
            h5: 'endTagHeading',
            h6: 'endTagHeading',
            a: 'endTagFormatting',
            b: 'endTagFormatting',
            big: 'endTagFormatting',
            code: 'endTagFormatting',
            em: 'endTagFormatting',
            font: 'endTagFormatting',
            i: 'endTagFormatting',
            nobr: 'endTagFormatting',
            s: 'endTagFormatting',
            small: 'endTagFormatting',
            strike: 'endTagFormatting',
            strong: 'endTagFormatting',
            tt: 'endTagFormatting',
            u: 'endTagFormatting',
            br: 'endTagBr',
            "-default": 'endTagOther'
          };
          modes.inBody.processCharacters = function(buffer) {
            if (tree.shouldSkipLeadingNewline) {
              tree.shouldSkipLeadingNewline = false;
              buffer.skipAtMostOneLeadingNewline();
            }
            tree.reconstructActiveFormattingElements();
            var characters = buffer.takeRemaining();
            characters = characters.replace(/\u0000/g, function(match, index) {
              tree.parseError("invalid-codepoint");
              return '';
            });
            if (!characters)
              return;
            tree.insertText(characters);
            if (tree.framesetOk && !isAllWhitespaceOrReplacementCharacters_1.default(characters))
              tree.framesetOk = false;
          };
          modes.inBody.startTagHtml = function(name, attributes) {
            tree.parseError('non-html-root');
            tree.addAttributesToElement(tree.openElements.rootNode, attributes);
          };
          modes.inBody.startTagProcessInHead = function(name, attributes) {
            modes.inHead.processStartTag(name, attributes);
          };
          modes.inBody.startTagBody = function(name, attributes) {
            tree.parseError('unexpected-start-tag', {name: 'body'});
            if (tree.openElements.length == 1 || tree.openElements.item(1).localName != 'body') {} else {
              tree.framesetOk = false;
              tree.addAttributesToElement(tree.openElements.bodyElement, attributes);
            }
          };
          modes.inBody.startTagFrameset = function(name, attributes) {
            tree.parseError('unexpected-start-tag', {name: 'frameset'});
            if (tree.openElements.length == 1 || tree.openElements.item(1).localName != 'body') {} else if (tree.framesetOk) {
              tree.detachFromParent(tree.openElements.bodyElement);
              while (tree.openElements.length > 1)
                tree.openElements.pop();
              tree.insertElement(name, attributes);
              tree.setInsertionMode('inFrameset');
            }
          };
          modes.inBody.startTagCloseP = function(name, attributes) {
            if (tree.openElements.inButtonScope('p'))
              this.endTagP('p');
            tree.insertElement(name, attributes);
          };
          modes.inBody.startTagPreListing = function(name, attributes) {
            if (tree.openElements.inButtonScope('p'))
              this.endTagP('p');
            tree.insertElement(name, attributes);
            tree.framesetOk = false;
            tree.shouldSkipLeadingNewline = true;
          };
          modes.inBody.startTagForm = function(name, attributes) {
            if (tree.form) {
              tree.parseError('unexpected-start-tag', {name: name});
            } else {
              if (tree.openElements.inButtonScope('p'))
                this.endTagP('p');
              tree.insertElement(name, attributes);
              tree.form = tree.currentStackItem();
            }
          };
          modes.inBody.startTagRpRt = function(name, attributes) {
            if (tree.openElements.inScope('ruby')) {
              tree.generateImpliedEndTags();
              if (tree.currentStackItem().localName != 'ruby') {
                tree.parseError('unexpected-start-tag', {name: name});
              }
            }
            tree.insertElement(name, attributes);
          };
          modes.inBody.startTagListItem = function(name, attributes) {
            var stopNames = {
              li: ['li'],
              dd: ['dd', 'dt'],
              dt: ['dd', 'dt']
            };
            var stopName = stopNames[name];
            var els = tree.openElements;
            for (var i = els.length - 1; i >= 0; i--) {
              var node = els.item(i);
              if (stopName.indexOf(node.localName) != -1) {
                tree.insertionMode.processEndTag(node.localName);
                break;
              }
              if (node.isSpecial() && node.localName !== 'p' && node.localName !== 'address' && node.localName !== 'div')
                break;
            }
            if (tree.openElements.inButtonScope('p'))
              this.endTagP('p');
            tree.insertElement(name, attributes);
            tree.framesetOk = false;
          };
          modes.inBody.startTagPlaintext = function(name, attributes) {
            if (tree.openElements.inButtonScope('p'))
              this.endTagP('p');
            tree.insertElement(name, attributes);
            tree.tokenizer.setState(Tokenizer_1.default.PLAINTEXT);
          };
          modes.inBody.startTagHeading = function(name, attributes) {
            if (tree.openElements.inButtonScope('p'))
              this.endTagP('p');
            if (tree.currentStackItem().isNumberedHeader()) {
              tree.parseError('unexpected-start-tag', {name: name});
              tree.popElement();
            }
            tree.insertElement(name, attributes);
          };
          modes.inBody.startTagA = function(name, attributes) {
            var activeA = tree.elementInActiveFormattingElements('a');
            if (activeA) {
              tree.parseError("unexpected-start-tag-implies-end-tag", {
                startName: "a",
                endName: "a"
              });
              tree.adoptionAgencyEndTag('a');
              if (tree.openElements.contains(activeA))
                tree.openElements.remove(activeA);
              tree.removeElementFromActiveFormattingElements(activeA);
            }
            tree.reconstructActiveFormattingElements();
            tree.insertFormattingElement(name, attributes);
          };
          modes.inBody.startTagFormatting = function(name, attributes) {
            tree.reconstructActiveFormattingElements();
            tree.insertFormattingElement(name, attributes);
          };
          modes.inBody.startTagNobr = function(name, attributes) {
            tree.reconstructActiveFormattingElements();
            if (tree.openElements.inScope('nobr')) {
              tree.parseError("unexpected-start-tag-implies-end-tag", {
                startName: 'nobr',
                endName: 'nobr'
              });
              this.processEndTag('nobr');
              tree.reconstructActiveFormattingElements();
            }
            tree.insertFormattingElement(name, attributes);
          };
          modes.inBody.startTagButton = function(name, attributes) {
            if (tree.openElements.inScope('button')) {
              tree.parseError('unexpected-start-tag-implies-end-tag', {
                startName: 'button',
                endName: 'button'
              });
              this.processEndTag('button');
              tree.insertionMode.processStartTag(name, attributes);
            } else {
              tree.framesetOk = false;
              tree.reconstructActiveFormattingElements();
              tree.insertElement(name, attributes);
            }
          };
          modes.inBody.startTagAppletMarqueeObject = function(name, attributes) {
            tree.reconstructActiveFormattingElements();
            tree.insertElement(name, attributes);
            tree.activeFormattingElements.push(Marker);
            tree.framesetOk = false;
          };
          modes.inBody.endTagAppletMarqueeObject = function(name) {
            if (!tree.openElements.inScope(name)) {
              tree.parseError("unexpected-end-tag", {name: name});
            } else {
              tree.generateImpliedEndTags();
              if (tree.currentStackItem().localName != name) {
                tree.parseError('end-tag-too-early', {name: name});
              }
              tree.openElements.popUntilPopped(name);
              tree.clearActiveFormattingElements();
            }
          };
          modes.inBody.startTagXmp = function(name, attributes) {
            if (tree.openElements.inButtonScope('p'))
              this.processEndTag('p');
            tree.reconstructActiveFormattingElements();
            tree.processGenericRawTextStartTag(name, attributes);
            tree.framesetOk = false;
          };
          modes.inBody.startTagTable = function(name, attributes) {
            if (tree.compatMode !== "quirks")
              if (tree.openElements.inButtonScope('p'))
                this.processEndTag('p');
            tree.insertElement(name, attributes);
            tree.setInsertionMode('inTable');
            tree.framesetOk = false;
          };
          modes.inBody.startTagVoidFormatting = function(name, attributes) {
            tree.reconstructActiveFormattingElements();
            tree.insertSelfClosingElement(name, attributes);
            tree.framesetOk = false;
          };
          modes.inBody.startTagParamSourceTrack = function(name, attributes) {
            tree.insertSelfClosingElement(name, attributes);
          };
          modes.inBody.startTagHr = function(name, attributes) {
            if (tree.openElements.inButtonScope('p'))
              this.endTagP('p');
            tree.insertSelfClosingElement(name, attributes);
            tree.framesetOk = false;
          };
          modes.inBody.startTagImage = function(name, attributes) {
            tree.parseError('unexpected-start-tag-treated-as', {
              originalName: 'image',
              newName: 'img'
            });
            this.processStartTag('img', attributes);
          };
          modes.inBody.startTagInput = function(name, attributes) {
            var currentFramesetOk = tree.framesetOk;
            this.startTagVoidFormatting(name, attributes);
            for (var key in attributes) {
              if (attributes[key].nodeName == 'type') {
                if (attributes[key].nodeValue.toLowerCase() == 'hidden')
                  tree.framesetOk = currentFramesetOk;
                break;
              }
            }
          };
          modes.inBody.startTagIsindex = function(name, attributes) {
            tree.parseError('deprecated-tag', {name: 'isindex'});
            tree.selfClosingFlagAcknowledged = true;
            if (tree.form)
              return;
            var formAttributes = [];
            var inputAttributes = [];
            var prompt = "This is a searchable index. Enter search keywords: ";
            for (var key in attributes) {
              switch (attributes[key].nodeName) {
                case 'action':
                  formAttributes.push({
                    nodeName: 'action',
                    nodeValue: attributes[key].nodeValue
                  });
                  break;
                case 'prompt':
                  prompt = attributes[key].nodeValue;
                  break;
                case 'name':
                  break;
                default:
                  inputAttributes.push({
                    nodeName: attributes[key].nodeName,
                    nodeValue: attributes[key].nodeValue
                  });
              }
            }
            inputAttributes.push({
              nodeName: 'name',
              nodeValue: 'isindex'
            });
            this.processStartTag('form', formAttributes);
            this.processStartTag('hr');
            this.processStartTag('label');
            this.processCharacters(new CharacterBuffer_1.default(prompt));
            this.processStartTag('input', inputAttributes);
            this.processEndTag('label');
            this.processStartTag('hr');
            this.processEndTag('form');
          };
          modes.inBody.startTagTextarea = function(name, attributes) {
            tree.insertElement(name, attributes);
            tree.tokenizer.setState(Tokenizer_1.default.RCDATA);
            tree.originalInsertionMode = tree.insertionModeName;
            tree.shouldSkipLeadingNewline = true;
            tree.framesetOk = false;
            tree.setInsertionMode('text');
          };
          modes.inBody.startTagIFrame = function(name, attributes) {
            tree.framesetOk = false;
            this.startTagRawText(name, attributes);
          };
          modes.inBody.startTagRawText = function(name, attributes) {
            tree.processGenericRawTextStartTag(name, attributes);
          };
          modes.inBody.startTagSelect = function(name, attributes) {
            tree.reconstructActiveFormattingElements();
            tree.insertElement(name, attributes);
            tree.framesetOk = false;
            var insertionModeName = tree.insertionModeName;
            if (insertionModeName == 'inTable' || insertionModeName == 'inCaption' || insertionModeName == 'inColumnGroup' || insertionModeName == 'inTableBody' || insertionModeName == 'inRow' || insertionModeName == 'inCell') {
              tree.setInsertionMode('inSelectInTable');
            } else {
              tree.setInsertionMode('inSelect');
            }
          };
          modes.inBody.startTagMisplaced = function(name, attributes) {
            tree.parseError('unexpected-start-tag-ignored', {name: name});
          };
          modes.inBody.endTagMisplaced = function(name) {
            tree.parseError("unexpected-end-tag", {name: name});
          };
          modes.inBody.endTagBr = function(name) {
            tree.parseError("unexpected-end-tag-treated-as", {
              originalName: "br",
              newName: "br element"
            });
            tree.reconstructActiveFormattingElements();
            tree.insertElement(name, []);
            tree.popElement();
          };
          modes.inBody.startTagOptionOptgroup = function(name, attributes) {
            if (tree.currentStackItem().localName == 'option')
              tree.popElement();
            tree.reconstructActiveFormattingElements();
            tree.insertElement(name, attributes);
          };
          modes.inBody.startTagOther = function(name, attributes) {
            tree.reconstructActiveFormattingElements();
            tree.insertElement(name, attributes);
          };
          modes.inBody.endTagOther = function(name) {
            var node;
            for (var i = tree.openElements.length - 1; i > 0; i--) {
              node = tree.openElements.item(i);
              if (node.localName == name) {
                tree.generateImpliedEndTags(name);
                if (tree.currentStackItem().localName != name)
                  tree.parseError('unexpected-end-tag', {name: name});
                tree.openElements.remove_openElements_until(function(x) {
                  return x === node;
                });
                break;
              }
              if (node.isSpecial()) {
                tree.parseError('unexpected-end-tag', {name: name});
                break;
              }
            }
          };
          modes.inBody.startTagMath = function(name, attributes, selfClosing) {
            tree.reconstructActiveFormattingElements();
            attributes = tree.adjustMathMLAttributes(attributes);
            attributes = tree.adjustForeignAttributes(attributes);
            tree.insertForeignElement(name, attributes, "http://www.w3.org/1998/Math/MathML", selfClosing);
          };
          modes.inBody.startTagSVG = function(name, attributes, selfClosing) {
            tree.reconstructActiveFormattingElements();
            attributes = tree.adjustSVGAttributes(attributes);
            attributes = tree.adjustForeignAttributes(attributes);
            tree.insertForeignElement(name, attributes, "http://www.w3.org/2000/svg", selfClosing);
          };
          modes.inBody.endTagP = function(name) {
            if (!tree.openElements.inButtonScope('p')) {
              tree.parseError('unexpected-end-tag', {name: 'p'});
              this.startTagCloseP('p', []);
              this.endTagP('p');
            } else {
              tree.generateImpliedEndTags('p');
              if (tree.currentStackItem().localName != 'p')
                tree.parseError('unexpected-implied-end-tag', {name: 'p'});
              tree.openElements.popUntilPopped(name);
            }
          };
          modes.inBody.endTagBody = function(name) {
            if (!tree.openElements.inScope('body')) {
              tree.parseError('unexpected-end-tag', {name: name});
              return;
            }
            if (tree.currentStackItem().localName != 'body') {
              tree.parseError('expected-one-end-tag-but-got-another', {
                expectedName: tree.currentStackItem().localName,
                gotName: name
              });
            }
            tree.setInsertionMode('afterBody');
          };
          modes.inBody.endTagHtml = function(name) {
            if (!tree.openElements.inScope('body')) {
              tree.parseError('unexpected-end-tag', {name: name});
              return;
            }
            if (tree.currentStackItem().localName != 'body') {
              tree.parseError('expected-one-end-tag-but-got-another', {
                expectedName: tree.currentStackItem().localName,
                gotName: name
              });
            }
            tree.setInsertionMode('afterBody');
            tree.insertionMode.processEndTag(name);
          };
          modes.inBody.endTagBlock = function(name) {
            if (!tree.openElements.inScope(name)) {
              tree.parseError('unexpected-end-tag', {name: name});
            } else {
              tree.generateImpliedEndTags();
              if (tree.currentStackItem().localName != name) {
                tree.parseError('end-tag-too-early', {name: name});
              }
              tree.openElements.popUntilPopped(name);
            }
          };
          modes.inBody.endTagForm = function(name) {
            var node = tree.form;
            tree.form = null;
            if (!node || !tree.openElements.inScope(name)) {
              tree.parseError('unexpected-end-tag', {name: name});
            } else {
              tree.generateImpliedEndTags();
              if (tree.currentStackItem() != node) {
                tree.parseError('end-tag-too-early-ignored', {name: 'form'});
              }
              tree.openElements.remove(node);
            }
          };
          modes.inBody.endTagListItem = function(name) {
            if (!tree.openElements.inListItemScope(name)) {
              tree.parseError('unexpected-end-tag', {name: name});
            } else {
              tree.generateImpliedEndTags(name);
              if (tree.currentStackItem().localName != name)
                tree.parseError('end-tag-too-early', {name: name});
              tree.openElements.popUntilPopped(name);
            }
          };
          modes.inBody.endTagHeading = function(name) {
            if (!tree.openElements.hasNumberedHeaderElementInScope()) {
              tree.parseError('unexpected-end-tag', {name: name});
              return;
            }
            tree.generateImpliedEndTags();
            if (tree.currentStackItem().localName != name)
              tree.parseError('end-tag-too-early', {name: name});
            tree.openElements.remove_openElements_until(function(e) {
              return e.isNumberedHeader();
            });
          };
          modes.inBody.endTagFormatting = function(name, attributes) {
            if (!tree.adoptionAgencyEndTag(name))
              this.endTagOther(name, attributes);
          };
          modes.inCaption = Object.create(modes.base);
          modes.inCaption.start_tag_handlers = {
            html: 'startTagHtml',
            caption: 'startTagTableElement',
            col: 'startTagTableElement',
            colgroup: 'startTagTableElement',
            tbody: 'startTagTableElement',
            td: 'startTagTableElement',
            tfoot: 'startTagTableElement',
            thead: 'startTagTableElement',
            tr: 'startTagTableElement',
            '-default': 'startTagOther'
          };
          modes.inCaption.end_tag_handlers = {
            caption: 'endTagCaption',
            table: 'endTagTable',
            body: 'endTagIgnore',
            col: 'endTagIgnore',
            colgroup: 'endTagIgnore',
            html: 'endTagIgnore',
            tbody: 'endTagIgnore',
            td: 'endTagIgnore',
            tfood: 'endTagIgnore',
            thead: 'endTagIgnore',
            tr: 'endTagIgnore',
            '-default': 'endTagOther'
          };
          modes.inCaption.processCharacters = function(data) {
            modes.inBody.processCharacters(data);
          };
          modes.inCaption.startTagTableElement = function(name, attributes) {
            tree.parseError('unexpected-end-tag', {name: name});
            var ignoreEndTag = !tree.openElements.inTableScope('caption');
            tree.insertionMode.processEndTag('caption');
            if (!ignoreEndTag)
              tree.insertionMode.processStartTag(name, attributes);
          };
          modes.inCaption.startTagOther = function(name, attributes, selfClosing) {
            modes.inBody.processStartTag(name, attributes, selfClosing);
          };
          modes.inCaption.endTagCaption = function(name) {
            if (!tree.openElements.inTableScope('caption')) {
              tree.parseError('unexpected-end-tag', {name: name});
            } else {
              tree.generateImpliedEndTags();
              if (tree.currentStackItem().localName != 'caption') {
                tree.parseError('expected-one-end-tag-but-got-another', {
                  gotName: "caption",
                  expectedName: tree.currentStackItem().localName
                });
              }
              tree.openElements.popUntilPopped('caption');
              tree.clearActiveFormattingElements();
              tree.setInsertionMode('inTable');
            }
          };
          modes.inCaption.endTagTable = function(name) {
            tree.parseError("unexpected-end-table-in-caption");
            var ignoreEndTag = !tree.openElements.inTableScope('caption');
            tree.insertionMode.processEndTag('caption');
            if (!ignoreEndTag)
              tree.insertionMode.processEndTag(name);
          };
          modes.inCaption.endTagIgnore = function(name) {
            tree.parseError('unexpected-end-tag', {name: name});
          };
          modes.inCaption.endTagOther = function(name) {
            modes.inBody.processEndTag(name);
          };
          modes.inCell = Object.create(modes.base);
          modes.inCell.start_tag_handlers = {
            html: 'startTagHtml',
            caption: 'startTagTableOther',
            col: 'startTagTableOther',
            colgroup: 'startTagTableOther',
            tbody: 'startTagTableOther',
            td: 'startTagTableOther',
            tfoot: 'startTagTableOther',
            th: 'startTagTableOther',
            thead: 'startTagTableOther',
            tr: 'startTagTableOther',
            '-default': 'startTagOther'
          };
          modes.inCell.end_tag_handlers = {
            td: 'endTagTableCell',
            th: 'endTagTableCell',
            body: 'endTagIgnore',
            caption: 'endTagIgnore',
            col: 'endTagIgnore',
            colgroup: 'endTagIgnore',
            html: 'endTagIgnore',
            table: 'endTagImply',
            tbody: 'endTagImply',
            tfoot: 'endTagImply',
            thead: 'endTagImply',
            tr: 'endTagImply',
            '-default': 'endTagOther'
          };
          modes.inCell.processCharacters = function(data) {
            modes.inBody.processCharacters(data);
          };
          modes.inCell.startTagTableOther = function(name, attributes, selfClosing) {
            if (tree.openElements.inTableScope('td') || tree.openElements.inTableScope('th')) {
              this.closeCell();
              tree.insertionMode.processStartTag(name, attributes, selfClosing);
            } else {
              tree.parseError('unexpected-start-tag', {name: name});
            }
          };
          modes.inCell.startTagOther = function(name, attributes, selfClosing) {
            modes.inBody.processStartTag(name, attributes, selfClosing);
          };
          modes.inCell.endTagTableCell = function(name) {
            if (tree.openElements.inTableScope(name)) {
              tree.generateImpliedEndTags(name);
              if (tree.currentStackItem().localName != name.toLowerCase()) {
                tree.parseError('unexpected-cell-end-tag', {name: name});
                tree.openElements.popUntilPopped(name);
              } else {
                tree.popElement();
              }
              tree.clearActiveFormattingElements();
              tree.setInsertionMode('inRow');
            } else {
              tree.parseError('unexpected-end-tag', {name: name});
            }
          };
          modes.inCell.endTagIgnore = function(name) {
            tree.parseError('unexpected-end-tag', {name: name});
          };
          modes.inCell.endTagImply = function(name) {
            if (tree.openElements.inTableScope(name)) {
              this.closeCell();
              tree.insertionMode.processEndTag(name);
            } else {
              tree.parseError('unexpected-end-tag', {name: name});
            }
          };
          modes.inCell.endTagOther = function(name) {
            modes.inBody.processEndTag(name);
          };
          modes.inCell.closeCell = function() {
            if (tree.openElements.inTableScope('td')) {
              this.endTagTableCell('td');
            } else if (tree.openElements.inTableScope('th')) {
              this.endTagTableCell('th');
            }
          };
          modes.inColumnGroup = Object.create(modes.base);
          modes.inColumnGroup.start_tag_handlers = {
            html: 'startTagHtml',
            col: 'startTagCol',
            '-default': 'startTagOther'
          };
          modes.inColumnGroup.end_tag_handlers = {
            colgroup: 'endTagColgroup',
            col: 'endTagCol',
            '-default': 'endTagOther'
          };
          modes.inColumnGroup.ignoreEndTagColgroup = function() {
            return tree.currentStackItem().localName == 'html';
          };
          modes.inColumnGroup.processCharacters = function(buffer) {
            var leadingWhitespace = buffer.takeLeadingWhitespace();
            if (leadingWhitespace)
              tree.insertText(leadingWhitespace);
            if (!buffer.length)
              return;
            var ignoreEndTag = this.ignoreEndTagColgroup();
            this.endTagColgroup('colgroup');
            if (!ignoreEndTag)
              tree.insertionMode.processCharacters(buffer);
          };
          modes.inColumnGroup.startTagCol = function(name, attributes) {
            tree.insertSelfClosingElement(name, attributes);
          };
          modes.inColumnGroup.startTagOther = function(name, attributes, selfClosing) {
            var ignoreEndTag = this.ignoreEndTagColgroup();
            this.endTagColgroup('colgroup');
            if (!ignoreEndTag)
              tree.insertionMode.processStartTag(name, attributes, selfClosing);
          };
          modes.inColumnGroup.endTagColgroup = function(name) {
            if (this.ignoreEndTagColgroup()) {
              tree.parseError('unexpected-end-tag', {name: name});
            } else {
              tree.popElement();
              tree.setInsertionMode('inTable');
            }
          };
          modes.inColumnGroup.endTagCol = function(name) {
            tree.parseError("no-end-tag", {name: 'col'});
          };
          modes.inColumnGroup.endTagOther = function(name) {
            var ignoreEndTag = this.ignoreEndTagColgroup();
            this.endTagColgroup('colgroup');
            if (!ignoreEndTag)
              tree.insertionMode.processEndTag(name);
          };
          modes.inForeignContent = Object.create(modes.base);
          modes.inForeignContent.processStartTag = function(name, attributes, selfClosing) {
            if (['b', 'big', 'blockquote', 'body', 'br', 'center', 'code', 'dd', 'div', 'dl', 'dt', 'em', 'embed', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'i', 'img', 'li', 'listing', 'menu', 'meta', 'nobr', 'ol', 'p', 'pre', 'ruby', 's', 'small', 'span', 'strong', 'strike', 'sub', 'sup', 'table', 'tt', 'u', 'ul', 'var'].indexOf(name) != -1 || (name == 'font' && attributes.some(function(attr) {
              return ['color', 'face', 'size'].indexOf(attr.nodeName) >= 0;
            }))) {
              tree.parseError('unexpected-html-element-in-foreign-content', {name: name});
              while (tree.currentStackItem().isForeign() && !tree.currentStackItem().isHtmlIntegrationPoint() && !tree.currentStackItem().isMathMLTextIntegrationPoint()) {
                tree.openElements.pop();
              }
              tree.insertionMode.processStartTag(name, attributes, selfClosing);
              return;
            }
            if (tree.currentStackItem().namespaceURI == "http://www.w3.org/1998/Math/MathML") {
              attributes = tree.adjustMathMLAttributes(attributes);
            }
            if (tree.currentStackItem().namespaceURI == "http://www.w3.org/2000/svg") {
              name = tree.adjustSVGTagNameCase(name);
              attributes = tree.adjustSVGAttributes(attributes);
            }
            attributes = tree.adjustForeignAttributes(attributes);
            tree.insertForeignElement(name, attributes, tree.currentStackItem().namespaceURI, selfClosing);
          };
          modes.inForeignContent.processEndTag = function(name) {
            var node = tree.currentStackItem();
            var index = tree.openElements.length - 1;
            if (node.localName.toLowerCase() != name)
              tree.parseError("unexpected-end-tag", {name: name});
            while (true) {
              if (index === 0)
                break;
              if (node.localName.toLowerCase() == name) {
                while (tree.openElements.pop() != node)
                  ;
                break;
              }
              index -= 1;
              node = tree.openElements.item(index);
              if (node.isForeign()) {
                continue;
              } else {
                tree.insertionMode.processEndTag(name);
                break;
              }
            }
          };
          modes.inForeignContent.processCharacters = function(buffer) {
            var characters = buffer.takeRemaining();
            characters = characters.replace(/\u0000/g, function(match, index) {
              tree.parseError('invalid-codepoint');
              return '\uFFFD';
            });
            if (tree.framesetOk && !isAllWhitespaceOrReplacementCharacters_1.default(characters))
              tree.framesetOk = false;
            tree.insertText(characters);
          };
          modes.inHeadNoscript = Object.create(modes.base);
          modes.inHeadNoscript.start_tag_handlers = {
            html: 'startTagHtml',
            basefont: 'startTagBasefontBgsoundLinkMetaNoframesStyle',
            bgsound: 'startTagBasefontBgsoundLinkMetaNoframesStyle',
            link: 'startTagBasefontBgsoundLinkMetaNoframesStyle',
            meta: 'startTagBasefontBgsoundLinkMetaNoframesStyle',
            noframes: 'startTagBasefontBgsoundLinkMetaNoframesStyle',
            style: 'startTagBasefontBgsoundLinkMetaNoframesStyle',
            head: 'startTagHeadNoscript',
            noscript: 'startTagHeadNoscript',
            "-default": 'startTagOther'
          };
          modes.inHeadNoscript.end_tag_handlers = {
            noscript: 'endTagNoscript',
            br: 'endTagBr',
            '-default': 'endTagOther'
          };
          modes.inHeadNoscript.processCharacters = function(buffer) {
            var leadingWhitespace = buffer.takeLeadingWhitespace();
            if (leadingWhitespace)
              tree.insertText(leadingWhitespace);
            if (!buffer.length)
              return;
            tree.parseError("unexpected-char-in-frameset");
            this.anythingElse();
            tree.insertionMode.processCharacters(buffer);
          };
          modes.inHeadNoscript.processComment = function(data) {
            modes.inHead.processComment(data);
          };
          modes.inHeadNoscript.startTagBasefontBgsoundLinkMetaNoframesStyle = function(name, attributes) {
            modes.inHead.processStartTag(name, attributes);
          };
          modes.inHeadNoscript.startTagHeadNoscript = function(name, attributes) {
            tree.parseError("unexpected-start-tag-in-frameset", {name: name});
          };
          modes.inHeadNoscript.startTagOther = function(name, attributes) {
            tree.parseError("unexpected-start-tag-in-frameset", {name: name});
            this.anythingElse();
            tree.insertionMode.processStartTag(name, attributes);
          };
          modes.inHeadNoscript.endTagBr = function(name, attributes) {
            tree.parseError("unexpected-end-tag-in-frameset", {name: name});
            this.anythingElse();
            tree.insertionMode.processEndTag(name, attributes);
          };
          modes.inHeadNoscript.endTagNoscript = function(name, attributes) {
            tree.popElement();
            tree.setInsertionMode('inHead');
          };
          modes.inHeadNoscript.endTagOther = function(name, attributes) {
            tree.parseError("unexpected-end-tag-in-frameset", {name: name});
          };
          modes.inHeadNoscript.anythingElse = function() {
            tree.popElement();
            tree.setInsertionMode('inHead');
          };
          modes.inFrameset = Object.create(modes.base);
          modes.inFrameset.start_tag_handlers = {
            html: 'startTagHtml',
            frameset: 'startTagFrameset',
            frame: 'startTagFrame',
            noframes: 'startTagNoframes',
            "-default": 'startTagOther'
          };
          modes.inFrameset.end_tag_handlers = {
            frameset: 'endTagFrameset',
            noframes: 'endTagNoframes',
            '-default': 'endTagOther'
          };
          modes.inFrameset.processCharacters = function(data) {
            tree.parseError("unexpected-char-in-frameset");
          };
          modes.inFrameset.startTagFrameset = function(name, attributes) {
            tree.insertElement(name, attributes);
          };
          modes.inFrameset.startTagFrame = function(name, attributes) {
            tree.insertSelfClosingElement(name, attributes);
          };
          modes.inFrameset.startTagNoframes = function(name, attributes) {
            modes.inBody.processStartTag(name, attributes);
          };
          modes.inFrameset.startTagOther = function(name, attributes) {
            tree.parseError("unexpected-start-tag-in-frameset", {name: name});
          };
          modes.inFrameset.endTagFrameset = function(name, attributes) {
            if (tree.currentStackItem().localName == 'html') {
              tree.parseError("unexpected-frameset-in-frameset-innerhtml");
            } else {
              tree.popElement();
            }
            if (!tree.context && tree.currentStackItem().localName != 'frameset') {
              tree.setInsertionMode('afterFrameset');
            }
          };
          modes.inFrameset.endTagNoframes = function(name) {
            modes.inBody.processEndTag(name);
          };
          modes.inFrameset.endTagOther = function(name) {
            tree.parseError("unexpected-end-tag-in-frameset", {name: name});
          };
          modes.inTable = Object.create(modes.base);
          modes.inTable.start_tag_handlers = {
            html: 'startTagHtml',
            caption: 'startTagCaption',
            colgroup: 'startTagColgroup',
            col: 'startTagCol',
            table: 'startTagTable',
            tbody: 'startTagRowGroup',
            tfoot: 'startTagRowGroup',
            thead: 'startTagRowGroup',
            td: 'startTagImplyTbody',
            th: 'startTagImplyTbody',
            tr: 'startTagImplyTbody',
            style: 'startTagStyleScript',
            script: 'startTagStyleScript',
            input: 'startTagInput',
            form: 'startTagForm',
            '-default': 'startTagOther'
          };
          modes.inTable.end_tag_handlers = {
            table: 'endTagTable',
            body: 'endTagIgnore',
            caption: 'endTagIgnore',
            col: 'endTagIgnore',
            colgroup: 'endTagIgnore',
            html: 'endTagIgnore',
            tbody: 'endTagIgnore',
            td: 'endTagIgnore',
            tfoot: 'endTagIgnore',
            th: 'endTagIgnore',
            thead: 'endTagIgnore',
            tr: 'endTagIgnore',
            '-default': 'endTagOther'
          };
          modes.inTable.processCharacters = function(data) {
            if (tree.currentStackItem().isFosterParenting()) {
              var originalInsertionMode = tree.insertionModeName;
              tree.setInsertionMode('inTableText');
              tree.originalInsertionMode = originalInsertionMode;
              tree.insertionMode.processCharacters(data);
            } else {
              tree.redirectAttachToFosterParent = true;
              modes.inBody.processCharacters(data);
              tree.redirectAttachToFosterParent = false;
            }
          };
          modes.inTable.startTagCaption = function(name, attributes) {
            tree.openElements.popUntilTableScopeMarker();
            tree.activeFormattingElements.push(Marker);
            tree.insertElement(name, attributes);
            tree.setInsertionMode('inCaption');
          };
          modes.inTable.startTagColgroup = function(name, attributes) {
            tree.openElements.popUntilTableScopeMarker();
            tree.insertElement(name, attributes);
            tree.setInsertionMode('inColumnGroup');
          };
          modes.inTable.startTagCol = function(name, attributes) {
            this.startTagColgroup('colgroup', []);
            tree.insertionMode.processStartTag(name, attributes);
          };
          modes.inTable.startTagRowGroup = function(name, attributes) {
            tree.openElements.popUntilTableScopeMarker();
            tree.insertElement(name, attributes);
            tree.setInsertionMode('inTableBody');
          };
          modes.inTable.startTagImplyTbody = function(name, attributes) {
            this.startTagRowGroup('tbody', []);
            tree.insertionMode.processStartTag(name, attributes);
          };
          modes.inTable.startTagTable = function(name, attributes) {
            tree.parseError("unexpected-start-tag-implies-end-tag", {
              startName: "table",
              endName: "table"
            });
            tree.insertionMode.processEndTag('table');
            if (!tree.context)
              tree.insertionMode.processStartTag(name, attributes);
          };
          modes.inTable.startTagStyleScript = function(name, attributes) {
            modes.inHead.processStartTag(name, attributes);
          };
          modes.inTable.startTagInput = function(name, attributes) {
            for (var key in attributes) {
              if (attributes[key].nodeName.toLowerCase() == 'type') {
                if (attributes[key].nodeValue.toLowerCase() == 'hidden') {
                  tree.parseError("unexpected-hidden-input-in-table");
                  tree.insertElement(name, attributes);
                  tree.openElements.pop();
                  return;
                }
                break;
              }
            }
            this.startTagOther(name, attributes);
          };
          modes.inTable.startTagForm = function(name, attributes) {
            tree.parseError("unexpected-form-in-table");
            if (!tree.form) {
              tree.insertElement(name, attributes);
              tree.form = tree.currentStackItem();
              tree.openElements.pop();
            }
          };
          modes.inTable.startTagOther = function(name, attributes, selfClosing) {
            tree.parseError("unexpected-start-tag-implies-table-voodoo", {name: name});
            tree.redirectAttachToFosterParent = true;
            modes.inBody.processStartTag(name, attributes, selfClosing);
            tree.redirectAttachToFosterParent = false;
          };
          modes.inTable.endTagTable = function(name) {
            if (tree.openElements.inTableScope(name)) {
              tree.generateImpliedEndTags();
              if (tree.currentStackItem().localName != name) {
                tree.parseError("end-tag-too-early-named", {
                  gotName: 'table',
                  expectedName: tree.currentStackItem().localName
                });
              }
              tree.openElements.popUntilPopped('table');
              tree.resetInsertionMode();
            } else {
              tree.parseError('unexpected-end-tag', {name: name});
            }
          };
          modes.inTable.endTagIgnore = function(name) {
            tree.parseError("unexpected-end-tag", {name: name});
          };
          modes.inTable.endTagOther = function(name) {
            tree.parseError("unexpected-end-tag-implies-table-voodoo", {name: name});
            tree.redirectAttachToFosterParent = true;
            modes.inBody.processEndTag(name);
            tree.redirectAttachToFosterParent = false;
          };
          modes.inTableText = Object.create(modes.base);
          modes.inTableText.flushCharacters = function() {
            var characters = tree.pendingTableCharacters.join('');
            if (!isAllWhitespace_1.default(characters)) {
              tree.redirectAttachToFosterParent = true;
              tree.reconstructActiveFormattingElements();
              tree.insertText(characters);
              tree.framesetOk = false;
              tree.redirectAttachToFosterParent = false;
            } else {
              tree.insertText(characters);
            }
            tree.pendingTableCharacters = [];
          };
          modes.inTableText.processComment = function(data) {
            this.flushCharacters();
            tree.setInsertionMode(tree.originalInsertionMode);
            tree.insertionMode.processComment(data);
          };
          modes.inTableText.processEOF = function(data) {
            this.flushCharacters();
            tree.setInsertionMode(tree.originalInsertionMode);
            tree.insertionMode.processEOF();
          };
          modes.inTableText.processCharacters = function(buffer) {
            var characters = buffer.takeRemaining();
            characters = characters.replace(/\u0000/g, function(match, index) {
              tree.parseError("invalid-codepoint");
              return '';
            });
            if (!characters)
              return;
            tree.pendingTableCharacters.push(characters);
          };
          modes.inTableText.processStartTag = function(name, attributes, selfClosing) {
            this.flushCharacters();
            tree.setInsertionMode(tree.originalInsertionMode);
            tree.insertionMode.processStartTag(name, attributes, selfClosing);
          };
          modes.inTableText.processEndTag = function(name, attributes) {
            this.flushCharacters();
            tree.setInsertionMode(tree.originalInsertionMode);
            tree.insertionMode.processEndTag(name, attributes);
          };
          modes.inTableBody = Object.create(modes.base);
          modes.inTableBody.start_tag_handlers = {
            html: 'startTagHtml',
            tr: 'startTagTr',
            td: 'startTagTableCell',
            th: 'startTagTableCell',
            caption: 'startTagTableOther',
            col: 'startTagTableOther',
            colgroup: 'startTagTableOther',
            tbody: 'startTagTableOther',
            tfoot: 'startTagTableOther',
            thead: 'startTagTableOther',
            '-default': 'startTagOther'
          };
          modes.inTableBody.end_tag_handlers = {
            table: 'endTagTable',
            tbody: 'endTagTableRowGroup',
            tfoot: 'endTagTableRowGroup',
            thead: 'endTagTableRowGroup',
            body: 'endTagIgnore',
            caption: 'endTagIgnore',
            col: 'endTagIgnore',
            colgroup: 'endTagIgnore',
            html: 'endTagIgnore',
            td: 'endTagIgnore',
            th: 'endTagIgnore',
            tr: 'endTagIgnore',
            '-default': 'endTagOther'
          };
          modes.inTableBody.processCharacters = function(data) {
            modes.inTable.processCharacters(data);
          };
          modes.inTableBody.startTagTr = function(name, attributes) {
            tree.openElements.popUntilTableBodyScopeMarker();
            tree.insertElement(name, attributes);
            tree.setInsertionMode('inRow');
          };
          modes.inTableBody.startTagTableCell = function(name, attributes) {
            tree.parseError("unexpected-cell-in-table-body", {name: name});
            this.startTagTr('tr', []);
            tree.insertionMode.processStartTag(name, attributes);
          };
          modes.inTableBody.startTagTableOther = function(name, attributes) {
            if (tree.openElements.inTableScope('tbody') || tree.openElements.inTableScope('thead') || tree.openElements.inTableScope('tfoot')) {
              tree.openElements.popUntilTableBodyScopeMarker();
              this.endTagTableRowGroup(tree.currentStackItem().localName);
              tree.insertionMode.processStartTag(name, attributes);
            } else {
              tree.parseError('unexpected-start-tag', {name: name});
            }
          };
          modes.inTableBody.startTagOther = function(name, attributes) {
            modes.inTable.processStartTag(name, attributes);
          };
          modes.inTableBody.endTagTableRowGroup = function(name) {
            if (tree.openElements.inTableScope(name)) {
              tree.openElements.popUntilTableBodyScopeMarker();
              tree.popElement();
              tree.setInsertionMode('inTable');
            } else {
              tree.parseError('unexpected-end-tag-in-table-body', {name: name});
            }
          };
          modes.inTableBody.endTagTable = function(name) {
            if (tree.openElements.inTableScope('tbody') || tree.openElements.inTableScope('thead') || tree.openElements.inTableScope('tfoot')) {
              tree.openElements.popUntilTableBodyScopeMarker();
              this.endTagTableRowGroup(tree.currentStackItem().localName);
              tree.insertionMode.processEndTag(name);
            } else {
              tree.parseError('unexpected-end-tag', {name: name});
            }
          };
          modes.inTableBody.endTagIgnore = function(name) {
            tree.parseError("unexpected-end-tag-in-table-body", {name: name});
          };
          modes.inTableBody.endTagOther = function(name) {
            modes.inTable.processEndTag(name);
          };
          modes.inSelect = Object.create(modes.base);
          modes.inSelect.start_tag_handlers = {
            html: 'startTagHtml',
            option: 'startTagOption',
            optgroup: 'startTagOptgroup',
            select: 'startTagSelect',
            input: 'startTagInput',
            keygen: 'startTagInput',
            textarea: 'startTagInput',
            script: 'startTagScript',
            '-default': 'startTagOther'
          };
          modes.inSelect.end_tag_handlers = {
            option: 'endTagOption',
            optgroup: 'endTagOptgroup',
            select: 'endTagSelect',
            caption: 'endTagTableElements',
            table: 'endTagTableElements',
            tbody: 'endTagTableElements',
            tfoot: 'endTagTableElements',
            thead: 'endTagTableElements',
            tr: 'endTagTableElements',
            td: 'endTagTableElements',
            th: 'endTagTableElements',
            '-default': 'endTagOther'
          };
          modes.inSelect.processCharacters = function(buffer) {
            var data = buffer.takeRemaining();
            data = data.replace(/\u0000/g, function(match, index) {
              tree.parseError("invalid-codepoint");
              return '';
            });
            if (!data)
              return;
            tree.insertText(data);
          };
          modes.inSelect.startTagOption = function(name, attributes) {
            if (tree.currentStackItem().localName == 'option')
              tree.popElement();
            tree.insertElement(name, attributes);
          };
          modes.inSelect.startTagOptgroup = function(name, attributes) {
            if (tree.currentStackItem().localName == 'option')
              tree.popElement();
            if (tree.currentStackItem().localName == 'optgroup')
              tree.popElement();
            tree.insertElement(name, attributes);
          };
          modes.inSelect.endTagOption = function(name) {
            if (tree.currentStackItem().localName !== 'option') {
              tree.parseError('unexpected-end-tag-in-select', {name: name});
              return;
            }
            tree.popElement();
          };
          modes.inSelect.endTagOptgroup = function(name) {
            if (tree.currentStackItem().localName == 'option' && tree.openElements.item(tree.openElements.length - 2).localName == 'optgroup') {
              tree.popElement();
            }
            if (tree.currentStackItem().localName == 'optgroup') {
              tree.popElement();
            } else {
              tree.parseError('unexpected-end-tag-in-select', {name: 'optgroup'});
            }
          };
          modes.inSelect.startTagSelect = function(name) {
            tree.parseError("unexpected-select-in-select");
            this.endTagSelect('select');
          };
          modes.inSelect.endTagSelect = function(name) {
            if (tree.openElements.inTableScope('select')) {
              tree.openElements.popUntilPopped('select');
              tree.resetInsertionMode();
            } else {
              tree.parseError('unexpected-end-tag', {name: name});
            }
          };
          modes.inSelect.startTagInput = function(name, attributes) {
            tree.parseError("unexpected-input-in-select");
            if (tree.openElements.inSelectScope('select')) {
              this.endTagSelect('select');
              tree.insertionMode.processStartTag(name, attributes);
            }
          };
          modes.inSelect.startTagScript = function(name, attributes) {
            modes.inHead.processStartTag(name, attributes);
          };
          modes.inSelect.endTagTableElements = function(name) {
            tree.parseError('unexpected-end-tag-in-select', {name: name});
            if (tree.openElements.inTableScope(name)) {
              this.endTagSelect('select');
              tree.insertionMode.processEndTag(name);
            }
          };
          modes.inSelect.startTagOther = function(name, attributes) {
            tree.parseError("unexpected-start-tag-in-select", {name: name});
          };
          modes.inSelect.endTagOther = function(name) {
            tree.parseError('unexpected-end-tag-in-select', {name: name});
          };
          modes.inSelectInTable = Object.create(modes.base);
          modes.inSelectInTable.start_tag_handlers = {
            caption: 'startTagTable',
            table: 'startTagTable',
            tbody: 'startTagTable',
            tfoot: 'startTagTable',
            thead: 'startTagTable',
            tr: 'startTagTable',
            td: 'startTagTable',
            th: 'startTagTable',
            '-default': 'startTagOther'
          };
          modes.inSelectInTable.end_tag_handlers = {
            caption: 'endTagTable',
            table: 'endTagTable',
            tbody: 'endTagTable',
            tfoot: 'endTagTable',
            thead: 'endTagTable',
            tr: 'endTagTable',
            td: 'endTagTable',
            th: 'endTagTable',
            '-default': 'endTagOther'
          };
          modes.inSelectInTable.processCharacters = function(data) {
            modes.inSelect.processCharacters(data);
          };
          modes.inSelectInTable.startTagTable = function(name, attributes) {
            tree.parseError("unexpected-table-element-start-tag-in-select-in-table", {name: name});
            this.endTagOther("select");
            tree.insertionMode.processStartTag(name, attributes);
          };
          modes.inSelectInTable.startTagOther = function(name, attributes, selfClosing) {
            modes.inSelect.processStartTag(name, attributes, selfClosing);
          };
          modes.inSelectInTable.endTagTable = function(name) {
            tree.parseError("unexpected-table-element-end-tag-in-select-in-table", {name: name});
            if (tree.openElements.inTableScope(name)) {
              this.endTagOther("select");
              tree.insertionMode.processEndTag(name);
            }
          };
          modes.inSelectInTable.endTagOther = function(name) {
            modes.inSelect.processEndTag(name);
          };
          modes.inRow = Object.create(modes.base);
          modes.inRow.start_tag_handlers = {
            html: 'startTagHtml',
            td: 'startTagTableCell',
            th: 'startTagTableCell',
            caption: 'startTagTableOther',
            col: 'startTagTableOther',
            colgroup: 'startTagTableOther',
            tbody: 'startTagTableOther',
            tfoot: 'startTagTableOther',
            thead: 'startTagTableOther',
            tr: 'startTagTableOther',
            '-default': 'startTagOther'
          };
          modes.inRow.end_tag_handlers = {
            tr: 'endTagTr',
            table: 'endTagTable',
            tbody: 'endTagTableRowGroup',
            tfoot: 'endTagTableRowGroup',
            thead: 'endTagTableRowGroup',
            body: 'endTagIgnore',
            caption: 'endTagIgnore',
            col: 'endTagIgnore',
            colgroup: 'endTagIgnore',
            html: 'endTagIgnore',
            td: 'endTagIgnore',
            th: 'endTagIgnore',
            '-default': 'endTagOther'
          };
          modes.inRow.processCharacters = function(data) {
            modes.inTable.processCharacters(data);
          };
          modes.inRow.startTagTableCell = function(name, attributes) {
            tree.openElements.popUntilTableRowScopeMarker();
            tree.insertElement(name, attributes);
            tree.setInsertionMode('inCell');
            tree.activeFormattingElements.push(Marker);
          };
          modes.inRow.startTagTableOther = function(name, attributes) {
            var ignoreEndTag = this.ignoreEndTagTr();
            this.endTagTr('tr');
            if (!ignoreEndTag)
              tree.insertionMode.processStartTag(name, attributes);
          };
          modes.inRow.startTagOther = function(name, attributes, selfClosing) {
            modes.inTable.processStartTag(name, attributes, selfClosing);
          };
          modes.inRow.endTagTr = function(name) {
            if (this.ignoreEndTagTr()) {
              tree.parseError('unexpected-end-tag', {name: name});
            } else {
              tree.openElements.popUntilTableRowScopeMarker();
              tree.popElement();
              tree.setInsertionMode('inTableBody');
            }
          };
          modes.inRow.endTagTable = function(name) {
            var ignoreEndTag = this.ignoreEndTagTr();
            this.endTagTr('tr');
            if (!ignoreEndTag)
              tree.insertionMode.processEndTag(name);
          };
          modes.inRow.endTagTableRowGroup = function(name) {
            if (tree.openElements.inTableScope(name)) {
              this.endTagTr('tr');
              tree.insertionMode.processEndTag(name);
            } else {
              tree.parseError('unexpected-end-tag', {name: name});
            }
          };
          modes.inRow.endTagIgnore = function(name) {
            tree.parseError("unexpected-end-tag-in-table-row", {name: name});
          };
          modes.inRow.endTagOther = function(name) {
            modes.inTable.processEndTag(name);
          };
          modes.inRow.ignoreEndTagTr = function() {
            return !tree.openElements.inTableScope('tr');
          };
          modes.afterAfterFrameset = Object.create(modes.base);
          modes.afterAfterFrameset.start_tag_handlers = {
            html: 'startTagHtml',
            noframes: 'startTagNoFrames',
            '-default': 'startTagOther'
          };
          modes.afterAfterFrameset.processEOF = function() {};
          modes.afterAfterFrameset.processComment = function(data) {
            tree.insertComment(data, tree.document);
          };
          modes.afterAfterFrameset.processCharacters = function(buffer) {
            var characters = buffer.takeRemaining();
            var whitespace = "";
            for (var i = 0; i < characters.length; i++) {
              var ch = characters[i];
              if (isWhitespace_1.default(ch))
                whitespace += ch;
            }
            if (whitespace) {
              tree.reconstructActiveFormattingElements();
              tree.insertText(whitespace);
            }
            if (whitespace.length < characters.length)
              tree.parseError('expected-eof-but-got-char');
          };
          modes.afterAfterFrameset.startTagNoFrames = function(name, attributes) {
            modes.inHead.processStartTag(name, attributes);
          };
          modes.afterAfterFrameset.startTagOther = function(name, attributes, selfClosing) {
            tree.parseError('expected-eof-but-got-start-tag', {name: name});
          };
          modes.afterAfterFrameset.processEndTag = function(name, attributes) {
            tree.parseError('expected-eof-but-got-end-tag', {name: name});
          };
          modes.text = Object.create(modes.base);
          modes.text.start_tag_handlers = {'-default': 'startTagOther'};
          modes.text.end_tag_handlers = {
            script: 'endTagScript',
            '-default': 'endTagOther'
          };
          modes.text.processCharacters = function(buffer) {
            if (tree.shouldSkipLeadingNewline) {
              tree.shouldSkipLeadingNewline = false;
              buffer.skipAtMostOneLeadingNewline();
            }
            var data = buffer.takeRemaining();
            if (!data)
              return;
            tree.insertText(data);
          };
          modes.text.processEOF = function() {
            tree.parseError("expected-named-closing-tag-but-got-eof", {name: tree.currentStackItem().localName});
            tree.openElements.pop();
            tree.setInsertionMode(tree.originalInsertionMode);
            tree.insertionMode.processEOF();
          };
          modes.text.startTagOther = function(name) {
            throw "Tried to process start tag " + name + " in RCDATA/RAWTEXT mode";
          };
          modes.text.endTagScript = function(name) {
            var node = tree.openElements.pop();
            tree.setInsertionMode(tree.originalInsertionMode);
          };
          modes.text.endTagOther = function(name) {
            tree.openElements.pop();
            tree.setInsertionMode(tree.originalInsertionMode);
          };
        }
        TreeBuilder.prototype.setInsertionMode = function(name) {
          this.insertionMode = this.insertionModes[name];
          this.insertionModeName = name;
        };
        TreeBuilder.prototype.adoptionAgencyEndTag = function(name) {
          var outerIterationLimit = 8;
          var innerIterationLimit = 3;
          var formattingElement;
          function isActiveFormattingElement(el) {
            return el === formattingElement;
          }
          var outerLoopCounter = 0;
          while (outerLoopCounter++ < outerIterationLimit) {
            formattingElement = this.elementInActiveFormattingElements(name);
            if (!formattingElement || (this.openElements.contains(formattingElement) && !this.openElements.inScope(formattingElement.localName))) {
              this.parseError('adoption-agency-1.1', {name: name});
              return false;
            }
            if (!this.openElements.contains(formattingElement)) {
              this.parseError('adoption-agency-1.2', {name: name});
              this.removeElementFromActiveFormattingElements(formattingElement);
              return true;
            }
            if (!this.openElements.inScope(formattingElement.localName)) {
              this.parseError('adoption-agency-4.4', {name: name});
            }
            if (formattingElement != this.currentStackItem()) {
              this.parseError('adoption-agency-1.3', {name: name});
            }
            var furthestBlock = this.openElements.furthestBlockForFormattingElement(formattingElement.node);
            if (!furthestBlock) {
              this.openElements.remove_openElements_until(isActiveFormattingElement);
              this.removeElementFromActiveFormattingElements(formattingElement);
              return true;
            }
            var afeIndex = this.openElements.elements.indexOf(formattingElement);
            var commonAncestor = this.openElements.item(afeIndex - 1);
            var bookmark = this.activeFormattingElements.indexOf(formattingElement);
            var node = furthestBlock;
            var lastNode = furthestBlock;
            var index = this.openElements.elements.indexOf(node);
            var innerLoopCounter = 0;
            while (innerLoopCounter++ < innerIterationLimit) {
              index -= 1;
              node = this.openElements.item(index);
              if (this.activeFormattingElements.indexOf(node) < 0) {
                this.openElements.elements.splice(index, 1);
                continue;
              }
              if (node == formattingElement)
                break;
              if (lastNode == furthestBlock)
                bookmark = this.activeFormattingElements.indexOf(node) + 1;
              var clone = this.createElement(node.namespaceURI, node.localName, node.attributes);
              var newNode = new StackItem_1.default(node.namespaceURI, node.localName, node.attributes, clone);
              this.activeFormattingElements[this.activeFormattingElements.indexOf(node)] = newNode;
              this.openElements.elements[this.openElements.elements.indexOf(node)] = newNode;
              node = newNode;
              this.detachFromParent(lastNode.node);
              this.attachNode(lastNode.node, node.node);
              lastNode = node;
            }
            this.detachFromParent(lastNode.node);
            if (commonAncestor.isFosterParenting()) {
              this.insertIntoFosterParent(lastNode.node);
            } else {
              this.attachNode(lastNode.node, commonAncestor.node);
            }
            var clone = this.createElement("http://www.w3.org/1999/xhtml", formattingElement.localName, formattingElement.attributes);
            var formattingClone = new StackItem_1.default(formattingElement.namespaceURI, formattingElement.localName, formattingElement.attributes, clone);
            this.reparentChildren(furthestBlock.node, clone);
            this.attachNode(clone, furthestBlock.node);
            this.removeElementFromActiveFormattingElements(formattingElement);
            this.activeFormattingElements.splice(Math.min(bookmark, this.activeFormattingElements.length), 0, formattingClone);
            this.openElements.remove(formattingElement);
            this.openElements.elements.splice(this.openElements.elements.indexOf(furthestBlock) + 1, 0, formattingClone);
          }
          return true;
        };
        TreeBuilder.prototype.start = function(tokenizer) {
          throw "Not implemented";
        };
        TreeBuilder.prototype.startTokenization = function(tokenizer) {
          this.tokenizer = tokenizer;
          this.compatMode = "no quirks";
          this.originalInsertionMode = "initial";
          this.framesetOk = true;
          this.openElements = new ElementStack_1.default();
          this.activeFormattingElements = [];
          this.start(tokenizer);
          if (this.context) {
            switch (this.context) {
              case 'title':
              case 'textarea':
                this.tokenizer.setState(Tokenizer_1.default.RCDATA);
                break;
              case 'style':
              case 'xmp':
              case 'iframe':
              case 'noembed':
              case 'noframes':
                this.tokenizer.setState(Tokenizer_1.default.RAWTEXT);
                break;
              case 'script':
                this.tokenizer.setState(Tokenizer_1.default.SCRIPT_DATA);
                break;
              case 'noscript':
                if (this.scriptingEnabled)
                  this.tokenizer.setState(Tokenizer_1.default.RAWTEXT);
                break;
              case 'plaintext':
                this.tokenizer.setState(Tokenizer_1.default.PLAINTEXT);
                break;
            }
            this.insertHtmlElement();
            this.resetInsertionMode();
          } else {
            this.setInsertionMode('initial');
          }
        };
        TreeBuilder.prototype.processToken = function(token) {
          this.selfClosingFlagAcknowledged = false;
          var currentNode = this.openElements.top || null;
          var insertionMode;
          if (!currentNode || !currentNode.isForeign() || (currentNode.isMathMLTextIntegrationPoint() && ((token.type == 'StartTag' && !(token.name in {
            mglyph: 0,
            malignmark: 0
          })) || (token.type === 'Characters'))) || (currentNode.namespaceURI == "http://www.w3.org/1998/Math/MathML" && currentNode.localName == 'annotation-xml' && token.type == 'StartTag' && token.name == 'svg') || (currentNode.isHtmlIntegrationPoint() && token.type in {
            StartTag: 0,
            Characters: 0
          }) || token.type == 'EOF') {
            insertionMode = this.insertionMode;
          } else {
            insertionMode = this.insertionModes.inForeignContent;
          }
          switch (token.type) {
            case 'Characters':
              var buffer = new CharacterBuffer_1.default(token.data);
              insertionMode.processCharacters(buffer);
              break;
            case 'Comment':
              insertionMode.processComment(token.data);
              break;
            case 'StartTag':
              insertionMode.processStartTag(token.name, token.data, token.selfClosing);
              break;
            case 'EndTag':
              insertionMode.processEndTag(token.name);
              break;
            case 'Doctype':
              insertionMode.processDoctype(token.name, token.publicId, token.systemId, token.forceQuirks);
              break;
            case 'EOF':
              insertionMode.processEOF();
              break;
          }
        };
        TreeBuilder.prototype.isCdataSectionAllowed = function() {
          return this.openElements.length > 0 && this.currentStackItem().isForeign();
        };
        TreeBuilder.prototype.isSelfClosingFlagAcknowledged = function() {
          return this.selfClosingFlagAcknowledged;
        };
        TreeBuilder.prototype.createElement = function(namespaceURI, localName, attributes) {
          throw new Error("Not implemented");
        };
        TreeBuilder.prototype.attachNode = function(child, parent) {
          throw new Error("Not implemented");
        };
        TreeBuilder.prototype.attachNodeToFosterParent = function(child, table, stackParent) {
          throw new Error("Not implemented");
        };
        TreeBuilder.prototype.detachFromParent = function(node) {
          throw new Error("Not implemented");
        };
        TreeBuilder.prototype.addAttributesToElement = function(element, attributes) {
          throw new Error("Not implemented");
        };
        TreeBuilder.prototype.insertHtmlElement = function(attributes) {
          var root = this.createElement("http://www.w3.org/1999/xhtml", 'html', attributes);
          this.attachNode(root, this.document);
          this.openElements.pushHtmlElement(new StackItem_1.default("http://www.w3.org/1999/xhtml", 'html', attributes, root));
          return root;
        };
        TreeBuilder.prototype.insertHeadElement = function(attributes) {
          var element = this.createElement("http://www.w3.org/1999/xhtml", "head", attributes);
          this.head = new StackItem_1.default("http://www.w3.org/1999/xhtml", "head", attributes, element);
          this.attachNode(element, this.openElements.top.node);
          this.openElements.pushHeadElement(this.head);
          return element;
        };
        TreeBuilder.prototype.insertBodyElement = function(attributes) {
          var element = this.createElement("http://www.w3.org/1999/xhtml", "body", attributes);
          this.attachNode(element, this.openElements.top.node);
          this.openElements.pushBodyElement(new StackItem_1.default("http://www.w3.org/1999/xhtml", "body", attributes, element));
          return element;
        };
        TreeBuilder.prototype.insertIntoFosterParent = function(node) {
          var tableIndex = this.openElements.findIndex('table');
          var tableElement = this.openElements.item(tableIndex).node;
          if (tableIndex === 0)
            return this.attachNode(node, tableElement);
          this.attachNodeToFosterParent(node, tableElement, this.openElements.item(tableIndex - 1).node);
        };
        TreeBuilder.prototype.insertElement = function(name, attributes, namespaceURI, selfClosing) {
          if (!namespaceURI)
            namespaceURI = "http://www.w3.org/1999/xhtml";
          var element = this.createElement(namespaceURI, name, attributes);
          if (this.shouldFosterParent())
            this.insertIntoFosterParent(element);
          else
            this.attachNode(element, this.openElements.top.node);
          if (!selfClosing)
            this.openElements.push(new StackItem_1.default(namespaceURI, name, attributes, element));
        };
        TreeBuilder.prototype.insertFormattingElement = function(name, attributes) {
          this.insertElement(name, attributes, "http://www.w3.org/1999/xhtml");
          this.appendElementToActiveFormattingElements(this.currentStackItem());
        };
        TreeBuilder.prototype.insertSelfClosingElement = function(name, attributes) {
          this.selfClosingFlagAcknowledged = true;
          this.insertElement(name, attributes, "http://www.w3.org/1999/xhtml", true);
        };
        TreeBuilder.prototype.insertForeignElement = function(name, attributes, namespaceURI, selfClosing) {
          if (selfClosing)
            this.selfClosingFlagAcknowledged = true;
          this.insertElement(name, attributes, namespaceURI, selfClosing);
        };
        TreeBuilder.prototype.insertComment = function(data, parent) {
          throw new Error("Not implemented");
        };
        TreeBuilder.prototype.insertDoctype = function(name, publicId, systemId) {
          throw new Error("Not implemented");
        };
        TreeBuilder.prototype.insertText = function(data) {
          throw new Error("Not implemented");
        };
        TreeBuilder.prototype.currentStackItem = function() {
          return this.openElements.top;
        };
        TreeBuilder.prototype.popElement = function() {
          return this.openElements.pop();
        };
        TreeBuilder.prototype.shouldFosterParent = function() {
          return this.redirectAttachToFosterParent && this.currentStackItem().isFosterParenting();
        };
        TreeBuilder.prototype.generateImpliedEndTags = function(exclude) {
          var name = this.openElements.top.localName;
          if (['dd', 'dt', 'li', 'option', 'optgroup', 'p', 'rp', 'rt'].indexOf(name) != -1 && name != exclude) {
            this.popElement();
            this.generateImpliedEndTags(exclude);
          }
        };
        TreeBuilder.prototype.reconstructActiveFormattingElements = function() {
          if (this.activeFormattingElements.length === 0)
            return;
          var i = this.activeFormattingElements.length - 1;
          var entry = this.activeFormattingElements[i];
          if (entry == Marker || this.openElements.contains(entry))
            return;
          while (entry != Marker && !this.openElements.contains(entry)) {
            i -= 1;
            entry = this.activeFormattingElements[i];
            if (!entry)
              break;
          }
          while (true) {
            i += 1;
            entry = this.activeFormattingElements[i];
            this.insertElement(entry.localName, entry.attributes);
            var element = this.currentStackItem();
            this.activeFormattingElements[i] = element;
            if (element == this.activeFormattingElements[this.activeFormattingElements.length - 1])
              break;
          }
        };
        TreeBuilder.prototype.ensureNoahsArkCondition = function(item) {
          var kNoahsArkCapacity = 3;
          if (this.activeFormattingElements.length < kNoahsArkCapacity)
            return;
          var candidates = [];
          var newItemAttributeCount = item.attributes.length;
          for (var i = this.activeFormattingElements.length - 1; i >= 0; i--) {
            var candidate = this.activeFormattingElements[i];
            if (candidate === Marker)
              break;
            if (item.localName !== candidate.localName || item.namespaceURI !== candidate.namespaceURI)
              continue;
            if (candidate.attributes.length != newItemAttributeCount)
              continue;
            candidates.push(candidate);
          }
          if (candidates.length < kNoahsArkCapacity)
            return;
          var remainingCandidates = [];
          var attributes = item.attributes;
          for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            for (var j = 0; j < candidates.length; j++) {
              var candidate = candidates[j];
              var candidateAttribute = getAttribute_1.default(candidate, attribute.nodeName);
              if (candidateAttribute && candidateAttribute.nodeValue === attribute.nodeValue)
                remainingCandidates.push(candidate);
            }
            if (remainingCandidates.length < kNoahsArkCapacity)
              return;
            candidates = remainingCandidates;
            remainingCandidates = [];
          }
          for (var i = kNoahsArkCapacity - 1; i < candidates.length; i++)
            this.removeElementFromActiveFormattingElements(candidates[i]);
        };
        TreeBuilder.prototype.appendElementToActiveFormattingElements = function(item) {
          this.ensureNoahsArkCondition(item);
          this.activeFormattingElements.push(item);
        };
        TreeBuilder.prototype.removeElementFromActiveFormattingElements = function(item) {
          var index = this.activeFormattingElements.indexOf(item);
          if (index >= 0)
            this.activeFormattingElements.splice(index, 1);
        };
        TreeBuilder.prototype.elementInActiveFormattingElements = function(name) {
          var els = this.activeFormattingElements;
          for (var i = els.length - 1; i >= 0; i--) {
            if (els[i] == Marker)
              break;
            if (els[i].localName == name)
              return els[i];
          }
          return false;
        };
        TreeBuilder.prototype.clearActiveFormattingElements = function() {
          while (!(this.activeFormattingElements.length === 0 || this.activeFormattingElements.pop() == Marker))
            ;
        };
        TreeBuilder.prototype.reparentChildren = function(oldParent, newParent) {
          throw new Error("Not implemented");
        };
        TreeBuilder.prototype.setFragmentContext = function(context) {
          this.context = context;
        };
        TreeBuilder.prototype.parseError = function(code, args) {
          if (!this.errorHandler)
            return;
          var message = formatMessage_1.default(messages_1.default[code], args);
          this.errorHandler.error(message, this.tokenizer._inputStream.location(), code);
        };
        TreeBuilder.prototype.resetInsertionMode = function() {
          var last = false;
          var node = null;
          for (var i = this.openElements.length - 1; i >= 0; i--) {
            node = this.openElements.item(i);
            if (i === 0) {
              last = true;
              node = new StackItem_1.default("http://www.w3.org/1999/xhtml", this.context, [], null);
            }
            if (node.namespaceURI === "http://www.w3.org/1999/xhtml") {
              if (node.localName === 'select')
                return this.setInsertionMode('inSelect');
              if (node.localName === 'td' || node.localName === 'th')
                return this.setInsertionMode('inCell');
              if (node.localName === 'tr')
                return this.setInsertionMode('inRow');
              if (node.localName === 'tbody' || node.localName === 'thead' || node.localName === 'tfoot')
                return this.setInsertionMode('inTableBody');
              if (node.localName === 'caption')
                return this.setInsertionMode('inCaption');
              if (node.localName === 'colgroup')
                return this.setInsertionMode('inColumnGroup');
              if (node.localName === 'table')
                return this.setInsertionMode('inTable');
              if (node.localName === 'head' && !last)
                return this.setInsertionMode('inHead');
              if (node.localName === 'body')
                return this.setInsertionMode('inBody');
              if (node.localName === 'frameset')
                return this.setInsertionMode('inFrameset');
              if (node.localName === 'html')
                if (!this.openElements.headElement)
                  return this.setInsertionMode('beforeHead');
                else
                  return this.setInsertionMode('afterHead');
            }
            if (last)
              return this.setInsertionMode('inBody');
          }
        };
        TreeBuilder.prototype.processGenericRCDATAStartTag = function(name, attributes) {
          this.insertElement(name, attributes);
          this.tokenizer.setState(Tokenizer_1.default.RCDATA);
          this.originalInsertionMode = this.insertionModeName;
          this.setInsertionMode('text');
        };
        TreeBuilder.prototype.processGenericRawTextStartTag = function(name, attributes) {
          this.insertElement(name, attributes);
          this.tokenizer.setState(Tokenizer_1.default.RAWTEXT);
          this.originalInsertionMode = this.insertionModeName;
          this.setInsertionMode('text');
        };
        TreeBuilder.prototype.adjustMathMLAttributes = function(attributes) {
          attributes.forEach(function(a) {
            a.namespaceURI = "http://www.w3.org/1998/Math/MathML";
            if (constants_1.MATHMLAttributeMap[a.nodeName])
              a.nodeName = constants_1.MATHMLAttributeMap[a.nodeName];
          });
          return attributes;
        };
        TreeBuilder.prototype.adjustSVGTagNameCase = function(name) {
          return constants_1.SVGTagMap[name] || name;
        };
        TreeBuilder.prototype.adjustSVGAttributes = function(attributes) {
          attributes.forEach(function(a) {
            a.namespaceURI = "http://www.w3.org/2000/svg";
            if (constants_1.SVGAttributeMap[a.nodeName])
              a.nodeName = constants_1.SVGAttributeMap[a.nodeName];
          });
          return attributes;
        };
        TreeBuilder.prototype.adjustForeignAttributes = function(attributes) {
          for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            var adjusted = constants_1.ForeignAttributeMap[attribute.nodeName];
            if (adjusted) {
              attribute.nodeName = adjusted.localName;
              attribute.prefix = adjusted.prefix;
              attribute.namespaceURI = adjusted.namespaceURI;
            }
          }
          return attributes;
        };
        return TreeBuilder;
      })();
      exports_1("default", TreeBuilder);
    }
  };
});

System.register("src/mode/html/Characters.js", ["./Node", "./NodeType"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Node_1,
      NodeType_1;
  var Characters;
  return {
    setters: [function(Node_1_1) {
      Node_1 = Node_1_1;
    }, function(NodeType_1_1) {
      NodeType_1 = NodeType_1_1;
    }],
    execute: function() {
      Characters = (function(_super) {
        __extends(Characters, _super);
        function Characters(locator, data) {
          _super.call(this, locator);
          this.data = data;
          this.nodeType = NodeType_1.default.CHARACTERS;
        }
        Characters.prototype.visit = function(treeParser) {
          treeParser.characters(this.data, 0, this.data.length, this);
        };
        return Characters;
      })(Node_1.default);
      exports_1("default", Characters);
    }
  };
});

System.register("src/mode/html/Comment.js", ["./Node", "./NodeType"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Node_1,
      NodeType_1;
  var Comment;
  return {
    setters: [function(Node_1_1) {
      Node_1 = Node_1_1;
    }, function(NodeType_1_1) {
      NodeType_1 = NodeType_1_1;
    }],
    execute: function() {
      Comment = (function(_super) {
        __extends(Comment, _super);
        function Comment(locator, data) {
          _super.call(this, locator);
          this.data = data;
          this.nodeType = NodeType_1.default.COMMENT;
        }
        Comment.prototype.visit = function(treeParser) {
          treeParser.comment(this.data, 0, this.data.length, this);
        };
        return Comment;
      })(Node_1.default);
      exports_1("default", Comment);
    }
  };
});

System.register("src/mode/html/Document.js", ["./ParentNode", "./NodeType"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ParentNode_1,
      NodeType_1;
  var Document;
  return {
    setters: [function(ParentNode_1_1) {
      ParentNode_1 = ParentNode_1_1;
    }, function(NodeType_1_1) {
      NodeType_1 = NodeType_1_1;
    }],
    execute: function() {
      Document = (function(_super) {
        __extends(Document, _super);
        function Document(locator) {
          _super.call(this, locator);
          this.nodeType = NodeType_1.default.DOCUMENT;
        }
        Document.prototype.visit = function(treeParser) {
          treeParser.startDocument(this);
        };
        Document.prototype.revisit = function(treeParser) {
          treeParser.endDocument(this.endLocator);
        };
        return Document;
      })(ParentNode_1.default);
      exports_1("default", Document);
    }
  };
});

System.register("src/mode/html/DocumentFragment.js", [], function(exports_1) {
  var DocumentFragment;
  return {
    setters: [],
    execute: function() {
      DocumentFragment = (function() {
        function DocumentFragment() {}
        return DocumentFragment;
      })();
      exports_1("default", DocumentFragment);
    }
  };
});

System.register("src/mode/html/DTD.js", ["./ParentNode", "./NodeType"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ParentNode_1,
      NodeType_1;
  var DTD;
  return {
    setters: [function(ParentNode_1_1) {
      ParentNode_1 = ParentNode_1_1;
    }, function(NodeType_1_1) {
      NodeType_1 = NodeType_1_1;
    }],
    execute: function() {
      DTD = (function(_super) {
        __extends(DTD, _super);
        function DTD(locator, name, publicIdentifier, systemIdentifier) {
          _super.call(this, locator);
          this.name = name;
          this.publicIdentifier = publicIdentifier;
          this.systemIdentifier = systemIdentifier;
          this.nodeType = NodeType_1.default.DTD;
        }
        DTD.prototype.visit = function(treeParser) {
          treeParser.startDTD(this.name, this.publicIdentifier, this.systemIdentifier, this);
        };
        DTD.prototype.revisit = function(treeParser) {
          treeParser.endDTD();
        };
        return DTD;
      })(ParentNode_1.default);
      exports_1("default", DTD);
    }
  };
});

System.register("src/mode/html/Node.js", [], function(exports_1) {
  var Node;
  return {
    setters: [],
    execute: function() {
      Node = (function() {
        function Node(locator) {
          this.attributes = [];
          if (!locator) {
            this.columnNumber = -1;
            this.lineNumber = -1;
          } else {
            this.columnNumber = locator.columnNumber;
            this.lineNumber = locator.lineNumber;
          }
          this.parentNode = null;
          this.nextSibling = null;
          this.firstChild = null;
        }
        Node.prototype.visit = function(treeParser) {
          throw new Error("Not Implemented");
        };
        Node.prototype.revisit = function(treeParser) {
          return;
        };
        Node.prototype.detach = function() {
          if (this.parentNode !== null) {
            this.parentNode.removeChild(this);
            this.parentNode = null;
          }
        };
        Object.defineProperty(Node.prototype, "previousSibling", {
          get: function() {
            var prev = null;
            var next = this.parentNode.firstChild;
            for (; ; ) {
              if (this == next) {
                return prev;
              }
              prev = next;
              next = next.nextSibling;
            }
          },
          enumerable: true,
          configurable: true
        });
        return Node;
      })();
      exports_1("default", Node);
    }
  };
});

System.register("src/mode/html/ParentNode.js", ["./Node"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Node_1;
  var ParentNode;
  return {
    setters: [function(Node_1_1) {
      Node_1 = Node_1_1;
    }],
    execute: function() {
      ParentNode = (function(_super) {
        __extends(ParentNode, _super);
        function ParentNode(locator) {
          _super.call(this, locator);
          this.lastChild = null;
          this._endLocator = null;
        }
        ParentNode.prototype.insertBefore = function(child, sibling) {
          if (!sibling) {
            return this.appendChild(child);
          }
          child.detach();
          child.parentNode = this;
          if (this.firstChild == sibling) {
            child.nextSibling = sibling;
            this.firstChild = child;
          } else {
            var prev = this.firstChild;
            var next = this.firstChild.nextSibling;
            while (next != sibling) {
              prev = next;
              next = next.nextSibling;
            }
            prev.nextSibling = child;
            child.nextSibling = next;
          }
          return child;
        };
        ParentNode.prototype.insertBetween = function(child, prev, next) {
          if (!next) {
            return this.appendChild(child);
          }
          child.detach();
          child.parentNode = this;
          child.nextSibling = next;
          if (!prev) {
            this.firstChild = child;
          } else {
            prev.nextSibling = child;
          }
          return child;
        };
        ParentNode.prototype.appendChild = function(child) {
          child.detach();
          child.parentNode = this;
          if (!this.firstChild) {
            this.firstChild = child;
          } else {
            this.lastChild.nextSibling = child;
          }
          this.lastChild = child;
          return child;
        };
        ParentNode.prototype.appendChildren = function(parent) {
          var child = parent.firstChild;
          if (!child) {
            return;
          }
          var another = parent;
          if (!this.firstChild) {
            this.firstChild = child;
          } else {
            this.lastChild.nextSibling = child;
          }
          this.lastChild = another.lastChild;
          do {
            child.parentNode = this;
          } while ((child = child.nextSibling));
          another.firstChild = null;
          another.lastChild = null;
        };
        ParentNode.prototype.removeChild = function(node) {
          if (this.firstChild == node) {
            this.firstChild = node.nextSibling;
            if (this.lastChild == node) {
              this.lastChild = null;
            }
          } else {
            var prev = this.firstChild;
            var next = this.firstChild.nextSibling;
            while (next != node) {
              prev = next;
              next = next.nextSibling;
            }
            prev.nextSibling = node.nextSibling;
            if (this.lastChild == node) {
              this.lastChild = prev;
            }
          }
          node.parentNode = null;
          return node;
        };
        Object.defineProperty(ParentNode.prototype, "endLocator", {
          get: function() {
            return this._endLocator;
          },
          set: function(endLocator) {
            this._endLocator = {
              lineNumber: endLocator.lineNumber,
              columnNumber: endLocator.columnNumber
            };
          },
          enumerable: true,
          configurable: true
        });
        return ParentNode;
      })(Node_1.default);
      exports_1("default", ParentNode);
    }
  };
});

System.register("src/mode/html/NodeType.js", [], function(exports_1) {
  var NodeType;
  return {
    setters: [],
    execute: function() {
      NodeType = {
        CDATA: 1,
        CHARACTERS: 2,
        COMMENT: 3,
        DOCUMENT: 4,
        DOCUMENT_FRAGMENT: 5,
        DTD: 6,
        ELEMENT: 7,
        ENTITY: 8,
        IGNORABLE_WHITESPACE: 9,
        PROCESSING_INSTRUCTION: 10,
        SKIPPED_ENTITY: 11
      };
      exports_1("default", NodeType);
    }
  };
});

System.register("src/mode/html/Element.js", ["./ParentNode", "./NodeType"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ParentNode_1,
      NodeType_1;
  var Element;
  return {
    setters: [function(ParentNode_1_1) {
      ParentNode_1 = ParentNode_1_1;
    }, function(NodeType_1_1) {
      NodeType_1 = NodeType_1_1;
    }],
    execute: function() {
      Element = (function(_super) {
        __extends(Element, _super);
        function Element(locator, uri, localName, qName, atts, prefixMappings) {
          _super.call(this, locator);
          this.uri = uri;
          this.localName = localName;
          this.qName = qName;
          this.attributes = atts;
          this.prefixMappings = prefixMappings;
          this.nodeType = NodeType_1.default.ELEMENT;
        }
        Element.prototype.visit = function(treeParser) {
          if (this.prefixMappings) {
            for (var key in this.prefixMappings) {
              var mapping = this.prefixMappings[key];
              treeParser.startPrefixMapping(mapping.getPrefix(), mapping.getUri(), this);
            }
          }
          treeParser.startElement(this.uri, this.localName, this.qName, this.attributes, this);
        };
        Element.prototype.revisit = function(treeParser) {
          treeParser.endElement(this.uri, this.localName, this.qName, this.endLocator);
          if (this.prefixMappings) {
            for (var key in this.prefixMappings) {
              var mapping = this.prefixMappings[key];
              treeParser.endPrefixMapping(mapping.getPrefix(), this.endLocator);
            }
          }
        };
        return Element;
      })(ParentNode_1.default);
      exports_1("default", Element);
    }
  };
});

System.register("src/mode/html/getAttribute.js", [], function(exports_1) {
  function getAttribute(node, name) {
    for (var i = 0; i < node.attributes.length; i++) {
      var attribute = node.attributes[i];
      if (attribute.nodeName === name) {
        return attribute;
      }
    }
    return null;
  }
  exports_1("default", getAttribute);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/mode/html/SAXTreeBuilder.js", ["./TreeBuilder", "./Characters", "./Comment", "./Document", "./DocumentFragment", "./DTD", "./Element", "./getAttribute"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var TreeBuilder_1,
      Characters_1,
      Comment_1,
      Document_1,
      DocumentFragment_1,
      DTD_1,
      Element_1,
      getAttribute_1;
  var SAXTreeBuilder;
  return {
    setters: [function(TreeBuilder_1_1) {
      TreeBuilder_1 = TreeBuilder_1_1;
    }, function(Characters_1_1) {
      Characters_1 = Characters_1_1;
    }, function(Comment_1_1) {
      Comment_1 = Comment_1_1;
    }, function(Document_1_1) {
      Document_1 = Document_1_1;
    }, function(DocumentFragment_1_1) {
      DocumentFragment_1 = DocumentFragment_1_1;
    }, function(DTD_1_1) {
      DTD_1 = DTD_1_1;
    }, function(Element_1_1) {
      Element_1 = Element_1_1;
    }, function(getAttribute_1_1) {
      getAttribute_1 = getAttribute_1_1;
    }],
    execute: function() {
      SAXTreeBuilder = (function(_super) {
        __extends(SAXTreeBuilder, _super);
        function SAXTreeBuilder() {
          _super.call(this);
        }
        SAXTreeBuilder.prototype.start = function(tokenizer) {
          this.document = new Document_1.default(this.tokenizer);
        };
        SAXTreeBuilder.prototype.end = function() {
          this.document.endLocator = this.tokenizer;
        };
        SAXTreeBuilder.prototype.insertDoctype = function(name, publicId, systemId) {
          var doctype = new DTD_1.default(this.tokenizer, name, publicId, systemId);
          doctype.endLocator = this.tokenizer;
          this.document.appendChild(doctype);
        };
        SAXTreeBuilder.prototype.createElement = function(namespaceURI, localName, attributes) {
          var element = new Element_1.default(this.tokenizer, namespaceURI, localName, localName, attributes || []);
          return element;
        };
        SAXTreeBuilder.prototype.insertComment = function(data, parent) {
          if (!parent)
            parent = this.currentStackItem();
          var comment = new Comment_1.default(this.tokenizer, data);
          parent.appendChild(comment);
        };
        SAXTreeBuilder.prototype.appendCharacters = function(parent, data) {
          var text = new Characters_1.default(this.tokenizer, data);
          parent.appendChild(text);
        };
        SAXTreeBuilder.prototype.insertText = function(data) {
          if (this.redirectAttachToFosterParent && this.openElements.top.isFosterParenting()) {
            var tableIndex = this.openElements.findIndex('table');
            var tableItem = this.openElements.item(tableIndex);
            var table = tableItem.node;
            if (tableIndex === 0) {
              return this.appendCharacters(table, data);
            }
            var text = new Characters_1.default(this.tokenizer, data);
            var parent = table.parentNode;
            if (parent) {
              parent.insertBetween(text, table.previousSibling, table);
              return;
            }
            var stackParent = this.openElements.item(tableIndex - 1).node;
            stackParent.appendChild(text);
            return;
          }
          this.appendCharacters(this.currentStackItem().node, data);
        };
        SAXTreeBuilder.prototype.attachNode = function(node, parent) {
          parent.appendChild(node);
        };
        SAXTreeBuilder.prototype.attachNodeToFosterParent = function(child, table, stackParent) {
          var parent = table.parentNode;
          if (parent)
            parent.insertBetween(child, table.previousSibling, table);
          else
            stackParent.appendChild(child);
        };
        SAXTreeBuilder.prototype.detachFromParent = function(element) {
          element.detach();
        };
        SAXTreeBuilder.prototype.reparentChildren = function(oldParent, newParent) {
          newParent.appendChildren(oldParent.firstChild);
        };
        SAXTreeBuilder.prototype.getFragment = function() {
          var fragment = new DocumentFragment_1.default();
          this.reparentChildren(this.openElements.rootNode, fragment);
          return fragment;
        };
        SAXTreeBuilder.prototype.addAttributesToElement = function(element, attributes) {
          for (var i = 0; i < attributes.length; i++) {
            var attribute = attributes[i];
            if (!getAttribute_1.default(element, attribute.nodeName))
              element.attributes.push(attribute);
          }
        };
        return SAXTreeBuilder;
      })(TreeBuilder_1.default);
      exports_1("default", SAXTreeBuilder);
    }
  };
});

System.register("src/mode/html/entities.js", [], function(exports_1) {
  var entities;
  return {
    setters: [],
    execute: function() {
      entities = {
        "Aacute;": "\u00C1",
        "Aacute": "\u00C1",
        "aacute;": "\u00E1",
        "aacute": "\u00E1",
        "Abreve;": "\u0102",
        "abreve;": "\u0103",
        "ac;": "\u223E",
        "acd;": "\u223F",
        "acE;": "\u223E\u0333",
        "Acirc;": "\u00C2",
        "Acirc": "\u00C2",
        "acirc;": "\u00E2",
        "acirc": "\u00E2",
        "acute;": "\u00B4",
        "acute": "\u00B4",
        "Acy;": "\u0410",
        "acy;": "\u0430",
        "AElig;": "\u00C6",
        "AElig": "\u00C6",
        "aelig;": "\u00E6",
        "aelig": "\u00E6",
        "af;": "\u2061",
        "Afr;": "\uD835\uDD04",
        "afr;": "\uD835\uDD1E",
        "Agrave;": "\u00C0",
        "Agrave": "\u00C0",
        "agrave;": "\u00E0",
        "agrave": "\u00E0",
        "alefsym;": "\u2135",
        "aleph;": "\u2135",
        "Alpha;": "\u0391",
        "alpha;": "\u03B1",
        "Amacr;": "\u0100",
        "amacr;": "\u0101",
        "amalg;": "\u2A3F",
        "amp;": "\u0026",
        "amp": "\u0026",
        "AMP;": "\u0026",
        "AMP": "\u0026",
        "andand;": "\u2A55",
        "And;": "\u2A53",
        "and;": "\u2227",
        "andd;": "\u2A5C",
        "andslope;": "\u2A58",
        "andv;": "\u2A5A",
        "ang;": "\u2220",
        "ange;": "\u29A4",
        "angle;": "\u2220",
        "angmsdaa;": "\u29A8",
        "angmsdab;": "\u29A9",
        "angmsdac;": "\u29AA",
        "angmsdad;": "\u29AB",
        "angmsdae;": "\u29AC",
        "angmsdaf;": "\u29AD",
        "angmsdag;": "\u29AE",
        "angmsdah;": "\u29AF",
        "angmsd;": "\u2221",
        "angrt;": "\u221F",
        "angrtvb;": "\u22BE",
        "angrtvbd;": "\u299D",
        "angsph;": "\u2222",
        "angst;": "\u00C5",
        "angzarr;": "\u237C",
        "Aogon;": "\u0104",
        "aogon;": "\u0105",
        "Aopf;": "\uD835\uDD38",
        "aopf;": "\uD835\uDD52",
        "apacir;": "\u2A6F",
        "ap;": "\u2248",
        "apE;": "\u2A70",
        "ape;": "\u224A",
        "apid;": "\u224B",
        "apos;": "\u0027",
        "ApplyFunction;": "\u2061",
        "approx;": "\u2248",
        "approxeq;": "\u224A",
        "Aring;": "\u00C5",
        "Aring": "\u00C5",
        "aring;": "\u00E5",
        "aring": "\u00E5",
        "Ascr;": "\uD835\uDC9C",
        "ascr;": "\uD835\uDCB6",
        "Assign;": "\u2254",
        "ast;": "\u002A",
        "asymp;": "\u2248",
        "asympeq;": "\u224D",
        "Atilde;": "\u00C3",
        "Atilde": "\u00C3",
        "atilde;": "\u00E3",
        "atilde": "\u00E3",
        "Auml;": "\u00C4",
        "Auml": "\u00C4",
        "auml;": "\u00E4",
        "auml": "\u00E4",
        "awconint;": "\u2233",
        "awint;": "\u2A11",
        "backcong;": "\u224C",
        "backepsilon;": "\u03F6",
        "backprime;": "\u2035",
        "backsim;": "\u223D",
        "backsimeq;": "\u22CD",
        "Backslash;": "\u2216",
        "Barv;": "\u2AE7",
        "barvee;": "\u22BD",
        "barwed;": "\u2305",
        "Barwed;": "\u2306",
        "barwedge;": "\u2305",
        "bbrk;": "\u23B5",
        "bbrktbrk;": "\u23B6",
        "bcong;": "\u224C",
        "Bcy;": "\u0411",
        "bcy;": "\u0431",
        "bdquo;": "\u201E",
        "becaus;": "\u2235",
        "because;": "\u2235",
        "Because;": "\u2235",
        "bemptyv;": "\u29B0",
        "bepsi;": "\u03F6",
        "bernou;": "\u212C",
        "Bernoullis;": "\u212C",
        "Beta;": "\u0392",
        "beta;": "\u03B2",
        "beth;": "\u2136",
        "between;": "\u226C",
        "Bfr;": "\uD835\uDD05",
        "bfr;": "\uD835\uDD1F",
        "bigcap;": "\u22C2",
        "bigcirc;": "\u25EF",
        "bigcup;": "\u22C3",
        "bigodot;": "\u2A00",
        "bigoplus;": "\u2A01",
        "bigotimes;": "\u2A02",
        "bigsqcup;": "\u2A06",
        "bigstar;": "\u2605",
        "bigtriangledown;": "\u25BD",
        "bigtriangleup;": "\u25B3",
        "biguplus;": "\u2A04",
        "bigvee;": "\u22C1",
        "bigwedge;": "\u22C0",
        "bkarow;": "\u290D",
        "blacklozenge;": "\u29EB",
        "blacksquare;": "\u25AA",
        "blacktriangle;": "\u25B4",
        "blacktriangledown;": "\u25BE",
        "blacktriangleleft;": "\u25C2",
        "blacktriangleright;": "\u25B8",
        "blank;": "\u2423",
        "blk12;": "\u2592",
        "blk14;": "\u2591",
        "blk34;": "\u2593",
        "block;": "\u2588",
        "bne;": "\u003D\u20E5",
        "bnequiv;": "\u2261\u20E5",
        "bNot;": "\u2AED",
        "bnot;": "\u2310",
        "Bopf;": "\uD835\uDD39",
        "bopf;": "\uD835\uDD53",
        "bot;": "\u22A5",
        "bottom;": "\u22A5",
        "bowtie;": "\u22C8",
        "boxbox;": "\u29C9",
        "boxdl;": "\u2510",
        "boxdL;": "\u2555",
        "boxDl;": "\u2556",
        "boxDL;": "\u2557",
        "boxdr;": "\u250C",
        "boxdR;": "\u2552",
        "boxDr;": "\u2553",
        "boxDR;": "\u2554",
        "boxh;": "\u2500",
        "boxH;": "\u2550",
        "boxhd;": "\u252C",
        "boxHd;": "\u2564",
        "boxhD;": "\u2565",
        "boxHD;": "\u2566",
        "boxhu;": "\u2534",
        "boxHu;": "\u2567",
        "boxhU;": "\u2568",
        "boxHU;": "\u2569",
        "boxminus;": "\u229F",
        "boxplus;": "\u229E",
        "boxtimes;": "\u22A0",
        "boxul;": "\u2518",
        "boxuL;": "\u255B",
        "boxUl;": "\u255C",
        "boxUL;": "\u255D",
        "boxur;": "\u2514",
        "boxuR;": "\u2558",
        "boxUr;": "\u2559",
        "boxUR;": "\u255A",
        "boxv;": "\u2502",
        "boxV;": "\u2551",
        "boxvh;": "\u253C",
        "boxvH;": "\u256A",
        "boxVh;": "\u256B",
        "boxVH;": "\u256C",
        "boxvl;": "\u2524",
        "boxvL;": "\u2561",
        "boxVl;": "\u2562",
        "boxVL;": "\u2563",
        "boxvr;": "\u251C",
        "boxvR;": "\u255E",
        "boxVr;": "\u255F",
        "boxVR;": "\u2560",
        "bprime;": "\u2035",
        "breve;": "\u02D8",
        "Breve;": "\u02D8",
        "brvbar;": "\u00A6",
        "brvbar": "\u00A6",
        "bscr;": "\uD835\uDCB7",
        "Bscr;": "\u212C",
        "bsemi;": "\u204F",
        "bsim;": "\u223D",
        "bsime;": "\u22CD",
        "bsolb;": "\u29C5",
        "bsol;": "\u005C",
        "bsolhsub;": "\u27C8",
        "bull;": "\u2022",
        "bullet;": "\u2022",
        "bump;": "\u224E",
        "bumpE;": "\u2AAE",
        "bumpe;": "\u224F",
        "Bumpeq;": "\u224E",
        "bumpeq;": "\u224F",
        "Cacute;": "\u0106",
        "cacute;": "\u0107",
        "capand;": "\u2A44",
        "capbrcup;": "\u2A49",
        "capcap;": "\u2A4B",
        "cap;": "\u2229",
        "Cap;": "\u22D2",
        "capcup;": "\u2A47",
        "capdot;": "\u2A40",
        "CapitalDifferentialD;": "\u2145",
        "caps;": "\u2229\uFE00",
        "caret;": "\u2041",
        "caron;": "\u02C7",
        "Cayleys;": "\u212D",
        "ccaps;": "\u2A4D",
        "Ccaron;": "\u010C",
        "ccaron;": "\u010D",
        "Ccedil;": "\u00C7",
        "Ccedil": "\u00C7",
        "ccedil;": "\u00E7",
        "ccedil": "\u00E7",
        "Ccirc;": "\u0108",
        "ccirc;": "\u0109",
        "Cconint;": "\u2230",
        "ccups;": "\u2A4C",
        "ccupssm;": "\u2A50",
        "Cdot;": "\u010A",
        "cdot;": "\u010B",
        "cedil;": "\u00B8",
        "cedil": "\u00B8",
        "Cedilla;": "\u00B8",
        "cemptyv;": "\u29B2",
        "cent;": "\u00A2",
        "cent": "\u00A2",
        "centerdot;": "\u00B7",
        "CenterDot;": "\u00B7",
        "cfr;": "\uD835\uDD20",
        "Cfr;": "\u212D",
        "CHcy;": "\u0427",
        "chcy;": "\u0447",
        "check;": "\u2713",
        "checkmark;": "\u2713",
        "Chi;": "\u03A7",
        "chi;": "\u03C7",
        "circ;": "\u02C6",
        "circeq;": "\u2257",
        "circlearrowleft;": "\u21BA",
        "circlearrowright;": "\u21BB",
        "circledast;": "\u229B",
        "circledcirc;": "\u229A",
        "circleddash;": "\u229D",
        "CircleDot;": "\u2299",
        "circledR;": "\u00AE",
        "circledS;": "\u24C8",
        "CircleMinus;": "\u2296",
        "CirclePlus;": "\u2295",
        "CircleTimes;": "\u2297",
        "cir;": "\u25CB",
        "cirE;": "\u29C3",
        "cire;": "\u2257",
        "cirfnint;": "\u2A10",
        "cirmid;": "\u2AEF",
        "cirscir;": "\u29C2",
        "ClockwiseContourIntegral;": "\u2232",
        "CloseCurlyDoubleQuote;": "\u201D",
        "CloseCurlyQuote;": "\u2019",
        "clubs;": "\u2663",
        "clubsuit;": "\u2663",
        "colon;": "\u003A",
        "Colon;": "\u2237",
        "Colone;": "\u2A74",
        "colone;": "\u2254",
        "coloneq;": "\u2254",
        "comma;": "\u002C",
        "commat;": "\u0040",
        "comp;": "\u2201",
        "compfn;": "\u2218",
        "complement;": "\u2201",
        "complexes;": "\u2102",
        "cong;": "\u2245",
        "congdot;": "\u2A6D",
        "Congruent;": "\u2261",
        "conint;": "\u222E",
        "Conint;": "\u222F",
        "ContourIntegral;": "\u222E",
        "copf;": "\uD835\uDD54",
        "Copf;": "\u2102",
        "coprod;": "\u2210",
        "Coproduct;": "\u2210",
        "copy;": "\u00A9",
        "copy": "\u00A9",
        "COPY;": "\u00A9",
        "COPY": "\u00A9",
        "copysr;": "\u2117",
        "CounterClockwiseContourIntegral;": "\u2233",
        "crarr;": "\u21B5",
        "cross;": "\u2717",
        "Cross;": "\u2A2F",
        "Cscr;": "\uD835\uDC9E",
        "cscr;": "\uD835\uDCB8",
        "csub;": "\u2ACF",
        "csube;": "\u2AD1",
        "csup;": "\u2AD0",
        "csupe;": "\u2AD2",
        "ctdot;": "\u22EF",
        "cudarrl;": "\u2938",
        "cudarrr;": "\u2935",
        "cuepr;": "\u22DE",
        "cuesc;": "\u22DF",
        "cularr;": "\u21B6",
        "cularrp;": "\u293D",
        "cupbrcap;": "\u2A48",
        "cupcap;": "\u2A46",
        "CupCap;": "\u224D",
        "cup;": "\u222A",
        "Cup;": "\u22D3",
        "cupcup;": "\u2A4A",
        "cupdot;": "\u228D",
        "cupor;": "\u2A45",
        "cups;": "\u222A\uFE00",
        "curarr;": "\u21B7",
        "curarrm;": "\u293C",
        "curlyeqprec;": "\u22DE",
        "curlyeqsucc;": "\u22DF",
        "curlyvee;": "\u22CE",
        "curlywedge;": "\u22CF",
        "curren;": "\u00A4",
        "curren": "\u00A4",
        "curvearrowleft;": "\u21B6",
        "curvearrowright;": "\u21B7",
        "cuvee;": "\u22CE",
        "cuwed;": "\u22CF",
        "cwconint;": "\u2232",
        "cwint;": "\u2231",
        "cylcty;": "\u232D",
        "dagger;": "\u2020",
        "Dagger;": "\u2021",
        "daleth;": "\u2138",
        "darr;": "\u2193",
        "Darr;": "\u21A1",
        "dArr;": "\u21D3",
        "dash;": "\u2010",
        "Dashv;": "\u2AE4",
        "dashv;": "\u22A3",
        "dbkarow;": "\u290F",
        "dblac;": "\u02DD",
        "Dcaron;": "\u010E",
        "dcaron;": "\u010F",
        "Dcy;": "\u0414",
        "dcy;": "\u0434",
        "ddagger;": "\u2021",
        "ddarr;": "\u21CA",
        "DD;": "\u2145",
        "dd;": "\u2146",
        "DDotrahd;": "\u2911",
        "ddotseq;": "\u2A77",
        "deg;": "\u00B0",
        "deg": "\u00B0",
        "Del;": "\u2207",
        "Delta;": "\u0394",
        "delta;": "\u03B4",
        "demptyv;": "\u29B1",
        "dfisht;": "\u297F",
        "Dfr;": "\uD835\uDD07",
        "dfr;": "\uD835\uDD21",
        "dHar;": "\u2965",
        "dharl;": "\u21C3",
        "dharr;": "\u21C2",
        "DiacriticalAcute;": "\u00B4",
        "DiacriticalDot;": "\u02D9",
        "DiacriticalDoubleAcute;": "\u02DD",
        "DiacriticalGrave;": "\u0060",
        "DiacriticalTilde;": "\u02DC",
        "diam;": "\u22C4",
        "diamond;": "\u22C4",
        "Diamond;": "\u22C4",
        "diamondsuit;": "\u2666",
        "diams;": "\u2666",
        "die;": "\u00A8",
        "DifferentialD;": "\u2146",
        "digamma;": "\u03DD",
        "disin;": "\u22F2",
        "div;": "\u00F7",
        "divide;": "\u00F7",
        "divide": "\u00F7",
        "divideontimes;": "\u22C7",
        "divonx;": "\u22C7",
        "DJcy;": "\u0402",
        "djcy;": "\u0452",
        "dlcorn;": "\u231E",
        "dlcrop;": "\u230D",
        "dollar;": "\u0024",
        "Dopf;": "\uD835\uDD3B",
        "dopf;": "\uD835\uDD55",
        "Dot;": "\u00A8",
        "dot;": "\u02D9",
        "DotDot;": "\u20DC",
        "doteq;": "\u2250",
        "doteqdot;": "\u2251",
        "DotEqual;": "\u2250",
        "dotminus;": "\u2238",
        "dotplus;": "\u2214",
        "dotsquare;": "\u22A1",
        "doublebarwedge;": "\u2306",
        "DoubleContourIntegral;": "\u222F",
        "DoubleDot;": "\u00A8",
        "DoubleDownArrow;": "\u21D3",
        "DoubleLeftArrow;": "\u21D0",
        "DoubleLeftRightArrow;": "\u21D4",
        "DoubleLeftTee;": "\u2AE4",
        "DoubleLongLeftArrow;": "\u27F8",
        "DoubleLongLeftRightArrow;": "\u27FA",
        "DoubleLongRightArrow;": "\u27F9",
        "DoubleRightArrow;": "\u21D2",
        "DoubleRightTee;": "\u22A8",
        "DoubleUpArrow;": "\u21D1",
        "DoubleUpDownArrow;": "\u21D5",
        "DoubleVerticalBar;": "\u2225",
        "DownArrowBar;": "\u2913",
        "downarrow;": "\u2193",
        "DownArrow;": "\u2193",
        "Downarrow;": "\u21D3",
        "DownArrowUpArrow;": "\u21F5",
        "DownBreve;": "\u0311",
        "downdownarrows;": "\u21CA",
        "downharpoonleft;": "\u21C3",
        "downharpoonright;": "\u21C2",
        "DownLeftRightVector;": "\u2950",
        "DownLeftTeeVector;": "\u295E",
        "DownLeftVectorBar;": "\u2956",
        "DownLeftVector;": "\u21BD",
        "DownRightTeeVector;": "\u295F",
        "DownRightVectorBar;": "\u2957",
        "DownRightVector;": "\u21C1",
        "DownTeeArrow;": "\u21A7",
        "DownTee;": "\u22A4",
        "drbkarow;": "\u2910",
        "drcorn;": "\u231F",
        "drcrop;": "\u230C",
        "Dscr;": "\uD835\uDC9F",
        "dscr;": "\uD835\uDCB9",
        "DScy;": "\u0405",
        "dscy;": "\u0455",
        "dsol;": "\u29F6",
        "Dstrok;": "\u0110",
        "dstrok;": "\u0111",
        "dtdot;": "\u22F1",
        "dtri;": "\u25BF",
        "dtrif;": "\u25BE",
        "duarr;": "\u21F5",
        "duhar;": "\u296F",
        "dwangle;": "\u29A6",
        "DZcy;": "\u040F",
        "dzcy;": "\u045F",
        "dzigrarr;": "\u27FF",
        "Eacute;": "\u00C9",
        "Eacute": "\u00C9",
        "eacute;": "\u00E9",
        "eacute": "\u00E9",
        "easter;": "\u2A6E",
        "Ecaron;": "\u011A",
        "ecaron;": "\u011B",
        "Ecirc;": "\u00CA",
        "Ecirc": "\u00CA",
        "ecirc;": "\u00EA",
        "ecirc": "\u00EA",
        "ecir;": "\u2256",
        "ecolon;": "\u2255",
        "Ecy;": "\u042D",
        "ecy;": "\u044D",
        "eDDot;": "\u2A77",
        "Edot;": "\u0116",
        "edot;": "\u0117",
        "eDot;": "\u2251",
        "ee;": "\u2147",
        "efDot;": "\u2252",
        "Efr;": "\uD835\uDD08",
        "efr;": "\uD835\uDD22",
        "eg;": "\u2A9A",
        "Egrave;": "\u00C8",
        "Egrave": "\u00C8",
        "egrave;": "\u00E8",
        "egrave": "\u00E8",
        "egs;": "\u2A96",
        "egsdot;": "\u2A98",
        "el;": "\u2A99",
        "Element;": "\u2208",
        "elinters;": "\u23E7",
        "ell;": "\u2113",
        "els;": "\u2A95",
        "elsdot;": "\u2A97",
        "Emacr;": "\u0112",
        "emacr;": "\u0113",
        "empty;": "\u2205",
        "emptyset;": "\u2205",
        "EmptySmallSquare;": "\u25FB",
        "emptyv;": "\u2205",
        "EmptyVerySmallSquare;": "\u25AB",
        "emsp13;": "\u2004",
        "emsp14;": "\u2005",
        "emsp;": "\u2003",
        "ENG;": "\u014A",
        "eng;": "\u014B",
        "ensp;": "\u2002",
        "Eogon;": "\u0118",
        "eogon;": "\u0119",
        "Eopf;": "\uD835\uDD3C",
        "eopf;": "\uD835\uDD56",
        "epar;": "\u22D5",
        "eparsl;": "\u29E3",
        "eplus;": "\u2A71",
        "epsi;": "\u03B5",
        "Epsilon;": "\u0395",
        "epsilon;": "\u03B5",
        "epsiv;": "\u03F5",
        "eqcirc;": "\u2256",
        "eqcolon;": "\u2255",
        "eqsim;": "\u2242",
        "eqslantgtr;": "\u2A96",
        "eqslantless;": "\u2A95",
        "Equal;": "\u2A75",
        "equals;": "\u003D",
        "EqualTilde;": "\u2242",
        "equest;": "\u225F",
        "Equilibrium;": "\u21CC",
        "equiv;": "\u2261",
        "equivDD;": "\u2A78",
        "eqvparsl;": "\u29E5",
        "erarr;": "\u2971",
        "erDot;": "\u2253",
        "escr;": "\u212F",
        "Escr;": "\u2130",
        "esdot;": "\u2250",
        "Esim;": "\u2A73",
        "esim;": "\u2242",
        "Eta;": "\u0397",
        "eta;": "\u03B7",
        "ETH;": "\u00D0",
        "ETH": "\u00D0",
        "eth;": "\u00F0",
        "eth": "\u00F0",
        "Euml;": "\u00CB",
        "Euml": "\u00CB",
        "euml;": "\u00EB",
        "euml": "\u00EB",
        "euro;": "\u20AC",
        "excl;": "\u0021",
        "exist;": "\u2203",
        "Exists;": "\u2203",
        "expectation;": "\u2130",
        "exponentiale;": "\u2147",
        "ExponentialE;": "\u2147",
        "fallingdotseq;": "\u2252",
        "Fcy;": "\u0424",
        "fcy;": "\u0444",
        "female;": "\u2640",
        "ffilig;": "\uFB03",
        "fflig;": "\uFB00",
        "ffllig;": "\uFB04",
        "Ffr;": "\uD835\uDD09",
        "ffr;": "\uD835\uDD23",
        "filig;": "\uFB01",
        "FilledSmallSquare;": "\u25FC",
        "FilledVerySmallSquare;": "\u25AA",
        "fjlig;": "\u0066\u006A",
        "flat;": "\u266D",
        "fllig;": "\uFB02",
        "fltns;": "\u25B1",
        "fnof;": "\u0192",
        "Fopf;": "\uD835\uDD3D",
        "fopf;": "\uD835\uDD57",
        "forall;": "\u2200",
        "ForAll;": "\u2200",
        "fork;": "\u22D4",
        "forkv;": "\u2AD9",
        "Fouriertrf;": "\u2131",
        "fpartint;": "\u2A0D",
        "frac12;": "\u00BD",
        "frac12": "\u00BD",
        "frac13;": "\u2153",
        "frac14;": "\u00BC",
        "frac14": "\u00BC",
        "frac15;": "\u2155",
        "frac16;": "\u2159",
        "frac18;": "\u215B",
        "frac23;": "\u2154",
        "frac25;": "\u2156",
        "frac34;": "\u00BE",
        "frac34": "\u00BE",
        "frac35;": "\u2157",
        "frac38;": "\u215C",
        "frac45;": "\u2158",
        "frac56;": "\u215A",
        "frac58;": "\u215D",
        "frac78;": "\u215E",
        "frasl;": "\u2044",
        "frown;": "\u2322",
        "fscr;": "\uD835\uDCBB",
        "Fscr;": "\u2131",
        "gacute;": "\u01F5",
        "Gamma;": "\u0393",
        "gamma;": "\u03B3",
        "Gammad;": "\u03DC",
        "gammad;": "\u03DD",
        "gap;": "\u2A86",
        "Gbreve;": "\u011E",
        "gbreve;": "\u011F",
        "Gcedil;": "\u0122",
        "Gcirc;": "\u011C",
        "gcirc;": "\u011D",
        "Gcy;": "\u0413",
        "gcy;": "\u0433",
        "Gdot;": "\u0120",
        "gdot;": "\u0121",
        "ge;": "\u2265",
        "gE;": "\u2267",
        "gEl;": "\u2A8C",
        "gel;": "\u22DB",
        "geq;": "\u2265",
        "geqq;": "\u2267",
        "geqslant;": "\u2A7E",
        "gescc;": "\u2AA9",
        "ges;": "\u2A7E",
        "gesdot;": "\u2A80",
        "gesdoto;": "\u2A82",
        "gesdotol;": "\u2A84",
        "gesl;": "\u22DB\uFE00",
        "gesles;": "\u2A94",
        "Gfr;": "\uD835\uDD0A",
        "gfr;": "\uD835\uDD24",
        "gg;": "\u226B",
        "Gg;": "\u22D9",
        "ggg;": "\u22D9",
        "gimel;": "\u2137",
        "GJcy;": "\u0403",
        "gjcy;": "\u0453",
        "gla;": "\u2AA5",
        "gl;": "\u2277",
        "glE;": "\u2A92",
        "glj;": "\u2AA4",
        "gnap;": "\u2A8A",
        "gnapprox;": "\u2A8A",
        "gne;": "\u2A88",
        "gnE;": "\u2269",
        "gneq;": "\u2A88",
        "gneqq;": "\u2269",
        "gnsim;": "\u22E7",
        "Gopf;": "\uD835\uDD3E",
        "gopf;": "\uD835\uDD58",
        "grave;": "\u0060",
        "GreaterEqual;": "\u2265",
        "GreaterEqualLess;": "\u22DB",
        "GreaterFullEqual;": "\u2267",
        "GreaterGreater;": "\u2AA2",
        "GreaterLess;": "\u2277",
        "GreaterSlantEqual;": "\u2A7E",
        "GreaterTilde;": "\u2273",
        "Gscr;": "\uD835\uDCA2",
        "gscr;": "\u210A",
        "gsim;": "\u2273",
        "gsime;": "\u2A8E",
        "gsiml;": "\u2A90",
        "gtcc;": "\u2AA7",
        "gtcir;": "\u2A7A",
        "gt;": "\u003E",
        "gt": "\u003E",
        "GT;": "\u003E",
        "GT": "\u003E",
        "Gt;": "\u226B",
        "gtdot;": "\u22D7",
        "gtlPar;": "\u2995",
        "gtquest;": "\u2A7C",
        "gtrapprox;": "\u2A86",
        "gtrarr;": "\u2978",
        "gtrdot;": "\u22D7",
        "gtreqless;": "\u22DB",
        "gtreqqless;": "\u2A8C",
        "gtrless;": "\u2277",
        "gtrsim;": "\u2273",
        "gvertneqq;": "\u2269\uFE00",
        "gvnE;": "\u2269\uFE00",
        "Hacek;": "\u02C7",
        "hairsp;": "\u200A",
        "half;": "\u00BD",
        "hamilt;": "\u210B",
        "HARDcy;": "\u042A",
        "hardcy;": "\u044A",
        "harrcir;": "\u2948",
        "harr;": "\u2194",
        "hArr;": "\u21D4",
        "harrw;": "\u21AD",
        "Hat;": "\u005E",
        "hbar;": "\u210F",
        "Hcirc;": "\u0124",
        "hcirc;": "\u0125",
        "hearts;": "\u2665",
        "heartsuit;": "\u2665",
        "hellip;": "\u2026",
        "hercon;": "\u22B9",
        "hfr;": "\uD835\uDD25",
        "Hfr;": "\u210C",
        "HilbertSpace;": "\u210B",
        "hksearow;": "\u2925",
        "hkswarow;": "\u2926",
        "hoarr;": "\u21FF",
        "homtht;": "\u223B",
        "hookleftarrow;": "\u21A9",
        "hookrightarrow;": "\u21AA",
        "hopf;": "\uD835\uDD59",
        "Hopf;": "\u210D",
        "horbar;": "\u2015",
        "HorizontalLine;": "\u2500",
        "hscr;": "\uD835\uDCBD",
        "Hscr;": "\u210B",
        "hslash;": "\u210F",
        "Hstrok;": "\u0126",
        "hstrok;": "\u0127",
        "HumpDownHump;": "\u224E",
        "HumpEqual;": "\u224F",
        "hybull;": "\u2043",
        "hyphen;": "\u2010",
        "Iacute;": "\u00CD",
        "Iacute": "\u00CD",
        "iacute;": "\u00ED",
        "iacute": "\u00ED",
        "ic;": "\u2063",
        "Icirc;": "\u00CE",
        "Icirc": "\u00CE",
        "icirc;": "\u00EE",
        "icirc": "\u00EE",
        "Icy;": "\u0418",
        "icy;": "\u0438",
        "Idot;": "\u0130",
        "IEcy;": "\u0415",
        "iecy;": "\u0435",
        "iexcl;": "\u00A1",
        "iexcl": "\u00A1",
        "iff;": "\u21D4",
        "ifr;": "\uD835\uDD26",
        "Ifr;": "\u2111",
        "Igrave;": "\u00CC",
        "Igrave": "\u00CC",
        "igrave;": "\u00EC",
        "igrave": "\u00EC",
        "ii;": "\u2148",
        "iiiint;": "\u2A0C",
        "iiint;": "\u222D",
        "iinfin;": "\u29DC",
        "iiota;": "\u2129",
        "IJlig;": "\u0132",
        "ijlig;": "\u0133",
        "Imacr;": "\u012A",
        "imacr;": "\u012B",
        "image;": "\u2111",
        "ImaginaryI;": "\u2148",
        "imagline;": "\u2110",
        "imagpart;": "\u2111",
        "imath;": "\u0131",
        "Im;": "\u2111",
        "imof;": "\u22B7",
        "imped;": "\u01B5",
        "Implies;": "\u21D2",
        "incare;": "\u2105",
        "in;": "\u2208",
        "infin;": "\u221E",
        "infintie;": "\u29DD",
        "inodot;": "\u0131",
        "intcal;": "\u22BA",
        "int;": "\u222B",
        "Int;": "\u222C",
        "integers;": "\u2124",
        "Integral;": "\u222B",
        "intercal;": "\u22BA",
        "Intersection;": "\u22C2",
        "intlarhk;": "\u2A17",
        "intprod;": "\u2A3C",
        "InvisibleComma;": "\u2063",
        "InvisibleTimes;": "\u2062",
        "IOcy;": "\u0401",
        "iocy;": "\u0451",
        "Iogon;": "\u012E",
        "iogon;": "\u012F",
        "Iopf;": "\uD835\uDD40",
        "iopf;": "\uD835\uDD5A",
        "Iota;": "\u0399",
        "iota;": "\u03B9",
        "iprod;": "\u2A3C",
        "iquest;": "\u00BF",
        "iquest": "\u00BF",
        "iscr;": "\uD835\uDCBE",
        "Iscr;": "\u2110",
        "isin;": "\u2208",
        "isindot;": "\u22F5",
        "isinE;": "\u22F9",
        "isins;": "\u22F4",
        "isinsv;": "\u22F3",
        "isinv;": "\u2208",
        "it;": "\u2062",
        "Itilde;": "\u0128",
        "itilde;": "\u0129",
        "Iukcy;": "\u0406",
        "iukcy;": "\u0456",
        "Iuml;": "\u00CF",
        "Iuml": "\u00CF",
        "iuml;": "\u00EF",
        "iuml": "\u00EF",
        "Jcirc;": "\u0134",
        "jcirc;": "\u0135",
        "Jcy;": "\u0419",
        "jcy;": "\u0439",
        "Jfr;": "\uD835\uDD0D",
        "jfr;": "\uD835\uDD27",
        "jmath;": "\u0237",
        "Jopf;": "\uD835\uDD41",
        "jopf;": "\uD835\uDD5B",
        "Jscr;": "\uD835\uDCA5",
        "jscr;": "\uD835\uDCBF",
        "Jsercy;": "\u0408",
        "jsercy;": "\u0458",
        "Jukcy;": "\u0404",
        "jukcy;": "\u0454",
        "Kappa;": "\u039A",
        "kappa;": "\u03BA",
        "kappav;": "\u03F0",
        "Kcedil;": "\u0136",
        "kcedil;": "\u0137",
        "Kcy;": "\u041A",
        "kcy;": "\u043A",
        "Kfr;": "\uD835\uDD0E",
        "kfr;": "\uD835\uDD28",
        "kgreen;": "\u0138",
        "KHcy;": "\u0425",
        "khcy;": "\u0445",
        "KJcy;": "\u040C",
        "kjcy;": "\u045C",
        "Kopf;": "\uD835\uDD42",
        "kopf;": "\uD835\uDD5C",
        "Kscr;": "\uD835\uDCA6",
        "kscr;": "\uD835\uDCC0",
        "lAarr;": "\u21DA",
        "Lacute;": "\u0139",
        "lacute;": "\u013A",
        "laemptyv;": "\u29B4",
        "lagran;": "\u2112",
        "Lambda;": "\u039B",
        "lambda;": "\u03BB",
        "lang;": "\u27E8",
        "Lang;": "\u27EA",
        "langd;": "\u2991",
        "langle;": "\u27E8",
        "lap;": "\u2A85",
        "Laplacetrf;": "\u2112",
        "laquo;": "\u00AB",
        "laquo": "\u00AB",
        "larrb;": "\u21E4",
        "larrbfs;": "\u291F",
        "larr;": "\u2190",
        "Larr;": "\u219E",
        "lArr;": "\u21D0",
        "larrfs;": "\u291D",
        "larrhk;": "\u21A9",
        "larrlp;": "\u21AB",
        "larrpl;": "\u2939",
        "larrsim;": "\u2973",
        "larrtl;": "\u21A2",
        "latail;": "\u2919",
        "lAtail;": "\u291B",
        "lat;": "\u2AAB",
        "late;": "\u2AAD",
        "lates;": "\u2AAD\uFE00",
        "lbarr;": "\u290C",
        "lBarr;": "\u290E",
        "lbbrk;": "\u2772",
        "lbrace;": "\u007B",
        "lbrack;": "\u005B",
        "lbrke;": "\u298B",
        "lbrksld;": "\u298F",
        "lbrkslu;": "\u298D",
        "Lcaron;": "\u013D",
        "lcaron;": "\u013E",
        "Lcedil;": "\u013B",
        "lcedil;": "\u013C",
        "lceil;": "\u2308",
        "lcub;": "\u007B",
        "Lcy;": "\u041B",
        "lcy;": "\u043B",
        "ldca;": "\u2936",
        "ldquo;": "\u201C",
        "ldquor;": "\u201E",
        "ldrdhar;": "\u2967",
        "ldrushar;": "\u294B",
        "ldsh;": "\u21B2",
        "le;": "\u2264",
        "lE;": "\u2266",
        "LeftAngleBracket;": "\u27E8",
        "LeftArrowBar;": "\u21E4",
        "leftarrow;": "\u2190",
        "LeftArrow;": "\u2190",
        "Leftarrow;": "\u21D0",
        "LeftArrowRightArrow;": "\u21C6",
        "leftarrowtail;": "\u21A2",
        "LeftCeiling;": "\u2308",
        "LeftDoubleBracket;": "\u27E6",
        "LeftDownTeeVector;": "\u2961",
        "LeftDownVectorBar;": "\u2959",
        "LeftDownVector;": "\u21C3",
        "LeftFloor;": "\u230A",
        "leftharpoondown;": "\u21BD",
        "leftharpoonup;": "\u21BC",
        "leftleftarrows;": "\u21C7",
        "leftrightarrow;": "\u2194",
        "LeftRightArrow;": "\u2194",
        "Leftrightarrow;": "\u21D4",
        "leftrightarrows;": "\u21C6",
        "leftrightharpoons;": "\u21CB",
        "leftrightsquigarrow;": "\u21AD",
        "LeftRightVector;": "\u294E",
        "LeftTeeArrow;": "\u21A4",
        "LeftTee;": "\u22A3",
        "LeftTeeVector;": "\u295A",
        "leftthreetimes;": "\u22CB",
        "LeftTriangleBar;": "\u29CF",
        "LeftTriangle;": "\u22B2",
        "LeftTriangleEqual;": "\u22B4",
        "LeftUpDownVector;": "\u2951",
        "LeftUpTeeVector;": "\u2960",
        "LeftUpVectorBar;": "\u2958",
        "LeftUpVector;": "\u21BF",
        "LeftVectorBar;": "\u2952",
        "LeftVector;": "\u21BC",
        "lEg;": "\u2A8B",
        "leg;": "\u22DA",
        "leq;": "\u2264",
        "leqq;": "\u2266",
        "leqslant;": "\u2A7D",
        "lescc;": "\u2AA8",
        "les;": "\u2A7D",
        "lesdot;": "\u2A7F",
        "lesdoto;": "\u2A81",
        "lesdotor;": "\u2A83",
        "lesg;": "\u22DA\uFE00",
        "lesges;": "\u2A93",
        "lessapprox;": "\u2A85",
        "lessdot;": "\u22D6",
        "lesseqgtr;": "\u22DA",
        "lesseqqgtr;": "\u2A8B",
        "LessEqualGreater;": "\u22DA",
        "LessFullEqual;": "\u2266",
        "LessGreater;": "\u2276",
        "lessgtr;": "\u2276",
        "LessLess;": "\u2AA1",
        "lesssim;": "\u2272",
        "LessSlantEqual;": "\u2A7D",
        "LessTilde;": "\u2272",
        "lfisht;": "\u297C",
        "lfloor;": "\u230A",
        "Lfr;": "\uD835\uDD0F",
        "lfr;": "\uD835\uDD29",
        "lg;": "\u2276",
        "lgE;": "\u2A91",
        "lHar;": "\u2962",
        "lhard;": "\u21BD",
        "lharu;": "\u21BC",
        "lharul;": "\u296A",
        "lhblk;": "\u2584",
        "LJcy;": "\u0409",
        "ljcy;": "\u0459",
        "llarr;": "\u21C7",
        "ll;": "\u226A",
        "Ll;": "\u22D8",
        "llcorner;": "\u231E",
        "Lleftarrow;": "\u21DA",
        "llhard;": "\u296B",
        "lltri;": "\u25FA",
        "Lmidot;": "\u013F",
        "lmidot;": "\u0140",
        "lmoustache;": "\u23B0",
        "lmoust;": "\u23B0",
        "lnap;": "\u2A89",
        "lnapprox;": "\u2A89",
        "lne;": "\u2A87",
        "lnE;": "\u2268",
        "lneq;": "\u2A87",
        "lneqq;": "\u2268",
        "lnsim;": "\u22E6",
        "loang;": "\u27EC",
        "loarr;": "\u21FD",
        "lobrk;": "\u27E6",
        "longleftarrow;": "\u27F5",
        "LongLeftArrow;": "\u27F5",
        "Longleftarrow;": "\u27F8",
        "longleftrightarrow;": "\u27F7",
        "LongLeftRightArrow;": "\u27F7",
        "Longleftrightarrow;": "\u27FA",
        "longmapsto;": "\u27FC",
        "longrightarrow;": "\u27F6",
        "LongRightArrow;": "\u27F6",
        "Longrightarrow;": "\u27F9",
        "looparrowleft;": "\u21AB",
        "looparrowright;": "\u21AC",
        "lopar;": "\u2985",
        "Lopf;": "\uD835\uDD43",
        "lopf;": "\uD835\uDD5D",
        "loplus;": "\u2A2D",
        "lotimes;": "\u2A34",
        "lowast;": "\u2217",
        "lowbar;": "\u005F",
        "LowerLeftArrow;": "\u2199",
        "LowerRightArrow;": "\u2198",
        "loz;": "\u25CA",
        "lozenge;": "\u25CA",
        "lozf;": "\u29EB",
        "lpar;": "\u0028",
        "lparlt;": "\u2993",
        "lrarr;": "\u21C6",
        "lrcorner;": "\u231F",
        "lrhar;": "\u21CB",
        "lrhard;": "\u296D",
        "lrm;": "\u200E",
        "lrtri;": "\u22BF",
        "lsaquo;": "\u2039",
        "lscr;": "\uD835\uDCC1",
        "Lscr;": "\u2112",
        "lsh;": "\u21B0",
        "Lsh;": "\u21B0",
        "lsim;": "\u2272",
        "lsime;": "\u2A8D",
        "lsimg;": "\u2A8F",
        "lsqb;": "\u005B",
        "lsquo;": "\u2018",
        "lsquor;": "\u201A",
        "Lstrok;": "\u0141",
        "lstrok;": "\u0142",
        "ltcc;": "\u2AA6",
        "ltcir;": "\u2A79",
        "lt;": "\u003C",
        "lt": "\u003C",
        "LT;": "\u003C",
        "LT": "\u003C",
        "Lt;": "\u226A",
        "ltdot;": "\u22D6",
        "lthree;": "\u22CB",
        "ltimes;": "\u22C9",
        "ltlarr;": "\u2976",
        "ltquest;": "\u2A7B",
        "ltri;": "\u25C3",
        "ltrie;": "\u22B4",
        "ltrif;": "\u25C2",
        "ltrPar;": "\u2996",
        "lurdshar;": "\u294A",
        "luruhar;": "\u2966",
        "lvertneqq;": "\u2268\uFE00",
        "lvnE;": "\u2268\uFE00",
        "macr;": "\u00AF",
        "macr": "\u00AF",
        "male;": "\u2642",
        "malt;": "\u2720",
        "maltese;": "\u2720",
        "Map;": "\u2905",
        "map;": "\u21A6",
        "mapsto;": "\u21A6",
        "mapstodown;": "\u21A7",
        "mapstoleft;": "\u21A4",
        "mapstoup;": "\u21A5",
        "marker;": "\u25AE",
        "mcomma;": "\u2A29",
        "Mcy;": "\u041C",
        "mcy;": "\u043C",
        "mdash;": "\u2014",
        "mDDot;": "\u223A",
        "measuredangle;": "\u2221",
        "MediumSpace;": "\u205F",
        "Mellintrf;": "\u2133",
        "Mfr;": "\uD835\uDD10",
        "mfr;": "\uD835\uDD2A",
        "mho;": "\u2127",
        "micro;": "\u00B5",
        "micro": "\u00B5",
        "midast;": "\u002A",
        "midcir;": "\u2AF0",
        "mid;": "\u2223",
        "middot;": "\u00B7",
        "middot": "\u00B7",
        "minusb;": "\u229F",
        "minus;": "\u2212",
        "minusd;": "\u2238",
        "minusdu;": "\u2A2A",
        "MinusPlus;": "\u2213",
        "mlcp;": "\u2ADB",
        "mldr;": "\u2026",
        "mnplus;": "\u2213",
        "models;": "\u22A7",
        "Mopf;": "\uD835\uDD44",
        "mopf;": "\uD835\uDD5E",
        "mp;": "\u2213",
        "mscr;": "\uD835\uDCC2",
        "Mscr;": "\u2133",
        "mstpos;": "\u223E",
        "Mu;": "\u039C",
        "mu;": "\u03BC",
        "multimap;": "\u22B8",
        "mumap;": "\u22B8",
        "nabla;": "\u2207",
        "Nacute;": "\u0143",
        "nacute;": "\u0144",
        "nang;": "\u2220\u20D2",
        "nap;": "\u2249",
        "napE;": "\u2A70\u0338",
        "napid;": "\u224B\u0338",
        "napos;": "\u0149",
        "napprox;": "\u2249",
        "natural;": "\u266E",
        "naturals;": "\u2115",
        "natur;": "\u266E",
        "nbsp;": "\u00A0",
        "nbsp": "\u00A0",
        "nbump;": "\u224E\u0338",
        "nbumpe;": "\u224F\u0338",
        "ncap;": "\u2A43",
        "Ncaron;": "\u0147",
        "ncaron;": "\u0148",
        "Ncedil;": "\u0145",
        "ncedil;": "\u0146",
        "ncong;": "\u2247",
        "ncongdot;": "\u2A6D\u0338",
        "ncup;": "\u2A42",
        "Ncy;": "\u041D",
        "ncy;": "\u043D",
        "ndash;": "\u2013",
        "nearhk;": "\u2924",
        "nearr;": "\u2197",
        "neArr;": "\u21D7",
        "nearrow;": "\u2197",
        "ne;": "\u2260",
        "nedot;": "\u2250\u0338",
        "NegativeMediumSpace;": "\u200B",
        "NegativeThickSpace;": "\u200B",
        "NegativeThinSpace;": "\u200B",
        "NegativeVeryThinSpace;": "\u200B",
        "nequiv;": "\u2262",
        "nesear;": "\u2928",
        "nesim;": "\u2242\u0338",
        "NestedGreaterGreater;": "\u226B",
        "NestedLessLess;": "\u226A",
        "NewLine;": "\u000A",
        "nexist;": "\u2204",
        "nexists;": "\u2204",
        "Nfr;": "\uD835\uDD11",
        "nfr;": "\uD835\uDD2B",
        "ngE;": "\u2267\u0338",
        "nge;": "\u2271",
        "ngeq;": "\u2271",
        "ngeqq;": "\u2267\u0338",
        "ngeqslant;": "\u2A7E\u0338",
        "nges;": "\u2A7E\u0338",
        "nGg;": "\u22D9\u0338",
        "ngsim;": "\u2275",
        "nGt;": "\u226B\u20D2",
        "ngt;": "\u226F",
        "ngtr;": "\u226F",
        "nGtv;": "\u226B\u0338",
        "nharr;": "\u21AE",
        "nhArr;": "\u21CE",
        "nhpar;": "\u2AF2",
        "ni;": "\u220B",
        "nis;": "\u22FC",
        "nisd;": "\u22FA",
        "niv;": "\u220B",
        "NJcy;": "\u040A",
        "njcy;": "\u045A",
        "nlarr;": "\u219A",
        "nlArr;": "\u21CD",
        "nldr;": "\u2025",
        "nlE;": "\u2266\u0338",
        "nle;": "\u2270",
        "nleftarrow;": "\u219A",
        "nLeftarrow;": "\u21CD",
        "nleftrightarrow;": "\u21AE",
        "nLeftrightarrow;": "\u21CE",
        "nleq;": "\u2270",
        "nleqq;": "\u2266\u0338",
        "nleqslant;": "\u2A7D\u0338",
        "nles;": "\u2A7D\u0338",
        "nless;": "\u226E",
        "nLl;": "\u22D8\u0338",
        "nlsim;": "\u2274",
        "nLt;": "\u226A\u20D2",
        "nlt;": "\u226E",
        "nltri;": "\u22EA",
        "nltrie;": "\u22EC",
        "nLtv;": "\u226A\u0338",
        "nmid;": "\u2224",
        "NoBreak;": "\u2060",
        "NonBreakingSpace;": "\u00A0",
        "nopf;": "\uD835\uDD5F",
        "Nopf;": "\u2115",
        "Not;": "\u2AEC",
        "not;": "\u00AC",
        "not": "\u00AC",
        "NotCongruent;": "\u2262",
        "NotCupCap;": "\u226D",
        "NotDoubleVerticalBar;": "\u2226",
        "NotElement;": "\u2209",
        "NotEqual;": "\u2260",
        "NotEqualTilde;": "\u2242\u0338",
        "NotExists;": "\u2204",
        "NotGreater;": "\u226F",
        "NotGreaterEqual;": "\u2271",
        "NotGreaterFullEqual;": "\u2267\u0338",
        "NotGreaterGreater;": "\u226B\u0338",
        "NotGreaterLess;": "\u2279",
        "NotGreaterSlantEqual;": "\u2A7E\u0338",
        "NotGreaterTilde;": "\u2275",
        "NotHumpDownHump;": "\u224E\u0338",
        "NotHumpEqual;": "\u224F\u0338",
        "notin;": "\u2209",
        "notindot;": "\u22F5\u0338",
        "notinE;": "\u22F9\u0338",
        "notinva;": "\u2209",
        "notinvb;": "\u22F7",
        "notinvc;": "\u22F6",
        "NotLeftTriangleBar;": "\u29CF\u0338",
        "NotLeftTriangle;": "\u22EA",
        "NotLeftTriangleEqual;": "\u22EC",
        "NotLess;": "\u226E",
        "NotLessEqual;": "\u2270",
        "NotLessGreater;": "\u2278",
        "NotLessLess;": "\u226A\u0338",
        "NotLessSlantEqual;": "\u2A7D\u0338",
        "NotLessTilde;": "\u2274",
        "NotNestedGreaterGreater;": "\u2AA2\u0338",
        "NotNestedLessLess;": "\u2AA1\u0338",
        "notni;": "\u220C",
        "notniva;": "\u220C",
        "notnivb;": "\u22FE",
        "notnivc;": "\u22FD",
        "NotPrecedes;": "\u2280",
        "NotPrecedesEqual;": "\u2AAF\u0338",
        "NotPrecedesSlantEqual;": "\u22E0",
        "NotReverseElement;": "\u220C",
        "NotRightTriangleBar;": "\u29D0\u0338",
        "NotRightTriangle;": "\u22EB",
        "NotRightTriangleEqual;": "\u22ED",
        "NotSquareSubset;": "\u228F\u0338",
        "NotSquareSubsetEqual;": "\u22E2",
        "NotSquareSuperset;": "\u2290\u0338",
        "NotSquareSupersetEqual;": "\u22E3",
        "NotSubset;": "\u2282\u20D2",
        "NotSubsetEqual;": "\u2288",
        "NotSucceeds;": "\u2281",
        "NotSucceedsEqual;": "\u2AB0\u0338",
        "NotSucceedsSlantEqual;": "\u22E1",
        "NotSucceedsTilde;": "\u227F\u0338",
        "NotSuperset;": "\u2283\u20D2",
        "NotSupersetEqual;": "\u2289",
        "NotTilde;": "\u2241",
        "NotTildeEqual;": "\u2244",
        "NotTildeFullEqual;": "\u2247",
        "NotTildeTilde;": "\u2249",
        "NotVerticalBar;": "\u2224",
        "nparallel;": "\u2226",
        "npar;": "\u2226",
        "nparsl;": "\u2AFD\u20E5",
        "npart;": "\u2202\u0338",
        "npolint;": "\u2A14",
        "npr;": "\u2280",
        "nprcue;": "\u22E0",
        "nprec;": "\u2280",
        "npreceq;": "\u2AAF\u0338",
        "npre;": "\u2AAF\u0338",
        "nrarrc;": "\u2933\u0338",
        "nrarr;": "\u219B",
        "nrArr;": "\u21CF",
        "nrarrw;": "\u219D\u0338",
        "nrightarrow;": "\u219B",
        "nRightarrow;": "\u21CF",
        "nrtri;": "\u22EB",
        "nrtrie;": "\u22ED",
        "nsc;": "\u2281",
        "nsccue;": "\u22E1",
        "nsce;": "\u2AB0\u0338",
        "Nscr;": "\uD835\uDCA9",
        "nscr;": "\uD835\uDCC3",
        "nshortmid;": "\u2224",
        "nshortparallel;": "\u2226",
        "nsim;": "\u2241",
        "nsime;": "\u2244",
        "nsimeq;": "\u2244",
        "nsmid;": "\u2224",
        "nspar;": "\u2226",
        "nsqsube;": "\u22E2",
        "nsqsupe;": "\u22E3",
        "nsub;": "\u2284",
        "nsubE;": "\u2AC5\u0338",
        "nsube;": "\u2288",
        "nsubset;": "\u2282\u20D2",
        "nsubseteq;": "\u2288",
        "nsubseteqq;": "\u2AC5\u0338",
        "nsucc;": "\u2281",
        "nsucceq;": "\u2AB0\u0338",
        "nsup;": "\u2285",
        "nsupE;": "\u2AC6\u0338",
        "nsupe;": "\u2289",
        "nsupset;": "\u2283\u20D2",
        "nsupseteq;": "\u2289",
        "nsupseteqq;": "\u2AC6\u0338",
        "ntgl;": "\u2279",
        "Ntilde;": "\u00D1",
        "Ntilde": "\u00D1",
        "ntilde;": "\u00F1",
        "ntilde": "\u00F1",
        "ntlg;": "\u2278",
        "ntriangleleft;": "\u22EA",
        "ntrianglelefteq;": "\u22EC",
        "ntriangleright;": "\u22EB",
        "ntrianglerighteq;": "\u22ED",
        "Nu;": "\u039D",
        "nu;": "\u03BD",
        "num;": "\u0023",
        "numero;": "\u2116",
        "numsp;": "\u2007",
        "nvap;": "\u224D\u20D2",
        "nvdash;": "\u22AC",
        "nvDash;": "\u22AD",
        "nVdash;": "\u22AE",
        "nVDash;": "\u22AF",
        "nvge;": "\u2265\u20D2",
        "nvgt;": "\u003E\u20D2",
        "nvHarr;": "\u2904",
        "nvinfin;": "\u29DE",
        "nvlArr;": "\u2902",
        "nvle;": "\u2264\u20D2",
        "nvlt;": "\u003C\u20D2",
        "nvltrie;": "\u22B4\u20D2",
        "nvrArr;": "\u2903",
        "nvrtrie;": "\u22B5\u20D2",
        "nvsim;": "\u223C\u20D2",
        "nwarhk;": "\u2923",
        "nwarr;": "\u2196",
        "nwArr;": "\u21D6",
        "nwarrow;": "\u2196",
        "nwnear;": "\u2927",
        "Oacute;": "\u00D3",
        "Oacute": "\u00D3",
        "oacute;": "\u00F3",
        "oacute": "\u00F3",
        "oast;": "\u229B",
        "Ocirc;": "\u00D4",
        "Ocirc": "\u00D4",
        "ocirc;": "\u00F4",
        "ocirc": "\u00F4",
        "ocir;": "\u229A",
        "Ocy;": "\u041E",
        "ocy;": "\u043E",
        "odash;": "\u229D",
        "Odblac;": "\u0150",
        "odblac;": "\u0151",
        "odiv;": "\u2A38",
        "odot;": "\u2299",
        "odsold;": "\u29BC",
        "OElig;": "\u0152",
        "oelig;": "\u0153",
        "ofcir;": "\u29BF",
        "Ofr;": "\uD835\uDD12",
        "ofr;": "\uD835\uDD2C",
        "ogon;": "\u02DB",
        "Ograve;": "\u00D2",
        "Ograve": "\u00D2",
        "ograve;": "\u00F2",
        "ograve": "\u00F2",
        "ogt;": "\u29C1",
        "ohbar;": "\u29B5",
        "ohm;": "\u03A9",
        "oint;": "\u222E",
        "olarr;": "\u21BA",
        "olcir;": "\u29BE",
        "olcross;": "\u29BB",
        "oline;": "\u203E",
        "olt;": "\u29C0",
        "Omacr;": "\u014C",
        "omacr;": "\u014D",
        "Omega;": "\u03A9",
        "omega;": "\u03C9",
        "Omicron;": "\u039F",
        "omicron;": "\u03BF",
        "omid;": "\u29B6",
        "ominus;": "\u2296",
        "Oopf;": "\uD835\uDD46",
        "oopf;": "\uD835\uDD60",
        "opar;": "\u29B7",
        "OpenCurlyDoubleQuote;": "\u201C",
        "OpenCurlyQuote;": "\u2018",
        "operp;": "\u29B9",
        "oplus;": "\u2295",
        "orarr;": "\u21BB",
        "Or;": "\u2A54",
        "or;": "\u2228",
        "ord;": "\u2A5D",
        "order;": "\u2134",
        "orderof;": "\u2134",
        "ordf;": "\u00AA",
        "ordf": "\u00AA",
        "ordm;": "\u00BA",
        "ordm": "\u00BA",
        "origof;": "\u22B6",
        "oror;": "\u2A56",
        "orslope;": "\u2A57",
        "orv;": "\u2A5B",
        "oS;": "\u24C8",
        "Oscr;": "\uD835\uDCAA",
        "oscr;": "\u2134",
        "Oslash;": "\u00D8",
        "Oslash": "\u00D8",
        "oslash;": "\u00F8",
        "oslash": "\u00F8",
        "osol;": "\u2298",
        "Otilde;": "\u00D5",
        "Otilde": "\u00D5",
        "otilde;": "\u00F5",
        "otilde": "\u00F5",
        "otimesas;": "\u2A36",
        "Otimes;": "\u2A37",
        "otimes;": "\u2297",
        "Ouml;": "\u00D6",
        "Ouml": "\u00D6",
        "ouml;": "\u00F6",
        "ouml": "\u00F6",
        "ovbar;": "\u233D",
        "OverBar;": "\u203E",
        "OverBrace;": "\u23DE",
        "OverBracket;": "\u23B4",
        "OverParenthesis;": "\u23DC",
        "para;": "\u00B6",
        "para": "\u00B6",
        "parallel;": "\u2225",
        "par;": "\u2225",
        "parsim;": "\u2AF3",
        "parsl;": "\u2AFD",
        "part;": "\u2202",
        "PartialD;": "\u2202",
        "Pcy;": "\u041F",
        "pcy;": "\u043F",
        "percnt;": "\u0025",
        "period;": "\u002E",
        "permil;": "\u2030",
        "perp;": "\u22A5",
        "pertenk;": "\u2031",
        "Pfr;": "\uD835\uDD13",
        "pfr;": "\uD835\uDD2D",
        "Phi;": "\u03A6",
        "phi;": "\u03C6",
        "phiv;": "\u03D5",
        "phmmat;": "\u2133",
        "phone;": "\u260E",
        "Pi;": "\u03A0",
        "pi;": "\u03C0",
        "pitchfork;": "\u22D4",
        "piv;": "\u03D6",
        "planck;": "\u210F",
        "planckh;": "\u210E",
        "plankv;": "\u210F",
        "plusacir;": "\u2A23",
        "plusb;": "\u229E",
        "pluscir;": "\u2A22",
        "plus;": "\u002B",
        "plusdo;": "\u2214",
        "plusdu;": "\u2A25",
        "pluse;": "\u2A72",
        "PlusMinus;": "\u00B1",
        "plusmn;": "\u00B1",
        "plusmn": "\u00B1",
        "plussim;": "\u2A26",
        "plustwo;": "\u2A27",
        "pm;": "\u00B1",
        "Poincareplane;": "\u210C",
        "pointint;": "\u2A15",
        "popf;": "\uD835\uDD61",
        "Popf;": "\u2119",
        "pound;": "\u00A3",
        "pound": "\u00A3",
        "prap;": "\u2AB7",
        "Pr;": "\u2ABB",
        "pr;": "\u227A",
        "prcue;": "\u227C",
        "precapprox;": "\u2AB7",
        "prec;": "\u227A",
        "preccurlyeq;": "\u227C",
        "Precedes;": "\u227A",
        "PrecedesEqual;": "\u2AAF",
        "PrecedesSlantEqual;": "\u227C",
        "PrecedesTilde;": "\u227E",
        "preceq;": "\u2AAF",
        "precnapprox;": "\u2AB9",
        "precneqq;": "\u2AB5",
        "precnsim;": "\u22E8",
        "pre;": "\u2AAF",
        "prE;": "\u2AB3",
        "precsim;": "\u227E",
        "prime;": "\u2032",
        "Prime;": "\u2033",
        "primes;": "\u2119",
        "prnap;": "\u2AB9",
        "prnE;": "\u2AB5",
        "prnsim;": "\u22E8",
        "prod;": "\u220F",
        "Product;": "\u220F",
        "profalar;": "\u232E",
        "profline;": "\u2312",
        "profsurf;": "\u2313",
        "prop;": "\u221D",
        "Proportional;": "\u221D",
        "Proportion;": "\u2237",
        "propto;": "\u221D",
        "prsim;": "\u227E",
        "prurel;": "\u22B0",
        "Pscr;": "\uD835\uDCAB",
        "pscr;": "\uD835\uDCC5",
        "Psi;": "\u03A8",
        "psi;": "\u03C8",
        "puncsp;": "\u2008",
        "Qfr;": "\uD835\uDD14",
        "qfr;": "\uD835\uDD2E",
        "qint;": "\u2A0C",
        "qopf;": "\uD835\uDD62",
        "Qopf;": "\u211A",
        "qprime;": "\u2057",
        "Qscr;": "\uD835\uDCAC",
        "qscr;": "\uD835\uDCC6",
        "quaternions;": "\u210D",
        "quatint;": "\u2A16",
        "quest;": "\u003F",
        "questeq;": "\u225F",
        "quot;": "\u0022",
        "quot": "\u0022",
        "QUOT;": "\u0022",
        "QUOT": "\u0022",
        "rAarr;": "\u21DB",
        "race;": "\u223D\u0331",
        "Racute;": "\u0154",
        "racute;": "\u0155",
        "radic;": "\u221A",
        "raemptyv;": "\u29B3",
        "rang;": "\u27E9",
        "Rang;": "\u27EB",
        "rangd;": "\u2992",
        "range;": "\u29A5",
        "rangle;": "\u27E9",
        "raquo;": "\u00BB",
        "raquo": "\u00BB",
        "rarrap;": "\u2975",
        "rarrb;": "\u21E5",
        "rarrbfs;": "\u2920",
        "rarrc;": "\u2933",
        "rarr;": "\u2192",
        "Rarr;": "\u21A0",
        "rArr;": "\u21D2",
        "rarrfs;": "\u291E",
        "rarrhk;": "\u21AA",
        "rarrlp;": "\u21AC",
        "rarrpl;": "\u2945",
        "rarrsim;": "\u2974",
        "Rarrtl;": "\u2916",
        "rarrtl;": "\u21A3",
        "rarrw;": "\u219D",
        "ratail;": "\u291A",
        "rAtail;": "\u291C",
        "ratio;": "\u2236",
        "rationals;": "\u211A",
        "rbarr;": "\u290D",
        "rBarr;": "\u290F",
        "RBarr;": "\u2910",
        "rbbrk;": "\u2773",
        "rbrace;": "\u007D",
        "rbrack;": "\u005D",
        "rbrke;": "\u298C",
        "rbrksld;": "\u298E",
        "rbrkslu;": "\u2990",
        "Rcaron;": "\u0158",
        "rcaron;": "\u0159",
        "Rcedil;": "\u0156",
        "rcedil;": "\u0157",
        "rceil;": "\u2309",
        "rcub;": "\u007D",
        "Rcy;": "\u0420",
        "rcy;": "\u0440",
        "rdca;": "\u2937",
        "rdldhar;": "\u2969",
        "rdquo;": "\u201D",
        "rdquor;": "\u201D",
        "rdsh;": "\u21B3",
        "real;": "\u211C",
        "realine;": "\u211B",
        "realpart;": "\u211C",
        "reals;": "\u211D",
        "Re;": "\u211C",
        "rect;": "\u25AD",
        "reg;": "\u00AE",
        "reg": "\u00AE",
        "REG;": "\u00AE",
        "REG": "\u00AE",
        "ReverseElement;": "\u220B",
        "ReverseEquilibrium;": "\u21CB",
        "ReverseUpEquilibrium;": "\u296F",
        "rfisht;": "\u297D",
        "rfloor;": "\u230B",
        "rfr;": "\uD835\uDD2F",
        "Rfr;": "\u211C",
        "rHar;": "\u2964",
        "rhard;": "\u21C1",
        "rharu;": "\u21C0",
        "rharul;": "\u296C",
        "Rho;": "\u03A1",
        "rho;": "\u03C1",
        "rhov;": "\u03F1",
        "RightAngleBracket;": "\u27E9",
        "RightArrowBar;": "\u21E5",
        "rightarrow;": "\u2192",
        "RightArrow;": "\u2192",
        "Rightarrow;": "\u21D2",
        "RightArrowLeftArrow;": "\u21C4",
        "rightarrowtail;": "\u21A3",
        "RightCeiling;": "\u2309",
        "RightDoubleBracket;": "\u27E7",
        "RightDownTeeVector;": "\u295D",
        "RightDownVectorBar;": "\u2955",
        "RightDownVector;": "\u21C2",
        "RightFloor;": "\u230B",
        "rightharpoondown;": "\u21C1",
        "rightharpoonup;": "\u21C0",
        "rightleftarrows;": "\u21C4",
        "rightleftharpoons;": "\u21CC",
        "rightrightarrows;": "\u21C9",
        "rightsquigarrow;": "\u219D",
        "RightTeeArrow;": "\u21A6",
        "RightTee;": "\u22A2",
        "RightTeeVector;": "\u295B",
        "rightthreetimes;": "\u22CC",
        "RightTriangleBar;": "\u29D0",
        "RightTriangle;": "\u22B3",
        "RightTriangleEqual;": "\u22B5",
        "RightUpDownVector;": "\u294F",
        "RightUpTeeVector;": "\u295C",
        "RightUpVectorBar;": "\u2954",
        "RightUpVector;": "\u21BE",
        "RightVectorBar;": "\u2953",
        "RightVector;": "\u21C0",
        "ring;": "\u02DA",
        "risingdotseq;": "\u2253",
        "rlarr;": "\u21C4",
        "rlhar;": "\u21CC",
        "rlm;": "\u200F",
        "rmoustache;": "\u23B1",
        "rmoust;": "\u23B1",
        "rnmid;": "\u2AEE",
        "roang;": "\u27ED",
        "roarr;": "\u21FE",
        "robrk;": "\u27E7",
        "ropar;": "\u2986",
        "ropf;": "\uD835\uDD63",
        "Ropf;": "\u211D",
        "roplus;": "\u2A2E",
        "rotimes;": "\u2A35",
        "RoundImplies;": "\u2970",
        "rpar;": "\u0029",
        "rpargt;": "\u2994",
        "rppolint;": "\u2A12",
        "rrarr;": "\u21C9",
        "Rrightarrow;": "\u21DB",
        "rsaquo;": "\u203A",
        "rscr;": "\uD835\uDCC7",
        "Rscr;": "\u211B",
        "rsh;": "\u21B1",
        "Rsh;": "\u21B1",
        "rsqb;": "\u005D",
        "rsquo;": "\u2019",
        "rsquor;": "\u2019",
        "rthree;": "\u22CC",
        "rtimes;": "\u22CA",
        "rtri;": "\u25B9",
        "rtrie;": "\u22B5",
        "rtrif;": "\u25B8",
        "rtriltri;": "\u29CE",
        "RuleDelayed;": "\u29F4",
        "ruluhar;": "\u2968",
        "rx;": "\u211E",
        "Sacute;": "\u015A",
        "sacute;": "\u015B",
        "sbquo;": "\u201A",
        "scap;": "\u2AB8",
        "Scaron;": "\u0160",
        "scaron;": "\u0161",
        "Sc;": "\u2ABC",
        "sc;": "\u227B",
        "sccue;": "\u227D",
        "sce;": "\u2AB0",
        "scE;": "\u2AB4",
        "Scedil;": "\u015E",
        "scedil;": "\u015F",
        "Scirc;": "\u015C",
        "scirc;": "\u015D",
        "scnap;": "\u2ABA",
        "scnE;": "\u2AB6",
        "scnsim;": "\u22E9",
        "scpolint;": "\u2A13",
        "scsim;": "\u227F",
        "Scy;": "\u0421",
        "scy;": "\u0441",
        "sdotb;": "\u22A1",
        "sdot;": "\u22C5",
        "sdote;": "\u2A66",
        "searhk;": "\u2925",
        "searr;": "\u2198",
        "seArr;": "\u21D8",
        "searrow;": "\u2198",
        "sect;": "\u00A7",
        "sect": "\u00A7",
        "semi;": "\u003B",
        "seswar;": "\u2929",
        "setminus;": "\u2216",
        "setmn;": "\u2216",
        "sext;": "\u2736",
        "Sfr;": "\uD835\uDD16",
        "sfr;": "\uD835\uDD30",
        "sfrown;": "\u2322",
        "sharp;": "\u266F",
        "SHCHcy;": "\u0429",
        "shchcy;": "\u0449",
        "SHcy;": "\u0428",
        "shcy;": "\u0448",
        "ShortDownArrow;": "\u2193",
        "ShortLeftArrow;": "\u2190",
        "shortmid;": "\u2223",
        "shortparallel;": "\u2225",
        "ShortRightArrow;": "\u2192",
        "ShortUpArrow;": "\u2191",
        "shy;": "\u00AD",
        "shy": "\u00AD",
        "Sigma;": "\u03A3",
        "sigma;": "\u03C3",
        "sigmaf;": "\u03C2",
        "sigmav;": "\u03C2",
        "sim;": "\u223C",
        "simdot;": "\u2A6A",
        "sime;": "\u2243",
        "simeq;": "\u2243",
        "simg;": "\u2A9E",
        "simgE;": "\u2AA0",
        "siml;": "\u2A9D",
        "simlE;": "\u2A9F",
        "simne;": "\u2246",
        "simplus;": "\u2A24",
        "simrarr;": "\u2972",
        "slarr;": "\u2190",
        "SmallCircle;": "\u2218",
        "smallsetminus;": "\u2216",
        "smashp;": "\u2A33",
        "smeparsl;": "\u29E4",
        "smid;": "\u2223",
        "smile;": "\u2323",
        "smt;": "\u2AAA",
        "smte;": "\u2AAC",
        "smtes;": "\u2AAC\uFE00",
        "SOFTcy;": "\u042C",
        "softcy;": "\u044C",
        "solbar;": "\u233F",
        "solb;": "\u29C4",
        "sol;": "\u002F",
        "Sopf;": "\uD835\uDD4A",
        "sopf;": "\uD835\uDD64",
        "spades;": "\u2660",
        "spadesuit;": "\u2660",
        "spar;": "\u2225",
        "sqcap;": "\u2293",
        "sqcaps;": "\u2293\uFE00",
        "sqcup;": "\u2294",
        "sqcups;": "\u2294\uFE00",
        "Sqrt;": "\u221A",
        "sqsub;": "\u228F",
        "sqsube;": "\u2291",
        "sqsubset;": "\u228F",
        "sqsubseteq;": "\u2291",
        "sqsup;": "\u2290",
        "sqsupe;": "\u2292",
        "sqsupset;": "\u2290",
        "sqsupseteq;": "\u2292",
        "square;": "\u25A1",
        "Square;": "\u25A1",
        "SquareIntersection;": "\u2293",
        "SquareSubset;": "\u228F",
        "SquareSubsetEqual;": "\u2291",
        "SquareSuperset;": "\u2290",
        "SquareSupersetEqual;": "\u2292",
        "SquareUnion;": "\u2294",
        "squarf;": "\u25AA",
        "squ;": "\u25A1",
        "squf;": "\u25AA",
        "srarr;": "\u2192",
        "Sscr;": "\uD835\uDCAE",
        "sscr;": "\uD835\uDCC8",
        "ssetmn;": "\u2216",
        "ssmile;": "\u2323",
        "sstarf;": "\u22C6",
        "Star;": "\u22C6",
        "star;": "\u2606",
        "starf;": "\u2605",
        "straightepsilon;": "\u03F5",
        "straightphi;": "\u03D5",
        "strns;": "\u00AF",
        "sub;": "\u2282",
        "Sub;": "\u22D0",
        "subdot;": "\u2ABD",
        "subE;": "\u2AC5",
        "sube;": "\u2286",
        "subedot;": "\u2AC3",
        "submult;": "\u2AC1",
        "subnE;": "\u2ACB",
        "subne;": "\u228A",
        "subplus;": "\u2ABF",
        "subrarr;": "\u2979",
        "subset;": "\u2282",
        "Subset;": "\u22D0",
        "subseteq;": "\u2286",
        "subseteqq;": "\u2AC5",
        "SubsetEqual;": "\u2286",
        "subsetneq;": "\u228A",
        "subsetneqq;": "\u2ACB",
        "subsim;": "\u2AC7",
        "subsub;": "\u2AD5",
        "subsup;": "\u2AD3",
        "succapprox;": "\u2AB8",
        "succ;": "\u227B",
        "succcurlyeq;": "\u227D",
        "Succeeds;": "\u227B",
        "SucceedsEqual;": "\u2AB0",
        "SucceedsSlantEqual;": "\u227D",
        "SucceedsTilde;": "\u227F",
        "succeq;": "\u2AB0",
        "succnapprox;": "\u2ABA",
        "succneqq;": "\u2AB6",
        "succnsim;": "\u22E9",
        "succsim;": "\u227F",
        "SuchThat;": "\u220B",
        "sum;": "\u2211",
        "Sum;": "\u2211",
        "sung;": "\u266A",
        "sup1;": "\u00B9",
        "sup1": "\u00B9",
        "sup2;": "\u00B2",
        "sup2": "\u00B2",
        "sup3;": "\u00B3",
        "sup3": "\u00B3",
        "sup;": "\u2283",
        "Sup;": "\u22D1",
        "supdot;": "\u2ABE",
        "supdsub;": "\u2AD8",
        "supE;": "\u2AC6",
        "supe;": "\u2287",
        "supedot;": "\u2AC4",
        "Superset;": "\u2283",
        "SupersetEqual;": "\u2287",
        "suphsol;": "\u27C9",
        "suphsub;": "\u2AD7",
        "suplarr;": "\u297B",
        "supmult;": "\u2AC2",
        "supnE;": "\u2ACC",
        "supne;": "\u228B",
        "supplus;": "\u2AC0",
        "supset;": "\u2283",
        "Supset;": "\u22D1",
        "supseteq;": "\u2287",
        "supseteqq;": "\u2AC6",
        "supsetneq;": "\u228B",
        "supsetneqq;": "\u2ACC",
        "supsim;": "\u2AC8",
        "supsub;": "\u2AD4",
        "supsup;": "\u2AD6",
        "swarhk;": "\u2926",
        "swarr;": "\u2199",
        "swArr;": "\u21D9",
        "swarrow;": "\u2199",
        "swnwar;": "\u292A",
        "szlig;": "\u00DF",
        "szlig": "\u00DF",
        "Tab;": "\u0009",
        "target;": "\u2316",
        "Tau;": "\u03A4",
        "tau;": "\u03C4",
        "tbrk;": "\u23B4",
        "Tcaron;": "\u0164",
        "tcaron;": "\u0165",
        "Tcedil;": "\u0162",
        "tcedil;": "\u0163",
        "Tcy;": "\u0422",
        "tcy;": "\u0442",
        "tdot;": "\u20DB",
        "telrec;": "\u2315",
        "Tfr;": "\uD835\uDD17",
        "tfr;": "\uD835\uDD31",
        "there4;": "\u2234",
        "therefore;": "\u2234",
        "Therefore;": "\u2234",
        "Theta;": "\u0398",
        "theta;": "\u03B8",
        "thetasym;": "\u03D1",
        "thetav;": "\u03D1",
        "thickapprox;": "\u2248",
        "thicksim;": "\u223C",
        "ThickSpace;": "\u205F\u200A",
        "ThinSpace;": "\u2009",
        "thinsp;": "\u2009",
        "thkap;": "\u2248",
        "thksim;": "\u223C",
        "THORN;": "\u00DE",
        "THORN": "\u00DE",
        "thorn;": "\u00FE",
        "thorn": "\u00FE",
        "tilde;": "\u02DC",
        "Tilde;": "\u223C",
        "TildeEqual;": "\u2243",
        "TildeFullEqual;": "\u2245",
        "TildeTilde;": "\u2248",
        "timesbar;": "\u2A31",
        "timesb;": "\u22A0",
        "times;": "\u00D7",
        "times": "\u00D7",
        "timesd;": "\u2A30",
        "tint;": "\u222D",
        "toea;": "\u2928",
        "topbot;": "\u2336",
        "topcir;": "\u2AF1",
        "top;": "\u22A4",
        "Topf;": "\uD835\uDD4B",
        "topf;": "\uD835\uDD65",
        "topfork;": "\u2ADA",
        "tosa;": "\u2929",
        "tprime;": "\u2034",
        "trade;": "\u2122",
        "TRADE;": "\u2122",
        "triangle;": "\u25B5",
        "triangledown;": "\u25BF",
        "triangleleft;": "\u25C3",
        "trianglelefteq;": "\u22B4",
        "triangleq;": "\u225C",
        "triangleright;": "\u25B9",
        "trianglerighteq;": "\u22B5",
        "tridot;": "\u25EC",
        "trie;": "\u225C",
        "triminus;": "\u2A3A",
        "TripleDot;": "\u20DB",
        "triplus;": "\u2A39",
        "trisb;": "\u29CD",
        "tritime;": "\u2A3B",
        "trpezium;": "\u23E2",
        "Tscr;": "\uD835\uDCAF",
        "tscr;": "\uD835\uDCC9",
        "TScy;": "\u0426",
        "tscy;": "\u0446",
        "TSHcy;": "\u040B",
        "tshcy;": "\u045B",
        "Tstrok;": "\u0166",
        "tstrok;": "\u0167",
        "twixt;": "\u226C",
        "twoheadleftarrow;": "\u219E",
        "twoheadrightarrow;": "\u21A0",
        "Uacute;": "\u00DA",
        "Uacute": "\u00DA",
        "uacute;": "\u00FA",
        "uacute": "\u00FA",
        "uarr;": "\u2191",
        "Uarr;": "\u219F",
        "uArr;": "\u21D1",
        "Uarrocir;": "\u2949",
        "Ubrcy;": "\u040E",
        "ubrcy;": "\u045E",
        "Ubreve;": "\u016C",
        "ubreve;": "\u016D",
        "Ucirc;": "\u00DB",
        "Ucirc": "\u00DB",
        "ucirc;": "\u00FB",
        "ucirc": "\u00FB",
        "Ucy;": "\u0423",
        "ucy;": "\u0443",
        "udarr;": "\u21C5",
        "Udblac;": "\u0170",
        "udblac;": "\u0171",
        "udhar;": "\u296E",
        "ufisht;": "\u297E",
        "Ufr;": "\uD835\uDD18",
        "ufr;": "\uD835\uDD32",
        "Ugrave;": "\u00D9",
        "Ugrave": "\u00D9",
        "ugrave;": "\u00F9",
        "ugrave": "\u00F9",
        "uHar;": "\u2963",
        "uharl;": "\u21BF",
        "uharr;": "\u21BE",
        "uhblk;": "\u2580",
        "ulcorn;": "\u231C",
        "ulcorner;": "\u231C",
        "ulcrop;": "\u230F",
        "ultri;": "\u25F8",
        "Umacr;": "\u016A",
        "umacr;": "\u016B",
        "uml;": "\u00A8",
        "uml": "\u00A8",
        "UnderBar;": "\u005F",
        "UnderBrace;": "\u23DF",
        "UnderBracket;": "\u23B5",
        "UnderParenthesis;": "\u23DD",
        "Union;": "\u22C3",
        "UnionPlus;": "\u228E",
        "Uogon;": "\u0172",
        "uogon;": "\u0173",
        "Uopf;": "\uD835\uDD4C",
        "uopf;": "\uD835\uDD66",
        "UpArrowBar;": "\u2912",
        "uparrow;": "\u2191",
        "UpArrow;": "\u2191",
        "Uparrow;": "\u21D1",
        "UpArrowDownArrow;": "\u21C5",
        "updownarrow;": "\u2195",
        "UpDownArrow;": "\u2195",
        "Updownarrow;": "\u21D5",
        "UpEquilibrium;": "\u296E",
        "upharpoonleft;": "\u21BF",
        "upharpoonright;": "\u21BE",
        "uplus;": "\u228E",
        "UpperLeftArrow;": "\u2196",
        "UpperRightArrow;": "\u2197",
        "upsi;": "\u03C5",
        "Upsi;": "\u03D2",
        "upsih;": "\u03D2",
        "Upsilon;": "\u03A5",
        "upsilon;": "\u03C5",
        "UpTeeArrow;": "\u21A5",
        "UpTee;": "\u22A5",
        "upuparrows;": "\u21C8",
        "urcorn;": "\u231D",
        "urcorner;": "\u231D",
        "urcrop;": "\u230E",
        "Uring;": "\u016E",
        "uring;": "\u016F",
        "urtri;": "\u25F9",
        "Uscr;": "\uD835\uDCB0",
        "uscr;": "\uD835\uDCCA",
        "utdot;": "\u22F0",
        "Utilde;": "\u0168",
        "utilde;": "\u0169",
        "utri;": "\u25B5",
        "utrif;": "\u25B4",
        "uuarr;": "\u21C8",
        "Uuml;": "\u00DC",
        "Uuml": "\u00DC",
        "uuml;": "\u00FC",
        "uuml": "\u00FC",
        "uwangle;": "\u29A7",
        "vangrt;": "\u299C",
        "varepsilon;": "\u03F5",
        "varkappa;": "\u03F0",
        "varnothing;": "\u2205",
        "varphi;": "\u03D5",
        "varpi;": "\u03D6",
        "varpropto;": "\u221D",
        "varr;": "\u2195",
        "vArr;": "\u21D5",
        "varrho;": "\u03F1",
        "varsigma;": "\u03C2",
        "varsubsetneq;": "\u228A\uFE00",
        "varsubsetneqq;": "\u2ACB\uFE00",
        "varsupsetneq;": "\u228B\uFE00",
        "varsupsetneqq;": "\u2ACC\uFE00",
        "vartheta;": "\u03D1",
        "vartriangleleft;": "\u22B2",
        "vartriangleright;": "\u22B3",
        "vBar;": "\u2AE8",
        "Vbar;": "\u2AEB",
        "vBarv;": "\u2AE9",
        "Vcy;": "\u0412",
        "vcy;": "\u0432",
        "vdash;": "\u22A2",
        "vDash;": "\u22A8",
        "Vdash;": "\u22A9",
        "VDash;": "\u22AB",
        "Vdashl;": "\u2AE6",
        "veebar;": "\u22BB",
        "vee;": "\u2228",
        "Vee;": "\u22C1",
        "veeeq;": "\u225A",
        "vellip;": "\u22EE",
        "verbar;": "\u007C",
        "Verbar;": "\u2016",
        "vert;": "\u007C",
        "Vert;": "\u2016",
        "VerticalBar;": "\u2223",
        "VerticalLine;": "\u007C",
        "VerticalSeparator;": "\u2758",
        "VerticalTilde;": "\u2240",
        "VeryThinSpace;": "\u200A",
        "Vfr;": "\uD835\uDD19",
        "vfr;": "\uD835\uDD33",
        "vltri;": "\u22B2",
        "vnsub;": "\u2282\u20D2",
        "vnsup;": "\u2283\u20D2",
        "Vopf;": "\uD835\uDD4D",
        "vopf;": "\uD835\uDD67",
        "vprop;": "\u221D",
        "vrtri;": "\u22B3",
        "Vscr;": "\uD835\uDCB1",
        "vscr;": "\uD835\uDCCB",
        "vsubnE;": "\u2ACB\uFE00",
        "vsubne;": "\u228A\uFE00",
        "vsupnE;": "\u2ACC\uFE00",
        "vsupne;": "\u228B\uFE00",
        "Vvdash;": "\u22AA",
        "vzigzag;": "\u299A",
        "Wcirc;": "\u0174",
        "wcirc;": "\u0175",
        "wedbar;": "\u2A5F",
        "wedge;": "\u2227",
        "Wedge;": "\u22C0",
        "wedgeq;": "\u2259",
        "weierp;": "\u2118",
        "Wfr;": "\uD835\uDD1A",
        "wfr;": "\uD835\uDD34",
        "Wopf;": "\uD835\uDD4E",
        "wopf;": "\uD835\uDD68",
        "wp;": "\u2118",
        "wr;": "\u2240",
        "wreath;": "\u2240",
        "Wscr;": "\uD835\uDCB2",
        "wscr;": "\uD835\uDCCC",
        "xcap;": "\u22C2",
        "xcirc;": "\u25EF",
        "xcup;": "\u22C3",
        "xdtri;": "\u25BD",
        "Xfr;": "\uD835\uDD1B",
        "xfr;": "\uD835\uDD35",
        "xharr;": "\u27F7",
        "xhArr;": "\u27FA",
        "Xi;": "\u039E",
        "xi;": "\u03BE",
        "xlarr;": "\u27F5",
        "xlArr;": "\u27F8",
        "xmap;": "\u27FC",
        "xnis;": "\u22FB",
        "xodot;": "\u2A00",
        "Xopf;": "\uD835\uDD4F",
        "xopf;": "\uD835\uDD69",
        "xoplus;": "\u2A01",
        "xotime;": "\u2A02",
        "xrarr;": "\u27F6",
        "xrArr;": "\u27F9",
        "Xscr;": "\uD835\uDCB3",
        "xscr;": "\uD835\uDCCD",
        "xsqcup;": "\u2A06",
        "xuplus;": "\u2A04",
        "xutri;": "\u25B3",
        "xvee;": "\u22C1",
        "xwedge;": "\u22C0",
        "Yacute;": "\u00DD",
        "Yacute": "\u00DD",
        "yacute;": "\u00FD",
        "yacute": "\u00FD",
        "YAcy;": "\u042F",
        "yacy;": "\u044F",
        "Ycirc;": "\u0176",
        "ycirc;": "\u0177",
        "Ycy;": "\u042B",
        "ycy;": "\u044B",
        "yen;": "\u00A5",
        "yen": "\u00A5",
        "Yfr;": "\uD835\uDD1C",
        "yfr;": "\uD835\uDD36",
        "YIcy;": "\u0407",
        "yicy;": "\u0457",
        "Yopf;": "\uD835\uDD50",
        "yopf;": "\uD835\uDD6A",
        "Yscr;": "\uD835\uDCB4",
        "yscr;": "\uD835\uDCCE",
        "YUcy;": "\u042E",
        "yucy;": "\u044E",
        "yuml;": "\u00FF",
        "yuml": "\u00FF",
        "Yuml;": "\u0178",
        "Zacute;": "\u0179",
        "zacute;": "\u017A",
        "Zcaron;": "\u017D",
        "zcaron;": "\u017E",
        "Zcy;": "\u0417",
        "zcy;": "\u0437",
        "Zdot;": "\u017B",
        "zdot;": "\u017C",
        "zeetrf;": "\u2128",
        "ZeroWidthSpace;": "\u200B",
        "Zeta;": "\u0396",
        "zeta;": "\u03B6",
        "zfr;": "\uD835\uDD37",
        "Zfr;": "\u2128",
        "ZHcy;": "\u0416",
        "zhcy;": "\u0436",
        "zigrarr;": "\u21DD",
        "zopf;": "\uD835\uDD6B",
        "Zopf;": "\u2124",
        "Zscr;": "\uD835\uDCB5",
        "zscr;": "\uD835\uDCCF",
        "zwj;": "\u200D",
        "zwnj;": "\u200C"
      };
      exports_1("default", entities);
    }
  };
});

System.register("src/mode/html/isAlphaNumeric.js", [], function(exports_1) {
  function isAlphaNumeric(c) {
    return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
  }
  exports_1("default", isAlphaNumeric);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/mode/html/isDecimalDigit.js", [], function(exports_1) {
  function isDecimalDigit(c) {
    return (c >= '0' && c <= '9');
  }
  exports_1("default", isDecimalDigit);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/mode/html/isHexDigit.js", [], function(exports_1) {
  function isHexDigit(c) {
    return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F');
  }
  exports_1("default", isHexDigit);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/mode/html/EntityParser.js", ["./entities", "./InputStream", "./isAlphaNumeric", "./isDecimalDigit", "./isHexDigit"], function(exports_1) {
  var entities_1,
      InputStream_1,
      isAlphaNumeric_1,
      isDecimalDigit_1,
      isHexDigit_1;
  var namedEntityPrefixes,
      EntityParserClass,
      EntityParser;
  return {
    setters: [function(entities_1_1) {
      entities_1 = entities_1_1;
    }, function(InputStream_1_1) {
      InputStream_1 = InputStream_1_1;
    }, function(isAlphaNumeric_1_1) {
      isAlphaNumeric_1 = isAlphaNumeric_1_1;
    }, function(isDecimalDigit_1_1) {
      isDecimalDigit_1 = isDecimalDigit_1_1;
    }, function(isHexDigit_1_1) {
      isHexDigit_1 = isHexDigit_1_1;
    }],
    execute: function() {
      namedEntityPrefixes = {};
      Object.keys(entities_1.default).forEach(function(entityKey) {
        for (var i = 0; i < entityKey.length; i++) {
          namedEntityPrefixes[entityKey.substring(0, i + 1)] = true;
        }
      });
      EntityParserClass = (function() {
        function EntityParserClass() {}
        EntityParserClass.prototype.consumeEntity = function(buffer, tokenizer, additionalAllowedCharacter) {
          var decodedCharacter = '';
          var consumedCharacters = '';
          var ch = buffer.char();
          if (typeof ch === 'string') {
            consumedCharacters += ch;
            if (ch == '\t' || ch == '\n' || ch == '\v' || ch == ' ' || ch == '<' || ch == '&') {
              buffer.unget(consumedCharacters);
              return false;
            }
            if (additionalAllowedCharacter === ch) {
              buffer.unget(consumedCharacters);
              return false;
            }
            if (ch == '#') {
              ch = buffer.shift(1);
              if (ch === InputStream_1.default.EOF) {
                tokenizer._parseError("expected-numeric-entity-but-got-eof");
                buffer.unget(consumedCharacters);
                return false;
              }
              consumedCharacters += ch;
              var radix = 10;
              var isDigit = isDecimalDigit_1.default;
              if (ch == 'x' || ch == 'X') {
                radix = 16;
                isDigit = isHexDigit_1.default;
                ch = buffer.shift(1);
                if (ch === InputStream_1.default.EOF) {
                  tokenizer._parseError("expected-numeric-entity-but-got-eof");
                  buffer.unget(consumedCharacters);
                  return false;
                }
                consumedCharacters += ch;
              }
              if (isDigit(ch)) {
                var code = '';
                while (ch !== InputStream_1.default.EOF && isDigit(ch)) {
                  code += ch;
                  ch = buffer.char();
                }
                code = parseInt(code, radix);
                var replacement = this.replaceEntityNumbers(code);
                if (replacement) {
                  tokenizer._parseError("invalid-numeric-entity-replaced");
                  code = replacement;
                }
                if (code > 0xFFFF && code <= 0x10FFFF) {
                  code -= 0x10000;
                  var first = ((0xffc00 & code) >> 10) + 0xD800;
                  var second = (0x3ff & code) + 0xDC00;
                  decodedCharacter = String.fromCharCode(first, second);
                } else
                  decodedCharacter = String.fromCharCode(code);
                if (ch !== ';') {
                  tokenizer._parseError("numeric-entity-without-semicolon");
                  buffer.unget(ch);
                }
                return decodedCharacter;
              }
              buffer.unget(consumedCharacters);
              tokenizer._parseError("expected-numeric-entity");
              return false;
            }
            if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
              var mostRecentMatch = '';
              while (namedEntityPrefixes[consumedCharacters]) {
                if (entities_1.default[consumedCharacters]) {
                  mostRecentMatch = consumedCharacters;
                }
                if (ch == ';')
                  break;
                ch = buffer.char();
                if (ch === InputStream_1.default.EOF)
                  break;
                consumedCharacters += ch;
              }
              if (!mostRecentMatch) {
                tokenizer._parseError("expected-named-entity");
                buffer.unget(consumedCharacters);
                return false;
              }
              decodedCharacter = entities_1.default[mostRecentMatch];
              if (ch === ';' || !additionalAllowedCharacter || !(isAlphaNumeric_1.default(ch) || ch === '=')) {
                if (consumedCharacters.length > mostRecentMatch.length) {
                  buffer.unget(consumedCharacters.substring(mostRecentMatch.length));
                }
                if (ch !== ';') {
                  tokenizer._parseError("named-entity-without-semicolon");
                }
                return decodedCharacter;
              }
              buffer.unget(consumedCharacters);
              return false;
            }
          } else if (typeof ch === 'number') {
            if (ch === InputStream_1.default.EOF)
              return false;
          } else {
            throw new TypeError("InputStream.char() must return string or m=number");
          }
        };
        EntityParserClass.prototype.replaceEntityNumbers = function(c) {
          switch (c) {
            case 0x00:
              return 0xFFFD;
            case 0x13:
              return 0x0010;
            case 0x80:
              return 0x20AC;
            case 0x81:
              return 0x0081;
            case 0x82:
              return 0x201A;
            case 0x83:
              return 0x0192;
            case 0x84:
              return 0x201E;
            case 0x85:
              return 0x2026;
            case 0x86:
              return 0x2020;
            case 0x87:
              return 0x2021;
            case 0x88:
              return 0x02C6;
            case 0x89:
              return 0x2030;
            case 0x8A:
              return 0x0160;
            case 0x8B:
              return 0x2039;
            case 0x8C:
              return 0x0152;
            case 0x8D:
              return 0x008D;
            case 0x8E:
              return 0x017D;
            case 0x8F:
              return 0x008F;
            case 0x90:
              return 0x0090;
            case 0x91:
              return 0x2018;
            case 0x92:
              return 0x2019;
            case 0x93:
              return 0x201C;
            case 0x94:
              return 0x201D;
            case 0x95:
              return 0x2022;
            case 0x96:
              return 0x2013;
            case 0x97:
              return 0x2014;
            case 0x98:
              return 0x02DC;
            case 0x99:
              return 0x2122;
            case 0x9A:
              return 0x0161;
            case 0x9B:
              return 0x203A;
            case 0x9C:
              return 0x0153;
            case 0x9D:
              return 0x009D;
            case 0x9E:
              return 0x017E;
            case 0x9F:
              return 0x0178;
            default:
              if ((c >= 0xD800 && c <= 0xDFFF) || c > 0x10FFFF) {
                return 0xFFFD;
              } else if ((c >= 0x0001 && c <= 0x0008) || (c >= 0x000E && c <= 0x001F) || (c >= 0x007F && c <= 0x009F) || (c >= 0xFDD0 && c <= 0xFDEF) || c == 0x000B || c == 0xFFFE || c == 0x1FFFE || c == 0x2FFFFE || c == 0x2FFFF || c == 0x3FFFE || c == 0x3FFFF || c == 0x4FFFE || c == 0x4FFFF || c == 0x5FFFE || c == 0x5FFFF || c == 0x6FFFE || c == 0x6FFFF || c == 0x7FFFE || c == 0x7FFFF || c == 0x8FFFE || c == 0x8FFFF || c == 0x9FFFE || c == 0x9FFFF || c == 0xAFFFE || c == 0xAFFFF || c == 0xBFFFE || c == 0xBFFFF || c == 0xCFFFE || c == 0xCFFFF || c == 0xDFFFE || c == 0xDFFFF || c == 0xEFFFE || c == 0xEFFFF || c == 0xFFFFE || c == 0xFFFFF || c == 0x10FFFE || c == 0x10FFFF) {
                return c;
              }
          }
        };
        return EntityParserClass;
      })();
      exports_1("EntityParserClass", EntityParserClass);
      exports_1("EntityParser", EntityParser = new EntityParserClass());
    }
  };
});

System.register("src/mode/html/InputStream.js", [], function(exports_1) {
  var InputStream;
  return {
    setters: [],
    execute: function() {
      InputStream = (function() {
        function InputStream() {
          this.data = '';
          this.start = 0;
          this.committed = 0;
          this.eof = false;
          this.lastLocation = {
            line: 0,
            column: 0
          };
        }
        InputStream.prototype.slice = function() {
          if (this.start >= this.data.length) {
            if (!this.eof)
              throw InputStream.DRAIN;
            return InputStream.EOF;
          }
          return this.data.slice(this.start, this.data.length);
        };
        InputStream.prototype.char = function() {
          if (!this.eof && this.start >= this.data.length - 1)
            throw InputStream.DRAIN;
          if (this.start >= this.data.length) {
            return InputStream.EOF;
          }
          var ch = this.data[this.start++];
          if (ch === '\r')
            ch = '\n';
          return ch;
        };
        InputStream.prototype.advance = function(amount) {
          this.start += amount;
          if (this.start >= this.data.length) {
            if (!this.eof)
              throw InputStream.DRAIN;
            return InputStream.EOF;
          } else {
            if (this.committed > this.data.length / 2) {
              this.lastLocation = this.location();
              this.data = this.data.slice(this.committed);
              this.start = this.start - this.committed;
              this.committed = 0;
            }
          }
        };
        InputStream.prototype.matchWhile = function(re) {
          if (this.eof && this.start >= this.data.length)
            return '';
          var r = new RegExp("^" + re + "+");
          var m = r.exec(this.slice());
          if (m) {
            if (!this.eof && m[0].length == this.data.length - this.start)
              throw InputStream.DRAIN;
            this.advance(m[0].length);
            return m[0];
          } else {
            return '';
          }
        };
        InputStream.prototype.matchUntil = function(re) {
          var m,
              s;
          s = this.slice();
          if (s === InputStream.EOF) {
            return '';
          } else if (m = new RegExp(re + (this.eof ? "|$" : "")).exec(s)) {
            var t = this.data.slice(this.start, this.start + m.index);
            this.advance(m.index);
            return t.replace(/\r/g, '\n').replace(/\n{2,}/g, '\n');
          } else {
            throw InputStream.DRAIN;
          }
        };
        InputStream.prototype.append = function(data) {
          this.data += data;
        };
        InputStream.prototype.shift = function(n) {
          if (!this.eof && this.start + n >= this.data.length)
            throw InputStream.DRAIN;
          if (this.eof && this.start >= this.data.length)
            return InputStream.EOF;
          var d = this.data.slice(this.start, this.start + n).toString();
          this.advance(Math.min(n, this.data.length - this.start));
          return d;
        };
        InputStream.prototype.peek = function(n) {
          if (!this.eof && this.start + n >= this.data.length)
            throw InputStream.DRAIN;
          if (this.eof && this.start >= this.data.length)
            return InputStream.EOF;
          return this.data.slice(this.start, Math.min(this.start + n, this.data.length)).toString();
        };
        InputStream.prototype.length = function() {
          return this.data.length - this.start - 1;
        };
        InputStream.prototype.unget = function(d) {
          if (d === InputStream.EOF)
            return;
          this.start -= (d.length);
        };
        InputStream.prototype.undo = function() {
          this.start = this.committed;
        };
        InputStream.prototype.commit = function() {
          this.committed = this.start;
        };
        InputStream.prototype.location = function() {
          var lastLine = this.lastLocation.line;
          var lastColumn = this.lastLocation.column;
          var read = this.data.slice(0, this.committed);
          var newlines = read.match(/\n/g);
          var line = newlines ? lastLine + newlines.length : lastLine;
          var column = newlines ? read.length - read.lastIndexOf('\n') - 1 : lastColumn + read.length;
          return {
            line: line,
            column: column
          };
        };
        InputStream.EOF = -1;
        InputStream.DRAIN = -2;
        return InputStream;
      })();
      exports_1("default", InputStream);
    }
  };
});

System.register("src/mode/html/isAlpha.js", [], function(exports_1) {
  function isAlpha(c) {
    return (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z');
  }
  exports_1("default", isAlpha);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/mode/html/isWhitespace.js", [], function(exports_1) {
  function isWhitespace(ch) {
    return ch === " " || ch === "\n" || ch === "\t" || ch === "\r" || ch === "\f";
  }
  exports_1("default", isWhitespace);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/mode/html/Tokenizer.js", ["./EntityParser", "./InputStream", "./isAlpha", "./isWhitespace"], function(exports_1) {
  var EntityParser_1,
      InputStream_1,
      isAlpha_1,
      isWhitespace_1;
  var Tokenizer;
  return {
    setters: [function(EntityParser_1_1) {
      EntityParser_1 = EntityParser_1_1;
    }, function(InputStream_1_1) {
      InputStream_1 = InputStream_1_1;
    }, function(isAlpha_1_1) {
      isAlpha_1 = isAlpha_1_1;
    }, function(isWhitespace_1_1) {
      isWhitespace_1 = isWhitespace_1_1;
    }],
    execute: function() {
      Tokenizer = (function() {
        function Tokenizer(tokenHandler) {
          this._emitCurrentToken = function() {
            this._state = Tokenizer.DATA;
            this._emitToken(this._currentToken);
          };
          this._currentAttribute = function() {
            return this._currentToken.data[this._currentToken.data.length - 1];
          };
          this.setState = function(state) {
            this._state = state;
          };
          this.tokenize = function(source) {
            Tokenizer.DATA = data_state;
            Tokenizer.RCDATA = rcdata_state;
            Tokenizer.RAWTEXT = rawtext_state;
            Tokenizer.SCRIPT_DATA = script_data_state;
            Tokenizer.PLAINTEXT = plaintext_state;
            this._state = Tokenizer.DATA;
            this._inputStream.append(source);
            this._tokenHandler.startTokenization(this);
            this._inputStream.eof = true;
            var tokenizer = this;
            while (this._state.call(this, this._inputStream))
              ;
            function data_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._emitToken({
                  type: 'EOF',
                  data: null
                });
                return false;
              } else if (data === '&') {
                tokenizer.setState(character_reference_in_data_state);
              } else if (data === '<') {
                tokenizer.setState(tag_open_state);
              } else if (data === '\u0000') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data
                });
                buffer.commit();
              } else {
                var chars = buffer.matchUntil("&|<|\u0000");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data + chars
                });
                buffer.commit();
              }
              return true;
            }
            function character_reference_in_data_state(buffer) {
              var character = EntityParser_1.EntityParser.consumeEntity(buffer, tokenizer);
              tokenizer.setState(data_state);
              tokenizer._emitToken({
                type: 'Characters',
                data: character || '&'
              });
              return true;
            }
            function rcdata_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._emitToken({
                  type: 'EOF',
                  data: null
                });
                return false;
              } else if (data === '&') {
                tokenizer.setState(character_reference_in_rcdata_state);
              } else if (data === '<') {
                tokenizer.setState(rcdata_less_than_sign_state);
              } else if (data === "\u0000") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '\uFFFD'
                });
                buffer.commit();
              } else {
                var chars = buffer.matchUntil("&|<|\u0000");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data + chars
                });
                buffer.commit();
              }
              return true;
            }
            function character_reference_in_rcdata_state(buffer) {
              var character = EntityParser_1.EntityParser.consumeEntity(buffer, tokenizer);
              tokenizer.setState(rcdata_state);
              tokenizer._emitToken({
                type: 'Characters',
                data: character || '&'
              });
              return true;
            }
            function rawtext_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._emitToken({
                  type: 'EOF',
                  data: null
                });
                return false;
              } else if (data === '<') {
                tokenizer.setState(rawtext_less_than_sign_state);
              } else if (data === "\u0000") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '\uFFFD'
                });
                buffer.commit();
              } else {
                var chars = buffer.matchUntil("<|\u0000");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data + chars
                });
              }
              return true;
            }
            function plaintext_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._emitToken({
                  type: 'EOF',
                  data: null
                });
                return false;
              } else if (data === "\u0000") {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '\uFFFD'
                });
                buffer.commit();
              } else {
                var chars = buffer.matchUntil("\u0000");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data + chars
                });
              }
              return true;
            }
            function script_data_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._emitToken({
                  type: 'EOF',
                  data: null
                });
                return false;
              } else if (data === '<') {
                tokenizer.setState(script_data_less_than_sign_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '\uFFFD'
                });
                buffer.commit();
              } else {
                var chars = buffer.matchUntil("<|\u0000");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data + chars
                });
              }
              return true;
            }
            function rcdata_less_than_sign_state(buffer) {
              var data = buffer.char();
              if (data === "/") {
                this._temporaryBuffer = '';
                tokenizer.setState(rcdata_end_tag_open_state);
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '<'
                });
                buffer.unget(data);
                tokenizer.setState(rcdata_state);
              }
              return true;
            }
            function rcdata_end_tag_open_state(buffer) {
              var data = buffer.char();
              if (isAlpha_1.default(data)) {
                this._temporaryBuffer += data;
                tokenizer.setState(rcdata_end_tag_name_state);
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '</'
                });
                buffer.unget(data);
                tokenizer.setState(rcdata_state);
              }
              return true;
            }
            function rcdata_end_tag_name_state(buffer) {
              var appropriate = tokenizer._currentToken && (tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase());
              var data = buffer.char();
              if (isWhitespace_1.default(data) && appropriate) {
                tokenizer._currentToken = {
                  type: 'EndTag',
                  name: this._temporaryBuffer,
                  data: [],
                  selfClosing: false
                };
                tokenizer.setState(before_attribute_name_state);
              } else if (data === '/' && appropriate) {
                tokenizer._currentToken = {
                  type: 'EndTag',
                  name: this._temporaryBuffer,
                  data: [],
                  selfClosing: false
                };
                tokenizer.setState(self_closing_tag_state);
              } else if (data === '>' && appropriate) {
                tokenizer._currentToken = {
                  type: 'EndTag',
                  name: this._temporaryBuffer,
                  data: [],
                  selfClosing: false
                };
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else if (isAlpha_1.default(data)) {
                this._temporaryBuffer += data;
                buffer.commit();
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '</' + this._temporaryBuffer
                });
                buffer.unget(data);
                tokenizer.setState(rcdata_state);
              }
              return true;
            }
            function rawtext_less_than_sign_state(buffer) {
              var data = buffer.char();
              if (data === "/") {
                this._temporaryBuffer = '';
                tokenizer.setState(rawtext_end_tag_open_state);
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '<'
                });
                buffer.unget(data);
                tokenizer.setState(rawtext_state);
              }
              return true;
            }
            function rawtext_end_tag_open_state(buffer) {
              var data = buffer.char();
              if (isAlpha_1.default(data)) {
                this._temporaryBuffer += data;
                tokenizer.setState(rawtext_end_tag_name_state);
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '</'
                });
                buffer.unget(data);
                tokenizer.setState(rawtext_state);
              }
              return true;
            }
            function rawtext_end_tag_name_state(buffer) {
              var appropriate = tokenizer._currentToken && (tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase());
              var data = buffer.char();
              if (isWhitespace_1.default(data) && appropriate) {
                tokenizer._currentToken = {
                  type: 'EndTag',
                  name: this._temporaryBuffer,
                  data: [],
                  selfClosing: false
                };
                tokenizer.setState(before_attribute_name_state);
              } else if (data === '/' && appropriate) {
                tokenizer._currentToken = {
                  type: 'EndTag',
                  name: this._temporaryBuffer,
                  data: [],
                  selfClosing: false
                };
                tokenizer.setState(self_closing_tag_state);
              } else if (data === '>' && appropriate) {
                tokenizer._currentToken = {
                  type: 'EndTag',
                  name: this._temporaryBuffer,
                  data: [],
                  selfClosing: false
                };
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else if (isAlpha_1.default(data)) {
                this._temporaryBuffer += data;
                buffer.commit();
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '</' + this._temporaryBuffer
                });
                buffer.unget(data);
                tokenizer.setState(rawtext_state);
              }
              return true;
            }
            function script_data_less_than_sign_state(buffer) {
              var data = buffer.char();
              if (data === "/") {
                this._temporaryBuffer = '';
                tokenizer.setState(script_data_end_tag_open_state);
              } else if (data === '!') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '<!'
                });
                tokenizer.setState(script_data_escape_start_state);
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '<'
                });
                buffer.unget(data);
                tokenizer.setState(script_data_state);
              }
              return true;
            }
            function script_data_end_tag_open_state(buffer) {
              var data = buffer.char();
              if (isAlpha_1.default(data)) {
                this._temporaryBuffer += data;
                tokenizer.setState(script_data_end_tag_name_state);
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '</'
                });
                buffer.unget(data);
                tokenizer.setState(script_data_state);
              }
              return true;
            }
            function script_data_end_tag_name_state(buffer) {
              var appropriate = tokenizer._currentToken && (tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase());
              var data = buffer.char();
              if (isWhitespace_1.default(data) && appropriate) {
                tokenizer._currentToken = {
                  type: 'EndTag',
                  name: 'script',
                  data: [],
                  selfClosing: false
                };
                tokenizer.setState(before_attribute_name_state);
              } else if (data === '/' && appropriate) {
                tokenizer._currentToken = {
                  type: 'EndTag',
                  name: 'script',
                  data: [],
                  selfClosing: false
                };
                tokenizer.setState(self_closing_tag_state);
              } else if (data === '>' && appropriate) {
                tokenizer._currentToken = {
                  type: 'EndTag',
                  name: 'script',
                  data: [],
                  selfClosing: false
                };
                tokenizer._emitCurrentToken();
              } else if (isAlpha_1.default(data)) {
                this._temporaryBuffer += data;
                buffer.commit();
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '</' + this._temporaryBuffer
                });
                buffer.unget(data);
                tokenizer.setState(script_data_state);
              }
              return true;
            }
            function script_data_escape_start_state(buffer) {
              var data = buffer.char();
              if (data === '-') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '-'
                });
                tokenizer.setState(script_data_escape_start_dash_state);
              } else {
                buffer.unget(data);
                tokenizer.setState(script_data_state);
              }
              return true;
            }
            function script_data_escape_start_dash_state(buffer) {
              var data = buffer.char();
              if (data === '-') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '-'
                });
                tokenizer.setState(script_data_escaped_dash_dash_state);
              } else {
                buffer.unget(data);
                tokenizer.setState(script_data_state);
              }
              return true;
            }
            function script_data_escaped_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '-') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '-'
                });
                tokenizer.setState(script_data_escaped_dash_state);
              } else if (data === '<') {
                tokenizer.setState(script_data_escaped_less_then_sign_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '\uFFFD'
                });
                buffer.commit();
              } else {
                var chars = buffer.matchUntil('<|-|\u0000');
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data + chars
                });
              }
              return true;
            }
            function script_data_escaped_dash_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '-') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '-'
                });
                tokenizer.setState(script_data_escaped_dash_dash_state);
              } else if (data === '<') {
                tokenizer.setState(script_data_escaped_less_then_sign_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '\uFFFD'
                });
                tokenizer.setState(script_data_escaped_state);
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data
                });
                tokenizer.setState(script_data_escaped_state);
              }
              return true;
            }
            function script_data_escaped_dash_dash_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError('eof-in-script');
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '<') {
                tokenizer.setState(script_data_escaped_less_then_sign_state);
              } else if (data === '>') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '>'
                });
                tokenizer.setState(script_data_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '\uFFFD'
                });
                tokenizer.setState(script_data_escaped_state);
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data
                });
                tokenizer.setState(script_data_escaped_state);
              }
              return true;
            }
            function script_data_escaped_less_then_sign_state(buffer) {
              var data = buffer.char();
              if (data === '/') {
                this._temporaryBuffer = '';
                tokenizer.setState(script_data_escaped_end_tag_open_state);
              } else if (isAlpha_1.default(data)) {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '<' + data
                });
                this._temporaryBuffer = data;
                tokenizer.setState(script_data_double_escape_start_state);
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '<'
                });
                buffer.unget(data);
                tokenizer.setState(script_data_escaped_state);
              }
              return true;
            }
            function script_data_escaped_end_tag_open_state(buffer) {
              var data = buffer.char();
              if (isAlpha_1.default(data)) {
                this._temporaryBuffer = data;
                tokenizer.setState(script_data_escaped_end_tag_name_state);
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '</'
                });
                buffer.unget(data);
                tokenizer.setState(script_data_escaped_state);
              }
              return true;
            }
            function script_data_escaped_end_tag_name_state(buffer) {
              var appropriate = tokenizer._currentToken && (tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase());
              var data = buffer.char();
              if (isWhitespace_1.default(data) && appropriate) {
                tokenizer._currentToken = {
                  type: 'EndTag',
                  name: 'script',
                  data: [],
                  selfClosing: false
                };
                tokenizer.setState(before_attribute_name_state);
              } else if (data === '/' && appropriate) {
                tokenizer._currentToken = {
                  type: 'EndTag',
                  name: 'script',
                  data: [],
                  selfClosing: false
                };
                tokenizer.setState(self_closing_tag_state);
              } else if (data === '>' && appropriate) {
                tokenizer._currentToken = {
                  type: 'EndTag',
                  name: 'script',
                  data: [],
                  selfClosing: false
                };
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isAlpha_1.default(data)) {
                this._temporaryBuffer += data;
                buffer.commit();
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '</' + this._temporaryBuffer
                });
                buffer.unget(data);
                tokenizer.setState(script_data_escaped_state);
              }
              return true;
            }
            function script_data_double_escape_start_state(buffer) {
              var data = buffer.char();
              if (isWhitespace_1.default(data) || data === '/' || data === '>') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data
                });
                if (this._temporaryBuffer.toLowerCase() === 'script')
                  tokenizer.setState(script_data_double_escaped_state);
                else
                  tokenizer.setState(script_data_escaped_state);
              } else if (isAlpha_1.default(data)) {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data
                });
                this._temporaryBuffer += data;
                buffer.commit();
              } else {
                buffer.unget(data);
                tokenizer.setState(script_data_escaped_state);
              }
              return true;
            }
            function script_data_double_escaped_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError('eof-in-script');
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '-') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '-'
                });
                tokenizer.setState(script_data_double_escaped_dash_state);
              } else if (data === '<') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '<'
                });
                tokenizer.setState(script_data_double_escaped_less_than_sign_state);
              } else if (data === '\u0000') {
                tokenizer._parseError('invalid-codepoint');
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '\uFFFD'
                });
                buffer.commit();
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data
                });
                buffer.commit();
              }
              return true;
            }
            function script_data_double_escaped_dash_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError('eof-in-script');
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '-') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '-'
                });
                tokenizer.setState(script_data_double_escaped_dash_dash_state);
              } else if (data === '<') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '<'
                });
                tokenizer.setState(script_data_double_escaped_less_than_sign_state);
              } else if (data === '\u0000') {
                tokenizer._parseError('invalid-codepoint');
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '\uFFFD'
                });
                tokenizer.setState(script_data_double_escaped_state);
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data
                });
                tokenizer.setState(script_data_double_escaped_state);
              }
              return true;
            }
            function script_data_double_escaped_dash_dash_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError('eof-in-script');
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '-') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '-'
                });
                buffer.commit();
              } else if (data === '<') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '<'
                });
                tokenizer.setState(script_data_double_escaped_less_than_sign_state);
              } else if (data === '>') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '>'
                });
                tokenizer.setState(script_data_state);
              } else if (data === '\u0000') {
                tokenizer._parseError('invalid-codepoint');
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '\uFFFD'
                });
                tokenizer.setState(script_data_double_escaped_state);
              } else {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data
                });
                tokenizer.setState(script_data_double_escaped_state);
              }
              return true;
            }
            function script_data_double_escaped_less_than_sign_state(buffer) {
              var data = buffer.char();
              if (data === '/') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '/'
                });
                this._temporaryBuffer = '';
                tokenizer.setState(script_data_double_escape_end_state);
              } else {
                buffer.unget(data);
                tokenizer.setState(script_data_double_escaped_state);
              }
              return true;
            }
            function script_data_double_escape_end_state(buffer) {
              var data = buffer.char();
              if (isWhitespace_1.default(data) || data === '/' || data === '>') {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data
                });
                if (this._temporaryBuffer.toLowerCase() === 'script')
                  tokenizer.setState(script_data_escaped_state);
                else
                  tokenizer.setState(script_data_double_escaped_state);
              } else if (isAlpha_1.default(data)) {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data
                });
                this._temporaryBuffer += data;
                buffer.commit();
              } else {
                buffer.unget(data);
                tokenizer.setState(script_data_double_escaped_state);
              }
              return true;
            }
            function tag_open_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("bare-less-than-sign-at-eof");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '<'
                });
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isAlpha_1.default(data)) {
                tokenizer._currentToken = {
                  type: 'StartTag',
                  name: data.toLowerCase(),
                  data: []
                };
                tokenizer.setState(tag_name_state);
              } else if (data === '!') {
                tokenizer.setState(markup_declaration_open_state);
              } else if (data === '/') {
                tokenizer.setState(close_tag_open_state);
              } else if (data === '>') {
                tokenizer._parseError("expected-tag-name-but-got-right-bracket");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: "<>"
                });
                tokenizer.setState(data_state);
              } else if (data === '?') {
                tokenizer._parseError("expected-tag-name-but-got-question-mark");
                buffer.unget(data);
                tokenizer.setState(bogus_comment_state);
              } else {
                tokenizer._parseError("expected-tag-name");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: "<"
                });
                buffer.unget(data);
                tokenizer.setState(data_state);
              }
              return true;
            }
            function close_tag_open_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("expected-closing-tag-but-got-eof");
                tokenizer._emitToken({
                  type: 'Characters',
                  data: '</'
                });
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isAlpha_1.default(data)) {
                tokenizer._currentToken = {
                  type: 'EndTag',
                  name: data.toLowerCase(),
                  data: []
                };
                tokenizer.setState(tag_name_state);
              } else if (data === '>') {
                tokenizer._parseError("expected-closing-tag-but-got-right-bracket");
                tokenizer.setState(data_state);
              } else {
                tokenizer._parseError("expected-closing-tag-but-got-char", {data: data});
                buffer.unget(data);
                tokenizer.setState(bogus_comment_state);
              }
              return true;
            }
            function tag_name_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError('eof-in-tag-name');
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace_1.default(data)) {
                tokenizer.setState(before_attribute_name_state);
              } else if (isAlpha_1.default(data)) {
                tokenizer._currentToken.name += data.toLowerCase();
              } else if (data === '>') {
                tokenizer._emitCurrentToken();
              } else if (data === '/') {
                tokenizer.setState(self_closing_tag_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.name += "\uFFFD";
              } else {
                tokenizer._currentToken.name += data;
              }
              buffer.commit();
              return true;
            }
            function before_attribute_name_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("expected-attribute-name-but-got-eof");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace_1.default(data)) {
                return true;
              } else if (isAlpha_1.default(data)) {
                tokenizer._currentToken.data.push({
                  nodeName: data.toLowerCase(),
                  nodeValue: ""
                });
                tokenizer.setState(attribute_name_state);
              } else if (data === '>') {
                tokenizer._emitCurrentToken();
              } else if (data === '/') {
                tokenizer.setState(self_closing_tag_state);
              } else if (data === "'" || data === '"' || data === '=' || data === '<') {
                tokenizer._parseError("invalid-character-in-attribute-name");
                tokenizer._currentToken.data.push({
                  nodeName: data,
                  nodeValue: ""
                });
                tokenizer.setState(attribute_name_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data.push({
                  nodeName: "\uFFFD",
                  nodeValue: ""
                });
              } else {
                tokenizer._currentToken.data.push({
                  nodeName: data,
                  nodeValue: ""
                });
                tokenizer.setState(attribute_name_state);
              }
              return true;
            }
            function attribute_name_state(buffer) {
              var data = buffer.char();
              var leavingThisState = true;
              var shouldEmit = false;
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-attribute-name");
                buffer.unget(data);
                tokenizer.setState(data_state);
                shouldEmit = true;
              } else if (data === '=') {
                tokenizer.setState(before_attribute_value_state);
              } else if (isAlpha_1.default(data)) {
                tokenizer._currentAttribute().nodeName += data.toLowerCase();
                leavingThisState = false;
              } else if (data === '>') {
                shouldEmit = true;
              } else if (isWhitespace_1.default(data)) {
                tokenizer.setState(after_attribute_name_state);
              } else if (data === '/') {
                tokenizer.setState(self_closing_tag_state);
              } else if (data === "'" || data === '"') {
                tokenizer._parseError("invalid-character-in-attribute-name");
                tokenizer._currentAttribute().nodeName += data;
                leavingThisState = false;
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentAttribute().nodeName += "\uFFFD";
              } else {
                tokenizer._currentAttribute().nodeName += data;
                leavingThisState = false;
              }
              if (leavingThisState) {
                var attributes = tokenizer._currentToken.data;
                var currentAttribute = attributes[attributes.length - 1];
                for (var i = attributes.length - 2; i >= 0; i--) {
                  if (currentAttribute.nodeName === attributes[i].nodeName) {
                    tokenizer._parseError("duplicate-attribute", {name: currentAttribute.nodeName});
                    currentAttribute.nodeName = null;
                    break;
                  }
                }
                if (shouldEmit)
                  tokenizer._emitCurrentToken();
              } else {
                buffer.commit();
              }
              return true;
            }
            function after_attribute_name_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("expected-end-of-tag-but-got-eof");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace_1.default(data)) {
                return true;
              } else if (data === '=') {
                tokenizer.setState(before_attribute_value_state);
              } else if (data === '>') {
                tokenizer._emitCurrentToken();
              } else if (isAlpha_1.default(data)) {
                tokenizer._currentToken.data.push({
                  nodeName: data,
                  nodeValue: ""
                });
                tokenizer.setState(attribute_name_state);
              } else if (data === '/') {
                tokenizer.setState(self_closing_tag_state);
              } else if (data === "'" || data === '"' || data === '<') {
                tokenizer._parseError("invalid-character-after-attribute-name");
                tokenizer._currentToken.data.push({
                  nodeName: data,
                  nodeValue: ""
                });
                tokenizer.setState(attribute_name_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data.push({
                  nodeName: "\uFFFD",
                  nodeValue: ""
                });
              } else {
                tokenizer._currentToken.data.push({
                  nodeName: data,
                  nodeValue: ""
                });
                tokenizer.setState(attribute_name_state);
              }
              return true;
            }
            function before_attribute_value_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("expected-attribute-value-but-got-eof");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace_1.default(data)) {
                return true;
              } else if (data === '"') {
                tokenizer.setState(attribute_value_double_quoted_state);
              } else if (data === '&') {
                tokenizer.setState(attribute_value_unquoted_state);
                buffer.unget(data);
              } else if (data === "'") {
                tokenizer.setState(attribute_value_single_quoted_state);
              } else if (data === '>') {
                tokenizer._parseError("expected-attribute-value-but-got-right-bracket");
                tokenizer._emitCurrentToken();
              } else if (data === '=' || data === '<' || data === '`') {
                tokenizer._parseError("unexpected-character-in-unquoted-attribute-value");
                tokenizer._currentAttribute().nodeValue += data;
                tokenizer.setState(attribute_value_unquoted_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentAttribute().nodeValue += "\uFFFD";
              } else {
                tokenizer._currentAttribute().nodeValue += data;
                tokenizer.setState(attribute_value_unquoted_state);
              }
              return true;
            }
            function attribute_value_double_quoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-attribute-value-double-quote");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '"') {
                tokenizer.setState(after_attribute_value_state);
              } else if (data === '&') {
                this._additionalAllowedCharacter = '"';
                tokenizer.setState(character_reference_in_attribute_value_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentAttribute().nodeValue += "\uFFFD";
              } else {
                var s = buffer.matchUntil('[\0"&]');
                data = data + s;
                tokenizer._currentAttribute().nodeValue += data;
              }
              return true;
            }
            function attribute_value_single_quoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-attribute-value-single-quote");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "'") {
                tokenizer.setState(after_attribute_value_state);
              } else if (data === '&') {
                this._additionalAllowedCharacter = "'";
                tokenizer.setState(character_reference_in_attribute_value_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentAttribute().nodeValue += "\uFFFD";
              } else {
                tokenizer._currentAttribute().nodeValue += data + buffer.matchUntil("\u0000|['&]");
              }
              return true;
            }
            function attribute_value_unquoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-after-attribute-value");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace_1.default(data)) {
                tokenizer.setState(before_attribute_name_state);
              } else if (data === '&') {
                this._additionalAllowedCharacter = ">";
                tokenizer.setState(character_reference_in_attribute_value_state);
              } else if (data === '>') {
                tokenizer._emitCurrentToken();
              } else if (data === '"' || data === "'" || data === '=' || data === '`' || data === '<') {
                tokenizer._parseError("unexpected-character-in-unquoted-attribute-value");
                tokenizer._currentAttribute().nodeValue += data;
                buffer.commit();
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentAttribute().nodeValue += "\uFFFD";
              } else {
                var o = buffer.matchUntil("\u0000|[" + "\t\n\v\f\x20\r" + "&<>\"'=`" + "]");
                if (o === InputStream_1.default.EOF) {
                  tokenizer._parseError("eof-in-attribute-value-no-quotes");
                  tokenizer._emitCurrentToken();
                }
                buffer.commit();
                tokenizer._currentAttribute().nodeValue += data + o;
              }
              return true;
            }
            function character_reference_in_attribute_value_state(buffer) {
              var character = EntityParser_1.EntityParser.consumeEntity(buffer, tokenizer, this._additionalAllowedCharacter);
              this._currentAttribute().nodeValue += character || '&';
              if (this._additionalAllowedCharacter === '"')
                tokenizer.setState(attribute_value_double_quoted_state);
              else if (this._additionalAllowedCharacter === '\'')
                tokenizer.setState(attribute_value_single_quoted_state);
              else if (this._additionalAllowedCharacter === '>')
                tokenizer.setState(attribute_value_unquoted_state);
              return true;
            }
            function after_attribute_value_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-after-attribute-value");
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace_1.default(data)) {
                tokenizer.setState(before_attribute_name_state);
              } else if (data === '>') {
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (data === '/') {
                tokenizer.setState(self_closing_tag_state);
              } else {
                tokenizer._parseError("unexpected-character-after-attribute-value");
                buffer.unget(data);
                tokenizer.setState(before_attribute_name_state);
              }
              return true;
            }
            function self_closing_tag_state(buffer) {
              var c = buffer.char();
              if (c === InputStream_1.default.EOF) {
                tokenizer._parseError("unexpected-eof-after-solidus-in-tag");
                buffer.unget(c);
                tokenizer.setState(data_state);
              } else if (c === '>') {
                tokenizer._currentToken.selfClosing = true;
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                tokenizer._parseError("unexpected-character-after-solidus-in-tag");
                buffer.unget(c);
                tokenizer.setState(before_attribute_name_state);
              }
              return true;
            }
            function bogus_comment_state(buffer) {
              var data = buffer.matchUntil('>');
              data = data.replace(/\u0000/g, "\uFFFD");
              buffer.char();
              tokenizer._emitToken({
                type: 'Comment',
                data: data
              });
              tokenizer.setState(data_state);
              return true;
            }
            function markup_declaration_open_state(buffer) {
              var chars = buffer.shift(2);
              if (chars === '--') {
                tokenizer._currentToken = {
                  type: 'Comment',
                  data: ''
                };
                tokenizer.setState(comment_start_state);
              } else {
                var newchars = buffer.shift(5);
                if (newchars === InputStream_1.default.EOF || chars === InputStream_1.default.EOF) {
                  tokenizer._parseError("expected-dashes-or-doctype");
                  tokenizer.setState(bogus_comment_state);
                  buffer.unget(chars);
                  return true;
                }
                chars += newchars;
                if (chars.toUpperCase() === 'DOCTYPE') {
                  tokenizer._currentToken = {
                    type: 'Doctype',
                    name: '',
                    publicId: null,
                    systemId: null,
                    forceQuirks: false
                  };
                  tokenizer.setState(doctype_state);
                } else if (tokenizer._tokenHandler.isCdataSectionAllowed() && chars === '[CDATA[') {
                  tokenizer.setState(cdata_section_state);
                } else {
                  tokenizer._parseError("expected-dashes-or-doctype");
                  buffer.unget(chars);
                  tokenizer.setState(bogus_comment_state);
                }
              }
              return true;
            }
            function cdata_section_state(buffer) {
              var data = buffer.matchUntil(']]>');
              buffer.shift(3);
              if (data) {
                tokenizer._emitToken({
                  type: 'Characters',
                  data: data
                });
              }
              tokenizer.setState(data_state);
              return true;
            }
            function comment_start_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-comment");
                tokenizer._emitToken(tokenizer._currentToken);
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '-') {
                tokenizer.setState(comment_start_dash_state);
              } else if (data === '>') {
                tokenizer._parseError("incorrect-comment");
                tokenizer._emitToken(tokenizer._currentToken);
                tokenizer.setState(data_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data += "\uFFFD";
              } else {
                tokenizer._currentToken.data += data;
                tokenizer.setState(comment_state);
              }
              return true;
            }
            function comment_start_dash_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-comment");
                tokenizer._emitToken(tokenizer._currentToken);
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '-') {
                tokenizer.setState(comment_end_state);
              } else if (data === '>') {
                tokenizer._parseError("incorrect-comment");
                tokenizer._emitToken(tokenizer._currentToken);
                tokenizer.setState(data_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data += "\uFFFD";
              } else {
                tokenizer._currentToken.data += '-' + data;
                tokenizer.setState(comment_state);
              }
              return true;
            }
            function comment_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-comment");
                tokenizer._emitToken(tokenizer._currentToken);
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '-') {
                tokenizer.setState(comment_end_dash_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data += "\uFFFD";
              } else {
                tokenizer._currentToken.data += data;
                buffer.commit();
              }
              return true;
            }
            function comment_end_dash_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-comment-end-dash");
                tokenizer._emitToken(tokenizer._currentToken);
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '-') {
                tokenizer.setState(comment_end_state);
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data += "-\uFFFD";
                tokenizer.setState(comment_state);
              } else {
                tokenizer._currentToken.data += '-' + data + buffer.matchUntil('\u0000|-');
                buffer.char();
              }
              return true;
            }
            function comment_end_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-comment-double-dash");
                tokenizer._emitToken(tokenizer._currentToken);
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '>') {
                tokenizer._emitToken(tokenizer._currentToken);
                tokenizer.setState(data_state);
              } else if (data === '!') {
                tokenizer._parseError("unexpected-bang-after-double-dash-in-comment");
                tokenizer.setState(comment_end_bang_state);
              } else if (data === '-') {
                tokenizer._parseError("unexpected-dash-after-double-dash-in-comment");
                tokenizer._currentToken.data += data;
              } else if (data === '\u0000') {
                tokenizer._parseError("invalid-codepoint");
                tokenizer._currentToken.data += "--\uFFFD";
                tokenizer.setState(comment_state);
              } else {
                tokenizer._parseError("unexpected-char-in-comment");
                tokenizer._currentToken.data += '--' + data;
                tokenizer.setState(comment_state);
              }
              return true;
            }
            function comment_end_bang_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-comment-end-bang-state");
                tokenizer._emitToken(tokenizer._currentToken);
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '>') {
                tokenizer._emitToken(tokenizer._currentToken);
                tokenizer.setState(data_state);
              } else if (data === '-') {
                tokenizer._currentToken.data += '--!';
                tokenizer.setState(comment_end_dash_state);
              } else {
                tokenizer._currentToken.data += '--!' + data;
                tokenizer.setState(comment_state);
              }
              return true;
            }
            function doctype_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("expected-doctype-name-but-got-eof");
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isWhitespace_1.default(data)) {
                tokenizer.setState(before_doctype_name_state);
              } else {
                tokenizer._parseError("need-space-after-doctype");
                buffer.unget(data);
                tokenizer.setState(before_doctype_name_state);
              }
              return true;
            }
            function before_doctype_name_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("expected-doctype-name-but-got-eof");
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isWhitespace_1.default(data)) {} else if (data === '>') {
                tokenizer._parseError("expected-doctype-name-but-got-right-bracket");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                if (isAlpha_1.default(data))
                  data = data.toLowerCase();
                tokenizer._currentToken.name = data;
                tokenizer.setState(doctype_name_state);
              }
              return true;
            }
            function doctype_name_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer._parseError("eof-in-doctype-name");
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isWhitespace_1.default(data)) {
                tokenizer.setState(after_doctype_name_state);
              } else if (data === '>') {
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                if (isAlpha_1.default(data))
                  data = data.toLowerCase();
                tokenizer._currentToken.name += data;
                buffer.commit();
              }
              return true;
            }
            function after_doctype_name_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer._parseError("eof-in-doctype");
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isWhitespace_1.default(data)) {} else if (data === '>') {
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                if (['p', 'P'].indexOf(data) > -1) {
                  var expected = [['u', 'U'], ['b', 'B'], ['l', 'L'], ['i', 'I'], ['c', 'C']];
                  var matched = expected.every(function(expected) {
                    data = buffer.char();
                    return expected.indexOf(data) > -1;
                  });
                  if (matched) {
                    tokenizer.setState(after_doctype_public_keyword_state);
                    return true;
                  }
                } else if (['s', 'S'].indexOf(data) > -1) {
                  var expected = [['y', 'Y'], ['s', 'S'], ['t', 'T'], ['e', 'E'], ['m', 'M']];
                  var matched = expected.every(function(expected) {
                    data = buffer.char();
                    return expected.indexOf(data) > -1;
                  });
                  if (matched) {
                    tokenizer.setState(after_doctype_system_keyword_state);
                    return true;
                  }
                }
                buffer.unget(data);
                tokenizer._currentToken.forceQuirks = true;
                if (data === InputStream_1.default.EOF) {
                  tokenizer._parseError("eof-in-doctype");
                  buffer.unget(data);
                  tokenizer.setState(data_state);
                  tokenizer._emitCurrentToken();
                } else {
                  tokenizer._parseError("expected-space-or-right-bracket-in-doctype", {data: data});
                  tokenizer.setState(bogus_doctype_state);
                }
              }
              return true;
            }
            function after_doctype_public_keyword_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isWhitespace_1.default(data)) {
                tokenizer.setState(before_doctype_public_identifier_state);
              } else if (data === "'" || data === '"') {
                tokenizer._parseError("unexpected-char-in-doctype");
                buffer.unget(data);
                tokenizer.setState(before_doctype_public_identifier_state);
              } else {
                buffer.unget(data);
                tokenizer.setState(before_doctype_public_identifier_state);
              }
              return true;
            }
            function before_doctype_public_identifier_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (isWhitespace_1.default(data)) {} else if (data === '"') {
                tokenizer._currentToken.publicId = '';
                tokenizer.setState(doctype_public_identifier_double_quoted_state);
              } else if (data === "'") {
                tokenizer._currentToken.publicId = '';
                tokenizer.setState(doctype_public_identifier_single_quoted_state);
              } else if (data === '>') {
                tokenizer._parseError("unexpected-end-of-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(bogus_doctype_state);
              }
              return true;
            }
            function doctype_public_identifier_double_quoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (data === '"') {
                tokenizer.setState(after_doctype_public_identifier_state);
              } else if (data === '>') {
                tokenizer._parseError("unexpected-end-of-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                tokenizer._currentToken.publicId += data;
              }
              return true;
            }
            function doctype_public_identifier_single_quoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                buffer.unget(data);
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (data === "'") {
                tokenizer.setState(after_doctype_public_identifier_state);
              } else if (data === '>') {
                tokenizer._parseError("unexpected-end-of-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else {
                tokenizer._currentToken.publicId += data;
              }
              return true;
            }
            function after_doctype_public_identifier_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace_1.default(data)) {
                tokenizer.setState(between_doctype_public_and_system_identifiers_state);
              } else if (data === '>') {
                tokenizer.setState(data_state);
                tokenizer._emitCurrentToken();
              } else if (data === '"') {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer._currentToken.systemId = '';
                tokenizer.setState(doctype_system_identifier_double_quoted_state);
              } else if (data === "'") {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer._currentToken.systemId = '';
                tokenizer.setState(doctype_system_identifier_single_quoted_state);
              } else {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(bogus_doctype_state);
              }
              return true;
            }
            function between_doctype_public_and_system_identifiers_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace_1.default(data)) {} else if (data === '>') {
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else if (data === '"') {
                tokenizer._currentToken.systemId = '';
                tokenizer.setState(doctype_system_identifier_double_quoted_state);
              } else if (data === "'") {
                tokenizer._currentToken.systemId = '';
                tokenizer.setState(doctype_system_identifier_single_quoted_state);
              } else {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(bogus_doctype_state);
              }
              return true;
            }
            function after_doctype_system_keyword_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace_1.default(data)) {
                tokenizer.setState(before_doctype_system_identifier_state);
              } else if (data === "'" || data === '"') {
                tokenizer._parseError("unexpected-char-in-doctype");
                buffer.unget(data);
                tokenizer.setState(before_doctype_system_identifier_state);
              } else {
                buffer.unget(data);
                tokenizer.setState(before_doctype_system_identifier_state);
              }
              return true;
            }
            function before_doctype_system_identifier_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace_1.default(data)) {} else if (data === '"') {
                tokenizer._currentToken.systemId = '';
                tokenizer.setState(doctype_system_identifier_double_quoted_state);
              } else if (data === "'") {
                tokenizer._currentToken.systemId = '';
                tokenizer.setState(doctype_system_identifier_single_quoted_state);
              } else if (data === '>') {
                tokenizer._parseError("unexpected-end-of-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer.setState(bogus_doctype_state);
              }
              return true;
            }
            function doctype_system_identifier_double_quoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === '"') {
                tokenizer.setState(after_doctype_system_identifier_state);
              } else if (data === '>') {
                tokenizer._parseError("unexpected-end-of-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else {
                tokenizer._currentToken.systemId += data;
              }
              return true;
            }
            function doctype_system_identifier_single_quoted_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (data === "'") {
                tokenizer.setState(after_doctype_system_identifier_state);
              } else if (data === '>') {
                tokenizer._parseError("unexpected-end-of-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else {
                tokenizer._currentToken.systemId += data;
              }
              return true;
            }
            function after_doctype_system_identifier_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                tokenizer._parseError("eof-in-doctype");
                tokenizer._currentToken.forceQuirks = true;
                tokenizer._emitCurrentToken();
                buffer.unget(data);
                tokenizer.setState(data_state);
              } else if (isWhitespace_1.default(data)) {} else if (data === '>') {
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else {
                tokenizer._parseError("unexpected-char-in-doctype");
                tokenizer.setState(bogus_doctype_state);
              }
              return true;
            }
            function bogus_doctype_state(buffer) {
              var data = buffer.char();
              if (data === InputStream_1.default.EOF) {
                buffer.unget(data);
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              } else if (data === '>') {
                tokenizer._emitCurrentToken();
                tokenizer.setState(data_state);
              }
              return true;
            }
          };
          this._tokenHandler = tokenHandler;
          this._state = Tokenizer.DATA;
          this._inputStream = new InputStream_1.default();
          this._currentToken = null;
          this._temporaryBuffer = '';
          this._additionalAllowedCharacter = '';
        }
        Object.defineProperty(Tokenizer.prototype, "lineNumber", {
          get: function() {
            return this._inputStream.location().line;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Tokenizer.prototype, "columnNumber", {
          get: function() {
            return this._inputStream.location().column;
          },
          enumerable: true,
          configurable: true
        });
        Tokenizer.prototype._parseError = function(code, args) {
          this._tokenHandler.parseError(code, args);
        };
        Tokenizer.prototype._emitToken = function(token) {
          if (token.type === 'StartTag') {
            for (var i = 1; i < token.data.length; i++) {
              if (!token.data[i].nodeName)
                token.data.splice(i--, 1);
            }
          } else if (token.type === 'EndTag') {
            if (token.selfClosing) {
              this._parseError('self-closing-flag-on-end-tag');
            }
            if (token.data.length !== 0) {
              this._parseError('attributes-in-end-tag');
            }
          }
          this._tokenHandler.processToken(token);
          if (token.type === 'StartTag' && token.selfClosing && !this._tokenHandler.isSelfClosingFlagAcknowledged()) {
            this._parseError('non-void-element-with-trailing-solidus', {name: token.name});
          }
        };
        return Tokenizer;
      })();
      exports_1("default", Tokenizer);
    }
  };
});

System.register("src/mode/html/TreeParser.js", [], function(exports_1) {
  var TreeParser;
  return {
    setters: [],
    execute: function() {
      TreeParser = (function() {
        function TreeParser(contextHandler) {}
        TreeParser.prototype.parse = function(something) {};
        return TreeParser;
      })();
      exports_1("default", TreeParser);
    }
  };
});

System.register("src/mode/html/SAXParser.js", ["./SAXTreeBuilder", "./Tokenizer", "./TreeParser"], function(exports_1) {
  var SAXTreeBuilder_1,
      Tokenizer_1,
      TreeParser_1;
  var SAXParser;
  return {
    setters: [function(SAXTreeBuilder_1_1) {
      SAXTreeBuilder_1 = SAXTreeBuilder_1_1;
    }, function(Tokenizer_1_1) {
      Tokenizer_1 = Tokenizer_1_1;
    }, function(TreeParser_1_1) {
      TreeParser_1 = TreeParser_1_1;
    }],
    execute: function() {
      SAXParser = (function() {
        function SAXParser() {
          this.contentHandler = null;
          this._errorHandler = null;
          this._treeBuilder = new SAXTreeBuilder_1.default();
          this._tokenizer = new Tokenizer_1.default(this._treeBuilder);
          this._scriptingEnabled = false;
        }
        SAXParser.prototype.parseFragment = function(source, context) {
          this._treeBuilder.setFragmentContext(context);
          this._tokenizer.tokenize(source);
          var fragment = this._treeBuilder.getFragment();
          if (fragment) {
            new TreeParser_1.default(this.contentHandler).parse(fragment);
          }
        };
        SAXParser.prototype.parse = function(source) {
          this._tokenizer.tokenize(source);
          var document = this._treeBuilder.document;
          if (document) {
            new TreeParser_1.default(this.contentHandler).parse(document);
          }
        };
        Object.defineProperty(SAXParser.prototype, "scriptingEnabled", {
          get: function() {
            return this._scriptingEnabled;
          },
          set: function(scriptingEnabled) {
            this._scriptingEnabled = scriptingEnabled;
            this._treeBuilder.scriptingEnabled = scriptingEnabled;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(SAXParser.prototype, "errorHandler", {
          get: function() {
            return this._errorHandler;
          },
          set: function(errorHandler) {
            this._errorHandler = errorHandler;
            this._treeBuilder.errorHandler = errorHandler;
          },
          enumerable: true,
          configurable: true
        });
        return SAXParser;
      })();
      exports_1("default", SAXParser);
    }
  };
});

System.register("src/mode/HtmlWorker.js", ["../worker/Mirror", "./html/SAXParser"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Mirror_1,
      SAXParser_1;
  var codeToAnnotationType,
      HtmlWorker;
  return {
    setters: [function(Mirror_1_1) {
      Mirror_1 = Mirror_1_1;
    }, function(SAXParser_1_1) {
      SAXParser_1 = SAXParser_1_1;
    }],
    execute: function() {
      codeToAnnotationType = {
        "expected-doctype-but-got-start-tag": "info",
        "expected-doctype-but-got-chars": "info",
        "non-html-root": "info"
      };
      HtmlWorker = (function(_super) {
        __extends(HtmlWorker, _super);
        function HtmlWorker(host) {
          _super.call(this, host, 500);
          this.setOptions();
        }
        HtmlWorker.prototype.setOptions = function(options) {
          if (options) {
            this.context = options.context;
          } else {
            this.context = void 0;
          }
          this.doc.getValue() && this.deferredUpdate.schedule(100);
        };
        HtmlWorker.prototype.onUpdate = function() {
          var annotations = [];
          var value = this.doc.getValue();
          if (!value) {
            this.emitAnnotations(annotations);
            return;
          }
          var parser = new SAXParser_1.default();
          if (parser) {
            var noop = function() {};
            parser.contentHandler = {
              startDocument: noop,
              endDocument: noop,
              startElement: noop,
              endElement: noop,
              characters: noop
            };
            parser.errorHandler = {error: function(message, location, code) {
                annotations.push({
                  row: location.line,
                  column: location.column,
                  text: message,
                  type: codeToAnnotationType[code] || "error"
                });
              }};
            if (this.context) {
              parser.parseFragment(value, this.context);
            } else {
              parser.parse(value);
            }
          }
          this.emitAnnotations(annotations);
        };
        return HtmlWorker;
      })(Mirror_1.default);
      exports_1("default", HtmlWorker);
    }
  };
});

"use strict";
System.register("src/mode/javascript/vars.js", [], function(exports_1) {
  var reservedVars,
      ecmaIdentifiers,
      browser,
      devel,
      worker,
      nonstandard,
      couch,
      node,
      browserify,
      phantom,
      qunit,
      rhino,
      shelljs,
      typed,
      wsh,
      dojo,
      jquery,
      mootools,
      prototypejs,
      yui,
      mocha,
      jasmine;
  return {
    setters: [],
    execute: function() {
      exports_1("reservedVars", reservedVars = {
        arguments: false,
        NaN: false
      });
      exports_1("ecmaIdentifiers", ecmaIdentifiers = {
        3: {
          Array: false,
          Boolean: false,
          Date: false,
          decodeURI: false,
          decodeURIComponent: false,
          encodeURI: false,
          encodeURIComponent: false,
          Error: false,
          "eval": false,
          EvalError: false,
          Function: false,
          hasOwnProperty: false,
          isFinite: false,
          isNaN: false,
          Math: false,
          Number: false,
          Object: false,
          parseInt: false,
          parseFloat: false,
          RangeError: false,
          ReferenceError: false,
          RegExp: false,
          String: false,
          SyntaxError: false,
          TypeError: false,
          URIError: false
        },
        5: {JSON: false},
        6: {
          Map: false,
          Promise: false,
          Proxy: false,
          Reflect: false,
          Set: false,
          Symbol: false,
          WeakMap: false,
          WeakSet: false
        }
      });
      exports_1("browser", browser = {
        Audio: false,
        Blob: false,
        addEventListener: false,
        applicationCache: false,
        atob: false,
        blur: false,
        btoa: false,
        cancelAnimationFrame: false,
        CanvasGradient: false,
        CanvasPattern: false,
        CanvasRenderingContext2D: false,
        CSS: false,
        clearInterval: false,
        clearTimeout: false,
        close: false,
        closed: false,
        Comment: false,
        CustomEvent: false,
        DOMParser: false,
        defaultStatus: false,
        Document: false,
        document: false,
        DocumentFragment: false,
        Element: false,
        ElementTimeControl: false,
        Event: false,
        event: false,
        fetch: false,
        File: false,
        FileList: false,
        FileReader: false,
        FormData: false,
        focus: false,
        frames: false,
        getComputedStyle: false,
        HTMLElement: false,
        HTMLAnchorElement: false,
        HTMLBaseElement: false,
        HTMLBlockquoteElement: false,
        HTMLBodyElement: false,
        HTMLBRElement: false,
        HTMLButtonElement: false,
        HTMLCanvasElement: false,
        HTMLCollection: false,
        HTMLDirectoryElement: false,
        HTMLDivElement: false,
        HTMLDListElement: false,
        HTMLFieldSetElement: false,
        HTMLFontElement: false,
        HTMLFormElement: false,
        HTMLFrameElement: false,
        HTMLFrameSetElement: false,
        HTMLHeadElement: false,
        HTMLHeadingElement: false,
        HTMLHRElement: false,
        HTMLHtmlElement: false,
        HTMLIFrameElement: false,
        HTMLImageElement: false,
        HTMLInputElement: false,
        HTMLIsIndexElement: false,
        HTMLLabelElement: false,
        HTMLLayerElement: false,
        HTMLLegendElement: false,
        HTMLLIElement: false,
        HTMLLinkElement: false,
        HTMLMapElement: false,
        HTMLMenuElement: false,
        HTMLMetaElement: false,
        HTMLModElement: false,
        HTMLObjectElement: false,
        HTMLOListElement: false,
        HTMLOptGroupElement: false,
        HTMLOptionElement: false,
        HTMLParagraphElement: false,
        HTMLParamElement: false,
        HTMLPreElement: false,
        HTMLQuoteElement: false,
        HTMLScriptElement: false,
        HTMLSelectElement: false,
        HTMLStyleElement: false,
        HTMLTableCaptionElement: false,
        HTMLTableCellElement: false,
        HTMLTableColElement: false,
        HTMLTableElement: false,
        HTMLTableRowElement: false,
        HTMLTableSectionElement: false,
        HTMLTemplateElement: false,
        HTMLTextAreaElement: false,
        HTMLTitleElement: false,
        HTMLUListElement: false,
        HTMLVideoElement: false,
        history: false,
        Image: false,
        Intl: false,
        length: false,
        localStorage: false,
        location: false,
        matchMedia: false,
        MessageChannel: false,
        MessageEvent: false,
        MessagePort: false,
        MouseEvent: false,
        moveBy: false,
        moveTo: false,
        MutationObserver: false,
        name: false,
        Node: false,
        NodeFilter: false,
        NodeList: false,
        Notification: false,
        navigator: false,
        onbeforeunload: true,
        onblur: true,
        onerror: true,
        onfocus: true,
        onload: true,
        onresize: true,
        onunload: true,
        open: false,
        openDatabase: false,
        opener: false,
        Option: false,
        parent: false,
        performance: false,
        print: false,
        Range: false,
        requestAnimationFrame: false,
        removeEventListener: false,
        resizeBy: false,
        resizeTo: false,
        screen: false,
        scroll: false,
        scrollBy: false,
        scrollTo: false,
        sessionStorage: false,
        setInterval: false,
        setTimeout: false,
        SharedWorker: false,
        status: false,
        SVGAElement: false,
        SVGAltGlyphDefElement: false,
        SVGAltGlyphElement: false,
        SVGAltGlyphItemElement: false,
        SVGAngle: false,
        SVGAnimateColorElement: false,
        SVGAnimateElement: false,
        SVGAnimateMotionElement: false,
        SVGAnimateTransformElement: false,
        SVGAnimatedAngle: false,
        SVGAnimatedBoolean: false,
        SVGAnimatedEnumeration: false,
        SVGAnimatedInteger: false,
        SVGAnimatedLength: false,
        SVGAnimatedLengthList: false,
        SVGAnimatedNumber: false,
        SVGAnimatedNumberList: false,
        SVGAnimatedPathData: false,
        SVGAnimatedPoints: false,
        SVGAnimatedPreserveAspectRatio: false,
        SVGAnimatedRect: false,
        SVGAnimatedString: false,
        SVGAnimatedTransformList: false,
        SVGAnimationElement: false,
        SVGCSSRule: false,
        SVGCircleElement: false,
        SVGClipPathElement: false,
        SVGColor: false,
        SVGColorProfileElement: false,
        SVGColorProfileRule: false,
        SVGComponentTransferFunctionElement: false,
        SVGCursorElement: false,
        SVGDefsElement: false,
        SVGDescElement: false,
        SVGDocument: false,
        SVGElement: false,
        SVGElementInstance: false,
        SVGElementInstanceList: false,
        SVGEllipseElement: false,
        SVGExternalResourcesRequired: false,
        SVGFEBlendElement: false,
        SVGFEColorMatrixElement: false,
        SVGFEComponentTransferElement: false,
        SVGFECompositeElement: false,
        SVGFEConvolveMatrixElement: false,
        SVGFEDiffuseLightingElement: false,
        SVGFEDisplacementMapElement: false,
        SVGFEDistantLightElement: false,
        SVGFEFloodElement: false,
        SVGFEFuncAElement: false,
        SVGFEFuncBElement: false,
        SVGFEFuncGElement: false,
        SVGFEFuncRElement: false,
        SVGFEGaussianBlurElement: false,
        SVGFEImageElement: false,
        SVGFEMergeElement: false,
        SVGFEMergeNodeElement: false,
        SVGFEMorphologyElement: false,
        SVGFEOffsetElement: false,
        SVGFEPointLightElement: false,
        SVGFESpecularLightingElement: false,
        SVGFESpotLightElement: false,
        SVGFETileElement: false,
        SVGFETurbulenceElement: false,
        SVGFilterElement: false,
        SVGFilterPrimitiveStandardAttributes: false,
        SVGFitToViewBox: false,
        SVGFontElement: false,
        SVGFontFaceElement: false,
        SVGFontFaceFormatElement: false,
        SVGFontFaceNameElement: false,
        SVGFontFaceSrcElement: false,
        SVGFontFaceUriElement: false,
        SVGForeignObjectElement: false,
        SVGGElement: false,
        SVGGlyphElement: false,
        SVGGlyphRefElement: false,
        SVGGradientElement: false,
        SVGHKernElement: false,
        SVGICCColor: false,
        SVGImageElement: false,
        SVGLangSpace: false,
        SVGLength: false,
        SVGLengthList: false,
        SVGLineElement: false,
        SVGLinearGradientElement: false,
        SVGLocatable: false,
        SVGMPathElement: false,
        SVGMarkerElement: false,
        SVGMaskElement: false,
        SVGMatrix: false,
        SVGMetadataElement: false,
        SVGMissingGlyphElement: false,
        SVGNumber: false,
        SVGNumberList: false,
        SVGPaint: false,
        SVGPathElement: false,
        SVGPathSeg: false,
        SVGPathSegArcAbs: false,
        SVGPathSegArcRel: false,
        SVGPathSegClosePath: false,
        SVGPathSegCurvetoCubicAbs: false,
        SVGPathSegCurvetoCubicRel: false,
        SVGPathSegCurvetoCubicSmoothAbs: false,
        SVGPathSegCurvetoCubicSmoothRel: false,
        SVGPathSegCurvetoQuadraticAbs: false,
        SVGPathSegCurvetoQuadraticRel: false,
        SVGPathSegCurvetoQuadraticSmoothAbs: false,
        SVGPathSegCurvetoQuadraticSmoothRel: false,
        SVGPathSegLinetoAbs: false,
        SVGPathSegLinetoHorizontalAbs: false,
        SVGPathSegLinetoHorizontalRel: false,
        SVGPathSegLinetoRel: false,
        SVGPathSegLinetoVerticalAbs: false,
        SVGPathSegLinetoVerticalRel: false,
        SVGPathSegList: false,
        SVGPathSegMovetoAbs: false,
        SVGPathSegMovetoRel: false,
        SVGPatternElement: false,
        SVGPoint: false,
        SVGPointList: false,
        SVGPolygonElement: false,
        SVGPolylineElement: false,
        SVGPreserveAspectRatio: false,
        SVGRadialGradientElement: false,
        SVGRect: false,
        SVGRectElement: false,
        SVGRenderingIntent: false,
        SVGSVGElement: false,
        SVGScriptElement: false,
        SVGSetElement: false,
        SVGStopElement: false,
        SVGStringList: false,
        SVGStylable: false,
        SVGStyleElement: false,
        SVGSwitchElement: false,
        SVGSymbolElement: false,
        SVGTRefElement: false,
        SVGTSpanElement: false,
        SVGTests: false,
        SVGTextContentElement: false,
        SVGTextElement: false,
        SVGTextPathElement: false,
        SVGTextPositioningElement: false,
        SVGTitleElement: false,
        SVGTransform: false,
        SVGTransformList: false,
        SVGTransformable: false,
        SVGURIReference: false,
        SVGUnitTypes: false,
        SVGUseElement: false,
        SVGVKernElement: false,
        SVGViewElement: false,
        SVGViewSpec: false,
        SVGZoomAndPan: false,
        Text: false,
        TextDecoder: false,
        TextEncoder: false,
        TimeEvent: false,
        top: false,
        URL: false,
        WebGLActiveInfo: false,
        WebGLBuffer: false,
        WebGLContextEvent: false,
        WebGLFramebuffer: false,
        WebGLProgram: false,
        WebGLRenderbuffer: false,
        WebGLRenderingContext: false,
        WebGLShader: false,
        WebGLShaderPrecisionFormat: false,
        WebGLTexture: false,
        WebGLUniformLocation: false,
        WebSocket: false,
        window: false,
        Window: false,
        Worker: false,
        XDomainRequest: false,
        XMLHttpRequest: false,
        XMLSerializer: false,
        XPathEvaluator: false,
        XPathException: false,
        XPathExpression: false,
        XPathNamespace: false,
        XPathNSResolver: false,
        XPathResult: false
      });
      exports_1("devel", devel = {
        alert: false,
        confirm: false,
        console: false,
        Debug: false,
        opera: false,
        prompt: false
      });
      exports_1("worker", worker = {
        importScripts: true,
        postMessage: true,
        self: true,
        FileReaderSync: true
      });
      exports_1("nonstandard", nonstandard = {
        escape: false,
        unescape: false
      });
      exports_1("couch", couch = {
        "require": false,
        respond: false,
        getRow: false,
        emit: false,
        send: false,
        start: false,
        sum: false,
        log: false,
        "exports": false,
        module: false,
        provides: false
      });
      exports_1("node", node = {
        __filename: false,
        __dirname: false,
        GLOBAL: false,
        global: false,
        module: false,
        require: false,
        Buffer: true,
        console: true,
        "exports": true,
        process: true,
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        setImmediate: true,
        clearImmediate: true
      });
      exports_1("browserify", browserify = {
        __filename: false,
        __dirname: false,
        global: false,
        module: false,
        require: false,
        Buffer: true,
        "exports": true,
        process: true
      });
      exports_1("phantom", phantom = {
        phantom: true,
        require: true,
        WebPage: true,
        console: true,
        "exports": true
      });
      exports_1("qunit", qunit = {
        asyncTest: false,
        deepEqual: false,
        equal: false,
        expect: false,
        module: false,
        notDeepEqual: false,
        notEqual: false,
        notOk: false,
        notPropEqual: false,
        notStrictEqual: false,
        ok: false,
        propEqual: false,
        QUnit: false,
        raises: false,
        start: false,
        stop: false,
        strictEqual: false,
        test: false,
        "throws": false
      });
      exports_1("rhino", rhino = {
        defineClass: false,
        deserialize: false,
        gc: false,
        help: false,
        importClass: false,
        importPackage: false,
        "java": false,
        load: false,
        loadClass: false,
        Packages: false,
        print: false,
        quit: false,
        readFile: false,
        readUrl: false,
        runCommand: false,
        seal: false,
        serialize: false,
        spawn: false,
        sync: false,
        toint32: false,
        version: false
      });
      exports_1("shelljs", shelljs = {
        target: false,
        echo: false,
        exit: false,
        cd: false,
        pwd: false,
        ls: false,
        find: false,
        cp: false,
        rm: false,
        mv: false,
        mkdir: false,
        test: false,
        cat: false,
        sed: false,
        grep: false,
        which: false,
        dirs: false,
        pushd: false,
        popd: false,
        env: false,
        exec: false,
        chmod: false,
        config: false,
        error: false,
        tempdir: false
      });
      exports_1("typed", typed = {
        ArrayBuffer: false,
        ArrayBufferView: false,
        DataView: false,
        Float32Array: false,
        Float64Array: false,
        Int16Array: false,
        Int32Array: false,
        Int8Array: false,
        Uint16Array: false,
        Uint32Array: false,
        Uint8Array: false,
        Uint8ClampedArray: false
      });
      exports_1("wsh", wsh = {
        ActiveXObject: true,
        Enumerator: true,
        GetObject: true,
        ScriptEngine: true,
        ScriptEngineBuildVersion: true,
        ScriptEngineMajorVersion: true,
        ScriptEngineMinorVersion: true,
        VBArray: true,
        WSH: true,
        WScript: true,
        XDomainRequest: true
      });
      exports_1("dojo", dojo = {
        dojo: false,
        dijit: false,
        dojox: false,
        define: false,
        "require": false
      });
      exports_1("jquery", jquery = {
        "$": false,
        jQuery: false
      });
      exports_1("mootools", mootools = {
        "$": false,
        "$$": false,
        Asset: false,
        Browser: false,
        Chain: false,
        Class: false,
        Color: false,
        Cookie: false,
        Core: false,
        Document: false,
        DomReady: false,
        DOMEvent: false,
        DOMReady: false,
        Drag: false,
        Element: false,
        Elements: false,
        Event: false,
        Events: false,
        Fx: false,
        Group: false,
        Hash: false,
        HtmlTable: false,
        IFrame: false,
        IframeShim: false,
        InputValidator: false,
        instanceOf: false,
        Keyboard: false,
        Locale: false,
        Mask: false,
        MooTools: false,
        Native: false,
        Options: false,
        OverText: false,
        Request: false,
        Scroller: false,
        Slick: false,
        Slider: false,
        Sortables: false,
        Spinner: false,
        Swiff: false,
        Tips: false,
        Type: false,
        typeOf: false,
        URI: false,
        Window: false
      });
      exports_1("prototypejs", prototypejs = {
        "$": false,
        "$$": false,
        "$A": false,
        "$F": false,
        "$H": false,
        "$R": false,
        "$break": false,
        "$continue": false,
        "$w": false,
        Abstract: false,
        Ajax: false,
        Class: false,
        Enumerable: false,
        Element: false,
        Event: false,
        Field: false,
        Form: false,
        Hash: false,
        Insertion: false,
        ObjectRange: false,
        PeriodicalExecuter: false,
        Position: false,
        Prototype: false,
        Selector: false,
        Template: false,
        Toggle: false,
        Try: false,
        Autocompleter: false,
        Builder: false,
        Control: false,
        Draggable: false,
        Draggables: false,
        Droppables: false,
        Effect: false,
        Sortable: false,
        SortableObserver: false,
        Sound: false,
        Scriptaculous: false
      });
      exports_1("yui", yui = {
        YUI: false,
        Y: false,
        YUI_config: false
      });
      exports_1("mocha", mocha = {
        mocha: false,
        describe: false,
        xdescribe: false,
        it: false,
        xit: false,
        context: false,
        xcontext: false,
        before: false,
        after: false,
        beforeEach: false,
        afterEach: false,
        suite: false,
        test: false,
        setup: false,
        teardown: false,
        suiteSetup: false,
        suiteTeardown: false
      });
      exports_1("jasmine", jasmine = {
        jasmine: false,
        describe: false,
        xdescribe: false,
        it: false,
        xit: false,
        beforeEach: false,
        afterEach: false,
        setFixtures: false,
        loadFixtures: false,
        spyOn: false,
        expect: false,
        runs: false,
        waitsFor: false,
        waits: false,
        beforeAll: false,
        afterAll: false,
        fail: false,
        fdescribe: false,
        fit: false,
        pending: false
      });
    }
  };
});

"use strict";
System.register("src/mode/javascript/messages.js", [], function(exports_1) {
  var errorsMap,
      warningsMap,
      infoMap,
      errors,
      warnings,
      info;
  function each(data, callback) {
    var keys = Object.keys(data);
    for (var i = 0,
        iLength = keys.length; i < iLength; i++) {
      var code = keys[i];
      var desc = data[code];
      callback(desc, code);
    }
  }
  return {
    setters: [],
    execute: function() {
      errorsMap = {
        E001: "Bad option: '{a}'.",
        E002: "Bad option value.",
        E003: "Expected a JSON value.",
        E004: "Input is neither a string nor an array of strings.",
        E005: "Input is empty.",
        E006: "Unexpected early end of program.",
        E007: "Missing \"use strict\" statement.",
        E008: "Strict violation.",
        E009: "Option 'validthis' can't be used in a global scope.",
        E010: "'with' is not allowed in strict mode.",
        E011: "'{a}' has already been declared.",
        E012: "const '{a}' is initialized to 'undefined'.",
        E013: "Attempting to override '{a}' which is a constant.",
        E014: "A regular expression literal can be confused with '/='.",
        E015: "Unclosed regular expression.",
        E016: "Invalid regular expression.",
        E017: "Unclosed comment.",
        E018: "Unbegun comment.",
        E019: "Unmatched '{a}'.",
        E020: "Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",
        E021: "Expected '{a}' and instead saw '{b}'.",
        E022: "Line breaking error '{a}'.",
        E023: "Missing '{a}'.",
        E024: "Unexpected '{a}'.",
        E025: "Missing ':' on a case clause.",
        E026: "Missing '}' to match '{' from line {a}.",
        E027: "Missing ']' to match '[' from line {a}.",
        E028: "Illegal comma.",
        E029: "Unclosed string.",
        E030: "Expected an identifier and instead saw '{a}'.",
        E031: "Bad assignment.",
        E032: "Expected a small integer or 'false' and instead saw '{a}'.",
        E033: "Expected an operator and instead saw '{a}'.",
        E034: "get/set are ES5 features.",
        E035: "Missing property name.",
        E036: "Expected to see a statement and instead saw a block.",
        E037: null,
        E038: null,
        E039: "Function declarations are not invocable. Wrap the whole function invocation in parens.",
        E040: "Each value should have its own case label.",
        E041: "Unrecoverable syntax error.",
        E042: "Stopping.",
        E043: "Too many errors.",
        E044: null,
        E045: "Invalid for each loop.",
        E046: "A yield statement shall be within a generator function (with syntax: `function*`)",
        E047: null,
        E048: "{a} declaration not directly within block.",
        E049: "A {a} cannot be named '{b}'.",
        E050: "Mozilla requires the yield expression to be parenthesized here.",
        E051: null,
        E052: "Unclosed template literal.",
        E053: "Export declaration must be in global scope.",
        E054: "Class properties must be methods. Expected '(' but instead saw '{a}'.",
        E055: "The '{a}' option cannot be set after any executable code.",
        E056: "'{a}' was used before it was declared, which is illegal for '{b}' variables.",
        E057: "Invalid meta property: '{a}.{b}'.",
        E058: "Missing semicolon.",
        E059: "Incompatible values for the '{a}' and '{b}' linting options."
      };
      warningsMap = {
        W001: "'hasOwnProperty' is a really bad name.",
        W002: "Value of '{a}' may be overwritten in IE 8 and earlier.",
        W003: "'{a}' was used before it was defined.",
        W004: "'{a}' is already defined.",
        W005: "A dot following a number can be confused with a decimal point.",
        W006: "Confusing minuses.",
        W007: "Confusing plusses.",
        W008: "A leading decimal point can be confused with a dot: '{a}'.",
        W009: "The array literal notation [] is preferable.",
        W010: "The object literal notation {} is preferable.",
        W011: null,
        W012: null,
        W013: null,
        W014: "Bad line breaking before '{a}'.",
        W015: null,
        W016: "Unexpected use of '{a}'.",
        W017: "Bad operand.",
        W018: "Confusing use of '{a}'.",
        W019: "Use the isNaN function to compare with NaN.",
        W020: "Read only.",
        W021: "Reassignment of '{a}', which is is a {b}. " + "Use 'var' or 'let' to declare bindings that may change.",
        W022: "Do not assign to the exception parameter.",
        W023: "Expected an identifier in an assignment and instead saw a function invocation.",
        W024: "Expected an identifier and instead saw '{a}' (a reserved word).",
        W025: "Missing name in function declaration.",
        W026: "Inner functions should be listed at the top of the outer function.",
        W027: "Unreachable '{a}' after '{b}'.",
        W028: "Label '{a}' on {b} statement.",
        W030: "Expected an assignment or function call and instead saw an expression.",
        W031: "Do not use 'new' for side effects.",
        W032: "Unnecessary semicolon.",
        W033: "Missing semicolon.",
        W034: "Unnecessary directive \"{a}\".",
        W035: "Empty block.",
        W036: "Unexpected /*member '{a}'.",
        W037: "'{a}' is a statement label.",
        W038: "'{a}' used out of scope.",
        W039: "'{a}' is not allowed.",
        W040: "Possible strict violation.",
        W041: "Use '{a}' to compare with '{b}'.",
        W042: "Avoid EOL escaping.",
        W043: "Bad escaping of EOL. Use option multistr if needed.",
        W044: "Bad or unnecessary escaping.",
        W045: "Bad number '{a}'.",
        W046: "Don't use extra leading zeros '{a}'.",
        W047: "A trailing decimal point can be confused with a dot: '{a}'.",
        W048: "Unexpected control character in regular expression.",
        W049: "Unexpected escaped character '{a}' in regular expression.",
        W050: "JavaScript URL.",
        W051: "Variables should not be deleted.",
        W052: "Unexpected '{a}'.",
        W053: "Do not use {a} as a constructor.",
        W054: "The Function constructor is a form of eval.",
        W055: "A constructor name should start with an uppercase letter.",
        W056: "Bad constructor.",
        W057: "Weird construction. Is 'new' necessary?",
        W058: "Missing '()' invoking a constructor.",
        W059: "Avoid arguments.{a}.",
        W060: "document.write can be a form of eval.",
        W061: "eval can be harmful.",
        W062: "Wrap an immediate function invocation in parens " + "to assist the reader in understanding that the expression " + "is the result of a function, and not the function itself.",
        W063: "Math is not a function.",
        W064: "Missing 'new' prefix when invoking a constructor.",
        W065: "Missing radix parameter.",
        W066: "Implied eval. Consider passing a function instead of a string.",
        W067: "Bad invocation.",
        W068: "Wrapping non-IIFE function literals in parens is unnecessary.",
        W069: "['{a}'] is better written in dot notation.",
        W070: "Extra comma. (it breaks older versions of IE)",
        W071: "This function has too many statements. ({a})",
        W072: "This function has too many parameters. ({a})",
        W073: "Blocks are nested too deeply. ({a})",
        W074: "This function's cyclomatic complexity is too high. ({a})",
        W075: "Duplicate {a} '{b}'.",
        W076: "Unexpected parameter '{a}' in get {b} function.",
        W077: "Expected a single parameter in set {a} function.",
        W078: "Setter is defined without getter.",
        W079: "Redefinition of '{a}'.",
        W080: "It's not necessary to initialize '{a}' to 'undefined'.",
        W081: null,
        W082: "Function declarations should not be placed in blocks. " + "Use a function expression or move the statement to the top of " + "the outer function.",
        W083: "Don't make functions within a loop.",
        W084: "Expected a conditional expression and instead saw an assignment.",
        W085: "Don't use 'with'.",
        W086: "Expected a 'break' statement before '{a}'.",
        W087: "Forgotten 'debugger' statement?",
        W088: "Creating global 'for' variable. Should be 'for (var {a} ...'.",
        W089: "The body of a for in should be wrapped in an if statement to filter " + "unwanted properties from the prototype.",
        W090: "'{a}' is not a statement label.",
        W091: null,
        W093: "Did you mean to return a conditional instead of an assignment?",
        W094: "Unexpected comma.",
        W095: "Expected a string and instead saw {a}.",
        W096: "The '{a}' key may produce unexpected results.",
        W097: "Use the function form of \"use strict\".",
        W098: "'{a}' is defined but never used.",
        W099: null,
        W100: "This character may get silently deleted by one or more browsers.",
        W101: "Line is too long.",
        W102: null,
        W103: "The '{a}' property is deprecated.",
        W104: "'{a}' is available in ES{b} (use 'esversion: {b}') or Mozilla JS extensions (use moz).",
        W105: "Unexpected {a} in '{b}'.",
        W106: "Identifier '{a}' is not in camel case.",
        W107: "Script URL.",
        W108: "Strings must use doublequote.",
        W109: "Strings must use singlequote.",
        W110: "Mixed double and single quotes.",
        W112: "Unclosed string.",
        W113: "Control character in string: {a}.",
        W114: "Avoid {a}.",
        W115: "Octal literals are not allowed in strict mode.",
        W116: "Expected '{a}' and instead saw '{b}'.",
        W117: "'{a}' is not defined.",
        W118: "'{a}' is only available in Mozilla JavaScript extensions (use moz option).",
        W119: "'{a}' is only available in ES{b} (use 'esversion: {b}').",
        W120: "You might be leaking a variable ({a}) here.",
        W121: "Extending prototype of native object: '{a}'.",
        W122: "Invalid typeof value '{a}'",
        W123: "'{a}' is already defined in outer scope.",
        W124: "A generator function shall contain a yield statement.",
        W125: "This line contains non-breaking spaces: http://jshint.com/doc/options/#nonbsp",
        W126: "Unnecessary grouping operator.",
        W127: "Unexpected use of a comma operator.",
        W128: "Empty array elements require elision=true.",
        W129: "'{a}' is defined in a future version of JavaScript. Use a " + "different variable name to avoid migration issues.",
        W130: "Invalid element after rest element.",
        W131: "Invalid parameter after rest parameter.",
        W132: "`var` declarations are forbidden. Use `let` or `const` instead.",
        W133: "Invalid for-{a} loop left-hand-side: {b}.",
        W134: "The '{a}' option is only available when linting ECMAScript {b} code.",
        W135: "{a} may not be supported by non-browser environments.",
        W136: "'{a}' must be in function scope.",
        W137: "Empty destructuring.",
        W138: "Regular parameters should not come after default parameters."
      };
      infoMap = {
        I001: "Comma warnings can be turned off with 'laxcomma'.",
        I002: null,
        I003: "ES5 option is now set per default"
      };
      exports_1("errors", errors = {});
      exports_1("warnings", warnings = {});
      exports_1("info", info = {});
      each(errorsMap, function(desc, code) {
        errors[code] = {
          code: code,
          desc: desc
        };
      });
      each(warningsMap, function(desc, code) {
        warnings[code] = {
          code: code,
          desc: desc
        };
      });
      each(infoMap, function(desc, code) {
        info[code] = {
          code: code,
          desc: desc
        };
      });
    }
  };
});

System.register("src/mode/javascript/ascii-identifier-data.js", [], function(exports_1) {
  var asciiIdentifierStartTable,
      asciiIdentifierPartTable;
  return {
    setters: [],
    execute: function() {
      exports_1("asciiIdentifierStartTable", asciiIdentifierStartTable = []);
      for (var i = 0; i < 128; i++) {
        asciiIdentifierStartTable[i] = i === 36 || i >= 65 && i <= 90 || i === 95 || i >= 97 && i <= 122;
      }
      exports_1("asciiIdentifierPartTable", asciiIdentifierPartTable = []);
      for (var i = 0; i < 128; i++) {
        asciiIdentifierPartTable[i] = asciiIdentifierStartTable[i] || i >= 48 && i <= 57;
      }
    }
  };
});

System.register("src/mode/javascript/non-ascii-identifier-start.js", [], function(exports_1) {
  var str,
      nonAsciiIdentifierStartTable;
  return {
    setters: [],
    execute: function() {
      str = '170,181,186,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549,550,551,552,553,554,555,556,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,575,576,577,578,579,580,581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,596,597,598,599,600,601,602,603,604,605,606,607,608,609,610,611,612,613,614,615,616,617,618,619,620,621,622,623,624,625,626,627,628,629,630,631,632,633,634,635,636,637,638,639,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,710,711,712,713,714,715,716,717,718,719,720,721,736,737,738,739,740,748,750,880,881,882,883,884,886,887,890,891,892,893,902,904,905,906,908,910,911,912,913,914,915,916,917,918,919,920,921,922,923,924,925,926,927,928,929,931,932,933,934,935,936,937,938,939,940,941,942,943,944,945,946,947,948,949,950,951,952,953,954,955,956,957,958,959,960,961,962,963,964,965,966,967,968,969,970,971,972,973,974,975,976,977,978,979,980,981,982,983,984,985,986,987,988,989,990,991,992,993,994,995,996,997,998,999,1000,1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1011,1012,1013,1015,1016,1017,1018,1019,1020,1021,1022,1023,1024,1025,1026,1027,1028,1029,1030,1031,1032,1033,1034,1035,1036,1037,1038,1039,1040,1041,1042,1043,1044,1045,1046,1047,1048,1049,1050,1051,1052,1053,1054,1055,1056,1057,1058,1059,1060,1061,1062,1063,1064,1065,1066,1067,1068,1069,1070,1071,1072,1073,1074,1075,1076,1077,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,1090,1091,1092,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103,1104,1105,1106,1107,1108,1109,1110,1111,1112,1113,1114,1115,1116,1117,1118,1119,1120,1121,1122,1123,1124,1125,1126,1127,1128,1129,1130,1131,1132,1133,1134,1135,1136,1137,1138,1139,1140,1141,1142,1143,1144,1145,1146,1147,1148,1149,1150,1151,1152,1153,1162,1163,1164,1165,1166,1167,1168,1169,1170,1171,1172,1173,1174,1175,1176,1177,1178,1179,1180,1181,1182,1183,1184,1185,1186,1187,1188,1189,1190,1191,1192,1193,1194,1195,1196,1197,1198,1199,1200,1201,1202,1203,1204,1205,1206,1207,1208,1209,1210,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220,1221,1222,1223,1224,1225,1226,1227,1228,1229,1230,1231,1232,1233,1234,1235,1236,1237,1238,1239,1240,1241,1242,1243,1244,1245,1246,1247,1248,1249,1250,1251,1252,1253,1254,1255,1256,1257,1258,1259,1260,1261,1262,1263,1264,1265,1266,1267,1268,1269,1270,1271,1272,1273,1274,1275,1276,1277,1278,1279,1280,1281,1282,1283,1284,1285,1286,1287,1288,1289,1290,1291,1292,1293,1294,1295,1296,1297,1298,1299,1300,1301,1302,1303,1304,1305,1306,1307,1308,1309,1310,1311,1312,1313,1314,1315,1316,1317,1318,1319,1329,1330,1331,1332,1333,1334,1335,1336,1337,1338,1339,1340,1341,1342,1343,1344,1345,1346,1347,1348,1349,1350,1351,1352,1353,1354,1355,1356,1357,1358,1359,1360,1361,1362,1363,1364,1365,1366,1369,1377,1378,1379,1380,1381,1382,1383,1384,1385,1386,1387,1388,1389,1390,1391,1392,1393,1394,1395,1396,1397,1398,1399,1400,1401,1402,1403,1404,1405,1406,1407,1408,1409,1410,1411,1412,1413,1414,1415,1488,1489,1490,1491,1492,1493,1494,1495,1496,1497,1498,1499,1500,1501,1502,1503,1504,1505,1506,1507,1508,1509,1510,1511,1512,1513,1514,1520,1521,1522,1568,1569,1570,1571,1572,1573,1574,1575,1576,1577,1578,1579,1580,1581,1582,1583,1584,1585,1586,1587,1588,1589,1590,1591,1592,1593,1594,1595,1596,1597,1598,1599,1600,1601,1602,1603,1604,1605,1606,1607,1608,1609,1610,1646,1647,1649,1650,1651,1652,1653,1654,1655,1656,1657,1658,1659,1660,1661,1662,1663,1664,1665,1666,1667,1668,1669,1670,1671,1672,1673,1674,1675,1676,1677,1678,1679,1680,1681,1682,1683,1684,1685,1686,1687,1688,1689,1690,1691,1692,1693,1694,1695,1696,1697,1698,1699,1700,1701,1702,1703,1704,1705,1706,1707,1708,1709,1710,1711,1712,1713,1714,1715,1716,1717,1718,1719,1720,1721,1722,1723,1724,1725,1726,1727,1728,1729,1730,1731,1732,1733,1734,1735,1736,1737,1738,1739,1740,1741,1742,1743,1744,1745,1746,1747,1749,1765,1766,1774,1775,1786,1787,1788,1791,1808,1810,1811,1812,1813,1814,1815,1816,1817,1818,1819,1820,1821,1822,1823,1824,1825,1826,1827,1828,1829,1830,1831,1832,1833,1834,1835,1836,1837,1838,1839,1869,1870,1871,1872,1873,1874,1875,1876,1877,1878,1879,1880,1881,1882,1883,1884,1885,1886,1887,1888,1889,1890,1891,1892,1893,1894,1895,1896,1897,1898,1899,1900,1901,1902,1903,1904,1905,1906,1907,1908,1909,1910,1911,1912,1913,1914,1915,1916,1917,1918,1919,1920,1921,1922,1923,1924,1925,1926,1927,1928,1929,1930,1931,1932,1933,1934,1935,1936,1937,1938,1939,1940,1941,1942,1943,1944,1945,1946,1947,1948,1949,1950,1951,1952,1953,1954,1955,1956,1957,1969,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2036,2037,2042,2048,2049,2050,2051,2052,2053,2054,2055,2056,2057,2058,2059,2060,2061,2062,2063,2064,2065,2066,2067,2068,2069,2074,2084,2088,2112,2113,2114,2115,2116,2117,2118,2119,2120,2121,2122,2123,2124,2125,2126,2127,2128,2129,2130,2131,2132,2133,2134,2135,2136,2208,2210,2211,2212,2213,2214,2215,2216,2217,2218,2219,2220,2308,2309,2310,2311,2312,2313,2314,2315,2316,2317,2318,2319,2320,2321,2322,2323,2324,2325,2326,2327,2328,2329,2330,2331,2332,2333,2334,2335,2336,2337,2338,2339,2340,2341,2342,2343,2344,2345,2346,2347,2348,2349,2350,2351,2352,2353,2354,2355,2356,2357,2358,2359,2360,2361,2365,2384,2392,2393,2394,2395,2396,2397,2398,2399,2400,2401,2417,2418,2419,2420,2421,2422,2423,2425,2426,2427,2428,2429,2430,2431,2437,2438,2439,2440,2441,2442,2443,2444,2447,2448,2451,2452,2453,2454,2455,2456,2457,2458,2459,2460,2461,2462,2463,2464,2465,2466,2467,2468,2469,2470,2471,2472,2474,2475,2476,2477,2478,2479,2480,2482,2486,2487,2488,2489,2493,2510,2524,2525,2527,2528,2529,2544,2545,2565,2566,2567,2568,2569,2570,2575,2576,2579,2580,2581,2582,2583,2584,2585,2586,2587,2588,2589,2590,2591,2592,2593,2594,2595,2596,2597,2598,2599,2600,2602,2603,2604,2605,2606,2607,2608,2610,2611,2613,2614,2616,2617,2649,2650,2651,2652,2654,2674,2675,2676,2693,2694,2695,2696,2697,2698,2699,2700,2701,2703,2704,2705,2707,2708,2709,2710,2711,2712,2713,2714,2715,2716,2717,2718,2719,2720,2721,2722,2723,2724,2725,2726,2727,2728,2730,2731,2732,2733,2734,2735,2736,2738,2739,2741,2742,2743,2744,2745,2749,2768,2784,2785,2821,2822,2823,2824,2825,2826,2827,2828,2831,2832,2835,2836,2837,2838,2839,2840,2841,2842,2843,2844,2845,2846,2847,2848,2849,2850,2851,2852,2853,2854,2855,2856,2858,2859,2860,2861,2862,2863,2864,2866,2867,2869,2870,2871,2872,2873,2877,2908,2909,2911,2912,2913,2929,2947,2949,2950,2951,2952,2953,2954,2958,2959,2960,2962,2963,2964,2965,2969,2970,2972,2974,2975,2979,2980,2984,2985,2986,2990,2991,2992,2993,2994,2995,2996,2997,2998,2999,3000,3001,3024,3077,3078,3079,3080,3081,3082,3083,3084,3086,3087,3088,3090,3091,3092,3093,3094,3095,3096,3097,3098,3099,3100,3101,3102,3103,3104,3105,3106,3107,3108,3109,3110,3111,3112,3114,3115,3116,3117,3118,3119,3120,3121,3122,3123,3125,3126,3127,3128,3129,3133,3160,3161,3168,3169,3205,3206,3207,3208,3209,3210,3211,3212,3214,3215,3216,3218,3219,3220,3221,3222,3223,3224,3225,3226,3227,3228,3229,3230,3231,3232,3233,3234,3235,3236,3237,3238,3239,3240,3242,3243,3244,3245,3246,3247,3248,3249,3250,3251,3253,3254,3255,3256,3257,3261,3294,3296,3297,3313,3314,3333,3334,3335,3336,3337,3338,3339,3340,3342,3343,3344,3346,3347,3348,3349,3350,3351,3352,3353,3354,3355,3356,3357,3358,3359,3360,3361,3362,3363,3364,3365,3366,3367,3368,3369,3370,3371,3372,3373,3374,3375,3376,3377,3378,3379,3380,3381,3382,3383,3384,3385,3386,3389,3406,3424,3425,3450,3451,3452,3453,3454,3455,3461,3462,3463,3464,3465,3466,3467,3468,3469,3470,3471,3472,3473,3474,3475,3476,3477,3478,3482,3483,3484,3485,3486,3487,3488,3489,3490,3491,3492,3493,3494,3495,3496,3497,3498,3499,3500,3501,3502,3503,3504,3505,3507,3508,3509,3510,3511,3512,3513,3514,3515,3517,3520,3521,3522,3523,3524,3525,3526,3585,3586,3587,3588,3589,3590,3591,3592,3593,3594,3595,3596,3597,3598,3599,3600,3601,3602,3603,3604,3605,3606,3607,3608,3609,3610,3611,3612,3613,3614,3615,3616,3617,3618,3619,3620,3621,3622,3623,3624,3625,3626,3627,3628,3629,3630,3631,3632,3634,3635,3648,3649,3650,3651,3652,3653,3654,3713,3714,3716,3719,3720,3722,3725,3732,3733,3734,3735,3737,3738,3739,3740,3741,3742,3743,3745,3746,3747,3749,3751,3754,3755,3757,3758,3759,3760,3762,3763,3773,3776,3777,3778,3779,3780,3782,3804,3805,3806,3807,3840,3904,3905,3906,3907,3908,3909,3910,3911,3913,3914,3915,3916,3917,3918,3919,3920,3921,3922,3923,3924,3925,3926,3927,3928,3929,3930,3931,3932,3933,3934,3935,3936,3937,3938,3939,3940,3941,3942,3943,3944,3945,3946,3947,3948,3976,3977,3978,3979,3980,4096,4097,4098,4099,4100,4101,4102,4103,4104,4105,4106,4107,4108,4109,4110,4111,4112,4113,4114,4115,4116,4117,4118,4119,4120,4121,4122,4123,4124,4125,4126,4127,4128,4129,4130,4131,4132,4133,4134,4135,4136,4137,4138,4159,4176,4177,4178,4179,4180,4181,4186,4187,4188,4189,4193,4197,4198,4206,4207,4208,4213,4214,4215,4216,4217,4218,4219,4220,4221,4222,4223,4224,4225,4238,4256,4257,4258,4259,4260,4261,4262,4263,4264,4265,4266,4267,4268,4269,4270,4271,4272,4273,4274,4275,4276,4277,4278,4279,4280,4281,4282,4283,4284,4285,4286,4287,4288,4289,4290,4291,4292,4293,4295,4301,4304,4305,4306,4307,4308,4309,4310,4311,4312,4313,4314,4315,4316,4317,4318,4319,4320,4321,4322,4323,4324,4325,4326,4327,4328,4329,4330,4331,4332,4333,4334,4335,4336,4337,4338,4339,4340,4341,4342,4343,4344,4345,4346,4348,4349,4350,4351,4352,4353,4354,4355,4356,4357,4358,4359,4360,4361,4362,4363,4364,4365,4366,4367,4368,4369,4370,4371,4372,4373,4374,4375,4376,4377,4378,4379,4380,4381,4382,4383,4384,4385,4386,4387,4388,4389,4390,4391,4392,4393,4394,4395,4396,4397,4398,4399,4400,4401,4402,4403,4404,4405,4406,4407,4408,4409,4410,4411,4412,4413,4414,4415,4416,4417,4418,4419,4420,4421,4422,4423,4424,4425,4426,4427,4428,4429,4430,4431,4432,4433,4434,4435,4436,4437,4438,4439,4440,4441,4442,4443,4444,4445,4446,4447,4448,4449,4450,4451,4452,4453,4454,4455,4456,4457,4458,4459,4460,4461,4462,4463,4464,4465,4466,4467,4468,4469,4470,4471,4472,4473,4474,4475,4476,4477,4478,4479,4480,4481,4482,4483,4484,4485,4486,4487,4488,4489,4490,4491,4492,4493,4494,4495,4496,4497,4498,4499,4500,4501,4502,4503,4504,4505,4506,4507,4508,4509,4510,4511,4512,4513,4514,4515,4516,4517,4518,4519,4520,4521,4522,4523,4524,4525,4526,4527,4528,4529,4530,4531,4532,4533,4534,4535,4536,4537,4538,4539,4540,4541,4542,4543,4544,4545,4546,4547,4548,4549,4550,4551,4552,4553,4554,4555,4556,4557,4558,4559,4560,4561,4562,4563,4564,4565,4566,4567,4568,4569,4570,4571,4572,4573,4574,4575,4576,4577,4578,4579,4580,4581,4582,4583,4584,4585,4586,4587,4588,4589,4590,4591,4592,4593,4594,4595,4596,4597,4598,4599,4600,4601,4602,4603,4604,4605,4606,4607,4608,4609,4610,4611,4612,4613,4614,4615,4616,4617,4618,4619,4620,4621,4622,4623,4624,4625,4626,4627,4628,4629,4630,4631,4632,4633,4634,4635,4636,4637,4638,4639,4640,4641,4642,4643,4644,4645,4646,4647,4648,4649,4650,4651,4652,4653,4654,4655,4656,4657,4658,4659,4660,4661,4662,4663,4664,4665,4666,4667,4668,4669,4670,4671,4672,4673,4674,4675,4676,4677,4678,4679,4680,4682,4683,4684,4685,4688,4689,4690,4691,4692,4693,4694,4696,4698,4699,4700,4701,4704,4705,4706,4707,4708,4709,4710,4711,4712,4713,4714,4715,4716,4717,4718,4719,4720,4721,4722,4723,4724,4725,4726,4727,4728,4729,4730,4731,4732,4733,4734,4735,4736,4737,4738,4739,4740,4741,4742,4743,4744,4746,4747,4748,4749,4752,4753,4754,4755,4756,4757,4758,4759,4760,4761,4762,4763,4764,4765,4766,4767,4768,4769,4770,4771,4772,4773,4774,4775,4776,4777,4778,4779,4780,4781,4782,4783,4784,4786,4787,4788,4789,4792,4793,4794,4795,4796,4797,4798,4800,4802,4803,4804,4805,4808,4809,4810,4811,4812,4813,4814,4815,4816,4817,4818,4819,4820,4821,4822,4824,4825,4826,4827,4828,4829,4830,4831,4832,4833,4834,4835,4836,4837,4838,4839,4840,4841,4842,4843,4844,4845,4846,4847,4848,4849,4850,4851,4852,4853,4854,4855,4856,4857,4858,4859,4860,4861,4862,4863,4864,4865,4866,4867,4868,4869,4870,4871,4872,4873,4874,4875,4876,4877,4878,4879,4880,4882,4883,4884,4885,4888,4889,4890,4891,4892,4893,4894,4895,4896,4897,4898,4899,4900,4901,4902,4903,4904,4905,4906,4907,4908,4909,4910,4911,4912,4913,4914,4915,4916,4917,4918,4919,4920,4921,4922,4923,4924,4925,4926,4927,4928,4929,4930,4931,4932,4933,4934,4935,4936,4937,4938,4939,4940,4941,4942,4943,4944,4945,4946,4947,4948,4949,4950,4951,4952,4953,4954,4992,4993,4994,4995,4996,4997,4998,4999,5000,5001,5002,5003,5004,5005,5006,5007,5024,5025,5026,5027,5028,5029,5030,5031,5032,5033,5034,5035,5036,5037,5038,5039,5040,5041,5042,5043,5044,5045,5046,5047,5048,5049,5050,5051,5052,5053,5054,5055,5056,5057,5058,5059,5060,5061,5062,5063,5064,5065,5066,5067,5068,5069,5070,5071,5072,5073,5074,5075,5076,5077,5078,5079,5080,5081,5082,5083,5084,5085,5086,5087,5088,5089,5090,5091,5092,5093,5094,5095,5096,5097,5098,5099,5100,5101,5102,5103,5104,5105,5106,5107,5108,5121,5122,5123,5124,5125,5126,5127,5128,5129,5130,5131,5132,5133,5134,5135,5136,5137,5138,5139,5140,5141,5142,5143,5144,5145,5146,5147,5148,5149,5150,5151,5152,5153,5154,5155,5156,5157,5158,5159,5160,5161,5162,5163,5164,5165,5166,5167,5168,5169,5170,5171,5172,5173,5174,5175,5176,5177,5178,5179,5180,5181,5182,5183,5184,5185,5186,5187,5188,5189,5190,5191,5192,5193,5194,5195,5196,5197,5198,5199,5200,5201,5202,5203,5204,5205,5206,5207,5208,5209,5210,5211,5212,5213,5214,5215,5216,5217,5218,5219,5220,5221,5222,5223,5224,5225,5226,5227,5228,5229,5230,5231,5232,5233,5234,5235,5236,5237,5238,5239,5240,5241,5242,5243,5244,5245,5246,5247,5248,5249,5250,5251,5252,5253,5254,5255,5256,5257,5258,5259,5260,5261,5262,5263,5264,5265,5266,5267,5268,5269,5270,5271,5272,5273,5274,5275,5276,5277,5278,5279,5280,5281,5282,5283,5284,5285,5286,5287,5288,5289,5290,5291,5292,5293,5294,5295,5296,5297,5298,5299,5300,5301,5302,5303,5304,5305,5306,5307,5308,5309,5310,5311,5312,5313,5314,5315,5316,5317,5318,5319,5320,5321,5322,5323,5324,5325,5326,5327,5328,5329,5330,5331,5332,5333,5334,5335,5336,5337,5338,5339,5340,5341,5342,5343,5344,5345,5346,5347,5348,5349,5350,5351,5352,5353,5354,5355,5356,5357,5358,5359,5360,5361,5362,5363,5364,5365,5366,5367,5368,5369,5370,5371,5372,5373,5374,5375,5376,5377,5378,5379,5380,5381,5382,5383,5384,5385,5386,5387,5388,5389,5390,5391,5392,5393,5394,5395,5396,5397,5398,5399,5400,5401,5402,5403,5404,5405,5406,5407,5408,5409,5410,5411,5412,5413,5414,5415,5416,5417,5418,5419,5420,5421,5422,5423,5424,5425,5426,5427,5428,5429,5430,5431,5432,5433,5434,5435,5436,5437,5438,5439,5440,5441,5442,5443,5444,5445,5446,5447,5448,5449,5450,5451,5452,5453,5454,5455,5456,5457,5458,5459,5460,5461,5462,5463,5464,5465,5466,5467,5468,5469,5470,5471,5472,5473,5474,5475,5476,5477,5478,5479,5480,5481,5482,5483,5484,5485,5486,5487,5488,5489,5490,5491,5492,5493,5494,5495,5496,5497,5498,5499,5500,5501,5502,5503,5504,5505,5506,5507,5508,5509,5510,5511,5512,5513,5514,5515,5516,5517,5518,5519,5520,5521,5522,5523,5524,5525,5526,5527,5528,5529,5530,5531,5532,5533,5534,5535,5536,5537,5538,5539,5540,5541,5542,5543,5544,5545,5546,5547,5548,5549,5550,5551,5552,5553,5554,5555,5556,5557,5558,5559,5560,5561,5562,5563,5564,5565,5566,5567,5568,5569,5570,5571,5572,5573,5574,5575,5576,5577,5578,5579,5580,5581,5582,5583,5584,5585,5586,5587,5588,5589,5590,5591,5592,5593,5594,5595,5596,5597,5598,5599,5600,5601,5602,5603,5604,5605,5606,5607,5608,5609,5610,5611,5612,5613,5614,5615,5616,5617,5618,5619,5620,5621,5622,5623,5624,5625,5626,5627,5628,5629,5630,5631,5632,5633,5634,5635,5636,5637,5638,5639,5640,5641,5642,5643,5644,5645,5646,5647,5648,5649,5650,5651,5652,5653,5654,5655,5656,5657,5658,5659,5660,5661,5662,5663,5664,5665,5666,5667,5668,5669,5670,5671,5672,5673,5674,5675,5676,5677,5678,5679,5680,5681,5682,5683,5684,5685,5686,5687,5688,5689,5690,5691,5692,5693,5694,5695,5696,5697,5698,5699,5700,5701,5702,5703,5704,5705,5706,5707,5708,5709,5710,5711,5712,5713,5714,5715,5716,5717,5718,5719,5720,5721,5722,5723,5724,5725,5726,5727,5728,5729,5730,5731,5732,5733,5734,5735,5736,5737,5738,5739,5740,5743,5744,5745,5746,5747,5748,5749,5750,5751,5752,5753,5754,5755,5756,5757,5758,5759,5761,5762,5763,5764,5765,5766,5767,5768,5769,5770,5771,5772,5773,5774,5775,5776,5777,5778,5779,5780,5781,5782,5783,5784,5785,5786,5792,5793,5794,5795,5796,5797,5798,5799,5800,5801,5802,5803,5804,5805,5806,5807,5808,5809,5810,5811,5812,5813,5814,5815,5816,5817,5818,5819,5820,5821,5822,5823,5824,5825,5826,5827,5828,5829,5830,5831,5832,5833,5834,5835,5836,5837,5838,5839,5840,5841,5842,5843,5844,5845,5846,5847,5848,5849,5850,5851,5852,5853,5854,5855,5856,5857,5858,5859,5860,5861,5862,5863,5864,5865,5866,5870,5871,5872,5888,5889,5890,5891,5892,5893,5894,5895,5896,5897,5898,5899,5900,5902,5903,5904,5905,5920,5921,5922,5923,5924,5925,5926,5927,5928,5929,5930,5931,5932,5933,5934,5935,5936,5937,5952,5953,5954,5955,5956,5957,5958,5959,5960,5961,5962,5963,5964,5965,5966,5967,5968,5969,5984,5985,5986,5987,5988,5989,5990,5991,5992,5993,5994,5995,5996,5998,5999,6000,6016,6017,6018,6019,6020,6021,6022,6023,6024,6025,6026,6027,6028,6029,6030,6031,6032,6033,6034,6035,6036,6037,6038,6039,6040,6041,6042,6043,6044,6045,6046,6047,6048,6049,6050,6051,6052,6053,6054,6055,6056,6057,6058,6059,6060,6061,6062,6063,6064,6065,6066,6067,6103,6108,6176,6177,6178,6179,6180,6181,6182,6183,6184,6185,6186,6187,6188,6189,6190,6191,6192,6193,6194,6195,6196,6197,6198,6199,6200,6201,6202,6203,6204,6205,6206,6207,6208,6209,6210,6211,6212,6213,6214,6215,6216,6217,6218,6219,6220,6221,6222,6223,6224,6225,6226,6227,6228,6229,6230,6231,6232,6233,6234,6235,6236,6237,6238,6239,6240,6241,6242,6243,6244,6245,6246,6247,6248,6249,6250,6251,6252,6253,6254,6255,6256,6257,6258,6259,6260,6261,6262,6263,6272,6273,6274,6275,6276,6277,6278,6279,6280,6281,6282,6283,6284,6285,6286,6287,6288,6289,6290,6291,6292,6293,6294,6295,6296,6297,6298,6299,6300,6301,6302,6303,6304,6305,6306,6307,6308,6309,6310,6311,6312,6314,6320,6321,6322,6323,6324,6325,6326,6327,6328,6329,6330,6331,6332,6333,6334,6335,6336,6337,6338,6339,6340,6341,6342,6343,6344,6345,6346,6347,6348,6349,6350,6351,6352,6353,6354,6355,6356,6357,6358,6359,6360,6361,6362,6363,6364,6365,6366,6367,6368,6369,6370,6371,6372,6373,6374,6375,6376,6377,6378,6379,6380,6381,6382,6383,6384,6385,6386,6387,6388,6389,6400,6401,6402,6403,6404,6405,6406,6407,6408,6409,6410,6411,6412,6413,6414,6415,6416,6417,6418,6419,6420,6421,6422,6423,6424,6425,6426,6427,6428,6480,6481,6482,6483,6484,6485,6486,6487,6488,6489,6490,6491,6492,6493,6494,6495,6496,6497,6498,6499,6500,6501,6502,6503,6504,6505,6506,6507,6508,6509,6512,6513,6514,6515,6516,6528,6529,6530,6531,6532,6533,6534,6535,6536,6537,6538,6539,6540,6541,6542,6543,6544,6545,6546,6547,6548,6549,6550,6551,6552,6553,6554,6555,6556,6557,6558,6559,6560,6561,6562,6563,6564,6565,6566,6567,6568,6569,6570,6571,6593,6594,6595,6596,6597,6598,6599,6656,6657,6658,6659,6660,6661,6662,6663,6664,6665,6666,6667,6668,6669,6670,6671,6672,6673,6674,6675,6676,6677,6678,6688,6689,6690,6691,6692,6693,6694,6695,6696,6697,6698,6699,6700,6701,6702,6703,6704,6705,6706,6707,6708,6709,6710,6711,6712,6713,6714,6715,6716,6717,6718,6719,6720,6721,6722,6723,6724,6725,6726,6727,6728,6729,6730,6731,6732,6733,6734,6735,6736,6737,6738,6739,6740,6823,6917,6918,6919,6920,6921,6922,6923,6924,6925,6926,6927,6928,6929,6930,6931,6932,6933,6934,6935,6936,6937,6938,6939,6940,6941,6942,6943,6944,6945,6946,6947,6948,6949,6950,6951,6952,6953,6954,6955,6956,6957,6958,6959,6960,6961,6962,6963,6981,6982,6983,6984,6985,6986,6987,7043,7044,7045,7046,7047,7048,7049,7050,7051,7052,7053,7054,7055,7056,7057,7058,7059,7060,7061,7062,7063,7064,7065,7066,7067,7068,7069,7070,7071,7072,7086,7087,7098,7099,7100,7101,7102,7103,7104,7105,7106,7107,7108,7109,7110,7111,7112,7113,7114,7115,7116,7117,7118,7119,7120,7121,7122,7123,7124,7125,7126,7127,7128,7129,7130,7131,7132,7133,7134,7135,7136,7137,7138,7139,7140,7141,7168,7169,7170,7171,7172,7173,7174,7175,7176,7177,7178,7179,7180,7181,7182,7183,7184,7185,7186,7187,7188,7189,7190,7191,7192,7193,7194,7195,7196,7197,7198,7199,7200,7201,7202,7203,7245,7246,7247,7258,7259,7260,7261,7262,7263,7264,7265,7266,7267,7268,7269,7270,7271,7272,7273,7274,7275,7276,7277,7278,7279,7280,7281,7282,7283,7284,7285,7286,7287,7288,7289,7290,7291,7292,7293,7401,7402,7403,7404,7406,7407,7408,7409,7413,7414,7424,7425,7426,7427,7428,7429,7430,7431,7432,7433,7434,7435,7436,7437,7438,7439,7440,7441,7442,7443,7444,7445,7446,7447,7448,7449,7450,7451,7452,7453,7454,7455,7456,7457,7458,7459,7460,7461,7462,7463,7464,7465,7466,7467,7468,7469,7470,7471,7472,7473,7474,7475,7476,7477,7478,7479,7480,7481,7482,7483,7484,7485,7486,7487,7488,7489,7490,7491,7492,7493,7494,7495,7496,7497,7498,7499,7500,7501,7502,7503,7504,7505,7506,7507,7508,7509,7510,7511,7512,7513,7514,7515,7516,7517,7518,7519,7520,7521,7522,7523,7524,7525,7526,7527,7528,7529,7530,7531,7532,7533,7534,7535,7536,7537,7538,7539,7540,7541,7542,7543,7544,7545,7546,7547,7548,7549,7550,7551,7552,7553,7554,7555,7556,7557,7558,7559,7560,7561,7562,7563,7564,7565,7566,7567,7568,7569,7570,7571,7572,7573,7574,7575,7576,7577,7578,7579,7580,7581,7582,7583,7584,7585,7586,7587,7588,7589,7590,7591,7592,7593,7594,7595,7596,7597,7598,7599,7600,7601,7602,7603,7604,7605,7606,7607,7608,7609,7610,7611,7612,7613,7614,7615,7680,7681,7682,7683,7684,7685,7686,7687,7688,7689,7690,7691,7692,7693,7694,7695,7696,7697,7698,7699,7700,7701,7702,7703,7704,7705,7706,7707,7708,7709,7710,7711,7712,7713,7714,7715,7716,7717,7718,7719,7720,7721,7722,7723,7724,7725,7726,7727,7728,7729,7730,7731,7732,7733,7734,7735,7736,7737,7738,7739,7740,7741,7742,7743,7744,7745,7746,7747,7748,7749,7750,7751,7752,7753,7754,7755,7756,7757,7758,7759,7760,7761,7762,7763,7764,7765,7766,7767,7768,7769,7770,7771,7772,7773,7774,7775,7776,7777,7778,7779,7780,7781,7782,7783,7784,7785,7786,7787,7788,7789,7790,7791,7792,7793,7794,7795,7796,7797,7798,7799,7800,7801,7802,7803,7804,7805,7806,7807,7808,7809,7810,7811,7812,7813,7814,7815,7816,7817,7818,7819,7820,7821,7822,7823,7824,7825,7826,7827,7828,7829,7830,7831,7832,7833,7834,7835,7836,7837,7838,7839,7840,7841,7842,7843,7844,7845,7846,7847,7848,7849,7850,7851,7852,7853,7854,7855,7856,7857,7858,7859,7860,7861,7862,7863,7864,7865,7866,7867,7868,7869,7870,7871,7872,7873,7874,7875,7876,7877,7878,7879,7880,7881,7882,7883,7884,7885,7886,7887,7888,7889,7890,7891,7892,7893,7894,7895,7896,7897,7898,7899,7900,7901,7902,7903,7904,7905,7906,7907,7908,7909,7910,7911,7912,7913,7914,7915,7916,7917,7918,7919,7920,7921,7922,7923,7924,7925,7926,7927,7928,7929,7930,7931,7932,7933,7934,7935,7936,7937,7938,7939,7940,7941,7942,7943,7944,7945,7946,7947,7948,7949,7950,7951,7952,7953,7954,7955,7956,7957,7960,7961,7962,7963,7964,7965,7968,7969,7970,7971,7972,7973,7974,7975,7976,7977,7978,7979,7980,7981,7982,7983,7984,7985,7986,7987,7988,7989,7990,7991,7992,7993,7994,7995,7996,7997,7998,7999,8000,8001,8002,8003,8004,8005,8008,8009,8010,8011,8012,8013,8016,8017,8018,8019,8020,8021,8022,8023,8025,8027,8029,8031,8032,8033,8034,8035,8036,8037,8038,8039,8040,8041,8042,8043,8044,8045,8046,8047,8048,8049,8050,8051,8052,8053,8054,8055,8056,8057,8058,8059,8060,8061,8064,8065,8066,8067,8068,8069,8070,8071,8072,8073,8074,8075,8076,8077,8078,8079,8080,8081,8082,8083,8084,8085,8086,8087,8088,8089,8090,8091,8092,8093,8094,8095,8096,8097,8098,8099,8100,8101,8102,8103,8104,8105,8106,8107,8108,8109,8110,8111,8112,8113,8114,8115,8116,8118,8119,8120,8121,8122,8123,8124,8126,8130,8131,8132,8134,8135,8136,8137,8138,8139,8140,8144,8145,8146,8147,8150,8151,8152,8153,8154,8155,8160,8161,8162,8163,8164,8165,8166,8167,8168,8169,8170,8171,8172,8178,8179,8180,8182,8183,8184,8185,8186,8187,8188,8305,8319,8336,8337,8338,8339,8340,8341,8342,8343,8344,8345,8346,8347,8348,8450,8455,8458,8459,8460,8461,8462,8463,8464,8465,8466,8467,8469,8473,8474,8475,8476,8477,8484,8486,8488,8490,8491,8492,8493,8495,8496,8497,8498,8499,8500,8501,8502,8503,8504,8505,8508,8509,8510,8511,8517,8518,8519,8520,8521,8526,8544,8545,8546,8547,8548,8549,8550,8551,8552,8553,8554,8555,8556,8557,8558,8559,8560,8561,8562,8563,8564,8565,8566,8567,8568,8569,8570,8571,8572,8573,8574,8575,8576,8577,8578,8579,8580,8581,8582,8583,8584,11264,11265,11266,11267,11268,11269,11270,11271,11272,11273,11274,11275,11276,11277,11278,11279,11280,11281,11282,11283,11284,11285,11286,11287,11288,11289,11290,11291,11292,11293,11294,11295,11296,11297,11298,11299,11300,11301,11302,11303,11304,11305,11306,11307,11308,11309,11310,11312,11313,11314,11315,11316,11317,11318,11319,11320,11321,11322,11323,11324,11325,11326,11327,11328,11329,11330,11331,11332,11333,11334,11335,11336,11337,11338,11339,11340,11341,11342,11343,11344,11345,11346,11347,11348,11349,11350,11351,11352,11353,11354,11355,11356,11357,11358,11360,11361,11362,11363,11364,11365,11366,11367,11368,11369,11370,11371,11372,11373,11374,11375,11376,11377,11378,11379,11380,11381,11382,11383,11384,11385,11386,11387,11388,11389,11390,11391,11392,11393,11394,11395,11396,11397,11398,11399,11400,11401,11402,11403,11404,11405,11406,11407,11408,11409,11410,11411,11412,11413,11414,11415,11416,11417,11418,11419,11420,11421,11422,11423,11424,11425,11426,11427,11428,11429,11430,11431,11432,11433,11434,11435,11436,11437,11438,11439,11440,11441,11442,11443,11444,11445,11446,11447,11448,11449,11450,11451,11452,11453,11454,11455,11456,11457,11458,11459,11460,11461,11462,11463,11464,11465,11466,11467,11468,11469,11470,11471,11472,11473,11474,11475,11476,11477,11478,11479,11480,11481,11482,11483,11484,11485,11486,11487,11488,11489,11490,11491,11492,11499,11500,11501,11502,11506,11507,11520,11521,11522,11523,11524,11525,11526,11527,11528,11529,11530,11531,11532,11533,11534,11535,11536,11537,11538,11539,11540,11541,11542,11543,11544,11545,11546,11547,11548,11549,11550,11551,11552,11553,11554,11555,11556,11557,11559,11565,11568,11569,11570,11571,11572,11573,11574,11575,11576,11577,11578,11579,11580,11581,11582,11583,11584,11585,11586,11587,11588,11589,11590,11591,11592,11593,11594,11595,11596,11597,11598,11599,11600,11601,11602,11603,11604,11605,11606,11607,11608,11609,11610,11611,11612,11613,11614,11615,11616,11617,11618,11619,11620,11621,11622,11623,11631,11648,11649,11650,11651,11652,11653,11654,11655,11656,11657,11658,11659,11660,11661,11662,11663,11664,11665,11666,11667,11668,11669,11670,11680,11681,11682,11683,11684,11685,11686,11688,11689,11690,11691,11692,11693,11694,11696,11697,11698,11699,11700,11701,11702,11704,11705,11706,11707,11708,11709,11710,11712,11713,11714,11715,11716,11717,11718,11720,11721,11722,11723,11724,11725,11726,11728,11729,11730,11731,11732,11733,11734,11736,11737,11738,11739,11740,11741,11742,11823,12293,12294,12295,12321,12322,12323,12324,12325,12326,12327,12328,12329,12337,12338,12339,12340,12341,12344,12345,12346,12347,12348,12353,12354,12355,12356,12357,12358,12359,12360,12361,12362,12363,12364,12365,12366,12367,12368,12369,12370,12371,12372,12373,12374,12375,12376,12377,12378,12379,12380,12381,12382,12383,12384,12385,12386,12387,12388,12389,12390,12391,12392,12393,12394,12395,12396,12397,12398,12399,12400,12401,12402,12403,12404,12405,12406,12407,12408,12409,12410,12411,12412,12413,12414,12415,12416,12417,12418,12419,12420,12421,12422,12423,12424,12425,12426,12427,12428,12429,12430,12431,12432,12433,12434,12435,12436,12437,12438,12445,12446,12447,12449,12450,12451,12452,12453,12454,12455,12456,12457,12458,12459,12460,12461,12462,12463,12464,12465,12466,12467,12468,12469,12470,12471,12472,12473,12474,12475,12476,12477,12478,12479,12480,12481,12482,12483,12484,12485,12486,12487,12488,12489,12490,12491,12492,12493,12494,12495,12496,12497,12498,12499,12500,12501,12502,12503,12504,12505,12506,12507,12508,12509,12510,12511,12512,12513,12514,12515,12516,12517,12518,12519,12520,12521,12522,12523,12524,12525,12526,12527,12528,12529,12530,12531,12532,12533,12534,12535,12536,12537,12538,12540,12541,12542,12543,12549,12550,12551,12552,12553,12554,12555,12556,12557,12558,12559,12560,12561,12562,12563,12564,12565,12566,12567,12568,12569,12570,12571,12572,12573,12574,12575,12576,12577,12578,12579,12580,12581,12582,12583,12584,12585,12586,12587,12588,12589,12593,12594,12595,12596,12597,12598,12599,12600,12601,12602,12603,12604,12605,12606,12607,12608,12609,12610,12611,12612,12613,12614,12615,12616,12617,12618,12619,12620,12621,12622,12623,12624,12625,12626,12627,12628,12629,12630,12631,12632,12633,12634,12635,12636,12637,12638,12639,12640,12641,12642,12643,12644,12645,12646,12647,12648,12649,12650,12651,12652,12653,12654,12655,12656,12657,12658,12659,12660,12661,12662,12663,12664,12665,12666,12667,12668,12669,12670,12671,12672,12673,12674,12675,12676,12677,12678,12679,12680,12681,12682,12683,12684,12685,12686,12704,12705,12706,12707,12708,12709,12710,12711,12712,12713,12714,12715,12716,12717,12718,12719,12720,12721,12722,12723,12724,12725,12726,12727,12728,12729,12730,12784,12785,12786,12787,12788,12789,12790,12791,12792,12793,12794,12795,12796,12797,12798,12799,13312,13313,13314,13315,13316,13317,13318,13319,13320,13321,13322,13323,13324,13325,13326,13327,13328,13329,13330,13331,13332,13333,13334,13335,13336,13337,13338,13339,13340,13341,13342,13343,13344,13345,13346,13347,13348,13349,13350,13351,13352,13353,13354,13355,13356,13357,13358,13359,13360,13361,13362,13363,13364,13365,13366,13367,13368,13369,13370,13371,13372,13373,13374,13375,13376,13377,13378,13379,13380,13381,13382,13383,13384,13385,13386,13387,13388,13389,13390,13391,13392,13393,13394,13395,13396,13397,13398,13399,13400,13401,13402,13403,13404,13405,13406,13407,13408,13409,13410,13411,13412,13413,13414,13415,13416,13417,13418,13419,13420,13421,13422,13423,13424,13425,13426,13427,13428,13429,13430,13431,13432,13433,13434,13435,13436,13437,13438,13439,13440,13441,13442,13443,13444,13445,13446,13447,13448,13449,13450,13451,13452,13453,13454,13455,13456,13457,13458,13459,13460,13461,13462,13463,13464,13465,13466,13467,13468,13469,13470,13471,13472,13473,13474,13475,13476,13477,13478,13479,13480,13481,13482,13483,13484,13485,13486,13487,13488,13489,13490,13491,13492,13493,13494,13495,13496,13497,13498,13499,13500,13501,13502,13503,13504,13505,13506,13507,13508,13509,13510,13511,13512,13513,13514,13515,13516,13517,13518,13519,13520,13521,13522,13523,13524,13525,13526,13527,13528,13529,13530,13531,13532,13533,13534,13535,13536,13537,13538,13539,13540,13541,13542,13543,13544,13545,13546,13547,13548,13549,13550,13551,13552,13553,13554,13555,13556,13557,13558,13559,13560,13561,13562,13563,13564,13565,13566,13567,13568,13569,13570,13571,13572,13573,13574,13575,13576,13577,13578,13579,13580,13581,13582,13583,13584,13585,13586,13587,13588,13589,13590,13591,13592,13593,13594,13595,13596,13597,13598,13599,13600,13601,13602,13603,13604,13605,13606,13607,13608,13609,13610,13611,13612,13613,13614,13615,13616,13617,13618,13619,13620,13621,13622,13623,13624,13625,13626,13627,13628,13629,13630,13631,13632,13633,13634,13635,13636,13637,13638,13639,13640,13641,13642,13643,13644,13645,13646,13647,13648,13649,13650,13651,13652,13653,13654,13655,13656,13657,13658,13659,13660,13661,13662,13663,13664,13665,13666,13667,13668,13669,13670,13671,13672,13673,13674,13675,13676,13677,13678,13679,13680,13681,13682,13683,13684,13685,13686,13687,13688,13689,13690,13691,13692,13693,13694,13695,13696,13697,13698,13699,13700,13701,13702,13703,13704,13705,13706,13707,13708,13709,13710,13711,13712,13713,13714,13715,13716,13717,13718,13719,13720,13721,13722,13723,13724,13725,13726,13727,13728,13729,13730,13731,13732,13733,13734,13735,13736,13737,13738,13739,13740,13741,13742,13743,13744,13745,13746,13747,13748,13749,13750,13751,13752,13753,13754,13755,13756,13757,13758,13759,13760,13761,13762,13763,13764,13765,13766,13767,13768,13769,13770,13771,13772,13773,13774,13775,13776,13777,13778,13779,13780,13781,13782,13783,13784,13785,13786,13787,13788,13789,13790,13791,13792,13793,13794,13795,13796,13797,13798,13799,13800,13801,13802,13803,13804,13805,13806,13807,13808,13809,13810,13811,13812,13813,13814,13815,13816,13817,13818,13819,13820,13821,13822,13823,13824,13825,13826,13827,13828,13829,13830,13831,13832,13833,13834,13835,13836,13837,13838,13839,13840,13841,13842,13843,13844,13845,13846,13847,13848,13849,13850,13851,13852,13853,13854,13855,13856,13857,13858,13859,13860,13861,13862,13863,13864,13865,13866,13867,13868,13869,13870,13871,13872,13873,13874,13875,13876,13877,13878,13879,13880,13881,13882,13883,13884,13885,13886,13887,13888,13889,13890,13891,13892,13893,13894,13895,13896,13897,13898,13899,13900,13901,13902,13903,13904,13905,13906,13907,13908,13909,13910,13911,13912,13913,13914,13915,13916,13917,13918,13919,13920,13921,13922,13923,13924,13925,13926,13927,13928,13929,13930,13931,13932,13933,13934,13935,13936,13937,13938,13939,13940,13941,13942,13943,13944,13945,13946,13947,13948,13949,13950,13951,13952,13953,13954,13955,13956,13957,13958,13959,13960,13961,13962,13963,13964,13965,13966,13967,13968,13969,13970,13971,13972,13973,13974,13975,13976,13977,13978,13979,13980,13981,13982,13983,13984,13985,13986,13987,13988,13989,13990,13991,13992,13993,13994,13995,13996,13997,13998,13999,14000,14001,14002,14003,14004,14005,14006,14007,14008,14009,14010,14011,14012,14013,14014,14015,14016,14017,14018,14019,14020,14021,14022,14023,14024,14025,14026,14027,14028,14029,14030,14031,14032,14033,14034,14035,14036,14037,14038,14039,14040,14041,14042,14043,14044,14045,14046,14047,14048,14049,14050,14051,14052,14053,14054,14055,14056,14057,14058,14059,14060,14061,14062,14063,14064,14065,14066,14067,14068,14069,14070,14071,14072,14073,14074,14075,14076,14077,14078,14079,14080,14081,14082,14083,14084,14085,14086,14087,14088,14089,14090,14091,14092,14093,14094,14095,14096,14097,14098,14099,14100,14101,14102,14103,14104,14105,14106,14107,14108,14109,14110,14111,14112,14113,14114,14115,14116,14117,14118,14119,14120,14121,14122,14123,14124,14125,14126,14127,14128,14129,14130,14131,14132,14133,14134,14135,14136,14137,14138,14139,14140,14141,14142,14143,14144,14145,14146,14147,14148,14149,14150,14151,14152,14153,14154,14155,14156,14157,14158,14159,14160,14161,14162,14163,14164,14165,14166,14167,14168,14169,14170,14171,14172,14173,14174,14175,14176,14177,14178,14179,14180,14181,14182,14183,14184,14185,14186,14187,14188,14189,14190,14191,14192,14193,14194,14195,14196,14197,14198,14199,14200,14201,14202,14203,14204,14205,14206,14207,14208,14209,14210,14211,14212,14213,14214,14215,14216,14217,14218,14219,14220,14221,14222,14223,14224,14225,14226,14227,14228,14229,14230,14231,14232,14233,14234,14235,14236,14237,14238,14239,14240,14241,14242,14243,14244,14245,14246,14247,14248,14249,14250,14251,14252,14253,14254,14255,14256,14257,14258,14259,14260,14261,14262,14263,14264,14265,14266,14267,14268,14269,14270,14271,14272,14273,14274,14275,14276,14277,14278,14279,14280,14281,14282,14283,14284,14285,14286,14287,14288,14289,14290,14291,14292,14293,14294,14295,14296,14297,14298,14299,14300,14301,14302,14303,14304,14305,14306,14307,14308,14309,14310,14311,14312,14313,14314,14315,14316,14317,14318,14319,14320,14321,14322,14323,14324,14325,14326,14327,14328,14329,14330,14331,14332,14333,14334,14335,14336,14337,14338,14339,14340,14341,14342,14343,14344,14345,14346,14347,14348,14349,14350,14351,14352,14353,14354,14355,14356,14357,14358,14359,14360,14361,14362,14363,14364,14365,14366,14367,14368,14369,14370,14371,14372,14373,14374,14375,14376,14377,14378,14379,14380,14381,14382,14383,14384,14385,14386,14387,14388,14389,14390,14391,14392,14393,14394,14395,14396,14397,14398,14399,14400,14401,14402,14403,14404,14405,14406,14407,14408,14409,14410,14411,14412,14413,14414,14415,14416,14417,14418,14419,14420,14421,14422,14423,14424,14425,14426,14427,14428,14429,14430,14431,14432,14433,14434,14435,14436,14437,14438,14439,14440,14441,14442,14443,14444,14445,14446,14447,14448,14449,14450,14451,14452,14453,14454,14455,14456,14457,14458,14459,14460,14461,14462,14463,14464,14465,14466,14467,14468,14469,14470,14471,14472,14473,14474,14475,14476,14477,14478,14479,14480,14481,14482,14483,14484,14485,14486,14487,14488,14489,14490,14491,14492,14493,14494,14495,14496,14497,14498,14499,14500,14501,14502,14503,14504,14505,14506,14507,14508,14509,14510,14511,14512,14513,14514,14515,14516,14517,14518,14519,14520,14521,14522,14523,14524,14525,14526,14527,14528,14529,14530,14531,14532,14533,14534,14535,14536,14537,14538,14539,14540,14541,14542,14543,14544,14545,14546,14547,14548,14549,14550,14551,14552,14553,14554,14555,14556,14557,14558,14559,14560,14561,14562,14563,14564,14565,14566,14567,14568,14569,14570,14571,14572,14573,14574,14575,14576,14577,14578,14579,14580,14581,14582,14583,14584,14585,14586,14587,14588,14589,14590,14591,14592,14593,14594,14595,14596,14597,14598,14599,14600,14601,14602,14603,14604,14605,14606,14607,14608,14609,14610,14611,14612,14613,14614,14615,14616,14617,14618,14619,14620,14621,14622,14623,14624,14625,14626,14627,14628,14629,14630,14631,14632,14633,14634,14635,14636,14637,14638,14639,14640,14641,14642,14643,14644,14645,14646,14647,14648,14649,14650,14651,14652,14653,14654,14655,14656,14657,14658,14659,14660,14661,14662,14663,14664,14665,14666,14667,14668,14669,14670,14671,14672,14673,14674,14675,14676,14677,14678,14679,14680,14681,14682,14683,14684,14685,14686,14687,14688,14689,14690,14691,14692,14693,14694,14695,14696,14697,14698,14699,14700,14701,14702,14703,14704,14705,14706,14707,14708,14709,14710,14711,14712,14713,14714,14715,14716,14717,14718,14719,14720,14721,14722,14723,14724,14725,14726,14727,14728,14729,14730,14731,14732,14733,14734,14735,14736,14737,14738,14739,14740,14741,14742,14743,14744,14745,14746,14747,14748,14749,14750,14751,14752,14753,14754,14755,14756,14757,14758,14759,14760,14761,14762,14763,14764,14765,14766,14767,14768,14769,14770,14771,14772,14773,14774,14775,14776,14777,14778,14779,14780,14781,14782,14783,14784,14785,14786,14787,14788,14789,14790,14791,14792,14793,14794,14795,14796,14797,14798,14799,14800,14801,14802,14803,14804,14805,14806,14807,14808,14809,14810,14811,14812,14813,14814,14815,14816,14817,14818,14819,14820,14821,14822,14823,14824,14825,14826,14827,14828,14829,14830,14831,14832,14833,14834,14835,14836,14837,14838,14839,14840,14841,14842,14843,14844,14845,14846,14847,14848,14849,14850,14851,14852,14853,14854,14855,14856,14857,14858,14859,14860,14861,14862,14863,14864,14865,14866,14867,14868,14869,14870,14871,14872,14873,14874,14875,14876,14877,14878,14879,14880,14881,14882,14883,14884,14885,14886,14887,14888,14889,14890,14891,14892,14893,14894,14895,14896,14897,14898,14899,14900,14901,14902,14903,14904,14905,14906,14907,14908,14909,14910,14911,14912,14913,14914,14915,14916,14917,14918,14919,14920,14921,14922,14923,14924,14925,14926,14927,14928,14929,14930,14931,14932,14933,14934,14935,14936,14937,14938,14939,14940,14941,14942,14943,14944,14945,14946,14947,14948,14949,14950,14951,14952,14953,14954,14955,14956,14957,14958,14959,14960,14961,14962,14963,14964,14965,14966,14967,14968,14969,14970,14971,14972,14973,14974,14975,14976,14977,14978,14979,14980,14981,14982,14983,14984,14985,14986,14987,14988,14989,14990,14991,14992,14993,14994,14995,14996,14997,14998,14999,15000,15001,15002,15003,15004,15005,15006,15007,15008,15009,15010,15011,15012,15013,15014,15015,15016,15017,15018,15019,15020,15021,15022,15023,15024,15025,15026,15027,15028,15029,15030,15031,15032,15033,15034,15035,15036,15037,15038,15039,15040,15041,15042,15043,15044,15045,15046,15047,15048,15049,15050,15051,15052,15053,15054,15055,15056,15057,15058,15059,15060,15061,15062,15063,15064,15065,15066,15067,15068,15069,15070,15071,15072,15073,15074,15075,15076,15077,15078,15079,15080,15081,15082,15083,15084,15085,15086,15087,15088,15089,15090,15091,15092,15093,15094,15095,15096,15097,15098,15099,15100,15101,15102,15103,15104,15105,15106,15107,15108,15109,15110,15111,15112,15113,15114,15115,15116,15117,15118,15119,15120,15121,15122,15123,15124,15125,15126,15127,15128,15129,15130,15131,15132,15133,15134,15135,15136,15137,15138,15139,15140,15141,15142,15143,15144,15145,15146,15147,15148,15149,15150,15151,15152,15153,15154,15155,15156,15157,15158,15159,15160,15161,15162,15163,15164,15165,15166,15167,15168,15169,15170,15171,15172,15173,15174,15175,15176,15177,15178,15179,15180,15181,15182,15183,15184,15185,15186,15187,15188,15189,15190,15191,15192,15193,15194,15195,15196,15197,15198,15199,15200,15201,15202,15203,15204,15205,15206,15207,15208,15209,15210,15211,15212,15213,15214,15215,15216,15217,15218,15219,15220,15221,15222,15223,15224,15225,15226,15227,15228,15229,15230,15231,15232,15233,15234,15235,15236,15237,15238,15239,15240,15241,15242,15243,15244,15245,15246,15247,15248,15249,15250,15251,15252,15253,15254,15255,15256,15257,15258,15259,15260,15261,15262,15263,15264,15265,15266,15267,15268,15269,15270,15271,15272,15273,15274,15275,15276,15277,15278,15279,15280,15281,15282,15283,15284,15285,15286,15287,15288,15289,15290,15291,15292,15293,15294,15295,15296,15297,15298,15299,15300,15301,15302,15303,15304,15305,15306,15307,15308,15309,15310,15311,15312,15313,15314,15315,15316,15317,15318,15319,15320,15321,15322,15323,15324,15325,15326,15327,15328,15329,15330,15331,15332,15333,15334,15335,15336,15337,15338,15339,15340,15341,15342,15343,15344,15345,15346,15347,15348,15349,15350,15351,15352,15353,15354,15355,15356,15357,15358,15359,15360,15361,15362,15363,15364,15365,15366,15367,15368,15369,15370,15371,15372,15373,15374,15375,15376,15377,15378,15379,15380,15381,15382,15383,15384,15385,15386,15387,15388,15389,15390,15391,15392,15393,15394,15395,15396,15397,15398,15399,15400,15401,15402,15403,15404,15405,15406,15407,15408,15409,15410,15411,15412,15413,15414,15415,15416,15417,15418,15419,15420,15421,15422,15423,15424,15425,15426,15427,15428,15429,15430,15431,15432,15433,15434,15435,15436,15437,15438,15439,15440,15441,15442,15443,15444,15445,15446,15447,15448,15449,15450,15451,15452,15453,15454,15455,15456,15457,15458,15459,15460,15461,15462,15463,15464,15465,15466,15467,15468,15469,15470,15471,15472,15473,15474,15475,15476,15477,15478,15479,15480,15481,15482,15483,15484,15485,15486,15487,15488,15489,15490,15491,15492,15493,15494,15495,15496,15497,15498,15499,15500,15501,15502,15503,15504,15505,15506,15507,15508,15509,15510,15511,15512,15513,15514,15515,15516,15517,15518,15519,15520,15521,15522,15523,15524,15525,15526,15527,15528,15529,15530,15531,15532,15533,15534,15535,15536,15537,15538,15539,15540,15541,15542,15543,15544,15545,15546,15547,15548,15549,15550,15551,15552,15553,15554,15555,15556,15557,15558,15559,15560,15561,15562,15563,15564,15565,15566,15567,15568,15569,15570,15571,15572,15573,15574,15575,15576,15577,15578,15579,15580,15581,15582,15583,15584,15585,15586,15587,15588,15589,15590,15591,15592,15593,15594,15595,15596,15597,15598,15599,15600,15601,15602,15603,15604,15605,15606,15607,15608,15609,15610,15611,15612,15613,15614,15615,15616,15617,15618,15619,15620,15621,15622,15623,15624,15625,15626,15627,15628,15629,15630,15631,15632,15633,15634,15635,15636,15637,15638,15639,15640,15641,15642,15643,15644,15645,15646,15647,15648,15649,15650,15651,15652,15653,15654,15655,15656,15657,15658,15659,15660,15661,15662,15663,15664,15665,15666,15667,15668,15669,15670,15671,15672,15673,15674,15675,15676,15677,15678,15679,15680,15681,15682,15683,15684,15685,15686,15687,15688,15689,15690,15691,15692,15693,15694,15695,15696,15697,15698,15699,15700,15701,15702,15703,15704,15705,15706,15707,15708,15709,15710,15711,15712,15713,15714,15715,15716,15717,15718,15719,15720,15721,15722,15723,15724,15725,15726,15727,15728,15729,15730,15731,15732,15733,15734,15735,15736,15737,15738,15739,15740,15741,15742,15743,15744,15745,15746,15747,15748,15749,15750,15751,15752,15753,15754,15755,15756,15757,15758,15759,15760,15761,15762,15763,15764,15765,15766,15767,15768,15769,15770,15771,15772,15773,15774,15775,15776,15777,15778,15779,15780,15781,15782,15783,15784,15785,15786,15787,15788,15789,15790,15791,15792,15793,15794,15795,15796,15797,15798,15799,15800,15801,15802,15803,15804,15805,15806,15807,15808,15809,15810,15811,15812,15813,15814,15815,15816,15817,15818,15819,15820,15821,15822,15823,15824,15825,15826,15827,15828,15829,15830,15831,15832,15833,15834,15835,15836,15837,15838,15839,15840,15841,15842,15843,15844,15845,15846,15847,15848,15849,15850,15851,15852,15853,15854,15855,15856,15857,15858,15859,15860,15861,15862,15863,15864,15865,15866,15867,15868,15869,15870,15871,15872,15873,15874,15875,15876,15877,15878,15879,15880,15881,15882,15883,15884,15885,15886,15887,15888,15889,15890,15891,15892,15893,15894,15895,15896,15897,15898,15899,15900,15901,15902,15903,15904,15905,15906,15907,15908,15909,15910,15911,15912,15913,15914,15915,15916,15917,15918,15919,15920,15921,15922,15923,15924,15925,15926,15927,15928,15929,15930,15931,15932,15933,15934,15935,15936,15937,15938,15939,15940,15941,15942,15943,15944,15945,15946,15947,15948,15949,15950,15951,15952,15953,15954,15955,15956,15957,15958,15959,15960,15961,15962,15963,15964,15965,15966,15967,15968,15969,15970,15971,15972,15973,15974,15975,15976,15977,15978,15979,15980,15981,15982,15983,15984,15985,15986,15987,15988,15989,15990,15991,15992,15993,15994,15995,15996,15997,15998,15999,16000,16001,16002,16003,16004,16005,16006,16007,16008,16009,16010,16011,16012,16013,16014,16015,16016,16017,16018,16019,16020,16021,16022,16023,16024,16025,16026,16027,16028,16029,16030,16031,16032,16033,16034,16035,16036,16037,16038,16039,16040,16041,16042,16043,16044,16045,16046,16047,16048,16049,16050,16051,16052,16053,16054,16055,16056,16057,16058,16059,16060,16061,16062,16063,16064,16065,16066,16067,16068,16069,16070,16071,16072,16073,16074,16075,16076,16077,16078,16079,16080,16081,16082,16083,16084,16085,16086,16087,16088,16089,16090,16091,16092,16093,16094,16095,16096,16097,16098,16099,16100,16101,16102,16103,16104,16105,16106,16107,16108,16109,16110,16111,16112,16113,16114,16115,16116,16117,16118,16119,16120,16121,16122,16123,16124,16125,16126,16127,16128,16129,16130,16131,16132,16133,16134,16135,16136,16137,16138,16139,16140,16141,16142,16143,16144,16145,16146,16147,16148,16149,16150,16151,16152,16153,16154,16155,16156,16157,16158,16159,16160,16161,16162,16163,16164,16165,16166,16167,16168,16169,16170,16171,16172,16173,16174,16175,16176,16177,16178,16179,16180,16181,16182,16183,16184,16185,16186,16187,16188,16189,16190,16191,16192,16193,16194,16195,16196,16197,16198,16199,16200,16201,16202,16203,16204,16205,16206,16207,16208,16209,16210,16211,16212,16213,16214,16215,16216,16217,16218,16219,16220,16221,16222,16223,16224,16225,16226,16227,16228,16229,16230,16231,16232,16233,16234,16235,16236,16237,16238,16239,16240,16241,16242,16243,16244,16245,16246,16247,16248,16249,16250,16251,16252,16253,16254,16255,16256,16257,16258,16259,16260,16261,16262,16263,16264,16265,16266,16267,16268,16269,16270,16271,16272,16273,16274,16275,16276,16277,16278,16279,16280,16281,16282,16283,16284,16285,16286,16287,16288,16289,16290,16291,16292,16293,16294,16295,16296,16297,16298,16299,16300,16301,16302,16303,16304,16305,16306,16307,16308,16309,16310,16311,16312,16313,16314,16315,16316,16317,16318,16319,16320,16321,16322,16323,16324,16325,16326,16327,16328,16329,16330,16331,16332,16333,16334,16335,16336,16337,16338,16339,16340,16341,16342,16343,16344,16345,16346,16347,16348,16349,16350,16351,16352,16353,16354,16355,16356,16357,16358,16359,16360,16361,16362,16363,16364,16365,16366,16367,16368,16369,16370,16371,16372,16373,16374,16375,16376,16377,16378,16379,16380,16381,16382,16383,16384,16385,16386,16387,16388,16389,16390,16391,16392,16393,16394,16395,16396,16397,16398,16399,16400,16401,16402,16403,16404,16405,16406,16407,16408,16409,16410,16411,16412,16413,16414,16415,16416,16417,16418,16419,16420,16421,16422,16423,16424,16425,16426,16427,16428,16429,16430,16431,16432,16433,16434,16435,16436,16437,16438,16439,16440,16441,16442,16443,16444,16445,16446,16447,16448,16449,16450,16451,16452,16453,16454,16455,16456,16457,16458,16459,16460,16461,16462,16463,16464,16465,16466,16467,16468,16469,16470,16471,16472,16473,16474,16475,16476,16477,16478,16479,16480,16481,16482,16483,16484,16485,16486,16487,16488,16489,16490,16491,16492,16493,16494,16495,16496,16497,16498,16499,16500,16501,16502,16503,16504,16505,16506,16507,16508,16509,16510,16511,16512,16513,16514,16515,16516,16517,16518,16519,16520,16521,16522,16523,16524,16525,16526,16527,16528,16529,16530,16531,16532,16533,16534,16535,16536,16537,16538,16539,16540,16541,16542,16543,16544,16545,16546,16547,16548,16549,16550,16551,16552,16553,16554,16555,16556,16557,16558,16559,16560,16561,16562,16563,16564,16565,16566,16567,16568,16569,16570,16571,16572,16573,16574,16575,16576,16577,16578,16579,16580,16581,16582,16583,16584,16585,16586,16587,16588,16589,16590,16591,16592,16593,16594,16595,16596,16597,16598,16599,16600,16601,16602,16603,16604,16605,16606,16607,16608,16609,16610,16611,16612,16613,16614,16615,16616,16617,16618,16619,16620,16621,16622,16623,16624,16625,16626,16627,16628,16629,16630,16631,16632,16633,16634,16635,16636,16637,16638,16639,16640,16641,16642,16643,16644,16645,16646,16647,16648,16649,16650,16651,16652,16653,16654,16655,16656,16657,16658,16659,16660,16661,16662,16663,16664,16665,16666,16667,16668,16669,16670,16671,16672,16673,16674,16675,16676,16677,16678,16679,16680,16681,16682,16683,16684,16685,16686,16687,16688,16689,16690,16691,16692,16693,16694,16695,16696,16697,16698,16699,16700,16701,16702,16703,16704,16705,16706,16707,16708,16709,16710,16711,16712,16713,16714,16715,16716,16717,16718,16719,16720,16721,16722,16723,16724,16725,16726,16727,16728,16729,16730,16731,16732,16733,16734,16735,16736,16737,16738,16739,16740,16741,16742,16743,16744,16745,16746,16747,16748,16749,16750,16751,16752,16753,16754,16755,16756,16757,16758,16759,16760,16761,16762,16763,16764,16765,16766,16767,16768,16769,16770,16771,16772,16773,16774,16775,16776,16777,16778,16779,16780,16781,16782,16783,16784,16785,16786,16787,16788,16789,16790,16791,16792,16793,16794,16795,16796,16797,16798,16799,16800,16801,16802,16803,16804,16805,16806,16807,16808,16809,16810,16811,16812,16813,16814,16815,16816,16817,16818,16819,16820,16821,16822,16823,16824,16825,16826,16827,16828,16829,16830,16831,16832,16833,16834,16835,16836,16837,16838,16839,16840,16841,16842,16843,16844,16845,16846,16847,16848,16849,16850,16851,16852,16853,16854,16855,16856,16857,16858,16859,16860,16861,16862,16863,16864,16865,16866,16867,16868,16869,16870,16871,16872,16873,16874,16875,16876,16877,16878,16879,16880,16881,16882,16883,16884,16885,16886,16887,16888,16889,16890,16891,16892,16893,16894,16895,16896,16897,16898,16899,16900,16901,16902,16903,16904,16905,16906,16907,16908,16909,16910,16911,16912,16913,16914,16915,16916,16917,16918,16919,16920,16921,16922,16923,16924,16925,16926,16927,16928,16929,16930,16931,16932,16933,16934,16935,16936,16937,16938,16939,16940,16941,16942,16943,16944,16945,16946,16947,16948,16949,16950,16951,16952,16953,16954,16955,16956,16957,16958,16959,16960,16961,16962,16963,16964,16965,16966,16967,16968,16969,16970,16971,16972,16973,16974,16975,16976,16977,16978,16979,16980,16981,16982,16983,16984,16985,16986,16987,16988,16989,16990,16991,16992,16993,16994,16995,16996,16997,16998,16999,17000,17001,17002,17003,17004,17005,17006,17007,17008,17009,17010,17011,17012,17013,17014,17015,17016,17017,17018,17019,17020,17021,17022,17023,17024,17025,17026,17027,17028,17029,17030,17031,17032,17033,17034,17035,17036,17037,17038,17039,17040,17041,17042,17043,17044,17045,17046,17047,17048,17049,17050,17051,17052,17053,17054,17055,17056,17057,17058,17059,17060,17061,17062,17063,17064,17065,17066,17067,17068,17069,17070,17071,17072,17073,17074,17075,17076,17077,17078,17079,17080,17081,17082,17083,17084,17085,17086,17087,17088,17089,17090,17091,17092,17093,17094,17095,17096,17097,17098,17099,17100,17101,17102,17103,17104,17105,17106,17107,17108,17109,17110,17111,17112,17113,17114,17115,17116,17117,17118,17119,17120,17121,17122,17123,17124,17125,17126,17127,17128,17129,17130,17131,17132,17133,17134,17135,17136,17137,17138,17139,17140,17141,17142,17143,17144,17145,17146,17147,17148,17149,17150,17151,17152,17153,17154,17155,17156,17157,17158,17159,17160,17161,17162,17163,17164,17165,17166,17167,17168,17169,17170,17171,17172,17173,17174,17175,17176,17177,17178,17179,17180,17181,17182,17183,17184,17185,17186,17187,17188,17189,17190,17191,17192,17193,17194,17195,17196,17197,17198,17199,17200,17201,17202,17203,17204,17205,17206,17207,17208,17209,17210,17211,17212,17213,17214,17215,17216,17217,17218,17219,17220,17221,17222,17223,17224,17225,17226,17227,17228,17229,17230,17231,17232,17233,17234,17235,17236,17237,17238,17239,17240,17241,17242,17243,17244,17245,17246,17247,17248,17249,17250,17251,17252,17253,17254,17255,17256,17257,17258,17259,17260,17261,17262,17263,17264,17265,17266,17267,17268,17269,17270,17271,17272,17273,17274,17275,17276,17277,17278,17279,17280,17281,17282,17283,17284,17285,17286,17287,17288,17289,17290,17291,17292,17293,17294,17295,17296,17297,17298,17299,17300,17301,17302,17303,17304,17305,17306,17307,17308,17309,17310,17311,17312,17313,17314,17315,17316,17317,17318,17319,17320,17321,17322,17323,17324,17325,17326,17327,17328,17329,17330,17331,17332,17333,17334,17335,17336,17337,17338,17339,17340,17341,17342,17343,17344,17345,17346,17347,17348,17349,17350,17351,17352,17353,17354,17355,17356,17357,17358,17359,17360,17361,17362,17363,17364,17365,17366,17367,17368,17369,17370,17371,17372,17373,17374,17375,17376,17377,17378,17379,17380,17381,17382,17383,17384,17385,17386,17387,17388,17389,17390,17391,17392,17393,17394,17395,17396,17397,17398,17399,17400,17401,17402,17403,17404,17405,17406,17407,17408,17409,17410,17411,17412,17413,17414,17415,17416,17417,17418,17419,17420,17421,17422,17423,17424,17425,17426,17427,17428,17429,17430,17431,17432,17433,17434,17435,17436,17437,17438,17439,17440,17441,17442,17443,17444,17445,17446,17447,17448,17449,17450,17451,17452,17453,17454,17455,17456,17457,17458,17459,17460,17461,17462,17463,17464,17465,17466,17467,17468,17469,17470,17471,17472,17473,17474,17475,17476,17477,17478,17479,17480,17481,17482,17483,17484,17485,17486,17487,17488,17489,17490,17491,17492,17493,17494,17495,17496,17497,17498,17499,17500,17501,17502,17503,17504,17505,17506,17507,17508,17509,17510,17511,17512,17513,17514,17515,17516,17517,17518,17519,17520,17521,17522,17523,17524,17525,17526,17527,17528,17529,17530,17531,17532,17533,17534,17535,17536,17537,17538,17539,17540,17541,17542,17543,17544,17545,17546,17547,17548,17549,17550,17551,17552,17553,17554,17555,17556,17557,17558,17559,17560,17561,17562,17563,17564,17565,17566,17567,17568,17569,17570,17571,17572,17573,17574,17575,17576,17577,17578,17579,17580,17581,17582,17583,17584,17585,17586,17587,17588,17589,17590,17591,17592,17593,17594,17595,17596,17597,17598,17599,17600,17601,17602,17603,17604,17605,17606,17607,17608,17609,17610,17611,17612,17613,17614,17615,17616,17617,17618,17619,17620,17621,17622,17623,17624,17625,17626,17627,17628,17629,17630,17631,17632,17633,17634,17635,17636,17637,17638,17639,17640,17641,17642,17643,17644,17645,17646,17647,17648,17649,17650,17651,17652,17653,17654,17655,17656,17657,17658,17659,17660,17661,17662,17663,17664,17665,17666,17667,17668,17669,17670,17671,17672,17673,17674,17675,17676,17677,17678,17679,17680,17681,17682,17683,17684,17685,17686,17687,17688,17689,17690,17691,17692,17693,17694,17695,17696,17697,17698,17699,17700,17701,17702,17703,17704,17705,17706,17707,17708,17709,17710,17711,17712,17713,17714,17715,17716,17717,17718,17719,17720,17721,17722,17723,17724,17725,17726,17727,17728,17729,17730,17731,17732,17733,17734,17735,17736,17737,17738,17739,17740,17741,17742,17743,17744,17745,17746,17747,17748,17749,17750,17751,17752,17753,17754,17755,17756,17757,17758,17759,17760,17761,17762,17763,17764,17765,17766,17767,17768,17769,17770,17771,17772,17773,17774,17775,17776,17777,17778,17779,17780,17781,17782,17783,17784,17785,17786,17787,17788,17789,17790,17791,17792,17793,17794,17795,17796,17797,17798,17799,17800,17801,17802,17803,17804,17805,17806,17807,17808,17809,17810,17811,17812,17813,17814,17815,17816,17817,17818,17819,17820,17821,17822,17823,17824,17825,17826,17827,17828,17829,17830,17831,17832,17833,17834,17835,17836,17837,17838,17839,17840,17841,17842,17843,17844,17845,17846,17847,17848,17849,17850,17851,17852,17853,17854,17855,17856,17857,17858,17859,17860,17861,17862,17863,17864,17865,17866,17867,17868,17869,17870,17871,17872,17873,17874,17875,17876,17877,17878,17879,17880,17881,17882,17883,17884,17885,17886,17887,17888,17889,17890,17891,17892,17893,17894,17895,17896,17897,17898,17899,17900,17901,17902,17903,17904,17905,17906,17907,17908,17909,17910,17911,17912,17913,17914,17915,17916,17917,17918,17919,17920,17921,17922,17923,17924,17925,17926,17927,17928,17929,17930,17931,17932,17933,17934,17935,17936,17937,17938,17939,17940,17941,17942,17943,17944,17945,17946,17947,17948,17949,17950,17951,17952,17953,17954,17955,17956,17957,17958,17959,17960,17961,17962,17963,17964,17965,17966,17967,17968,17969,17970,17971,17972,17973,17974,17975,17976,17977,17978,17979,17980,17981,17982,17983,17984,17985,17986,17987,17988,17989,17990,17991,17992,17993,17994,17995,17996,17997,17998,17999,18000,18001,18002,18003,18004,18005,18006,18007,18008,18009,18010,18011,18012,18013,18014,18015,18016,18017,18018,18019,18020,18021,18022,18023,18024,18025,18026,18027,18028,18029,18030,18031,18032,18033,18034,18035,18036,18037,18038,18039,18040,18041,18042,18043,18044,18045,18046,18047,18048,18049,18050,18051,18052,18053,18054,18055,18056,18057,18058,18059,18060,18061,18062,18063,18064,18065,18066,18067,18068,18069,18070,18071,18072,18073,18074,18075,18076,18077,18078,18079,18080,18081,18082,18083,18084,18085,18086,18087,18088,18089,18090,18091,18092,18093,18094,18095,18096,18097,18098,18099,18100,18101,18102,18103,18104,18105,18106,18107,18108,18109,18110,18111,18112,18113,18114,18115,18116,18117,18118,18119,18120,18121,18122,18123,18124,18125,18126,18127,18128,18129,18130,18131,18132,18133,18134,18135,18136,18137,18138,18139,18140,18141,18142,18143,18144,18145,18146,18147,18148,18149,18150,18151,18152,18153,18154,18155,18156,18157,18158,18159,18160,18161,18162,18163,18164,18165,18166,18167,18168,18169,18170,18171,18172,18173,18174,18175,18176,18177,18178,18179,18180,18181,18182,18183,18184,18185,18186,18187,18188,18189,18190,18191,18192,18193,18194,18195,18196,18197,18198,18199,18200,18201,18202,18203,18204,18205,18206,18207,18208,18209,18210,18211,18212,18213,18214,18215,18216,18217,18218,18219,18220,18221,18222,18223,18224,18225,18226,18227,18228,18229,18230,18231,18232,18233,18234,18235,18236,18237,18238,18239,18240,18241,18242,18243,18244,18245,18246,18247,18248,18249,18250,18251,18252,18253,18254,18255,18256,18257,18258,18259,18260,18261,18262,18263,18264,18265,18266,18267,18268,18269,18270,18271,18272,18273,18274,18275,18276,18277,18278,18279,18280,18281,18282,18283,18284,18285,18286,18287,18288,18289,18290,18291,18292,18293,18294,18295,18296,18297,18298,18299,18300,18301,18302,18303,18304,18305,18306,18307,18308,18309,18310,18311,18312,18313,18314,18315,18316,18317,18318,18319,18320,18321,18322,18323,18324,18325,18326,18327,18328,18329,18330,18331,18332,18333,18334,18335,18336,18337,18338,18339,18340,18341,18342,18343,18344,18345,18346,18347,18348,18349,18350,18351,18352,18353,18354,18355,18356,18357,18358,18359,18360,18361,18362,18363,18364,18365,18366,18367,18368,18369,18370,18371,18372,18373,18374,18375,18376,18377,18378,18379,18380,18381,18382,18383,18384,18385,18386,18387,18388,18389,18390,18391,18392,18393,18394,18395,18396,18397,18398,18399,18400,18401,18402,18403,18404,18405,18406,18407,18408,18409,18410,18411,18412,18413,18414,18415,18416,18417,18418,18419,18420,18421,18422,18423,18424,18425,18426,18427,18428,18429,18430,18431,18432,18433,18434,18435,18436,18437,18438,18439,18440,18441,18442,18443,18444,18445,18446,18447,18448,18449,18450,18451,18452,18453,18454,18455,18456,18457,18458,18459,18460,18461,18462,18463,18464,18465,18466,18467,18468,18469,18470,18471,18472,18473,18474,18475,18476,18477,18478,18479,18480,18481,18482,18483,18484,18485,18486,18487,18488,18489,18490,18491,18492,18493,18494,18495,18496,18497,18498,18499,18500,18501,18502,18503,18504,18505,18506,18507,18508,18509,18510,18511,18512,18513,18514,18515,18516,18517,18518,18519,18520,18521,18522,18523,18524,18525,18526,18527,18528,18529,18530,18531,18532,18533,18534,18535,18536,18537,18538,18539,18540,18541,18542,18543,18544,18545,18546,18547,18548,18549,18550,18551,18552,18553,18554,18555,18556,18557,18558,18559,18560,18561,18562,18563,18564,18565,18566,18567,18568,18569,18570,18571,18572,18573,18574,18575,18576,18577,18578,18579,18580,18581,18582,18583,18584,18585,18586,18587,18588,18589,18590,18591,18592,18593,18594,18595,18596,18597,18598,18599,18600,18601,18602,18603,18604,18605,18606,18607,18608,18609,18610,18611,18612,18613,18614,18615,18616,18617,18618,18619,18620,18621,18622,18623,18624,18625,18626,18627,18628,18629,18630,18631,18632,18633,18634,18635,18636,18637,18638,18639,18640,18641,18642,18643,18644,18645,18646,18647,18648,18649,18650,18651,18652,18653,18654,18655,18656,18657,18658,18659,18660,18661,18662,18663,18664,18665,18666,18667,18668,18669,18670,18671,18672,18673,18674,18675,18676,18677,18678,18679,18680,18681,18682,18683,18684,18685,18686,18687,18688,18689,18690,18691,18692,18693,18694,18695,18696,18697,18698,18699,18700,18701,18702,18703,18704,18705,18706,18707,18708,18709,18710,18711,18712,18713,18714,18715,18716,18717,18718,18719,18720,18721,18722,18723,18724,18725,18726,18727,18728,18729,18730,18731,18732,18733,18734,18735,18736,18737,18738,18739,18740,18741,18742,18743,18744,18745,18746,18747,18748,18749,18750,18751,18752,18753,18754,18755,18756,18757,18758,18759,18760,18761,18762,18763,18764,18765,18766,18767,18768,18769,18770,18771,18772,18773,18774,18775,18776,18777,18778,18779,18780,18781,18782,18783,18784,18785,18786,18787,18788,18789,18790,18791,18792,18793,18794,18795,18796,18797,18798,18799,18800,18801,18802,18803,18804,18805,18806,18807,18808,18809,18810,18811,18812,18813,18814,18815,18816,18817,18818,18819,18820,18821,18822,18823,18824,18825,18826,18827,18828,18829,18830,18831,18832,18833,18834,18835,18836,18837,18838,18839,18840,18841,18842,18843,18844,18845,18846,18847,18848,18849,18850,18851,18852,18853,18854,18855,18856,18857,18858,18859,18860,18861,18862,18863,18864,18865,18866,18867,18868,18869,18870,18871,18872,18873,18874,18875,18876,18877,18878,18879,18880,18881,18882,18883,18884,18885,18886,18887,18888,18889,18890,18891,18892,18893,18894,18895,18896,18897,18898,18899,18900,18901,18902,18903,18904,18905,18906,18907,18908,18909,18910,18911,18912,18913,18914,18915,18916,18917,18918,18919,18920,18921,18922,18923,18924,18925,18926,18927,18928,18929,18930,18931,18932,18933,18934,18935,18936,18937,18938,18939,18940,18941,18942,18943,18944,18945,18946,18947,18948,18949,18950,18951,18952,18953,18954,18955,18956,18957,18958,18959,18960,18961,18962,18963,18964,18965,18966,18967,18968,18969,18970,18971,18972,18973,18974,18975,18976,18977,18978,18979,18980,18981,18982,18983,18984,18985,18986,18987,18988,18989,18990,18991,18992,18993,18994,18995,18996,18997,18998,18999,19000,19001,19002,19003,19004,19005,19006,19007,19008,19009,19010,19011,19012,19013,19014,19015,19016,19017,19018,19019,19020,19021,19022,19023,19024,19025,19026,19027,19028,19029,19030,19031,19032,19033,19034,19035,19036,19037,19038,19039,19040,19041,19042,19043,19044,19045,19046,19047,19048,19049,19050,19051,19052,19053,19054,19055,19056,19057,19058,19059,19060,19061,19062,19063,19064,19065,19066,19067,19068,19069,19070,19071,19072,19073,19074,19075,19076,19077,19078,19079,19080,19081,19082,19083,19084,19085,19086,19087,19088,19089,19090,19091,19092,19093,19094,19095,19096,19097,19098,19099,19100,19101,19102,19103,19104,19105,19106,19107,19108,19109,19110,19111,19112,19113,19114,19115,19116,19117,19118,19119,19120,19121,19122,19123,19124,19125,19126,19127,19128,19129,19130,19131,19132,19133,19134,19135,19136,19137,19138,19139,19140,19141,19142,19143,19144,19145,19146,19147,19148,19149,19150,19151,19152,19153,19154,19155,19156,19157,19158,19159,19160,19161,19162,19163,19164,19165,19166,19167,19168,19169,19170,19171,19172,19173,19174,19175,19176,19177,19178,19179,19180,19181,19182,19183,19184,19185,19186,19187,19188,19189,19190,19191,19192,19193,19194,19195,19196,19197,19198,19199,19200,19201,19202,19203,19204,19205,19206,19207,19208,19209,19210,19211,19212,19213,19214,19215,19216,19217,19218,19219,19220,19221,19222,19223,19224,19225,19226,19227,19228,19229,19230,19231,19232,19233,19234,19235,19236,19237,19238,19239,19240,19241,19242,19243,19244,19245,19246,19247,19248,19249,19250,19251,19252,19253,19254,19255,19256,19257,19258,19259,19260,19261,19262,19263,19264,19265,19266,19267,19268,19269,19270,19271,19272,19273,19274,19275,19276,19277,19278,19279,19280,19281,19282,19283,19284,19285,19286,19287,19288,19289,19290,19291,19292,19293,19294,19295,19296,19297,19298,19299,19300,19301,19302,19303,19304,19305,19306,19307,19308,19309,19310,19311,19312,19313,19314,19315,19316,19317,19318,19319,19320,19321,19322,19323,19324,19325,19326,19327,19328,19329,19330,19331,19332,19333,19334,19335,19336,19337,19338,19339,19340,19341,19342,19343,19344,19345,19346,19347,19348,19349,19350,19351,19352,19353,19354,19355,19356,19357,19358,19359,19360,19361,19362,19363,19364,19365,19366,19367,19368,19369,19370,19371,19372,19373,19374,19375,19376,19377,19378,19379,19380,19381,19382,19383,19384,19385,19386,19387,19388,19389,19390,19391,19392,19393,19394,19395,19396,19397,19398,19399,19400,19401,19402,19403,19404,19405,19406,19407,19408,19409,19410,19411,19412,19413,19414,19415,19416,19417,19418,19419,19420,19421,19422,19423,19424,19425,19426,19427,19428,19429,19430,19431,19432,19433,19434,19435,19436,19437,19438,19439,19440,19441,19442,19443,19444,19445,19446,19447,19448,19449,19450,19451,19452,19453,19454,19455,19456,19457,19458,19459,19460,19461,19462,19463,19464,19465,19466,19467,19468,19469,19470,19471,19472,19473,19474,19475,19476,19477,19478,19479,19480,19481,19482,19483,19484,19485,19486,19487,19488,19489,19490,19491,19492,19493,19494,19495,19496,19497,19498,19499,19500,19501,19502,19503,19504,19505,19506,19507,19508,19509,19510,19511,19512,19513,19514,19515,19516,19517,19518,19519,19520,19521,19522,19523,19524,19525,19526,19527,19528,19529,19530,19531,19532,19533,19534,19535,19536,19537,19538,19539,19540,19541,19542,19543,19544,19545,19546,19547,19548,19549,19550,19551,19552,19553,19554,19555,19556,19557,19558,19559,19560,19561,19562,19563,19564,19565,19566,19567,19568,19569,19570,19571,19572,19573,19574,19575,19576,19577,19578,19579,19580,19581,19582,19583,19584,19585,19586,19587,19588,19589,19590,19591,19592,19593,19594,19595,19596,19597,19598,19599,19600,19601,19602,19603,19604,19605,19606,19607,19608,19609,19610,19611,19612,19613,19614,19615,19616,19617,19618,19619,19620,19621,19622,19623,19624,19625,19626,19627,19628,19629,19630,19631,19632,19633,19634,19635,19636,19637,19638,19639,19640,19641,19642,19643,19644,19645,19646,19647,19648,19649,19650,19651,19652,19653,19654,19655,19656,19657,19658,19659,19660,19661,19662,19663,19664,19665,19666,19667,19668,19669,19670,19671,19672,19673,19674,19675,19676,19677,19678,19679,19680,19681,19682,19683,19684,19685,19686,19687,19688,19689,19690,19691,19692,19693,19694,19695,19696,19697,19698,19699,19700,19701,19702,19703,19704,19705,19706,19707,19708,19709,19710,19711,19712,19713,19714,19715,19716,19717,19718,19719,19720,19721,19722,19723,19724,19725,19726,19727,19728,19729,19730,19731,19732,19733,19734,19735,19736,19737,19738,19739,19740,19741,19742,19743,19744,19745,19746,19747,19748,19749,19750,19751,19752,19753,19754,19755,19756,19757,19758,19759,19760,19761,19762,19763,19764,19765,19766,19767,19768,19769,19770,19771,19772,19773,19774,19775,19776,19777,19778,19779,19780,19781,19782,19783,19784,19785,19786,19787,19788,19789,19790,19791,19792,19793,19794,19795,19796,19797,19798,19799,19800,19801,19802,19803,19804,19805,19806,19807,19808,19809,19810,19811,19812,19813,19814,19815,19816,19817,19818,19819,19820,19821,19822,19823,19824,19825,19826,19827,19828,19829,19830,19831,19832,19833,19834,19835,19836,19837,19838,19839,19840,19841,19842,19843,19844,19845,19846,19847,19848,19849,19850,19851,19852,19853,19854,19855,19856,19857,19858,19859,19860,19861,19862,19863,19864,19865,19866,19867,19868,19869,19870,19871,19872,19873,19874,19875,19876,19877,19878,19879,19880,19881,19882,19883,19884,19885,19886,19887,19888,19889,19890,19891,19892,19893,19968,19969,19970,19971,19972,19973,19974,19975,19976,19977,19978,19979,19980,19981,19982,19983,19984,19985,19986,19987,19988,19989,19990,19991,19992,19993,19994,19995,19996,19997,19998,19999,20000,20001,20002,20003,20004,20005,20006,20007,20008,20009,20010,20011,20012,20013,20014,20015,20016,20017,20018,20019,20020,20021,20022,20023,20024,20025,20026,20027,20028,20029,20030,20031,20032,20033,20034,20035,20036,20037,20038,20039,20040,20041,20042,20043,20044,20045,20046,20047,20048,20049,20050,20051,20052,20053,20054,20055,20056,20057,20058,20059,20060,20061,20062,20063,20064,20065,20066,20067,20068,20069,20070,20071,20072,20073,20074,20075,20076,20077,20078,20079,20080,20081,20082,20083,20084,20085,20086,20087,20088,20089,20090,20091,20092,20093,20094,20095,20096,20097,20098,20099,20100,20101,20102,20103,20104,20105,20106,20107,20108,20109,20110,20111,20112,20113,20114,20115,20116,20117,20118,20119,20120,20121,20122,20123,20124,20125,20126,20127,20128,20129,20130,20131,20132,20133,20134,20135,20136,20137,20138,20139,20140,20141,20142,20143,20144,20145,20146,20147,20148,20149,20150,20151,20152,20153,20154,20155,20156,20157,20158,20159,20160,20161,20162,20163,20164,20165,20166,20167,20168,20169,20170,20171,20172,20173,20174,20175,20176,20177,20178,20179,20180,20181,20182,20183,20184,20185,20186,20187,20188,20189,20190,20191,20192,20193,20194,20195,20196,20197,20198,20199,20200,20201,20202,20203,20204,20205,20206,20207,20208,20209,20210,20211,20212,20213,20214,20215,20216,20217,20218,20219,20220,20221,20222,20223,20224,20225,20226,20227,20228,20229,20230,20231,20232,20233,20234,20235,20236,20237,20238,20239,20240,20241,20242,20243,20244,20245,20246,20247,20248,20249,20250,20251,20252,20253,20254,20255,20256,20257,20258,20259,20260,20261,20262,20263,20264,20265,20266,20267,20268,20269,20270,20271,20272,20273,20274,20275,20276,20277,20278,20279,20280,20281,20282,20283,20284,20285,20286,20287,20288,20289,20290,20291,20292,20293,20294,20295,20296,20297,20298,20299,20300,20301,20302,20303,20304,20305,20306,20307,20308,20309,20310,20311,20312,20313,20314,20315,20316,20317,20318,20319,20320,20321,20322,20323,20324,20325,20326,20327,20328,20329,20330,20331,20332,20333,20334,20335,20336,20337,20338,20339,20340,20341,20342,20343,20344,20345,20346,20347,20348,20349,20350,20351,20352,20353,20354,20355,20356,20357,20358,20359,20360,20361,20362,20363,20364,20365,20366,20367,20368,20369,20370,20371,20372,20373,20374,20375,20376,20377,20378,20379,20380,20381,20382,20383,20384,20385,20386,20387,20388,20389,20390,20391,20392,20393,20394,20395,20396,20397,20398,20399,20400,20401,20402,20403,20404,20405,20406,20407,20408,20409,20410,20411,20412,20413,20414,20415,20416,20417,20418,20419,20420,20421,20422,20423,20424,20425,20426,20427,20428,20429,20430,20431,20432,20433,20434,20435,20436,20437,20438,20439,20440,20441,20442,20443,20444,20445,20446,20447,20448,20449,20450,20451,20452,20453,20454,20455,20456,20457,20458,20459,20460,20461,20462,20463,20464,20465,20466,20467,20468,20469,20470,20471,20472,20473,20474,20475,20476,20477,20478,20479,20480,20481,20482,20483,20484,20485,20486,20487,20488,20489,20490,20491,20492,20493,20494,20495,20496,20497,20498,20499,20500,20501,20502,20503,20504,20505,20506,20507,20508,20509,20510,20511,20512,20513,20514,20515,20516,20517,20518,20519,20520,20521,20522,20523,20524,20525,20526,20527,20528,20529,20530,20531,20532,20533,20534,20535,20536,20537,20538,20539,20540,20541,20542,20543,20544,20545,20546,20547,20548,20549,20550,20551,20552,20553,20554,20555,20556,20557,20558,20559,20560,20561,20562,20563,20564,20565,20566,20567,20568,20569,20570,20571,20572,20573,20574,20575,20576,20577,20578,20579,20580,20581,20582,20583,20584,20585,20586,20587,20588,20589,20590,20591,20592,20593,20594,20595,20596,20597,20598,20599,20600,20601,20602,20603,20604,20605,20606,20607,20608,20609,20610,20611,20612,20613,20614,20615,20616,20617,20618,20619,20620,20621,20622,20623,20624,20625,20626,20627,20628,20629,20630,20631,20632,20633,20634,20635,20636,20637,20638,20639,20640,20641,20642,20643,20644,20645,20646,20647,20648,20649,20650,20651,20652,20653,20654,20655,20656,20657,20658,20659,20660,20661,20662,20663,20664,20665,20666,20667,20668,20669,20670,20671,20672,20673,20674,20675,20676,20677,20678,20679,20680,20681,20682,20683,20684,20685,20686,20687,20688,20689,20690,20691,20692,20693,20694,20695,20696,20697,20698,20699,20700,20701,20702,20703,20704,20705,20706,20707,20708,20709,20710,20711,20712,20713,20714,20715,20716,20717,20718,20719,20720,20721,20722,20723,20724,20725,20726,20727,20728,20729,20730,20731,20732,20733,20734,20735,20736,20737,20738,20739,20740,20741,20742,20743,20744,20745,20746,20747,20748,20749,20750,20751,20752,20753,20754,20755,20756,20757,20758,20759,20760,20761,20762,20763,20764,20765,20766,20767,20768,20769,20770,20771,20772,20773,20774,20775,20776,20777,20778,20779,20780,20781,20782,20783,20784,20785,20786,20787,20788,20789,20790,20791,20792,20793,20794,20795,20796,20797,20798,20799,20800,20801,20802,20803,20804,20805,20806,20807,20808,20809,20810,20811,20812,20813,20814,20815,20816,20817,20818,20819,20820,20821,20822,20823,20824,20825,20826,20827,20828,20829,20830,20831,20832,20833,20834,20835,20836,20837,20838,20839,20840,20841,20842,20843,20844,20845,20846,20847,20848,20849,20850,20851,20852,20853,20854,20855,20856,20857,20858,20859,20860,20861,20862,20863,20864,20865,20866,20867,20868,20869,20870,20871,20872,20873,20874,20875,20876,20877,20878,20879,20880,20881,20882,20883,20884,20885,20886,20887,20888,20889,20890,20891,20892,20893,20894,20895,20896,20897,20898,20899,20900,20901,20902,20903,20904,20905,20906,20907,20908,20909,20910,20911,20912,20913,20914,20915,20916,20917,20918,20919,20920,20921,20922,20923,20924,20925,20926,20927,20928,20929,20930,20931,20932,20933,20934,20935,20936,20937,20938,20939,20940,20941,20942,20943,20944,20945,20946,20947,20948,20949,20950,20951,20952,20953,20954,20955,20956,20957,20958,20959,20960,20961,20962,20963,20964,20965,20966,20967,20968,20969,20970,20971,20972,20973,20974,20975,20976,20977,20978,20979,20980,20981,20982,20983,20984,20985,20986,20987,20988,20989,20990,20991,20992,20993,20994,20995,20996,20997,20998,20999,21000,21001,21002,21003,21004,21005,21006,21007,21008,21009,21010,21011,21012,21013,21014,21015,21016,21017,21018,21019,21020,21021,21022,21023,21024,21025,21026,21027,21028,21029,21030,21031,21032,21033,21034,21035,21036,21037,21038,21039,21040,21041,21042,21043,21044,21045,21046,21047,21048,21049,21050,21051,21052,21053,21054,21055,21056,21057,21058,21059,21060,21061,21062,21063,21064,21065,21066,21067,21068,21069,21070,21071,21072,21073,21074,21075,21076,21077,21078,21079,21080,21081,21082,21083,21084,21085,21086,21087,21088,21089,21090,21091,21092,21093,21094,21095,21096,21097,21098,21099,21100,21101,21102,21103,21104,21105,21106,21107,21108,21109,21110,21111,21112,21113,21114,21115,21116,21117,21118,21119,21120,21121,21122,21123,21124,21125,21126,21127,21128,21129,21130,21131,21132,21133,21134,21135,21136,21137,21138,21139,21140,21141,21142,21143,21144,21145,21146,21147,21148,21149,21150,21151,21152,21153,21154,21155,21156,21157,21158,21159,21160,21161,21162,21163,21164,21165,21166,21167,21168,21169,21170,21171,21172,21173,21174,21175,21176,21177,21178,21179,21180,21181,21182,21183,21184,21185,21186,21187,21188,21189,21190,21191,21192,21193,21194,21195,21196,21197,21198,21199,21200,21201,21202,21203,21204,21205,21206,21207,21208,21209,21210,21211,21212,21213,21214,21215,21216,21217,21218,21219,21220,21221,21222,21223,21224,21225,21226,21227,21228,21229,21230,21231,21232,21233,21234,21235,21236,21237,21238,21239,21240,21241,21242,21243,21244,21245,21246,21247,21248,21249,21250,21251,21252,21253,21254,21255,21256,21257,21258,21259,21260,21261,21262,21263,21264,21265,21266,21267,21268,21269,21270,21271,21272,21273,21274,21275,21276,21277,21278,21279,21280,21281,21282,21283,21284,21285,21286,21287,21288,21289,21290,21291,21292,21293,21294,21295,21296,21297,21298,21299,21300,21301,21302,21303,21304,21305,21306,21307,21308,21309,21310,21311,21312,21313,21314,21315,21316,21317,21318,21319,21320,21321,21322,21323,21324,21325,21326,21327,21328,21329,21330,21331,21332,21333,21334,21335,21336,21337,21338,21339,21340,21341,21342,21343,21344,21345,21346,21347,21348,21349,21350,21351,21352,21353,21354,21355,21356,21357,21358,21359,21360,21361,21362,21363,21364,21365,21366,21367,21368,21369,21370,21371,21372,21373,21374,21375,21376,21377,21378,21379,21380,21381,21382,21383,21384,21385,21386,21387,21388,21389,21390,21391,21392,21393,21394,21395,21396,21397,21398,21399,21400,21401,21402,21403,21404,21405,21406,21407,21408,21409,21410,21411,21412,21413,21414,21415,21416,21417,21418,21419,21420,21421,21422,21423,21424,21425,21426,21427,21428,21429,21430,21431,21432,21433,21434,21435,21436,21437,21438,21439,21440,21441,21442,21443,21444,21445,21446,21447,21448,21449,21450,21451,21452,21453,21454,21455,21456,21457,21458,21459,21460,21461,21462,21463,21464,21465,21466,21467,21468,21469,21470,21471,21472,21473,21474,21475,21476,21477,21478,21479,21480,21481,21482,21483,21484,21485,21486,21487,21488,21489,21490,21491,21492,21493,21494,21495,21496,21497,21498,21499,21500,21501,21502,21503,21504,21505,21506,21507,21508,21509,21510,21511,21512,21513,21514,21515,21516,21517,21518,21519,21520,21521,21522,21523,21524,21525,21526,21527,21528,21529,21530,21531,21532,21533,21534,21535,21536,21537,21538,21539,21540,21541,21542,21543,21544,21545,21546,21547,21548,21549,21550,21551,21552,21553,21554,21555,21556,21557,21558,21559,21560,21561,21562,21563,21564,21565,21566,21567,21568,21569,21570,21571,21572,21573,21574,21575,21576,21577,21578,21579,21580,21581,21582,21583,21584,21585,21586,21587,21588,21589,21590,21591,21592,21593,21594,21595,21596,21597,21598,21599,21600,21601,21602,21603,21604,21605,21606,21607,21608,21609,21610,21611,21612,21613,21614,21615,21616,21617,21618,21619,21620,21621,21622,21623,21624,21625,21626,21627,21628,21629,21630,21631,21632,21633,21634,21635,21636,21637,21638,21639,21640,21641,21642,21643,21644,21645,21646,21647,21648,21649,21650,21651,21652,21653,21654,21655,21656,21657,21658,21659,21660,21661,21662,21663,21664,21665,21666,21667,21668,21669,21670,21671,21672,21673,21674,21675,21676,21677,21678,21679,21680,21681,21682,21683,21684,21685,21686,21687,21688,21689,21690,21691,21692,21693,21694,21695,21696,21697,21698,21699,21700,21701,21702,21703,21704,21705,21706,21707,21708,21709,21710,21711,21712,21713,21714,21715,21716,21717,21718,21719,21720,21721,21722,21723,21724,21725,21726,21727,21728,21729,21730,21731,21732,21733,21734,21735,21736,21737,21738,21739,21740,21741,21742,21743,21744,21745,21746,21747,21748,21749,21750,21751,21752,21753,21754,21755,21756,21757,21758,21759,21760,21761,21762,21763,21764,21765,21766,21767,21768,21769,21770,21771,21772,21773,21774,21775,21776,21777,21778,21779,21780,21781,21782,21783,21784,21785,21786,21787,21788,21789,21790,21791,21792,21793,21794,21795,21796,21797,21798,21799,21800,21801,21802,21803,21804,21805,21806,21807,21808,21809,21810,21811,21812,21813,21814,21815,21816,21817,21818,21819,21820,21821,21822,21823,21824,21825,21826,21827,21828,21829,21830,21831,21832,21833,21834,21835,21836,21837,21838,21839,21840,21841,21842,21843,21844,21845,21846,21847,21848,21849,21850,21851,21852,21853,21854,21855,21856,21857,21858,21859,21860,21861,21862,21863,21864,21865,21866,21867,21868,21869,21870,21871,21872,21873,21874,21875,21876,21877,21878,21879,21880,21881,21882,21883,21884,21885,21886,21887,21888,21889,21890,21891,21892,21893,21894,21895,21896,21897,21898,21899,21900,21901,21902,21903,21904,21905,21906,21907,21908,21909,21910,21911,21912,21913,21914,21915,21916,21917,21918,21919,21920,21921,21922,21923,21924,21925,21926,21927,21928,21929,21930,21931,21932,21933,21934,21935,21936,21937,21938,21939,21940,21941,21942,21943,21944,21945,21946,21947,21948,21949,21950,21951,21952,21953,21954,21955,21956,21957,21958,21959,21960,21961,21962,21963,21964,21965,21966,21967,21968,21969,21970,21971,21972,21973,21974,21975,21976,21977,21978,21979,21980,21981,21982,21983,21984,21985,21986,21987,21988,21989,21990,21991,21992,21993,21994,21995,21996,21997,21998,21999,22000,22001,22002,22003,22004,22005,22006,22007,22008,22009,22010,22011,22012,22013,22014,22015,22016,22017,22018,22019,22020,22021,22022,22023,22024,22025,22026,22027,22028,22029,22030,22031,22032,22033,22034,22035,22036,22037,22038,22039,22040,22041,22042,22043,22044,22045,22046,22047,22048,22049,22050,22051,22052,22053,22054,22055,22056,22057,22058,22059,22060,22061,22062,22063,22064,22065,22066,22067,22068,22069,22070,22071,22072,22073,22074,22075,22076,22077,22078,22079,22080,22081,22082,22083,22084,22085,22086,22087,22088,22089,22090,22091,22092,22093,22094,22095,22096,22097,22098,22099,22100,22101,22102,22103,22104,22105,22106,22107,22108,22109,22110,22111,22112,22113,22114,22115,22116,22117,22118,22119,22120,22121,22122,22123,22124,22125,22126,22127,22128,22129,22130,22131,22132,22133,22134,22135,22136,22137,22138,22139,22140,22141,22142,22143,22144,22145,22146,22147,22148,22149,22150,22151,22152,22153,22154,22155,22156,22157,22158,22159,22160,22161,22162,22163,22164,22165,22166,22167,22168,22169,22170,22171,22172,22173,22174,22175,22176,22177,22178,22179,22180,22181,22182,22183,22184,22185,22186,22187,22188,22189,22190,22191,22192,22193,22194,22195,22196,22197,22198,22199,22200,22201,22202,22203,22204,22205,22206,22207,22208,22209,22210,22211,22212,22213,22214,22215,22216,22217,22218,22219,22220,22221,22222,22223,22224,22225,22226,22227,22228,22229,22230,22231,22232,22233,22234,22235,22236,22237,22238,22239,22240,22241,22242,22243,22244,22245,22246,22247,22248,22249,22250,22251,22252,22253,22254,22255,22256,22257,22258,22259,22260,22261,22262,22263,22264,22265,22266,22267,22268,22269,22270,22271,22272,22273,22274,22275,22276,22277,22278,22279,22280,22281,22282,22283,22284,22285,22286,22287,22288,22289,22290,22291,22292,22293,22294,22295,22296,22297,22298,22299,22300,22301,22302,22303,22304,22305,22306,22307,22308,22309,22310,22311,22312,22313,22314,22315,22316,22317,22318,22319,22320,22321,22322,22323,22324,22325,22326,22327,22328,22329,22330,22331,22332,22333,22334,22335,22336,22337,22338,22339,22340,22341,22342,22343,22344,22345,22346,22347,22348,22349,22350,22351,22352,22353,22354,22355,22356,22357,22358,22359,22360,22361,22362,22363,22364,22365,22366,22367,22368,22369,22370,22371,22372,22373,22374,22375,22376,22377,22378,22379,22380,22381,22382,22383,22384,22385,22386,22387,22388,22389,22390,22391,22392,22393,22394,22395,22396,22397,22398,22399,22400,22401,22402,22403,22404,22405,22406,22407,22408,22409,22410,22411,22412,22413,22414,22415,22416,22417,22418,22419,22420,22421,22422,22423,22424,22425,22426,22427,22428,22429,22430,22431,22432,22433,22434,22435,22436,22437,22438,22439,22440,22441,22442,22443,22444,22445,22446,22447,22448,22449,22450,22451,22452,22453,22454,22455,22456,22457,22458,22459,22460,22461,22462,22463,22464,22465,22466,22467,22468,22469,22470,22471,22472,22473,22474,22475,22476,22477,22478,22479,22480,22481,22482,22483,22484,22485,22486,22487,22488,22489,22490,22491,22492,22493,22494,22495,22496,22497,22498,22499,22500,22501,22502,22503,22504,22505,22506,22507,22508,22509,22510,22511,22512,22513,22514,22515,22516,22517,22518,22519,22520,22521,22522,22523,22524,22525,22526,22527,22528,22529,22530,22531,22532,22533,22534,22535,22536,22537,22538,22539,22540,22541,22542,22543,22544,22545,22546,22547,22548,22549,22550,22551,22552,22553,22554,22555,22556,22557,22558,22559,22560,22561,22562,22563,22564,22565,22566,22567,22568,22569,22570,22571,22572,22573,22574,22575,22576,22577,22578,22579,22580,22581,22582,22583,22584,22585,22586,22587,22588,22589,22590,22591,22592,22593,22594,22595,22596,22597,22598,22599,22600,22601,22602,22603,22604,22605,22606,22607,22608,22609,22610,22611,22612,22613,22614,22615,22616,22617,22618,22619,22620,22621,22622,22623,22624,22625,22626,22627,22628,22629,22630,22631,22632,22633,22634,22635,22636,22637,22638,22639,22640,22641,22642,22643,22644,22645,22646,22647,22648,22649,22650,22651,22652,22653,22654,22655,22656,22657,22658,22659,22660,22661,22662,22663,22664,22665,22666,22667,22668,22669,22670,22671,22672,22673,22674,22675,22676,22677,22678,22679,22680,22681,22682,22683,22684,22685,22686,22687,22688,22689,22690,22691,22692,22693,22694,22695,22696,22697,22698,22699,22700,22701,22702,22703,22704,22705,22706,22707,22708,22709,22710,22711,22712,22713,22714,22715,22716,22717,22718,22719,22720,22721,22722,22723,22724,22725,22726,22727,22728,22729,22730,22731,22732,22733,22734,22735,22736,22737,22738,22739,22740,22741,22742,22743,22744,22745,22746,22747,22748,22749,22750,22751,22752,22753,22754,22755,22756,22757,22758,22759,22760,22761,22762,22763,22764,22765,22766,22767,22768,22769,22770,22771,22772,22773,22774,22775,22776,22777,22778,22779,22780,22781,22782,22783,22784,22785,22786,22787,22788,22789,22790,22791,22792,22793,22794,22795,22796,22797,22798,22799,22800,22801,22802,22803,22804,22805,22806,22807,22808,22809,22810,22811,22812,22813,22814,22815,22816,22817,22818,22819,22820,22821,22822,22823,22824,22825,22826,22827,22828,22829,22830,22831,22832,22833,22834,22835,22836,22837,22838,22839,22840,22841,22842,22843,22844,22845,22846,22847,22848,22849,22850,22851,22852,22853,22854,22855,22856,22857,22858,22859,22860,22861,22862,22863,22864,22865,22866,22867,22868,22869,22870,22871,22872,22873,22874,22875,22876,22877,22878,22879,22880,22881,22882,22883,22884,22885,22886,22887,22888,22889,22890,22891,22892,22893,22894,22895,22896,22897,22898,22899,22900,22901,22902,22903,22904,22905,22906,22907,22908,22909,22910,22911,22912,22913,22914,22915,22916,22917,22918,22919,22920,22921,22922,22923,22924,22925,22926,22927,22928,22929,22930,22931,22932,22933,22934,22935,22936,22937,22938,22939,22940,22941,22942,22943,22944,22945,22946,22947,22948,22949,22950,22951,22952,22953,22954,22955,22956,22957,22958,22959,22960,22961,22962,22963,22964,22965,22966,22967,22968,22969,22970,22971,22972,22973,22974,22975,22976,22977,22978,22979,22980,22981,22982,22983,22984,22985,22986,22987,22988,22989,22990,22991,22992,22993,22994,22995,22996,22997,22998,22999,23000,23001,23002,23003,23004,23005,23006,23007,23008,23009,23010,23011,23012,23013,23014,23015,23016,23017,23018,23019,23020,23021,23022,23023,23024,23025,23026,23027,23028,23029,23030,23031,23032,23033,23034,23035,23036,23037,23038,23039,23040,23041,23042,23043,23044,23045,23046,23047,23048,23049,23050,23051,23052,23053,23054,23055,23056,23057,23058,23059,23060,23061,23062,23063,23064,23065,23066,23067,23068,23069,23070,23071,23072,23073,23074,23075,23076,23077,23078,23079,23080,23081,23082,23083,23084,23085,23086,23087,23088,23089,23090,23091,23092,23093,23094,23095,23096,23097,23098,23099,23100,23101,23102,23103,23104,23105,23106,23107,23108,23109,23110,23111,23112,23113,23114,23115,23116,23117,23118,23119,23120,23121,23122,23123,23124,23125,23126,23127,23128,23129,23130,23131,23132,23133,23134,23135,23136,23137,23138,23139,23140,23141,23142,23143,23144,23145,23146,23147,23148,23149,23150,23151,23152,23153,23154,23155,23156,23157,23158,23159,23160,23161,23162,23163,23164,23165,23166,23167,23168,23169,23170,23171,23172,23173,23174,23175,23176,23177,23178,23179,23180,23181,23182,23183,23184,23185,23186,23187,23188,23189,23190,23191,23192,23193,23194,23195,23196,23197,23198,23199,23200,23201,23202,23203,23204,23205,23206,23207,23208,23209,23210,23211,23212,23213,23214,23215,23216,23217,23218,23219,23220,23221,23222,23223,23224,23225,23226,23227,23228,23229,23230,23231,23232,23233,23234,23235,23236,23237,23238,23239,23240,23241,23242,23243,23244,23245,23246,23247,23248,23249,23250,23251,23252,23253,23254,23255,23256,23257,23258,23259,23260,23261,23262,23263,23264,23265,23266,23267,23268,23269,23270,23271,23272,23273,23274,23275,23276,23277,23278,23279,23280,23281,23282,23283,23284,23285,23286,23287,23288,23289,23290,23291,23292,23293,23294,23295,23296,23297,23298,23299,23300,23301,23302,23303,23304,23305,23306,23307,23308,23309,23310,23311,23312,23313,23314,23315,23316,23317,23318,23319,23320,23321,23322,23323,23324,23325,23326,23327,23328,23329,23330,23331,23332,23333,23334,23335,23336,23337,23338,23339,23340,23341,23342,23343,23344,23345,23346,23347,23348,23349,23350,23351,23352,23353,23354,23355,23356,23357,23358,23359,23360,23361,23362,23363,23364,23365,23366,23367,23368,23369,23370,23371,23372,23373,23374,23375,23376,23377,23378,23379,23380,23381,23382,23383,23384,23385,23386,23387,23388,23389,23390,23391,23392,23393,23394,23395,23396,23397,23398,23399,23400,23401,23402,23403,23404,23405,23406,23407,23408,23409,23410,23411,23412,23413,23414,23415,23416,23417,23418,23419,23420,23421,23422,23423,23424,23425,23426,23427,23428,23429,23430,23431,23432,23433,23434,23435,23436,23437,23438,23439,23440,23441,23442,23443,23444,23445,23446,23447,23448,23449,23450,23451,23452,23453,23454,23455,23456,23457,23458,23459,23460,23461,23462,23463,23464,23465,23466,23467,23468,23469,23470,23471,23472,23473,23474,23475,23476,23477,23478,23479,23480,23481,23482,23483,23484,23485,23486,23487,23488,23489,23490,23491,23492,23493,23494,23495,23496,23497,23498,23499,23500,23501,23502,23503,23504,23505,23506,23507,23508,23509,23510,23511,23512,23513,23514,23515,23516,23517,23518,23519,23520,23521,23522,23523,23524,23525,23526,23527,23528,23529,23530,23531,23532,23533,23534,23535,23536,23537,23538,23539,23540,23541,23542,23543,23544,23545,23546,23547,23548,23549,23550,23551,23552,23553,23554,23555,23556,23557,23558,23559,23560,23561,23562,23563,23564,23565,23566,23567,23568,23569,23570,23571,23572,23573,23574,23575,23576,23577,23578,23579,23580,23581,23582,23583,23584,23585,23586,23587,23588,23589,23590,23591,23592,23593,23594,23595,23596,23597,23598,23599,23600,23601,23602,23603,23604,23605,23606,23607,23608,23609,23610,23611,23612,23613,23614,23615,23616,23617,23618,23619,23620,23621,23622,23623,23624,23625,23626,23627,23628,23629,23630,23631,23632,23633,23634,23635,23636,23637,23638,23639,23640,23641,23642,23643,23644,23645,23646,23647,23648,23649,23650,23651,23652,23653,23654,23655,23656,23657,23658,23659,23660,23661,23662,23663,23664,23665,23666,23667,23668,23669,23670,23671,23672,23673,23674,23675,23676,23677,23678,23679,23680,23681,23682,23683,23684,23685,23686,23687,23688,23689,23690,23691,23692,23693,23694,23695,23696,23697,23698,23699,23700,23701,23702,23703,23704,23705,23706,23707,23708,23709,23710,23711,23712,23713,23714,23715,23716,23717,23718,23719,23720,23721,23722,23723,23724,23725,23726,23727,23728,23729,23730,23731,23732,23733,23734,23735,23736,23737,23738,23739,23740,23741,23742,23743,23744,23745,23746,23747,23748,23749,23750,23751,23752,23753,23754,23755,23756,23757,23758,23759,23760,23761,23762,23763,23764,23765,23766,23767,23768,23769,23770,23771,23772,23773,23774,23775,23776,23777,23778,23779,23780,23781,23782,23783,23784,23785,23786,23787,23788,23789,23790,23791,23792,23793,23794,23795,23796,23797,23798,23799,23800,23801,23802,23803,23804,23805,23806,23807,23808,23809,23810,23811,23812,23813,23814,23815,23816,23817,23818,23819,23820,23821,23822,23823,23824,23825,23826,23827,23828,23829,23830,23831,23832,23833,23834,23835,23836,23837,23838,23839,23840,23841,23842,23843,23844,23845,23846,23847,23848,23849,23850,23851,23852,23853,23854,23855,23856,23857,23858,23859,23860,23861,23862,23863,23864,23865,23866,23867,23868,23869,23870,23871,23872,23873,23874,23875,23876,23877,23878,23879,23880,23881,23882,23883,23884,23885,23886,23887,23888,23889,23890,23891,23892,23893,23894,23895,23896,23897,23898,23899,23900,23901,23902,23903,23904,23905,23906,23907,23908,23909,23910,23911,23912,23913,23914,23915,23916,23917,23918,23919,23920,23921,23922,23923,23924,23925,23926,23927,23928,23929,23930,23931,23932,23933,23934,23935,23936,23937,23938,23939,23940,23941,23942,23943,23944,23945,23946,23947,23948,23949,23950,23951,23952,23953,23954,23955,23956,23957,23958,23959,23960,23961,23962,23963,23964,23965,23966,23967,23968,23969,23970,23971,23972,23973,23974,23975,23976,23977,23978,23979,23980,23981,23982,23983,23984,23985,23986,23987,23988,23989,23990,23991,23992,23993,23994,23995,23996,23997,23998,23999,24000,24001,24002,24003,24004,24005,24006,24007,24008,24009,24010,24011,24012,24013,24014,24015,24016,24017,24018,24019,24020,24021,24022,24023,24024,24025,24026,24027,24028,24029,24030,24031,24032,24033,24034,24035,24036,24037,24038,24039,24040,24041,24042,24043,24044,24045,24046,24047,24048,24049,24050,24051,24052,24053,24054,24055,24056,24057,24058,24059,24060,24061,24062,24063,24064,24065,24066,24067,24068,24069,24070,24071,24072,24073,24074,24075,24076,24077,24078,24079,24080,24081,24082,24083,24084,24085,24086,24087,24088,24089,24090,24091,24092,24093,24094,24095,24096,24097,24098,24099,24100,24101,24102,24103,24104,24105,24106,24107,24108,24109,24110,24111,24112,24113,24114,24115,24116,24117,24118,24119,24120,24121,24122,24123,24124,24125,24126,24127,24128,24129,24130,24131,24132,24133,24134,24135,24136,24137,24138,24139,24140,24141,24142,24143,24144,24145,24146,24147,24148,24149,24150,24151,24152,24153,24154,24155,24156,24157,24158,24159,24160,24161,24162,24163,24164,24165,24166,24167,24168,24169,24170,24171,24172,24173,24174,24175,24176,24177,24178,24179,24180,24181,24182,24183,24184,24185,24186,24187,24188,24189,24190,24191,24192,24193,24194,24195,24196,24197,24198,24199,24200,24201,24202,24203,24204,24205,24206,24207,24208,24209,24210,24211,24212,24213,24214,24215,24216,24217,24218,24219,24220,24221,24222,24223,24224,24225,24226,24227,24228,24229,24230,24231,24232,24233,24234,24235,24236,24237,24238,24239,24240,24241,24242,24243,24244,24245,24246,24247,24248,24249,24250,24251,24252,24253,24254,24255,24256,24257,24258,24259,24260,24261,24262,24263,24264,24265,24266,24267,24268,24269,24270,24271,24272,24273,24274,24275,24276,24277,24278,24279,24280,24281,24282,24283,24284,24285,24286,24287,24288,24289,24290,24291,24292,24293,24294,24295,24296,24297,24298,24299,24300,24301,24302,24303,24304,24305,24306,24307,24308,24309,24310,24311,24312,24313,24314,24315,24316,24317,24318,24319,24320,24321,24322,24323,24324,24325,24326,24327,24328,24329,24330,24331,24332,24333,24334,24335,24336,24337,24338,24339,24340,24341,24342,24343,24344,24345,24346,24347,24348,24349,24350,24351,24352,24353,24354,24355,24356,24357,24358,24359,24360,24361,24362,24363,24364,24365,24366,24367,24368,24369,24370,24371,24372,24373,24374,24375,24376,24377,24378,24379,24380,24381,24382,24383,24384,24385,24386,24387,24388,24389,24390,24391,24392,24393,24394,24395,24396,24397,24398,24399,24400,24401,24402,24403,24404,24405,24406,24407,24408,24409,24410,24411,24412,24413,24414,24415,24416,24417,24418,24419,24420,24421,24422,24423,24424,24425,24426,24427,24428,24429,24430,24431,24432,24433,24434,24435,24436,24437,24438,24439,24440,24441,24442,24443,24444,24445,24446,24447,24448,24449,24450,24451,24452,24453,24454,24455,24456,24457,24458,24459,24460,24461,24462,24463,24464,24465,24466,24467,24468,24469,24470,24471,24472,24473,24474,24475,24476,24477,24478,24479,24480,24481,24482,24483,24484,24485,24486,24487,24488,24489,24490,24491,24492,24493,24494,24495,24496,24497,24498,24499,24500,24501,24502,24503,24504,24505,24506,24507,24508,24509,24510,24511,24512,24513,24514,24515,24516,24517,24518,24519,24520,24521,24522,24523,24524,24525,24526,24527,24528,24529,24530,24531,24532,24533,24534,24535,24536,24537,24538,24539,24540,24541,24542,24543,24544,24545,24546,24547,24548,24549,24550,24551,24552,24553,24554,24555,24556,24557,24558,24559,24560,24561,24562,24563,24564,24565,24566,24567,24568,24569,24570,24571,24572,24573,24574,24575,24576,24577,24578,24579,24580,24581,24582,24583,24584,24585,24586,24587,24588,24589,24590,24591,24592,24593,24594,24595,24596,24597,24598,24599,24600,24601,24602,24603,24604,24605,24606,24607,24608,24609,24610,24611,24612,24613,24614,24615,24616,24617,24618,24619,24620,24621,24622,24623,24624,24625,24626,24627,24628,24629,24630,24631,24632,24633,24634,24635,24636,24637,24638,24639,24640,24641,24642,24643,24644,24645,24646,24647,24648,24649,24650,24651,24652,24653,24654,24655,24656,24657,24658,24659,24660,24661,24662,24663,24664,24665,24666,24667,24668,24669,24670,24671,24672,24673,24674,24675,24676,24677,24678,24679,24680,24681,24682,24683,24684,24685,24686,24687,24688,24689,24690,24691,24692,24693,24694,24695,24696,24697,24698,24699,24700,24701,24702,24703,24704,24705,24706,24707,24708,24709,24710,24711,24712,24713,24714,24715,24716,24717,24718,24719,24720,24721,24722,24723,24724,24725,24726,24727,24728,24729,24730,24731,24732,24733,24734,24735,24736,24737,24738,24739,24740,24741,24742,24743,24744,24745,24746,24747,24748,24749,24750,24751,24752,24753,24754,24755,24756,24757,24758,24759,24760,24761,24762,24763,24764,24765,24766,24767,24768,24769,24770,24771,24772,24773,24774,24775,24776,24777,24778,24779,24780,24781,24782,24783,24784,24785,24786,24787,24788,24789,24790,24791,24792,24793,24794,24795,24796,24797,24798,24799,24800,24801,24802,24803,24804,24805,24806,24807,24808,24809,24810,24811,24812,24813,24814,24815,24816,24817,24818,24819,24820,24821,24822,24823,24824,24825,24826,24827,24828,24829,24830,24831,24832,24833,24834,24835,24836,24837,24838,24839,24840,24841,24842,24843,24844,24845,24846,24847,24848,24849,24850,24851,24852,24853,24854,24855,24856,24857,24858,24859,24860,24861,24862,24863,24864,24865,24866,24867,24868,24869,24870,24871,24872,24873,24874,24875,24876,24877,24878,24879,24880,24881,24882,24883,24884,24885,24886,24887,24888,24889,24890,24891,24892,24893,24894,24895,24896,24897,24898,24899,24900,24901,24902,24903,24904,24905,24906,24907,24908,24909,24910,24911,24912,24913,24914,24915,24916,24917,24918,24919,24920,24921,24922,24923,24924,24925,24926,24927,24928,24929,24930,24931,24932,24933,24934,24935,24936,24937,24938,24939,24940,24941,24942,24943,24944,24945,24946,24947,24948,24949,24950,24951,24952,24953,24954,24955,24956,24957,24958,24959,24960,24961,24962,24963,24964,24965,24966,24967,24968,24969,24970,24971,24972,24973,24974,24975,24976,24977,24978,24979,24980,24981,24982,24983,24984,24985,24986,24987,24988,24989,24990,24991,24992,24993,24994,24995,24996,24997,24998,24999,25000,25001,25002,25003,25004,25005,25006,25007,25008,25009,25010,25011,25012,25013,25014,25015,25016,25017,25018,25019,25020,25021,25022,25023,25024,25025,25026,25027,25028,25029,25030,25031,25032,25033,25034,25035,25036,25037,25038,25039,25040,25041,25042,25043,25044,25045,25046,25047,25048,25049,25050,25051,25052,25053,25054,25055,25056,25057,25058,25059,25060,25061,25062,25063,25064,25065,25066,25067,25068,25069,25070,25071,25072,25073,25074,25075,25076,25077,25078,25079,25080,25081,25082,25083,25084,25085,25086,25087,25088,25089,25090,25091,25092,25093,25094,25095,25096,25097,25098,25099,25100,25101,25102,25103,25104,25105,25106,25107,25108,25109,25110,25111,25112,25113,25114,25115,25116,25117,25118,25119,25120,25121,25122,25123,25124,25125,25126,25127,25128,25129,25130,25131,25132,25133,25134,25135,25136,25137,25138,25139,25140,25141,25142,25143,25144,25145,25146,25147,25148,25149,25150,25151,25152,25153,25154,25155,25156,25157,25158,25159,25160,25161,25162,25163,25164,25165,25166,25167,25168,25169,25170,25171,25172,25173,25174,25175,25176,25177,25178,25179,25180,25181,25182,25183,25184,25185,25186,25187,25188,25189,25190,25191,25192,25193,25194,25195,25196,25197,25198,25199,25200,25201,25202,25203,25204,25205,25206,25207,25208,25209,25210,25211,25212,25213,25214,25215,25216,25217,25218,25219,25220,25221,25222,25223,25224,25225,25226,25227,25228,25229,25230,25231,25232,25233,25234,25235,25236,25237,25238,25239,25240,25241,25242,25243,25244,25245,25246,25247,25248,25249,25250,25251,25252,25253,25254,25255,25256,25257,25258,25259,25260,25261,25262,25263,25264,25265,25266,25267,25268,25269,25270,25271,25272,25273,25274,25275,25276,25277,25278,25279,25280,25281,25282,25283,25284,25285,25286,25287,25288,25289,25290,25291,25292,25293,25294,25295,25296,25297,25298,25299,25300,25301,25302,25303,25304,25305,25306,25307,25308,25309,25310,25311,25312,25313,25314,25315,25316,25317,25318,25319,25320,25321,25322,25323,25324,25325,25326,25327,25328,25329,25330,25331,25332,25333,25334,25335,25336,25337,25338,25339,25340,25341,25342,25343,25344,25345,25346,25347,25348,25349,25350,25351,25352,25353,25354,25355,25356,25357,25358,25359,25360,25361,25362,25363,25364,25365,25366,25367,25368,25369,25370,25371,25372,25373,25374,25375,25376,25377,25378,25379,25380,25381,25382,25383,25384,25385,25386,25387,25388,25389,25390,25391,25392,25393,25394,25395,25396,25397,25398,25399,25400,25401,25402,25403,25404,25405,25406,25407,25408,25409,25410,25411,25412,25413,25414,25415,25416,25417,25418,25419,25420,25421,25422,25423,25424,25425,25426,25427,25428,25429,25430,25431,25432,25433,25434,25435,25436,25437,25438,25439,25440,25441,25442,25443,25444,25445,25446,25447,25448,25449,25450,25451,25452,25453,25454,25455,25456,25457,25458,25459,25460,25461,25462,25463,25464,25465,25466,25467,25468,25469,25470,25471,25472,25473,25474,25475,25476,25477,25478,25479,25480,25481,25482,25483,25484,25485,25486,25487,25488,25489,25490,25491,25492,25493,25494,25495,25496,25497,25498,25499,25500,25501,25502,25503,25504,25505,25506,25507,25508,25509,25510,25511,25512,25513,25514,25515,25516,25517,25518,25519,25520,25521,25522,25523,25524,25525,25526,25527,25528,25529,25530,25531,25532,25533,25534,25535,25536,25537,25538,25539,25540,25541,25542,25543,25544,25545,25546,25547,25548,25549,25550,25551,25552,25553,25554,25555,25556,25557,25558,25559,25560,25561,25562,25563,25564,25565,25566,25567,25568,25569,25570,25571,25572,25573,25574,25575,25576,25577,25578,25579,25580,25581,25582,25583,25584,25585,25586,25587,25588,25589,25590,25591,25592,25593,25594,25595,25596,25597,25598,25599,25600,25601,25602,25603,25604,25605,25606,25607,25608,25609,25610,25611,25612,25613,25614,25615,25616,25617,25618,25619,25620,25621,25622,25623,25624,25625,25626,25627,25628,25629,25630,25631,25632,25633,25634,25635,25636,25637,25638,25639,25640,25641,25642,25643,25644,25645,25646,25647,25648,25649,25650,25651,25652,25653,25654,25655,25656,25657,25658,25659,25660,25661,25662,25663,25664,25665,25666,25667,25668,25669,25670,25671,25672,25673,25674,25675,25676,25677,25678,25679,25680,25681,25682,25683,25684,25685,25686,25687,25688,25689,25690,25691,25692,25693,25694,25695,25696,25697,25698,25699,25700,25701,25702,25703,25704,25705,25706,25707,25708,25709,25710,25711,25712,25713,25714,25715,25716,25717,25718,25719,25720,25721,25722,25723,25724,25725,25726,25727,25728,25729,25730,25731,25732,25733,25734,25735,25736,25737,25738,25739,25740,25741,25742,25743,25744,25745,25746,25747,25748,25749,25750,25751,25752,25753,25754,25755,25756,25757,25758,25759,25760,25761,25762,25763,25764,25765,25766,25767,25768,25769,25770,25771,25772,25773,25774,25775,25776,25777,25778,25779,25780,25781,25782,25783,25784,25785,25786,25787,25788,25789,25790,25791,25792,25793,25794,25795,25796,25797,25798,25799,25800,25801,25802,25803,25804,25805,25806,25807,25808,25809,25810,25811,25812,25813,25814,25815,25816,25817,25818,25819,25820,25821,25822,25823,25824,25825,25826,25827,25828,25829,25830,25831,25832,25833,25834,25835,25836,25837,25838,25839,25840,25841,25842,25843,25844,25845,25846,25847,25848,25849,25850,25851,25852,25853,25854,25855,25856,25857,25858,25859,25860,25861,25862,25863,25864,25865,25866,25867,25868,25869,25870,25871,25872,25873,25874,25875,25876,25877,25878,25879,25880,25881,25882,25883,25884,25885,25886,25887,25888,25889,25890,25891,25892,25893,25894,25895,25896,25897,25898,25899,25900,25901,25902,25903,25904,25905,25906,25907,25908,25909,25910,25911,25912,25913,25914,25915,25916,25917,25918,25919,25920,25921,25922,25923,25924,25925,25926,25927,25928,25929,25930,25931,25932,25933,25934,25935,25936,25937,25938,25939,25940,25941,25942,25943,25944,25945,25946,25947,25948,25949,25950,25951,25952,25953,25954,25955,25956,25957,25958,25959,25960,25961,25962,25963,25964,25965,25966,25967,25968,25969,25970,25971,25972,25973,25974,25975,25976,25977,25978,25979,25980,25981,25982,25983,25984,25985,25986,25987,25988,25989,25990,25991,25992,25993,25994,25995,25996,25997,25998,25999,26000,26001,26002,26003,26004,26005,26006,26007,26008,26009,26010,26011,26012,26013,26014,26015,26016,26017,26018,26019,26020,26021,26022,26023,26024,26025,26026,26027,26028,26029,26030,26031,26032,26033,26034,26035,26036,26037,26038,26039,26040,26041,26042,26043,26044,26045,26046,26047,26048,26049,26050,26051,26052,26053,26054,26055,26056,26057,26058,26059,26060,26061,26062,26063,26064,26065,26066,26067,26068,26069,26070,26071,26072,26073,26074,26075,26076,26077,26078,26079,26080,26081,26082,26083,26084,26085,26086,26087,26088,26089,26090,26091,26092,26093,26094,26095,26096,26097,26098,26099,26100,26101,26102,26103,26104,26105,26106,26107,26108,26109,26110,26111,26112,26113,26114,26115,26116,26117,26118,26119,26120,26121,26122,26123,26124,26125,26126,26127,26128,26129,26130,26131,26132,26133,26134,26135,26136,26137,26138,26139,26140,26141,26142,26143,26144,26145,26146,26147,26148,26149,26150,26151,26152,26153,26154,26155,26156,26157,26158,26159,26160,26161,26162,26163,26164,26165,26166,26167,26168,26169,26170,26171,26172,26173,26174,26175,26176,26177,26178,26179,26180,26181,26182,26183,26184,26185,26186,26187,26188,26189,26190,26191,26192,26193,26194,26195,26196,26197,26198,26199,26200,26201,26202,26203,26204,26205,26206,26207,26208,26209,26210,26211,26212,26213,26214,26215,26216,26217,26218,26219,26220,26221,26222,26223,26224,26225,26226,26227,26228,26229,26230,26231,26232,26233,26234,26235,26236,26237,26238,26239,26240,26241,26242,26243,26244,26245,26246,26247,26248,26249,26250,26251,26252,26253,26254,26255,26256,26257,26258,26259,26260,26261,26262,26263,26264,26265,26266,26267,26268,26269,26270,26271,26272,26273,26274,26275,26276,26277,26278,26279,26280,26281,26282,26283,26284,26285,26286,26287,26288,26289,26290,26291,26292,26293,26294,26295,26296,26297,26298,26299,26300,26301,26302,26303,26304,26305,26306,26307,26308,26309,26310,26311,26312,26313,26314,26315,26316,26317,26318,26319,26320,26321,26322,26323,26324,26325,26326,26327,26328,26329,26330,26331,26332,26333,26334,26335,26336,26337,26338,26339,26340,26341,26342,26343,26344,26345,26346,26347,26348,26349,26350,26351,26352,26353,26354,26355,26356,26357,26358,26359,26360,26361,26362,26363,26364,26365,26366,26367,26368,26369,26370,26371,26372,26373,26374,26375,26376,26377,26378,26379,26380,26381,26382,26383,26384,26385,26386,26387,26388,26389,26390,26391,26392,26393,26394,26395,26396,26397,26398,26399,26400,26401,26402,26403,26404,26405,26406,26407,26408,26409,26410,26411,26412,26413,26414,26415,26416,26417,26418,26419,26420,26421,26422,26423,26424,26425,26426,26427,26428,26429,26430,26431,26432,26433,26434,26435,26436,26437,26438,26439,26440,26441,26442,26443,26444,26445,26446,26447,26448,26449,26450,26451,26452,26453,26454,26455,26456,26457,26458,26459,26460,26461,26462,26463,26464,26465,26466,26467,26468,26469,26470,26471,26472,26473,26474,26475,26476,26477,26478,26479,26480,26481,26482,26483,26484,26485,26486,26487,26488,26489,26490,26491,26492,26493,26494,26495,26496,26497,26498,26499,26500,26501,26502,26503,26504,26505,26506,26507,26508,26509,26510,26511,26512,26513,26514,26515,26516,26517,26518,26519,26520,26521,26522,26523,26524,26525,26526,26527,26528,26529,26530,26531,26532,26533,26534,26535,26536,26537,26538,26539,26540,26541,26542,26543,26544,26545,26546,26547,26548,26549,26550,26551,26552,26553,26554,26555,26556,26557,26558,26559,26560,26561,26562,26563,26564,26565,26566,26567,26568,26569,26570,26571,26572,26573,26574,26575,26576,26577,26578,26579,26580,26581,26582,26583,26584,26585,26586,26587,26588,26589,26590,26591,26592,26593,26594,26595,26596,26597,26598,26599,26600,26601,26602,26603,26604,26605,26606,26607,26608,26609,26610,26611,26612,26613,26614,26615,26616,26617,26618,26619,26620,26621,26622,26623,26624,26625,26626,26627,26628,26629,26630,26631,26632,26633,26634,26635,26636,26637,26638,26639,26640,26641,26642,26643,26644,26645,26646,26647,26648,26649,26650,26651,26652,26653,26654,26655,26656,26657,26658,26659,26660,26661,26662,26663,26664,26665,26666,26667,26668,26669,26670,26671,26672,26673,26674,26675,26676,26677,26678,26679,26680,26681,26682,26683,26684,26685,26686,26687,26688,26689,26690,26691,26692,26693,26694,26695,26696,26697,26698,26699,26700,26701,26702,26703,26704,26705,26706,26707,26708,26709,26710,26711,26712,26713,26714,26715,26716,26717,26718,26719,26720,26721,26722,26723,26724,26725,26726,26727,26728,26729,26730,26731,26732,26733,26734,26735,26736,26737,26738,26739,26740,26741,26742,26743,26744,26745,26746,26747,26748,26749,26750,26751,26752,26753,26754,26755,26756,26757,26758,26759,26760,26761,26762,26763,26764,26765,26766,26767,26768,26769,26770,26771,26772,26773,26774,26775,26776,26777,26778,26779,26780,26781,26782,26783,26784,26785,26786,26787,26788,26789,26790,26791,26792,26793,26794,26795,26796,26797,26798,26799,26800,26801,26802,26803,26804,26805,26806,26807,26808,26809,26810,26811,26812,26813,26814,26815,26816,26817,26818,26819,26820,26821,26822,26823,26824,26825,26826,26827,26828,26829,26830,26831,26832,26833,26834,26835,26836,26837,26838,26839,26840,26841,26842,26843,26844,26845,26846,26847,26848,26849,26850,26851,26852,26853,26854,26855,26856,26857,26858,26859,26860,26861,26862,26863,26864,26865,26866,26867,26868,26869,26870,26871,26872,26873,26874,26875,26876,26877,26878,26879,26880,26881,26882,26883,26884,26885,26886,26887,26888,26889,26890,26891,26892,26893,26894,26895,26896,26897,26898,26899,26900,26901,26902,26903,26904,26905,26906,26907,26908,26909,26910,26911,26912,26913,26914,26915,26916,26917,26918,26919,26920,26921,26922,26923,26924,26925,26926,26927,26928,26929,26930,26931,26932,26933,26934,26935,26936,26937,26938,26939,26940,26941,26942,26943,26944,26945,26946,26947,26948,26949,26950,26951,26952,26953,26954,26955,26956,26957,26958,26959,26960,26961,26962,26963,26964,26965,26966,26967,26968,26969,26970,26971,26972,26973,26974,26975,26976,26977,26978,26979,26980,26981,26982,26983,26984,26985,26986,26987,26988,26989,26990,26991,26992,26993,26994,26995,26996,26997,26998,26999,27000,27001,27002,27003,27004,27005,27006,27007,27008,27009,27010,27011,27012,27013,27014,27015,27016,27017,27018,27019,27020,27021,27022,27023,27024,27025,27026,27027,27028,27029,27030,27031,27032,27033,27034,27035,27036,27037,27038,27039,27040,27041,27042,27043,27044,27045,27046,27047,27048,27049,27050,27051,27052,27053,27054,27055,27056,27057,27058,27059,27060,27061,27062,27063,27064,27065,27066,27067,27068,27069,27070,27071,27072,27073,27074,27075,27076,27077,27078,27079,27080,27081,27082,27083,27084,27085,27086,27087,27088,27089,27090,27091,27092,27093,27094,27095,27096,27097,27098,27099,27100,27101,27102,27103,27104,27105,27106,27107,27108,27109,27110,27111,27112,27113,27114,27115,27116,27117,27118,27119,27120,27121,27122,27123,27124,27125,27126,27127,27128,27129,27130,27131,27132,27133,27134,27135,27136,27137,27138,27139,27140,27141,27142,27143,27144,27145,27146,27147,27148,27149,27150,27151,27152,27153,27154,27155,27156,27157,27158,27159,27160,27161,27162,27163,27164,27165,27166,27167,27168,27169,27170,27171,27172,27173,27174,27175,27176,27177,27178,27179,27180,27181,27182,27183,27184,27185,27186,27187,27188,27189,27190,27191,27192,27193,27194,27195,27196,27197,27198,27199,27200,27201,27202,27203,27204,27205,27206,27207,27208,27209,27210,27211,27212,27213,27214,27215,27216,27217,27218,27219,27220,27221,27222,27223,27224,27225,27226,27227,27228,27229,27230,27231,27232,27233,27234,27235,27236,27237,27238,27239,27240,27241,27242,27243,27244,27245,27246,27247,27248,27249,27250,27251,27252,27253,27254,27255,27256,27257,27258,27259,27260,27261,27262,27263,27264,27265,27266,27267,27268,27269,27270,27271,27272,27273,27274,27275,27276,27277,27278,27279,27280,27281,27282,27283,27284,27285,27286,27287,27288,27289,27290,27291,27292,27293,27294,27295,27296,27297,27298,27299,27300,27301,27302,27303,27304,27305,27306,27307,27308,27309,27310,27311,27312,27313,27314,27315,27316,27317,27318,27319,27320,27321,27322,27323,27324,27325,27326,27327,27328,27329,27330,27331,27332,27333,27334,27335,27336,27337,27338,27339,27340,27341,27342,27343,27344,27345,27346,27347,27348,27349,27350,27351,27352,27353,27354,27355,27356,27357,27358,27359,27360,27361,27362,27363,27364,27365,27366,27367,27368,27369,27370,27371,27372,27373,27374,27375,27376,27377,27378,27379,27380,27381,27382,27383,27384,27385,27386,27387,27388,27389,27390,27391,27392,27393,27394,27395,27396,27397,27398,27399,27400,27401,27402,27403,27404,27405,27406,27407,27408,27409,27410,27411,27412,27413,27414,27415,27416,27417,27418,27419,27420,27421,27422,27423,27424,27425,27426,27427,27428,27429,27430,27431,27432,27433,27434,27435,27436,27437,27438,27439,27440,27441,27442,27443,27444,27445,27446,27447,27448,27449,27450,27451,27452,27453,27454,27455,27456,27457,27458,27459,27460,27461,27462,27463,27464,27465,27466,27467,27468,27469,27470,27471,27472,27473,27474,27475,27476,27477,27478,27479,27480,27481,27482,27483,27484,27485,27486,27487,27488,27489,27490,27491,27492,27493,27494,27495,27496,27497,27498,27499,27500,27501,27502,27503,27504,27505,27506,27507,27508,27509,27510,27511,27512,27513,27514,27515,27516,27517,27518,27519,27520,27521,27522,27523,27524,27525,27526,27527,27528,27529,27530,27531,27532,27533,27534,27535,27536,27537,27538,27539,27540,27541,27542,27543,27544,27545,27546,27547,27548,27549,27550,27551,27552,27553,27554,27555,27556,27557,27558,27559,27560,27561,27562,27563,27564,27565,27566,27567,27568,27569,27570,27571,27572,27573,27574,27575,27576,27577,27578,27579,27580,27581,27582,27583,27584,27585,27586,27587,27588,27589,27590,27591,27592,27593,27594,27595,27596,27597,27598,27599,27600,27601,27602,27603,27604,27605,27606,27607,27608,27609,27610,27611,27612,27613,27614,27615,27616,27617,27618,27619,27620,27621,27622,27623,27624,27625,27626,27627,27628,27629,27630,27631,27632,27633,27634,27635,27636,27637,27638,27639,27640,27641,27642,27643,27644,27645,27646,27647,27648,27649,27650,27651,27652,27653,27654,27655,27656,27657,27658,27659,27660,27661,27662,27663,27664,27665,27666,27667,27668,27669,27670,27671,27672,27673,27674,27675,27676,27677,27678,27679,27680,27681,27682,27683,27684,27685,27686,27687,27688,27689,27690,27691,27692,27693,27694,27695,27696,27697,27698,27699,27700,27701,27702,27703,27704,27705,27706,27707,27708,27709,27710,27711,27712,27713,27714,27715,27716,27717,27718,27719,27720,27721,27722,27723,27724,27725,27726,27727,27728,27729,27730,27731,27732,27733,27734,27735,27736,27737,27738,27739,27740,27741,27742,27743,27744,27745,27746,27747,27748,27749,27750,27751,27752,27753,27754,27755,27756,27757,27758,27759,27760,27761,27762,27763,27764,27765,27766,27767,27768,27769,27770,27771,27772,27773,27774,27775,27776,27777,27778,27779,27780,27781,27782,27783,27784,27785,27786,27787,27788,27789,27790,27791,27792,27793,27794,27795,27796,27797,27798,27799,27800,27801,27802,27803,27804,27805,27806,27807,27808,27809,27810,27811,27812,27813,27814,27815,27816,27817,27818,27819,27820,27821,27822,27823,27824,27825,27826,27827,27828,27829,27830,27831,27832,27833,27834,27835,27836,27837,27838,27839,27840,27841,27842,27843,27844,27845,27846,27847,27848,27849,27850,27851,27852,27853,27854,27855,27856,27857,27858,27859,27860,27861,27862,27863,27864,27865,27866,27867,27868,27869,27870,27871,27872,27873,27874,27875,27876,27877,27878,27879,27880,27881,27882,27883,27884,27885,27886,27887,27888,27889,27890,27891,27892,27893,27894,27895,27896,27897,27898,27899,27900,27901,27902,27903,27904,27905,27906,27907,27908,27909,27910,27911,27912,27913,27914,27915,27916,27917,27918,27919,27920,27921,27922,27923,27924,27925,27926,27927,27928,27929,27930,27931,27932,27933,27934,27935,27936,27937,27938,27939,27940,27941,27942,27943,27944,27945,27946,27947,27948,27949,27950,27951,27952,27953,27954,27955,27956,27957,27958,27959,27960,27961,27962,27963,27964,27965,27966,27967,27968,27969,27970,27971,27972,27973,27974,27975,27976,27977,27978,27979,27980,27981,27982,27983,27984,27985,27986,27987,27988,27989,27990,27991,27992,27993,27994,27995,27996,27997,27998,27999,28000,28001,28002,28003,28004,28005,28006,28007,28008,28009,28010,28011,28012,28013,28014,28015,28016,28017,28018,28019,28020,28021,28022,28023,28024,28025,28026,28027,28028,28029,28030,28031,28032,28033,28034,28035,28036,28037,28038,28039,28040,28041,28042,28043,28044,28045,28046,28047,28048,28049,28050,28051,28052,28053,28054,28055,28056,28057,28058,28059,28060,28061,28062,28063,28064,28065,28066,28067,28068,28069,28070,28071,28072,28073,28074,28075,28076,28077,28078,28079,28080,28081,28082,28083,28084,28085,28086,28087,28088,28089,28090,28091,28092,28093,28094,28095,28096,28097,28098,28099,28100,28101,28102,28103,28104,28105,28106,28107,28108,28109,28110,28111,28112,28113,28114,28115,28116,28117,28118,28119,28120,28121,28122,28123,28124,28125,28126,28127,28128,28129,28130,28131,28132,28133,28134,28135,28136,28137,28138,28139,28140,28141,28142,28143,28144,28145,28146,28147,28148,28149,28150,28151,28152,28153,28154,28155,28156,28157,28158,28159,28160,28161,28162,28163,28164,28165,28166,28167,28168,28169,28170,28171,28172,28173,28174,28175,28176,28177,28178,28179,28180,28181,28182,28183,28184,28185,28186,28187,28188,28189,28190,28191,28192,28193,28194,28195,28196,28197,28198,28199,28200,28201,28202,28203,28204,28205,28206,28207,28208,28209,28210,28211,28212,28213,28214,28215,28216,28217,28218,28219,28220,28221,28222,28223,28224,28225,28226,28227,28228,28229,28230,28231,28232,28233,28234,28235,28236,28237,28238,28239,28240,28241,28242,28243,28244,28245,28246,28247,28248,28249,28250,28251,28252,28253,28254,28255,28256,28257,28258,28259,28260,28261,28262,28263,28264,28265,28266,28267,28268,28269,28270,28271,28272,28273,28274,28275,28276,28277,28278,28279,28280,28281,28282,28283,28284,28285,28286,28287,28288,28289,28290,28291,28292,28293,28294,28295,28296,28297,28298,28299,28300,28301,28302,28303,28304,28305,28306,28307,28308,28309,28310,28311,28312,28313,28314,28315,28316,28317,28318,28319,28320,28321,28322,28323,28324,28325,28326,28327,28328,28329,28330,28331,28332,28333,28334,28335,28336,28337,28338,28339,28340,28341,28342,28343,28344,28345,28346,28347,28348,28349,28350,28351,28352,28353,28354,28355,28356,28357,28358,28359,28360,28361,28362,28363,28364,28365,28366,28367,28368,28369,28370,28371,28372,28373,28374,28375,28376,28377,28378,28379,28380,28381,28382,28383,28384,28385,28386,28387,28388,28389,28390,28391,28392,28393,28394,28395,28396,28397,28398,28399,28400,28401,28402,28403,28404,28405,28406,28407,28408,28409,28410,28411,28412,28413,28414,28415,28416,28417,28418,28419,28420,28421,28422,28423,28424,28425,28426,28427,28428,28429,28430,28431,28432,28433,28434,28435,28436,28437,28438,28439,28440,28441,28442,28443,28444,28445,28446,28447,28448,28449,28450,28451,28452,28453,28454,28455,28456,28457,28458,28459,28460,28461,28462,28463,28464,28465,28466,28467,28468,28469,28470,28471,28472,28473,28474,28475,28476,28477,28478,28479,28480,28481,28482,28483,28484,28485,28486,28487,28488,28489,28490,28491,28492,28493,28494,28495,28496,28497,28498,28499,28500,28501,28502,28503,28504,28505,28506,28507,28508,28509,28510,28511,28512,28513,28514,28515,28516,28517,28518,28519,28520,28521,28522,28523,28524,28525,28526,28527,28528,28529,28530,28531,28532,28533,28534,28535,28536,28537,28538,28539,28540,28541,28542,28543,28544,28545,28546,28547,28548,28549,28550,28551,28552,28553,28554,28555,28556,28557,28558,28559,28560,28561,28562,28563,28564,28565,28566,28567,28568,28569,28570,28571,28572,28573,28574,28575,28576,28577,28578,28579,28580,28581,28582,28583,28584,28585,28586,28587,28588,28589,28590,28591,28592,28593,28594,28595,28596,28597,28598,28599,28600,28601,28602,28603,28604,28605,28606,28607,28608,28609,28610,28611,28612,28613,28614,28615,28616,28617,28618,28619,28620,28621,28622,28623,28624,28625,28626,28627,28628,28629,28630,28631,28632,28633,28634,28635,28636,28637,28638,28639,28640,28641,28642,28643,28644,28645,28646,28647,28648,28649,28650,28651,28652,28653,28654,28655,28656,28657,28658,28659,28660,28661,28662,28663,28664,28665,28666,28667,28668,28669,28670,28671,28672,28673,28674,28675,28676,28677,28678,28679,28680,28681,28682,28683,28684,28685,28686,28687,28688,28689,28690,28691,28692,28693,28694,28695,28696,28697,28698,28699,28700,28701,28702,28703,28704,28705,28706,28707,28708,28709,28710,28711,28712,28713,28714,28715,28716,28717,28718,28719,28720,28721,28722,28723,28724,28725,28726,28727,28728,28729,28730,28731,28732,28733,28734,28735,28736,28737,28738,28739,28740,28741,28742,28743,28744,28745,28746,28747,28748,28749,28750,28751,28752,28753,28754,28755,28756,28757,28758,28759,28760,28761,28762,28763,28764,28765,28766,28767,28768,28769,28770,28771,28772,28773,28774,28775,28776,28777,28778,28779,28780,28781,28782,28783,28784,28785,28786,28787,28788,28789,28790,28791,28792,28793,28794,28795,28796,28797,28798,28799,28800,28801,28802,28803,28804,28805,28806,28807,28808,28809,28810,28811,28812,28813,28814,28815,28816,28817,28818,28819,28820,28821,28822,28823,28824,28825,28826,28827,28828,28829,28830,28831,28832,28833,28834,28835,28836,28837,28838,28839,28840,28841,28842,28843,28844,28845,28846,28847,28848,28849,28850,28851,28852,28853,28854,28855,28856,28857,28858,28859,28860,28861,28862,28863,28864,28865,28866,28867,28868,28869,28870,28871,28872,28873,28874,28875,28876,28877,28878,28879,28880,28881,28882,28883,28884,28885,28886,28887,28888,28889,28890,28891,28892,28893,28894,28895,28896,28897,28898,28899,28900,28901,28902,28903,28904,28905,28906,28907,28908,28909,28910,28911,28912,28913,28914,28915,28916,28917,28918,28919,28920,28921,28922,28923,28924,28925,28926,28927,28928,28929,28930,28931,28932,28933,28934,28935,28936,28937,28938,28939,28940,28941,28942,28943,28944,28945,28946,28947,28948,28949,28950,28951,28952,28953,28954,28955,28956,28957,28958,28959,28960,28961,28962,28963,28964,28965,28966,28967,28968,28969,28970,28971,28972,28973,28974,28975,28976,28977,28978,28979,28980,28981,28982,28983,28984,28985,28986,28987,28988,28989,28990,28991,28992,28993,28994,28995,28996,28997,28998,28999,29000,29001,29002,29003,29004,29005,29006,29007,29008,29009,29010,29011,29012,29013,29014,29015,29016,29017,29018,29019,29020,29021,29022,29023,29024,29025,29026,29027,29028,29029,29030,29031,29032,29033,29034,29035,29036,29037,29038,29039,29040,29041,29042,29043,29044,29045,29046,29047,29048,29049,29050,29051,29052,29053,29054,29055,29056,29057,29058,29059,29060,29061,29062,29063,29064,29065,29066,29067,29068,29069,29070,29071,29072,29073,29074,29075,29076,29077,29078,29079,29080,29081,29082,29083,29084,29085,29086,29087,29088,29089,29090,29091,29092,29093,29094,29095,29096,29097,29098,29099,29100,29101,29102,29103,29104,29105,29106,29107,29108,29109,29110,29111,29112,29113,29114,29115,29116,29117,29118,29119,29120,29121,29122,29123,29124,29125,29126,29127,29128,29129,29130,29131,29132,29133,29134,29135,29136,29137,29138,29139,29140,29141,29142,29143,29144,29145,29146,29147,29148,29149,29150,29151,29152,29153,29154,29155,29156,29157,29158,29159,29160,29161,29162,29163,29164,29165,29166,29167,29168,29169,29170,29171,29172,29173,29174,29175,29176,29177,29178,29179,29180,29181,29182,29183,29184,29185,29186,29187,29188,29189,29190,29191,29192,29193,29194,29195,29196,29197,29198,29199,29200,29201,29202,29203,29204,29205,29206,29207,29208,29209,29210,29211,29212,29213,29214,29215,29216,29217,29218,29219,29220,29221,29222,29223,29224,29225,29226,29227,29228,29229,29230,29231,29232,29233,29234,29235,29236,29237,29238,29239,29240,29241,29242,29243,29244,29245,29246,29247,29248,29249,29250,29251,29252,29253,29254,29255,29256,29257,29258,29259,29260,29261,29262,29263,29264,29265,29266,29267,29268,29269,29270,29271,29272,29273,29274,29275,29276,29277,29278,29279,29280,29281,29282,29283,29284,29285,29286,29287,29288,29289,29290,29291,29292,29293,29294,29295,29296,29297,29298,29299,29300,29301,29302,29303,29304,29305,29306,29307,29308,29309,29310,29311,29312,29313,29314,29315,29316,29317,29318,29319,29320,29321,29322,29323,29324,29325,29326,29327,29328,29329,29330,29331,29332,29333,29334,29335,29336,29337,29338,29339,29340,29341,29342,29343,29344,29345,29346,29347,29348,29349,29350,29351,29352,29353,29354,29355,29356,29357,29358,29359,29360,29361,29362,29363,29364,29365,29366,29367,29368,29369,29370,29371,29372,29373,29374,29375,29376,29377,29378,29379,29380,29381,29382,29383,29384,29385,29386,29387,29388,29389,29390,29391,29392,29393,29394,29395,29396,29397,29398,29399,29400,29401,29402,29403,29404,29405,29406,29407,29408,29409,29410,29411,29412,29413,29414,29415,29416,29417,29418,29419,29420,29421,29422,29423,29424,29425,29426,29427,29428,29429,29430,29431,29432,29433,29434,29435,29436,29437,29438,29439,29440,29441,29442,29443,29444,29445,29446,29447,29448,29449,29450,29451,29452,29453,29454,29455,29456,29457,29458,29459,29460,29461,29462,29463,29464,29465,29466,29467,29468,29469,29470,29471,29472,29473,29474,29475,29476,29477,29478,29479,29480,29481,29482,29483,29484,29485,29486,29487,29488,29489,29490,29491,29492,29493,29494,29495,29496,29497,29498,29499,29500,29501,29502,29503,29504,29505,29506,29507,29508,29509,29510,29511,29512,29513,29514,29515,29516,29517,29518,29519,29520,29521,29522,29523,29524,29525,29526,29527,29528,29529,29530,29531,29532,29533,29534,29535,29536,29537,29538,29539,29540,29541,29542,29543,29544,29545,29546,29547,29548,29549,29550,29551,29552,29553,29554,29555,29556,29557,29558,29559,29560,29561,29562,29563,29564,29565,29566,29567,29568,29569,29570,29571,29572,29573,29574,29575,29576,29577,29578,29579,29580,29581,29582,29583,29584,29585,29586,29587,29588,29589,29590,29591,29592,29593,29594,29595,29596,29597,29598,29599,29600,29601,29602,29603,29604,29605,29606,29607,29608,29609,29610,29611,29612,29613,29614,29615,29616,29617,29618,29619,29620,29621,29622,29623,29624,29625,29626,29627,29628,29629,29630,29631,29632,29633,29634,29635,29636,29637,29638,29639,29640,29641,29642,29643,29644,29645,29646,29647,29648,29649,29650,29651,29652,29653,29654,29655,29656,29657,29658,29659,29660,29661,29662,29663,29664,29665,29666,29667,29668,29669,29670,29671,29672,29673,29674,29675,29676,29677,29678,29679,29680,29681,29682,29683,29684,29685,29686,29687,29688,29689,29690,29691,29692,29693,29694,29695,29696,29697,29698,29699,29700,29701,29702,29703,29704,29705,29706,29707,29708,29709,29710,29711,29712,29713,29714,29715,29716,29717,29718,29719,29720,29721,29722,29723,29724,29725,29726,29727,29728,29729,29730,29731,29732,29733,29734,29735,29736,29737,29738,29739,29740,29741,29742,29743,29744,29745,29746,29747,29748,29749,29750,29751,29752,29753,29754,29755,29756,29757,29758,29759,29760,29761,29762,29763,29764,29765,29766,29767,29768,29769,29770,29771,29772,29773,29774,29775,29776,29777,29778,29779,29780,29781,29782,29783,29784,29785,29786,29787,29788,29789,29790,29791,29792,29793,29794,29795,29796,29797,29798,29799,29800,29801,29802,29803,29804,29805,29806,29807,29808,29809,29810,29811,29812,29813,29814,29815,29816,29817,29818,29819,29820,29821,29822,29823,29824,29825,29826,29827,29828,29829,29830,29831,29832,29833,29834,29835,29836,29837,29838,29839,29840,29841,29842,29843,29844,29845,29846,29847,29848,29849,29850,29851,29852,29853,29854,29855,29856,29857,29858,29859,29860,29861,29862,29863,29864,29865,29866,29867,29868,29869,29870,29871,29872,29873,29874,29875,29876,29877,29878,29879,29880,29881,29882,29883,29884,29885,29886,29887,29888,29889,29890,29891,29892,29893,29894,29895,29896,29897,29898,29899,29900,29901,29902,29903,29904,29905,29906,29907,29908,29909,29910,29911,29912,29913,29914,29915,29916,29917,29918,29919,29920,29921,29922,29923,29924,29925,29926,29927,29928,29929,29930,29931,29932,29933,29934,29935,29936,29937,29938,29939,29940,29941,29942,29943,29944,29945,29946,29947,29948,29949,29950,29951,29952,29953,29954,29955,29956,29957,29958,29959,29960,29961,29962,29963,29964,29965,29966,29967,29968,29969,29970,29971,29972,29973,29974,29975,29976,29977,29978,29979,29980,29981,29982,29983,29984,29985,29986,29987,29988,29989,29990,29991,29992,29993,29994,29995,29996,29997,29998,29999,30000,30001,30002,30003,30004,30005,30006,30007,30008,30009,30010,30011,30012,30013,30014,30015,30016,30017,30018,30019,30020,30021,30022,30023,30024,30025,30026,30027,30028,30029,30030,30031,30032,30033,30034,30035,30036,30037,30038,30039,30040,30041,30042,30043,30044,30045,30046,30047,30048,30049,30050,30051,30052,30053,30054,30055,30056,30057,30058,30059,30060,30061,30062,30063,30064,30065,30066,30067,30068,30069,30070,30071,30072,30073,30074,30075,30076,30077,30078,30079,30080,30081,30082,30083,30084,30085,30086,30087,30088,30089,30090,30091,30092,30093,30094,30095,30096,30097,30098,30099,30100,30101,30102,30103,30104,30105,30106,30107,30108,30109,30110,30111,30112,30113,30114,30115,30116,30117,30118,30119,30120,30121,30122,30123,30124,30125,30126,30127,30128,30129,30130,30131,30132,30133,30134,30135,30136,30137,30138,30139,30140,30141,30142,30143,30144,30145,30146,30147,30148,30149,30150,30151,30152,30153,30154,30155,30156,30157,30158,30159,30160,30161,30162,30163,30164,30165,30166,30167,30168,30169,30170,30171,30172,30173,30174,30175,30176,30177,30178,30179,30180,30181,30182,30183,30184,30185,30186,30187,30188,30189,30190,30191,30192,30193,30194,30195,30196,30197,30198,30199,30200,30201,30202,30203,30204,30205,30206,30207,30208,30209,30210,30211,30212,30213,30214,30215,30216,30217,30218,30219,30220,30221,30222,30223,30224,30225,30226,30227,30228,30229,30230,30231,30232,30233,30234,30235,30236,30237,30238,30239,30240,30241,30242,30243,30244,30245,30246,30247,30248,30249,30250,30251,30252,30253,30254,30255,30256,30257,30258,30259,30260,30261,30262,30263,30264,30265,30266,30267,30268,30269,30270,30271,30272,30273,30274,30275,30276,30277,30278,30279,30280,30281,30282,30283,30284,30285,30286,30287,30288,30289,30290,30291,30292,30293,30294,30295,30296,30297,30298,30299,30300,30301,30302,30303,30304,30305,30306,30307,30308,30309,30310,30311,30312,30313,30314,30315,30316,30317,30318,30319,30320,30321,30322,30323,30324,30325,30326,30327,30328,30329,30330,30331,30332,30333,30334,30335,30336,30337,30338,30339,30340,30341,30342,30343,30344,30345,30346,30347,30348,30349,30350,30351,30352,30353,30354,30355,30356,30357,30358,30359,30360,30361,30362,30363,30364,30365,30366,30367,30368,30369,30370,30371,30372,30373,30374,30375,30376,30377,30378,30379,30380,30381,30382,30383,30384,30385,30386,30387,30388,30389,30390,30391,30392,30393,30394,30395,30396,30397,30398,30399,30400,30401,30402,30403,30404,30405,30406,30407,30408,30409,30410,30411,30412,30413,30414,30415,30416,30417,30418,30419,30420,30421,30422,30423,30424,30425,30426,30427,30428,30429,30430,30431,30432,30433,30434,30435,30436,30437,30438,30439,30440,30441,30442,30443,30444,30445,30446,30447,30448,30449,30450,30451,30452,30453,30454,30455,30456,30457,30458,30459,30460,30461,30462,30463,30464,30465,30466,30467,30468,30469,30470,30471,30472,30473,30474,30475,30476,30477,30478,30479,30480,30481,30482,30483,30484,30485,30486,30487,30488,30489,30490,30491,30492,30493,30494,30495,30496,30497,30498,30499,30500,30501,30502,30503,30504,30505,30506,30507,30508,30509,30510,30511,30512,30513,30514,30515,30516,30517,30518,30519,30520,30521,30522,30523,30524,30525,30526,30527,30528,30529,30530,30531,30532,30533,30534,30535,30536,30537,30538,30539,30540,30541,30542,30543,30544,30545,30546,30547,30548,30549,30550,30551,30552,30553,30554,30555,30556,30557,30558,30559,30560,30561,30562,30563,30564,30565,30566,30567,30568,30569,30570,30571,30572,30573,30574,30575,30576,30577,30578,30579,30580,30581,30582,30583,30584,30585,30586,30587,30588,30589,30590,30591,30592,30593,30594,30595,30596,30597,30598,30599,30600,30601,30602,30603,30604,30605,30606,30607,30608,30609,30610,30611,30612,30613,30614,30615,30616,30617,30618,30619,30620,30621,30622,30623,30624,30625,30626,30627,30628,30629,30630,30631,30632,30633,30634,30635,30636,30637,30638,30639,30640,30641,30642,30643,30644,30645,30646,30647,30648,30649,30650,30651,30652,30653,30654,30655,30656,30657,30658,30659,30660,30661,30662,30663,30664,30665,30666,30667,30668,30669,30670,30671,30672,30673,30674,30675,30676,30677,30678,30679,30680,30681,30682,30683,30684,30685,30686,30687,30688,30689,30690,30691,30692,30693,30694,30695,30696,30697,30698,30699,30700,30701,30702,30703,30704,30705,30706,30707,30708,30709,30710,30711,30712,30713,30714,30715,30716,30717,30718,30719,30720,30721,30722,30723,30724,30725,30726,30727,30728,30729,30730,30731,30732,30733,30734,30735,30736,30737,30738,30739,30740,30741,30742,30743,30744,30745,30746,30747,30748,30749,30750,30751,30752,30753,30754,30755,30756,30757,30758,30759,30760,30761,30762,30763,30764,30765,30766,30767,30768,30769,30770,30771,30772,30773,30774,30775,30776,30777,30778,30779,30780,30781,30782,30783,30784,30785,30786,30787,30788,30789,30790,30791,30792,30793,30794,30795,30796,30797,30798,30799,30800,30801,30802,30803,30804,30805,30806,30807,30808,30809,30810,30811,30812,30813,30814,30815,30816,30817,30818,30819,30820,30821,30822,30823,30824,30825,30826,30827,30828,30829,30830,30831,30832,30833,30834,30835,30836,30837,30838,30839,30840,30841,30842,30843,30844,30845,30846,30847,30848,30849,30850,30851,30852,30853,30854,30855,30856,30857,30858,30859,30860,30861,30862,30863,30864,30865,30866,30867,30868,30869,30870,30871,30872,30873,30874,30875,30876,30877,30878,30879,30880,30881,30882,30883,30884,30885,30886,30887,30888,30889,30890,30891,30892,30893,30894,30895,30896,30897,30898,30899,30900,30901,30902,30903,30904,30905,30906,30907,30908,30909,30910,30911,30912,30913,30914,30915,30916,30917,30918,30919,30920,30921,30922,30923,30924,30925,30926,30927,30928,30929,30930,30931,30932,30933,30934,30935,30936,30937,30938,30939,30940,30941,30942,30943,30944,30945,30946,30947,30948,30949,30950,30951,30952,30953,30954,30955,30956,30957,30958,30959,30960,30961,30962,30963,30964,30965,30966,30967,30968,30969,30970,30971,30972,30973,30974,30975,30976,30977,30978,30979,30980,30981,30982,30983,30984,30985,30986,30987,30988,30989,30990,30991,30992,30993,30994,30995,30996,30997,30998,30999,31000,31001,31002,31003,31004,31005,31006,31007,31008,31009,31010,31011,31012,31013,31014,31015,31016,31017,31018,31019,31020,31021,31022,31023,31024,31025,31026,31027,31028,31029,31030,31031,31032,31033,31034,31035,31036,31037,31038,31039,31040,31041,31042,31043,31044,31045,31046,31047,31048,31049,31050,31051,31052,31053,31054,31055,31056,31057,31058,31059,31060,31061,31062,31063,31064,31065,31066,31067,31068,31069,31070,31071,31072,31073,31074,31075,31076,31077,31078,31079,31080,31081,31082,31083,31084,31085,31086,31087,31088,31089,31090,31091,31092,31093,31094,31095,31096,31097,31098,31099,31100,31101,31102,31103,31104,31105,31106,31107,31108,31109,31110,31111,31112,31113,31114,31115,31116,31117,31118,31119,31120,31121,31122,31123,31124,31125,31126,31127,31128,31129,31130,31131,31132,31133,31134,31135,31136,31137,31138,31139,31140,31141,31142,31143,31144,31145,31146,31147,31148,31149,31150,31151,31152,31153,31154,31155,31156,31157,31158,31159,31160,31161,31162,31163,31164,31165,31166,31167,31168,31169,31170,31171,31172,31173,31174,31175,31176,31177,31178,31179,31180,31181,31182,31183,31184,31185,31186,31187,31188,31189,31190,31191,31192,31193,31194,31195,31196,31197,31198,31199,31200,31201,31202,31203,31204,31205,31206,31207,31208,31209,31210,31211,31212,31213,31214,31215,31216,31217,31218,31219,31220,31221,31222,31223,31224,31225,31226,31227,31228,31229,31230,31231,31232,31233,31234,31235,31236,31237,31238,31239,31240,31241,31242,31243,31244,31245,31246,31247,31248,31249,31250,31251,31252,31253,31254,31255,31256,31257,31258,31259,31260,31261,31262,31263,31264,31265,31266,31267,31268,31269,31270,31271,31272,31273,31274,31275,31276,31277,31278,31279,31280,31281,31282,31283,31284,31285,31286,31287,31288,31289,31290,31291,31292,31293,31294,31295,31296,31297,31298,31299,31300,31301,31302,31303,31304,31305,31306,31307,31308,31309,31310,31311,31312,31313,31314,31315,31316,31317,31318,31319,31320,31321,31322,31323,31324,31325,31326,31327,31328,31329,31330,31331,31332,31333,31334,31335,31336,31337,31338,31339,31340,31341,31342,31343,31344,31345,31346,31347,31348,31349,31350,31351,31352,31353,31354,31355,31356,31357,31358,31359,31360,31361,31362,31363,31364,31365,31366,31367,31368,31369,31370,31371,31372,31373,31374,31375,31376,31377,31378,31379,31380,31381,31382,31383,31384,31385,31386,31387,31388,31389,31390,31391,31392,31393,31394,31395,31396,31397,31398,31399,31400,31401,31402,31403,31404,31405,31406,31407,31408,31409,31410,31411,31412,31413,31414,31415,31416,31417,31418,31419,31420,31421,31422,31423,31424,31425,31426,31427,31428,31429,31430,31431,31432,31433,31434,31435,31436,31437,31438,31439,31440,31441,31442,31443,31444,31445,31446,31447,31448,31449,31450,31451,31452,31453,31454,31455,31456,31457,31458,31459,31460,31461,31462,31463,31464,31465,31466,31467,31468,31469,31470,31471,31472,31473,31474,31475,31476,31477,31478,31479,31480,31481,31482,31483,31484,31485,31486,31487,31488,31489,31490,31491,31492,31493,31494,31495,31496,31497,31498,31499,31500,31501,31502,31503,31504,31505,31506,31507,31508,31509,31510,31511,31512,31513,31514,31515,31516,31517,31518,31519,31520,31521,31522,31523,31524,31525,31526,31527,31528,31529,31530,31531,31532,31533,31534,31535,31536,31537,31538,31539,31540,31541,31542,31543,31544,31545,31546,31547,31548,31549,31550,31551,31552,31553,31554,31555,31556,31557,31558,31559,31560,31561,31562,31563,31564,31565,31566,31567,31568,31569,31570,31571,31572,31573,31574,31575,31576,31577,31578,31579,31580,31581,31582,31583,31584,31585,31586,31587,31588,31589,31590,31591,31592,31593,31594,31595,31596,31597,31598,31599,31600,31601,31602,31603,31604,31605,31606,31607,31608,31609,31610,31611,31612,31613,31614,31615,31616,31617,31618,31619,31620,31621,31622,31623,31624,31625,31626,31627,31628,31629,31630,31631,31632,31633,31634,31635,31636,31637,31638,31639,31640,31641,31642,31643,31644,31645,31646,31647,31648,31649,31650,31651,31652,31653,31654,31655,31656,31657,31658,31659,31660,31661,31662,31663,31664,31665,31666,31667,31668,31669,31670,31671,31672,31673,31674,31675,31676,31677,31678,31679,31680,31681,31682,31683,31684,31685,31686,31687,31688,31689,31690,31691,31692,31693,31694,31695,31696,31697,31698,31699,31700,31701,31702,31703,31704,31705,31706,31707,31708,31709,31710,31711,31712,31713,31714,31715,31716,31717,31718,31719,31720,31721,31722,31723,31724,31725,31726,31727,31728,31729,31730,31731,31732,31733,31734,31735,31736,31737,31738,31739,31740,31741,31742,31743,31744,31745,31746,31747,31748,31749,31750,31751,31752,31753,31754,31755,31756,31757,31758,31759,31760,31761,31762,31763,31764,31765,31766,31767,31768,31769,31770,31771,31772,31773,31774,31775,31776,31777,31778,31779,31780,31781,31782,31783,31784,31785,31786,31787,31788,31789,31790,31791,31792,31793,31794,31795,31796,31797,31798,31799,31800,31801,31802,31803,31804,31805,31806,31807,31808,31809,31810,31811,31812,31813,31814,31815,31816,31817,31818,31819,31820,31821,31822,31823,31824,31825,31826,31827,31828,31829,31830,31831,31832,31833,31834,31835,31836,31837,31838,31839,31840,31841,31842,31843,31844,31845,31846,31847,31848,31849,31850,31851,31852,31853,31854,31855,31856,31857,31858,31859,31860,31861,31862,31863,31864,31865,31866,31867,31868,31869,31870,31871,31872,31873,31874,31875,31876,31877,31878,31879,31880,31881,31882,31883,31884,31885,31886,31887,31888,31889,31890,31891,31892,31893,31894,31895,31896,31897,31898,31899,31900,31901,31902,31903,31904,31905,31906,31907,31908,31909,31910,31911,31912,31913,31914,31915,31916,31917,31918,31919,31920,31921,31922,31923,31924,31925,31926,31927,31928,31929,31930,31931,31932,31933,31934,31935,31936,31937,31938,31939,31940,31941,31942,31943,31944,31945,31946,31947,31948,31949,31950,31951,31952,31953,31954,31955,31956,31957,31958,31959,31960,31961,31962,31963,31964,31965,31966,31967,31968,31969,31970,31971,31972,31973,31974,31975,31976,31977,31978,31979,31980,31981,31982,31983,31984,31985,31986,31987,31988,31989,31990,31991,31992,31993,31994,31995,31996,31997,31998,31999,32000,32001,32002,32003,32004,32005,32006,32007,32008,32009,32010,32011,32012,32013,32014,32015,32016,32017,32018,32019,32020,32021,32022,32023,32024,32025,32026,32027,32028,32029,32030,32031,32032,32033,32034,32035,32036,32037,32038,32039,32040,32041,32042,32043,32044,32045,32046,32047,32048,32049,32050,32051,32052,32053,32054,32055,32056,32057,32058,32059,32060,32061,32062,32063,32064,32065,32066,32067,32068,32069,32070,32071,32072,32073,32074,32075,32076,32077,32078,32079,32080,32081,32082,32083,32084,32085,32086,32087,32088,32089,32090,32091,32092,32093,32094,32095,32096,32097,32098,32099,32100,32101,32102,32103,32104,32105,32106,32107,32108,32109,32110,32111,32112,32113,32114,32115,32116,32117,32118,32119,32120,32121,32122,32123,32124,32125,32126,32127,32128,32129,32130,32131,32132,32133,32134,32135,32136,32137,32138,32139,32140,32141,32142,32143,32144,32145,32146,32147,32148,32149,32150,32151,32152,32153,32154,32155,32156,32157,32158,32159,32160,32161,32162,32163,32164,32165,32166,32167,32168,32169,32170,32171,32172,32173,32174,32175,32176,32177,32178,32179,32180,32181,32182,32183,32184,32185,32186,32187,32188,32189,32190,32191,32192,32193,32194,32195,32196,32197,32198,32199,32200,32201,32202,32203,32204,32205,32206,32207,32208,32209,32210,32211,32212,32213,32214,32215,32216,32217,32218,32219,32220,32221,32222,32223,32224,32225,32226,32227,32228,32229,32230,32231,32232,32233,32234,32235,32236,32237,32238,32239,32240,32241,32242,32243,32244,32245,32246,32247,32248,32249,32250,32251,32252,32253,32254,32255,32256,32257,32258,32259,32260,32261,32262,32263,32264,32265,32266,32267,32268,32269,32270,32271,32272,32273,32274,32275,32276,32277,32278,32279,32280,32281,32282,32283,32284,32285,32286,32287,32288,32289,32290,32291,32292,32293,32294,32295,32296,32297,32298,32299,32300,32301,32302,32303,32304,32305,32306,32307,32308,32309,32310,32311,32312,32313,32314,32315,32316,32317,32318,32319,32320,32321,32322,32323,32324,32325,32326,32327,32328,32329,32330,32331,32332,32333,32334,32335,32336,32337,32338,32339,32340,32341,32342,32343,32344,32345,32346,32347,32348,32349,32350,32351,32352,32353,32354,32355,32356,32357,32358,32359,32360,32361,32362,32363,32364,32365,32366,32367,32368,32369,32370,32371,32372,32373,32374,32375,32376,32377,32378,32379,32380,32381,32382,32383,32384,32385,32386,32387,32388,32389,32390,32391,32392,32393,32394,32395,32396,32397,32398,32399,32400,32401,32402,32403,32404,32405,32406,32407,32408,32409,32410,32411,32412,32413,32414,32415,32416,32417,32418,32419,32420,32421,32422,32423,32424,32425,32426,32427,32428,32429,32430,32431,32432,32433,32434,32435,32436,32437,32438,32439,32440,32441,32442,32443,32444,32445,32446,32447,32448,32449,32450,32451,32452,32453,32454,32455,32456,32457,32458,32459,32460,32461,32462,32463,32464,32465,32466,32467,32468,32469,32470,32471,32472,32473,32474,32475,32476,32477,32478,32479,32480,32481,32482,32483,32484,32485,32486,32487,32488,32489,32490,32491,32492,32493,32494,32495,32496,32497,32498,32499,32500,32501,32502,32503,32504,32505,32506,32507,32508,32509,32510,32511,32512,32513,32514,32515,32516,32517,32518,32519,32520,32521,32522,32523,32524,32525,32526,32527,32528,32529,32530,32531,32532,32533,32534,32535,32536,32537,32538,32539,32540,32541,32542,32543,32544,32545,32546,32547,32548,32549,32550,32551,32552,32553,32554,32555,32556,32557,32558,32559,32560,32561,32562,32563,32564,32565,32566,32567,32568,32569,32570,32571,32572,32573,32574,32575,32576,32577,32578,32579,32580,32581,32582,32583,32584,32585,32586,32587,32588,32589,32590,32591,32592,32593,32594,32595,32596,32597,32598,32599,32600,32601,32602,32603,32604,32605,32606,32607,32608,32609,32610,32611,32612,32613,32614,32615,32616,32617,32618,32619,32620,32621,32622,32623,32624,32625,32626,32627,32628,32629,32630,32631,32632,32633,32634,32635,32636,32637,32638,32639,32640,32641,32642,32643,32644,32645,32646,32647,32648,32649,32650,32651,32652,32653,32654,32655,32656,32657,32658,32659,32660,32661,32662,32663,32664,32665,32666,32667,32668,32669,32670,32671,32672,32673,32674,32675,32676,32677,32678,32679,32680,32681,32682,32683,32684,32685,32686,32687,32688,32689,32690,32691,32692,32693,32694,32695,32696,32697,32698,32699,32700,32701,32702,32703,32704,32705,32706,32707,32708,32709,32710,32711,32712,32713,32714,32715,32716,32717,32718,32719,32720,32721,32722,32723,32724,32725,32726,32727,32728,32729,32730,32731,32732,32733,32734,32735,32736,32737,32738,32739,32740,32741,32742,32743,32744,32745,32746,32747,32748,32749,32750,32751,32752,32753,32754,32755,32756,32757,32758,32759,32760,32761,32762,32763,32764,32765,32766,32767,32768,32769,32770,32771,32772,32773,32774,32775,32776,32777,32778,32779,32780,32781,32782,32783,32784,32785,32786,32787,32788,32789,32790,32791,32792,32793,32794,32795,32796,32797,32798,32799,32800,32801,32802,32803,32804,32805,32806,32807,32808,32809,32810,32811,32812,32813,32814,32815,32816,32817,32818,32819,32820,32821,32822,32823,32824,32825,32826,32827,32828,32829,32830,32831,32832,32833,32834,32835,32836,32837,32838,32839,32840,32841,32842,32843,32844,32845,32846,32847,32848,32849,32850,32851,32852,32853,32854,32855,32856,32857,32858,32859,32860,32861,32862,32863,32864,32865,32866,32867,32868,32869,32870,32871,32872,32873,32874,32875,32876,32877,32878,32879,32880,32881,32882,32883,32884,32885,32886,32887,32888,32889,32890,32891,32892,32893,32894,32895,32896,32897,32898,32899,32900,32901,32902,32903,32904,32905,32906,32907,32908,32909,32910,32911,32912,32913,32914,32915,32916,32917,32918,32919,32920,32921,32922,32923,32924,32925,32926,32927,32928,32929,32930,32931,32932,32933,32934,32935,32936,32937,32938,32939,32940,32941,32942,32943,32944,32945,32946,32947,32948,32949,32950,32951,32952,32953,32954,32955,32956,32957,32958,32959,32960,32961,32962,32963,32964,32965,32966,32967,32968,32969,32970,32971,32972,32973,32974,32975,32976,32977,32978,32979,32980,32981,32982,32983,32984,32985,32986,32987,32988,32989,32990,32991,32992,32993,32994,32995,32996,32997,32998,32999,33000,33001,33002,33003,33004,33005,33006,33007,33008,33009,33010,33011,33012,33013,33014,33015,33016,33017,33018,33019,33020,33021,33022,33023,33024,33025,33026,33027,33028,33029,33030,33031,33032,33033,33034,33035,33036,33037,33038,33039,33040,33041,33042,33043,33044,33045,33046,33047,33048,33049,33050,33051,33052,33053,33054,33055,33056,33057,33058,33059,33060,33061,33062,33063,33064,33065,33066,33067,33068,33069,33070,33071,33072,33073,33074,33075,33076,33077,33078,33079,33080,33081,33082,33083,33084,33085,33086,33087,33088,33089,33090,33091,33092,33093,33094,33095,33096,33097,33098,33099,33100,33101,33102,33103,33104,33105,33106,33107,33108,33109,33110,33111,33112,33113,33114,33115,33116,33117,33118,33119,33120,33121,33122,33123,33124,33125,33126,33127,33128,33129,33130,33131,33132,33133,33134,33135,33136,33137,33138,33139,33140,33141,33142,33143,33144,33145,33146,33147,33148,33149,33150,33151,33152,33153,33154,33155,33156,33157,33158,33159,33160,33161,33162,33163,33164,33165,33166,33167,33168,33169,33170,33171,33172,33173,33174,33175,33176,33177,33178,33179,33180,33181,33182,33183,33184,33185,33186,33187,33188,33189,33190,33191,33192,33193,33194,33195,33196,33197,33198,33199,33200,33201,33202,33203,33204,33205,33206,33207,33208,33209,33210,33211,33212,33213,33214,33215,33216,33217,33218,33219,33220,33221,33222,33223,33224,33225,33226,33227,33228,33229,33230,33231,33232,33233,33234,33235,33236,33237,33238,33239,33240,33241,33242,33243,33244,33245,33246,33247,33248,33249,33250,33251,33252,33253,33254,33255,33256,33257,33258,33259,33260,33261,33262,33263,33264,33265,33266,33267,33268,33269,33270,33271,33272,33273,33274,33275,33276,33277,33278,33279,33280,33281,33282,33283,33284,33285,33286,33287,33288,33289,33290,33291,33292,33293,33294,33295,33296,33297,33298,33299,33300,33301,33302,33303,33304,33305,33306,33307,33308,33309,33310,33311,33312,33313,33314,33315,33316,33317,33318,33319,33320,33321,33322,33323,33324,33325,33326,33327,33328,33329,33330,33331,33332,33333,33334,33335,33336,33337,33338,33339,33340,33341,33342,33343,33344,33345,33346,33347,33348,33349,33350,33351,33352,33353,33354,33355,33356,33357,33358,33359,33360,33361,33362,33363,33364,33365,33366,33367,33368,33369,33370,33371,33372,33373,33374,33375,33376,33377,33378,33379,33380,33381,33382,33383,33384,33385,33386,33387,33388,33389,33390,33391,33392,33393,33394,33395,33396,33397,33398,33399,33400,33401,33402,33403,33404,33405,33406,33407,33408,33409,33410,33411,33412,33413,33414,33415,33416,33417,33418,33419,33420,33421,33422,33423,33424,33425,33426,33427,33428,33429,33430,33431,33432,33433,33434,33435,33436,33437,33438,33439,33440,33441,33442,33443,33444,33445,33446,33447,33448,33449,33450,33451,33452,33453,33454,33455,33456,33457,33458,33459,33460,33461,33462,33463,33464,33465,33466,33467,33468,33469,33470,33471,33472,33473,33474,33475,33476,33477,33478,33479,33480,33481,33482,33483,33484,33485,33486,33487,33488,33489,33490,33491,33492,33493,33494,33495,33496,33497,33498,33499,33500,33501,33502,33503,33504,33505,33506,33507,33508,33509,33510,33511,33512,33513,33514,33515,33516,33517,33518,33519,33520,33521,33522,33523,33524,33525,33526,33527,33528,33529,33530,33531,33532,33533,33534,33535,33536,33537,33538,33539,33540,33541,33542,33543,33544,33545,33546,33547,33548,33549,33550,33551,33552,33553,33554,33555,33556,33557,33558,33559,33560,33561,33562,33563,33564,33565,33566,33567,33568,33569,33570,33571,33572,33573,33574,33575,33576,33577,33578,33579,33580,33581,33582,33583,33584,33585,33586,33587,33588,33589,33590,33591,33592,33593,33594,33595,33596,33597,33598,33599,33600,33601,33602,33603,33604,33605,33606,33607,33608,33609,33610,33611,33612,33613,33614,33615,33616,33617,33618,33619,33620,33621,33622,33623,33624,33625,33626,33627,33628,33629,33630,33631,33632,33633,33634,33635,33636,33637,33638,33639,33640,33641,33642,33643,33644,33645,33646,33647,33648,33649,33650,33651,33652,33653,33654,33655,33656,33657,33658,33659,33660,33661,33662,33663,33664,33665,33666,33667,33668,33669,33670,33671,33672,33673,33674,33675,33676,33677,33678,33679,33680,33681,33682,33683,33684,33685,33686,33687,33688,33689,33690,33691,33692,33693,33694,33695,33696,33697,33698,33699,33700,33701,33702,33703,33704,33705,33706,33707,33708,33709,33710,33711,33712,33713,33714,33715,33716,33717,33718,33719,33720,33721,33722,33723,33724,33725,33726,33727,33728,33729,33730,33731,33732,33733,33734,33735,33736,33737,33738,33739,33740,33741,33742,33743,33744,33745,33746,33747,33748,33749,33750,33751,33752,33753,33754,33755,33756,33757,33758,33759,33760,33761,33762,33763,33764,33765,33766,33767,33768,33769,33770,33771,33772,33773,33774,33775,33776,33777,33778,33779,33780,33781,33782,33783,33784,33785,33786,33787,33788,33789,33790,33791,33792,33793,33794,33795,33796,33797,33798,33799,33800,33801,33802,33803,33804,33805,33806,33807,33808,33809,33810,33811,33812,33813,33814,33815,33816,33817,33818,33819,33820,33821,33822,33823,33824,33825,33826,33827,33828,33829,33830,33831,33832,33833,33834,33835,33836,33837,33838,33839,33840,33841,33842,33843,33844,33845,33846,33847,33848,33849,33850,33851,33852,33853,33854,33855,33856,33857,33858,33859,33860,33861,33862,33863,33864,33865,33866,33867,33868,33869,33870,33871,33872,33873,33874,33875,33876,33877,33878,33879,33880,33881,33882,33883,33884,33885,33886,33887,33888,33889,33890,33891,33892,33893,33894,33895,33896,33897,33898,33899,33900,33901,33902,33903,33904,33905,33906,33907,33908,33909,33910,33911,33912,33913,33914,33915,33916,33917,33918,33919,33920,33921,33922,33923,33924,33925,33926,33927,33928,33929,33930,33931,33932,33933,33934,33935,33936,33937,33938,33939,33940,33941,33942,33943,33944,33945,33946,33947,33948,33949,33950,33951,33952,33953,33954,33955,33956,33957,33958,33959,33960,33961,33962,33963,33964,33965,33966,33967,33968,33969,33970,33971,33972,33973,33974,33975,33976,33977,33978,33979,33980,33981,33982,33983,33984,33985,33986,33987,33988,33989,33990,33991,33992,33993,33994,33995,33996,33997,33998,33999,34000,34001,34002,34003,34004,34005,34006,34007,34008,34009,34010,34011,34012,34013,34014,34015,34016,34017,34018,34019,34020,34021,34022,34023,34024,34025,34026,34027,34028,34029,34030,34031,34032,34033,34034,34035,34036,34037,34038,34039,34040,34041,34042,34043,34044,34045,34046,34047,34048,34049,34050,34051,34052,34053,34054,34055,34056,34057,34058,34059,34060,34061,34062,34063,34064,34065,34066,34067,34068,34069,34070,34071,34072,34073,34074,34075,34076,34077,34078,34079,34080,34081,34082,34083,34084,34085,34086,34087,34088,34089,34090,34091,34092,34093,34094,34095,34096,34097,34098,34099,34100,34101,34102,34103,34104,34105,34106,34107,34108,34109,34110,34111,34112,34113,34114,34115,34116,34117,34118,34119,34120,34121,34122,34123,34124,34125,34126,34127,34128,34129,34130,34131,34132,34133,34134,34135,34136,34137,34138,34139,34140,34141,34142,34143,34144,34145,34146,34147,34148,34149,34150,34151,34152,34153,34154,34155,34156,34157,34158,34159,34160,34161,34162,34163,34164,34165,34166,34167,34168,34169,34170,34171,34172,34173,34174,34175,34176,34177,34178,34179,34180,34181,34182,34183,34184,34185,34186,34187,34188,34189,34190,34191,34192,34193,34194,34195,34196,34197,34198,34199,34200,34201,34202,34203,34204,34205,34206,34207,34208,34209,34210,34211,34212,34213,34214,34215,34216,34217,34218,34219,34220,34221,34222,34223,34224,34225,34226,34227,34228,34229,34230,34231,34232,34233,34234,34235,34236,34237,34238,34239,34240,34241,34242,34243,34244,34245,34246,34247,34248,34249,34250,34251,34252,34253,34254,34255,34256,34257,34258,34259,34260,34261,34262,34263,34264,34265,34266,34267,34268,34269,34270,34271,34272,34273,34274,34275,34276,34277,34278,34279,34280,34281,34282,34283,34284,34285,34286,34287,34288,34289,34290,34291,34292,34293,34294,34295,34296,34297,34298,34299,34300,34301,34302,34303,34304,34305,34306,34307,34308,34309,34310,34311,34312,34313,34314,34315,34316,34317,34318,34319,34320,34321,34322,34323,34324,34325,34326,34327,34328,34329,34330,34331,34332,34333,34334,34335,34336,34337,34338,34339,34340,34341,34342,34343,34344,34345,34346,34347,34348,34349,34350,34351,34352,34353,34354,34355,34356,34357,34358,34359,34360,34361,34362,34363,34364,34365,34366,34367,34368,34369,34370,34371,34372,34373,34374,34375,34376,34377,34378,34379,34380,34381,34382,34383,34384,34385,34386,34387,34388,34389,34390,34391,34392,34393,34394,34395,34396,34397,34398,34399,34400,34401,34402,34403,34404,34405,34406,34407,34408,34409,34410,34411,34412,34413,34414,34415,34416,34417,34418,34419,34420,34421,34422,34423,34424,34425,34426,34427,34428,34429,34430,34431,34432,34433,34434,34435,34436,34437,34438,34439,34440,34441,34442,34443,34444,34445,34446,34447,34448,34449,34450,34451,34452,34453,34454,34455,34456,34457,34458,34459,34460,34461,34462,34463,34464,34465,34466,34467,34468,34469,34470,34471,34472,34473,34474,34475,34476,34477,34478,34479,34480,34481,34482,34483,34484,34485,34486,34487,34488,34489,34490,34491,34492,34493,34494,34495,34496,34497,34498,34499,34500,34501,34502,34503,34504,34505,34506,34507,34508,34509,34510,34511,34512,34513,34514,34515,34516,34517,34518,34519,34520,34521,34522,34523,34524,34525,34526,34527,34528,34529,34530,34531,34532,34533,34534,34535,34536,34537,34538,34539,34540,34541,34542,34543,34544,34545,34546,34547,34548,34549,34550,34551,34552,34553,34554,34555,34556,34557,34558,34559,34560,34561,34562,34563,34564,34565,34566,34567,34568,34569,34570,34571,34572,34573,34574,34575,34576,34577,34578,34579,34580,34581,34582,34583,34584,34585,34586,34587,34588,34589,34590,34591,34592,34593,34594,34595,34596,34597,34598,34599,34600,34601,34602,34603,34604,34605,34606,34607,34608,34609,34610,34611,34612,34613,34614,34615,34616,34617,34618,34619,34620,34621,34622,34623,34624,34625,34626,34627,34628,34629,34630,34631,34632,34633,34634,34635,34636,34637,34638,34639,34640,34641,34642,34643,34644,34645,34646,34647,34648,34649,34650,34651,34652,34653,34654,34655,34656,34657,34658,34659,34660,34661,34662,34663,34664,34665,34666,34667,34668,34669,34670,34671,34672,34673,34674,34675,34676,34677,34678,34679,34680,34681,34682,34683,34684,34685,34686,34687,34688,34689,34690,34691,34692,34693,34694,34695,34696,34697,34698,34699,34700,34701,34702,34703,34704,34705,34706,34707,34708,34709,34710,34711,34712,34713,34714,34715,34716,34717,34718,34719,34720,34721,34722,34723,34724,34725,34726,34727,34728,34729,34730,34731,34732,34733,34734,34735,34736,34737,34738,34739,34740,34741,34742,34743,34744,34745,34746,34747,34748,34749,34750,34751,34752,34753,34754,34755,34756,34757,34758,34759,34760,34761,34762,34763,34764,34765,34766,34767,34768,34769,34770,34771,34772,34773,34774,34775,34776,34777,34778,34779,34780,34781,34782,34783,34784,34785,34786,34787,34788,34789,34790,34791,34792,34793,34794,34795,34796,34797,34798,34799,34800,34801,34802,34803,34804,34805,34806,34807,34808,34809,34810,34811,34812,34813,34814,34815,34816,34817,34818,34819,34820,34821,34822,34823,34824,34825,34826,34827,34828,34829,34830,34831,34832,34833,34834,34835,34836,34837,34838,34839,34840,34841,34842,34843,34844,34845,34846,34847,34848,34849,34850,34851,34852,34853,34854,34855,34856,34857,34858,34859,34860,34861,34862,34863,34864,34865,34866,34867,34868,34869,34870,34871,34872,34873,34874,34875,34876,34877,34878,34879,34880,34881,34882,34883,34884,34885,34886,34887,34888,34889,34890,34891,34892,34893,34894,34895,34896,34897,34898,34899,34900,34901,34902,34903,34904,34905,34906,34907,34908,34909,34910,34911,34912,34913,34914,34915,34916,34917,34918,34919,34920,34921,34922,34923,34924,34925,34926,34927,34928,34929,34930,34931,34932,34933,34934,34935,34936,34937,34938,34939,34940,34941,34942,34943,34944,34945,34946,34947,34948,34949,34950,34951,34952,34953,34954,34955,34956,34957,34958,34959,34960,34961,34962,34963,34964,34965,34966,34967,34968,34969,34970,34971,34972,34973,34974,34975,34976,34977,34978,34979,34980,34981,34982,34983,34984,34985,34986,34987,34988,34989,34990,34991,34992,34993,34994,34995,34996,34997,34998,34999,35000,35001,35002,35003,35004,35005,35006,35007,35008,35009,35010,35011,35012,35013,35014,35015,35016,35017,35018,35019,35020,35021,35022,35023,35024,35025,35026,35027,35028,35029,35030,35031,35032,35033,35034,35035,35036,35037,35038,35039,35040,35041,35042,35043,35044,35045,35046,35047,35048,35049,35050,35051,35052,35053,35054,35055,35056,35057,35058,35059,35060,35061,35062,35063,35064,35065,35066,35067,35068,35069,35070,35071,35072,35073,35074,35075,35076,35077,35078,35079,35080,35081,35082,35083,35084,35085,35086,35087,35088,35089,35090,35091,35092,35093,35094,35095,35096,35097,35098,35099,35100,35101,35102,35103,35104,35105,35106,35107,35108,35109,35110,35111,35112,35113,35114,35115,35116,35117,35118,35119,35120,35121,35122,35123,35124,35125,35126,35127,35128,35129,35130,35131,35132,35133,35134,35135,35136,35137,35138,35139,35140,35141,35142,35143,35144,35145,35146,35147,35148,35149,35150,35151,35152,35153,35154,35155,35156,35157,35158,35159,35160,35161,35162,35163,35164,35165,35166,35167,35168,35169,35170,35171,35172,35173,35174,35175,35176,35177,35178,35179,35180,35181,35182,35183,35184,35185,35186,35187,35188,35189,35190,35191,35192,35193,35194,35195,35196,35197,35198,35199,35200,35201,35202,35203,35204,35205,35206,35207,35208,35209,35210,35211,35212,35213,35214,35215,35216,35217,35218,35219,35220,35221,35222,35223,35224,35225,35226,35227,35228,35229,35230,35231,35232,35233,35234,35235,35236,35237,35238,35239,35240,35241,35242,35243,35244,35245,35246,35247,35248,35249,35250,35251,35252,35253,35254,35255,35256,35257,35258,35259,35260,35261,35262,35263,35264,35265,35266,35267,35268,35269,35270,35271,35272,35273,35274,35275,35276,35277,35278,35279,35280,35281,35282,35283,35284,35285,35286,35287,35288,35289,35290,35291,35292,35293,35294,35295,35296,35297,35298,35299,35300,35301,35302,35303,35304,35305,35306,35307,35308,35309,35310,35311,35312,35313,35314,35315,35316,35317,35318,35319,35320,35321,35322,35323,35324,35325,35326,35327,35328,35329,35330,35331,35332,35333,35334,35335,35336,35337,35338,35339,35340,35341,35342,35343,35344,35345,35346,35347,35348,35349,35350,35351,35352,35353,35354,35355,35356,35357,35358,35359,35360,35361,35362,35363,35364,35365,35366,35367,35368,35369,35370,35371,35372,35373,35374,35375,35376,35377,35378,35379,35380,35381,35382,35383,35384,35385,35386,35387,35388,35389,35390,35391,35392,35393,35394,35395,35396,35397,35398,35399,35400,35401,35402,35403,35404,35405,35406,35407,35408,35409,35410,35411,35412,35413,35414,35415,35416,35417,35418,35419,35420,35421,35422,35423,35424,35425,35426,35427,35428,35429,35430,35431,35432,35433,35434,35435,35436,35437,35438,35439,35440,35441,35442,35443,35444,35445,35446,35447,35448,35449,35450,35451,35452,35453,35454,35455,35456,35457,35458,35459,35460,35461,35462,35463,35464,35465,35466,35467,35468,35469,35470,35471,35472,35473,35474,35475,35476,35477,35478,35479,35480,35481,35482,35483,35484,35485,35486,35487,35488,35489,35490,35491,35492,35493,35494,35495,35496,35497,35498,35499,35500,35501,35502,35503,35504,35505,35506,35507,35508,35509,35510,35511,35512,35513,35514,35515,35516,35517,35518,35519,35520,35521,35522,35523,35524,35525,35526,35527,35528,35529,35530,35531,35532,35533,35534,35535,35536,35537,35538,35539,35540,35541,35542,35543,35544,35545,35546,35547,35548,35549,35550,35551,35552,35553,35554,35555,35556,35557,35558,35559,35560,35561,35562,35563,35564,35565,35566,35567,35568,35569,35570,35571,35572,35573,35574,35575,35576,35577,35578,35579,35580,35581,35582,35583,35584,35585,35586,35587,35588,35589,35590,35591,35592,35593,35594,35595,35596,35597,35598,35599,35600,35601,35602,35603,35604,35605,35606,35607,35608,35609,35610,35611,35612,35613,35614,35615,35616,35617,35618,35619,35620,35621,35622,35623,35624,35625,35626,35627,35628,35629,35630,35631,35632,35633,35634,35635,35636,35637,35638,35639,35640,35641,35642,35643,35644,35645,35646,35647,35648,35649,35650,35651,35652,35653,35654,35655,35656,35657,35658,35659,35660,35661,35662,35663,35664,35665,35666,35667,35668,35669,35670,35671,35672,35673,35674,35675,35676,35677,35678,35679,35680,35681,35682,35683,35684,35685,35686,35687,35688,35689,35690,35691,35692,35693,35694,35695,35696,35697,35698,35699,35700,35701,35702,35703,35704,35705,35706,35707,35708,35709,35710,35711,35712,35713,35714,35715,35716,35717,35718,35719,35720,35721,35722,35723,35724,35725,35726,35727,35728,35729,35730,35731,35732,35733,35734,35735,35736,35737,35738,35739,35740,35741,35742,35743,35744,35745,35746,35747,35748,35749,35750,35751,35752,35753,35754,35755,35756,35757,35758,35759,35760,35761,35762,35763,35764,35765,35766,35767,35768,35769,35770,35771,35772,35773,35774,35775,35776,35777,35778,35779,35780,35781,35782,35783,35784,35785,35786,35787,35788,35789,35790,35791,35792,35793,35794,35795,35796,35797,35798,35799,35800,35801,35802,35803,35804,35805,35806,35807,35808,35809,35810,35811,35812,35813,35814,35815,35816,35817,35818,35819,35820,35821,35822,35823,35824,35825,35826,35827,35828,35829,35830,35831,35832,35833,35834,35835,35836,35837,35838,35839,35840,35841,35842,35843,35844,35845,35846,35847,35848,35849,35850,35851,35852,35853,35854,35855,35856,35857,35858,35859,35860,35861,35862,35863,35864,35865,35866,35867,35868,35869,35870,35871,35872,35873,35874,35875,35876,35877,35878,35879,35880,35881,35882,35883,35884,35885,35886,35887,35888,35889,35890,35891,35892,35893,35894,35895,35896,35897,35898,35899,35900,35901,35902,35903,35904,35905,35906,35907,35908,35909,35910,35911,35912,35913,35914,35915,35916,35917,35918,35919,35920,35921,35922,35923,35924,35925,35926,35927,35928,35929,35930,35931,35932,35933,35934,35935,35936,35937,35938,35939,35940,35941,35942,35943,35944,35945,35946,35947,35948,35949,35950,35951,35952,35953,35954,35955,35956,35957,35958,35959,35960,35961,35962,35963,35964,35965,35966,35967,35968,35969,35970,35971,35972,35973,35974,35975,35976,35977,35978,35979,35980,35981,35982,35983,35984,35985,35986,35987,35988,35989,35990,35991,35992,35993,35994,35995,35996,35997,35998,35999,36000,36001,36002,36003,36004,36005,36006,36007,36008,36009,36010,36011,36012,36013,36014,36015,36016,36017,36018,36019,36020,36021,36022,36023,36024,36025,36026,36027,36028,36029,36030,36031,36032,36033,36034,36035,36036,36037,36038,36039,36040,36041,36042,36043,36044,36045,36046,36047,36048,36049,36050,36051,36052,36053,36054,36055,36056,36057,36058,36059,36060,36061,36062,36063,36064,36065,36066,36067,36068,36069,36070,36071,36072,36073,36074,36075,36076,36077,36078,36079,36080,36081,36082,36083,36084,36085,36086,36087,36088,36089,36090,36091,36092,36093,36094,36095,36096,36097,36098,36099,36100,36101,36102,36103,36104,36105,36106,36107,36108,36109,36110,36111,36112,36113,36114,36115,36116,36117,36118,36119,36120,36121,36122,36123,36124,36125,36126,36127,36128,36129,36130,36131,36132,36133,36134,36135,36136,36137,36138,36139,36140,36141,36142,36143,36144,36145,36146,36147,36148,36149,36150,36151,36152,36153,36154,36155,36156,36157,36158,36159,36160,36161,36162,36163,36164,36165,36166,36167,36168,36169,36170,36171,36172,36173,36174,36175,36176,36177,36178,36179,36180,36181,36182,36183,36184,36185,36186,36187,36188,36189,36190,36191,36192,36193,36194,36195,36196,36197,36198,36199,36200,36201,36202,36203,36204,36205,36206,36207,36208,36209,36210,36211,36212,36213,36214,36215,36216,36217,36218,36219,36220,36221,36222,36223,36224,36225,36226,36227,36228,36229,36230,36231,36232,36233,36234,36235,36236,36237,36238,36239,36240,36241,36242,36243,36244,36245,36246,36247,36248,36249,36250,36251,36252,36253,36254,36255,36256,36257,36258,36259,36260,36261,36262,36263,36264,36265,36266,36267,36268,36269,36270,36271,36272,36273,36274,36275,36276,36277,36278,36279,36280,36281,36282,36283,36284,36285,36286,36287,36288,36289,36290,36291,36292,36293,36294,36295,36296,36297,36298,36299,36300,36301,36302,36303,36304,36305,36306,36307,36308,36309,36310,36311,36312,36313,36314,36315,36316,36317,36318,36319,36320,36321,36322,36323,36324,36325,36326,36327,36328,36329,36330,36331,36332,36333,36334,36335,36336,36337,36338,36339,36340,36341,36342,36343,36344,36345,36346,36347,36348,36349,36350,36351,36352,36353,36354,36355,36356,36357,36358,36359,36360,36361,36362,36363,36364,36365,36366,36367,36368,36369,36370,36371,36372,36373,36374,36375,36376,36377,36378,36379,36380,36381,36382,36383,36384,36385,36386,36387,36388,36389,36390,36391,36392,36393,36394,36395,36396,36397,36398,36399,36400,36401,36402,36403,36404,36405,36406,36407,36408,36409,36410,36411,36412,36413,36414,36415,36416,36417,36418,36419,36420,36421,36422,36423,36424,36425,36426,36427,36428,36429,36430,36431,36432,36433,36434,36435,36436,36437,36438,36439,36440,36441,36442,36443,36444,36445,36446,36447,36448,36449,36450,36451,36452,36453,36454,36455,36456,36457,36458,36459,36460,36461,36462,36463,36464,36465,36466,36467,36468,36469,36470,36471,36472,36473,36474,36475,36476,36477,36478,36479,36480,36481,36482,36483,36484,36485,36486,36487,36488,36489,36490,36491,36492,36493,36494,36495,36496,36497,36498,36499,36500,36501,36502,36503,36504,36505,36506,36507,36508,36509,36510,36511,36512,36513,36514,36515,36516,36517,36518,36519,36520,36521,36522,36523,36524,36525,36526,36527,36528,36529,36530,36531,36532,36533,36534,36535,36536,36537,36538,36539,36540,36541,36542,36543,36544,36545,36546,36547,36548,36549,36550,36551,36552,36553,36554,36555,36556,36557,36558,36559,36560,36561,36562,36563,36564,36565,36566,36567,36568,36569,36570,36571,36572,36573,36574,36575,36576,36577,36578,36579,36580,36581,36582,36583,36584,36585,36586,36587,36588,36589,36590,36591,36592,36593,36594,36595,36596,36597,36598,36599,36600,36601,36602,36603,36604,36605,36606,36607,36608,36609,36610,36611,36612,36613,36614,36615,36616,36617,36618,36619,36620,36621,36622,36623,36624,36625,36626,36627,36628,36629,36630,36631,36632,36633,36634,36635,36636,36637,36638,36639,36640,36641,36642,36643,36644,36645,36646,36647,36648,36649,36650,36651,36652,36653,36654,36655,36656,36657,36658,36659,36660,36661,36662,36663,36664,36665,36666,36667,36668,36669,36670,36671,36672,36673,36674,36675,36676,36677,36678,36679,36680,36681,36682,36683,36684,36685,36686,36687,36688,36689,36690,36691,36692,36693,36694,36695,36696,36697,36698,36699,36700,36701,36702,36703,36704,36705,36706,36707,36708,36709,36710,36711,36712,36713,36714,36715,36716,36717,36718,36719,36720,36721,36722,36723,36724,36725,36726,36727,36728,36729,36730,36731,36732,36733,36734,36735,36736,36737,36738,36739,36740,36741,36742,36743,36744,36745,36746,36747,36748,36749,36750,36751,36752,36753,36754,36755,36756,36757,36758,36759,36760,36761,36762,36763,36764,36765,36766,36767,36768,36769,36770,36771,36772,36773,36774,36775,36776,36777,36778,36779,36780,36781,36782,36783,36784,36785,36786,36787,36788,36789,36790,36791,36792,36793,36794,36795,36796,36797,36798,36799,36800,36801,36802,36803,36804,36805,36806,36807,36808,36809,36810,36811,36812,36813,36814,36815,36816,36817,36818,36819,36820,36821,36822,36823,36824,36825,36826,36827,36828,36829,36830,36831,36832,36833,36834,36835,36836,36837,36838,36839,36840,36841,36842,36843,36844,36845,36846,36847,36848,36849,36850,36851,36852,36853,36854,36855,36856,36857,36858,36859,36860,36861,36862,36863,36864,36865,36866,36867,36868,36869,36870,36871,36872,36873,36874,36875,36876,36877,36878,36879,36880,36881,36882,36883,36884,36885,36886,36887,36888,36889,36890,36891,36892,36893,36894,36895,36896,36897,36898,36899,36900,36901,36902,36903,36904,36905,36906,36907,36908,36909,36910,36911,36912,36913,36914,36915,36916,36917,36918,36919,36920,36921,36922,36923,36924,36925,36926,36927,36928,36929,36930,36931,36932,36933,36934,36935,36936,36937,36938,36939,36940,36941,36942,36943,36944,36945,36946,36947,36948,36949,36950,36951,36952,36953,36954,36955,36956,36957,36958,36959,36960,36961,36962,36963,36964,36965,36966,36967,36968,36969,36970,36971,36972,36973,36974,36975,36976,36977,36978,36979,36980,36981,36982,36983,36984,36985,36986,36987,36988,36989,36990,36991,36992,36993,36994,36995,36996,36997,36998,36999,37000,37001,37002,37003,37004,37005,37006,37007,37008,37009,37010,37011,37012,37013,37014,37015,37016,37017,37018,37019,37020,37021,37022,37023,37024,37025,37026,37027,37028,37029,37030,37031,37032,37033,37034,37035,37036,37037,37038,37039,37040,37041,37042,37043,37044,37045,37046,37047,37048,37049,37050,37051,37052,37053,37054,37055,37056,37057,37058,37059,37060,37061,37062,37063,37064,37065,37066,37067,37068,37069,37070,37071,37072,37073,37074,37075,37076,37077,37078,37079,37080,37081,37082,37083,37084,37085,37086,37087,37088,37089,37090,37091,37092,37093,37094,37095,37096,37097,37098,37099,37100,37101,37102,37103,37104,37105,37106,37107,37108,37109,37110,37111,37112,37113,37114,37115,37116,37117,37118,37119,37120,37121,37122,37123,37124,37125,37126,37127,37128,37129,37130,37131,37132,37133,37134,37135,37136,37137,37138,37139,37140,37141,37142,37143,37144,37145,37146,37147,37148,37149,37150,37151,37152,37153,37154,37155,37156,37157,37158,37159,37160,37161,37162,37163,37164,37165,37166,37167,37168,37169,37170,37171,37172,37173,37174,37175,37176,37177,37178,37179,37180,37181,37182,37183,37184,37185,37186,37187,37188,37189,37190,37191,37192,37193,37194,37195,37196,37197,37198,37199,37200,37201,37202,37203,37204,37205,37206,37207,37208,37209,37210,37211,37212,37213,37214,37215,37216,37217,37218,37219,37220,37221,37222,37223,37224,37225,37226,37227,37228,37229,37230,37231,37232,37233,37234,37235,37236,37237,37238,37239,37240,37241,37242,37243,37244,37245,37246,37247,37248,37249,37250,37251,37252,37253,37254,37255,37256,37257,37258,37259,37260,37261,37262,37263,37264,37265,37266,37267,37268,37269,37270,37271,37272,37273,37274,37275,37276,37277,37278,37279,37280,37281,37282,37283,37284,37285,37286,37287,37288,37289,37290,37291,37292,37293,37294,37295,37296,37297,37298,37299,37300,37301,37302,37303,37304,37305,37306,37307,37308,37309,37310,37311,37312,37313,37314,37315,37316,37317,37318,37319,37320,37321,37322,37323,37324,37325,37326,37327,37328,37329,37330,37331,37332,37333,37334,37335,37336,37337,37338,37339,37340,37341,37342,37343,37344,37345,37346,37347,37348,37349,37350,37351,37352,37353,37354,37355,37356,37357,37358,37359,37360,37361,37362,37363,37364,37365,37366,37367,37368,37369,37370,37371,37372,37373,37374,37375,37376,37377,37378,37379,37380,37381,37382,37383,37384,37385,37386,37387,37388,37389,37390,37391,37392,37393,37394,37395,37396,37397,37398,37399,37400,37401,37402,37403,37404,37405,37406,37407,37408,37409,37410,37411,37412,37413,37414,37415,37416,37417,37418,37419,37420,37421,37422,37423,37424,37425,37426,37427,37428,37429,37430,37431,37432,37433,37434,37435,37436,37437,37438,37439,37440,37441,37442,37443,37444,37445,37446,37447,37448,37449,37450,37451,37452,37453,37454,37455,37456,37457,37458,37459,37460,37461,37462,37463,37464,37465,37466,37467,37468,37469,37470,37471,37472,37473,37474,37475,37476,37477,37478,37479,37480,37481,37482,37483,37484,37485,37486,37487,37488,37489,37490,37491,37492,37493,37494,37495,37496,37497,37498,37499,37500,37501,37502,37503,37504,37505,37506,37507,37508,37509,37510,37511,37512,37513,37514,37515,37516,37517,37518,37519,37520,37521,37522,37523,37524,37525,37526,37527,37528,37529,37530,37531,37532,37533,37534,37535,37536,37537,37538,37539,37540,37541,37542,37543,37544,37545,37546,37547,37548,37549,37550,37551,37552,37553,37554,37555,37556,37557,37558,37559,37560,37561,37562,37563,37564,37565,37566,37567,37568,37569,37570,37571,37572,37573,37574,37575,37576,37577,37578,37579,37580,37581,37582,37583,37584,37585,37586,37587,37588,37589,37590,37591,37592,37593,37594,37595,37596,37597,37598,37599,37600,37601,37602,37603,37604,37605,37606,37607,37608,37609,37610,37611,37612,37613,37614,37615,37616,37617,37618,37619,37620,37621,37622,37623,37624,37625,37626,37627,37628,37629,37630,37631,37632,37633,37634,37635,37636,37637,37638,37639,37640,37641,37642,37643,37644,37645,37646,37647,37648,37649,37650,37651,37652,37653,37654,37655,37656,37657,37658,37659,37660,37661,37662,37663,37664,37665,37666,37667,37668,37669,37670,37671,37672,37673,37674,37675,37676,37677,37678,37679,37680,37681,37682,37683,37684,37685,37686,37687,37688,37689,37690,37691,37692,37693,37694,37695,37696,37697,37698,37699,37700,37701,37702,37703,37704,37705,37706,37707,37708,37709,37710,37711,37712,37713,37714,37715,37716,37717,37718,37719,37720,37721,37722,37723,37724,37725,37726,37727,37728,37729,37730,37731,37732,37733,37734,37735,37736,37737,37738,37739,37740,37741,37742,37743,37744,37745,37746,37747,37748,37749,37750,37751,37752,37753,37754,37755,37756,37757,37758,37759,37760,37761,37762,37763,37764,37765,37766,37767,37768,37769,37770,37771,37772,37773,37774,37775,37776,37777,37778,37779,37780,37781,37782,37783,37784,37785,37786,37787,37788,37789,37790,37791,37792,37793,37794,37795,37796,37797,37798,37799,37800,37801,37802,37803,37804,37805,37806,37807,37808,37809,37810,37811,37812,37813,37814,37815,37816,37817,37818,37819,37820,37821,37822,37823,37824,37825,37826,37827,37828,37829,37830,37831,37832,37833,37834,37835,37836,37837,37838,37839,37840,37841,37842,37843,37844,37845,37846,37847,37848,37849,37850,37851,37852,37853,37854,37855,37856,37857,37858,37859,37860,37861,37862,37863,37864,37865,37866,37867,37868,37869,37870,37871,37872,37873,37874,37875,37876,37877,37878,37879,37880,37881,37882,37883,37884,37885,37886,37887,37888,37889,37890,37891,37892,37893,37894,37895,37896,37897,37898,37899,37900,37901,37902,37903,37904,37905,37906,37907,37908,37909,37910,37911,37912,37913,37914,37915,37916,37917,37918,37919,37920,37921,37922,37923,37924,37925,37926,37927,37928,37929,37930,37931,37932,37933,37934,37935,37936,37937,37938,37939,37940,37941,37942,37943,37944,37945,37946,37947,37948,37949,37950,37951,37952,37953,37954,37955,37956,37957,37958,37959,37960,37961,37962,37963,37964,37965,37966,37967,37968,37969,37970,37971,37972,37973,37974,37975,37976,37977,37978,37979,37980,37981,37982,37983,37984,37985,37986,37987,37988,37989,37990,37991,37992,37993,37994,37995,37996,37997,37998,37999,38000,38001,38002,38003,38004,38005,38006,38007,38008,38009,38010,38011,38012,38013,38014,38015,38016,38017,38018,38019,38020,38021,38022,38023,38024,38025,38026,38027,38028,38029,38030,38031,38032,38033,38034,38035,38036,38037,38038,38039,38040,38041,38042,38043,38044,38045,38046,38047,38048,38049,38050,38051,38052,38053,38054,38055,38056,38057,38058,38059,38060,38061,38062,38063,38064,38065,38066,38067,38068,38069,38070,38071,38072,38073,38074,38075,38076,38077,38078,38079,38080,38081,38082,38083,38084,38085,38086,38087,38088,38089,38090,38091,38092,38093,38094,38095,38096,38097,38098,38099,38100,38101,38102,38103,38104,38105,38106,38107,38108,38109,38110,38111,38112,38113,38114,38115,38116,38117,38118,38119,38120,38121,38122,38123,38124,38125,38126,38127,38128,38129,38130,38131,38132,38133,38134,38135,38136,38137,38138,38139,38140,38141,38142,38143,38144,38145,38146,38147,38148,38149,38150,38151,38152,38153,38154,38155,38156,38157,38158,38159,38160,38161,38162,38163,38164,38165,38166,38167,38168,38169,38170,38171,38172,38173,38174,38175,38176,38177,38178,38179,38180,38181,38182,38183,38184,38185,38186,38187,38188,38189,38190,38191,38192,38193,38194,38195,38196,38197,38198,38199,38200,38201,38202,38203,38204,38205,38206,38207,38208,38209,38210,38211,38212,38213,38214,38215,38216,38217,38218,38219,38220,38221,38222,38223,38224,38225,38226,38227,38228,38229,38230,38231,38232,38233,38234,38235,38236,38237,38238,38239,38240,38241,38242,38243,38244,38245,38246,38247,38248,38249,38250,38251,38252,38253,38254,38255,38256,38257,38258,38259,38260,38261,38262,38263,38264,38265,38266,38267,38268,38269,38270,38271,38272,38273,38274,38275,38276,38277,38278,38279,38280,38281,38282,38283,38284,38285,38286,38287,38288,38289,38290,38291,38292,38293,38294,38295,38296,38297,38298,38299,38300,38301,38302,38303,38304,38305,38306,38307,38308,38309,38310,38311,38312,38313,38314,38315,38316,38317,38318,38319,38320,38321,38322,38323,38324,38325,38326,38327,38328,38329,38330,38331,38332,38333,38334,38335,38336,38337,38338,38339,38340,38341,38342,38343,38344,38345,38346,38347,38348,38349,38350,38351,38352,38353,38354,38355,38356,38357,38358,38359,38360,38361,38362,38363,38364,38365,38366,38367,38368,38369,38370,38371,38372,38373,38374,38375,38376,38377,38378,38379,38380,38381,38382,38383,38384,38385,38386,38387,38388,38389,38390,38391,38392,38393,38394,38395,38396,38397,38398,38399,38400,38401,38402,38403,38404,38405,38406,38407,38408,38409,38410,38411,38412,38413,38414,38415,38416,38417,38418,38419,38420,38421,38422,38423,38424,38425,38426,38427,38428,38429,38430,38431,38432,38433,38434,38435,38436,38437,38438,38439,38440,38441,38442,38443,38444,38445,38446,38447,38448,38449,38450,38451,38452,38453,38454,38455,38456,38457,38458,38459,38460,38461,38462,38463,38464,38465,38466,38467,38468,38469,38470,38471,38472,38473,38474,38475,38476,38477,38478,38479,38480,38481,38482,38483,38484,38485,38486,38487,38488,38489,38490,38491,38492,38493,38494,38495,38496,38497,38498,38499,38500,38501,38502,38503,38504,38505,38506,38507,38508,38509,38510,38511,38512,38513,38514,38515,38516,38517,38518,38519,38520,38521,38522,38523,38524,38525,38526,38527,38528,38529,38530,38531,38532,38533,38534,38535,38536,38537,38538,38539,38540,38541,38542,38543,38544,38545,38546,38547,38548,38549,38550,38551,38552,38553,38554,38555,38556,38557,38558,38559,38560,38561,38562,38563,38564,38565,38566,38567,38568,38569,38570,38571,38572,38573,38574,38575,38576,38577,38578,38579,38580,38581,38582,38583,38584,38585,38586,38587,38588,38589,38590,38591,38592,38593,38594,38595,38596,38597,38598,38599,38600,38601,38602,38603,38604,38605,38606,38607,38608,38609,38610,38611,38612,38613,38614,38615,38616,38617,38618,38619,38620,38621,38622,38623,38624,38625,38626,38627,38628,38629,38630,38631,38632,38633,38634,38635,38636,38637,38638,38639,38640,38641,38642,38643,38644,38645,38646,38647,38648,38649,38650,38651,38652,38653,38654,38655,38656,38657,38658,38659,38660,38661,38662,38663,38664,38665,38666,38667,38668,38669,38670,38671,38672,38673,38674,38675,38676,38677,38678,38679,38680,38681,38682,38683,38684,38685,38686,38687,38688,38689,38690,38691,38692,38693,38694,38695,38696,38697,38698,38699,38700,38701,38702,38703,38704,38705,38706,38707,38708,38709,38710,38711,38712,38713,38714,38715,38716,38717,38718,38719,38720,38721,38722,38723,38724,38725,38726,38727,38728,38729,38730,38731,38732,38733,38734,38735,38736,38737,38738,38739,38740,38741,38742,38743,38744,38745,38746,38747,38748,38749,38750,38751,38752,38753,38754,38755,38756,38757,38758,38759,38760,38761,38762,38763,38764,38765,38766,38767,38768,38769,38770,38771,38772,38773,38774,38775,38776,38777,38778,38779,38780,38781,38782,38783,38784,38785,38786,38787,38788,38789,38790,38791,38792,38793,38794,38795,38796,38797,38798,38799,38800,38801,38802,38803,38804,38805,38806,38807,38808,38809,38810,38811,38812,38813,38814,38815,38816,38817,38818,38819,38820,38821,38822,38823,38824,38825,38826,38827,38828,38829,38830,38831,38832,38833,38834,38835,38836,38837,38838,38839,38840,38841,38842,38843,38844,38845,38846,38847,38848,38849,38850,38851,38852,38853,38854,38855,38856,38857,38858,38859,38860,38861,38862,38863,38864,38865,38866,38867,38868,38869,38870,38871,38872,38873,38874,38875,38876,38877,38878,38879,38880,38881,38882,38883,38884,38885,38886,38887,38888,38889,38890,38891,38892,38893,38894,38895,38896,38897,38898,38899,38900,38901,38902,38903,38904,38905,38906,38907,38908,38909,38910,38911,38912,38913,38914,38915,38916,38917,38918,38919,38920,38921,38922,38923,38924,38925,38926,38927,38928,38929,38930,38931,38932,38933,38934,38935,38936,38937,38938,38939,38940,38941,38942,38943,38944,38945,38946,38947,38948,38949,38950,38951,38952,38953,38954,38955,38956,38957,38958,38959,38960,38961,38962,38963,38964,38965,38966,38967,38968,38969,38970,38971,38972,38973,38974,38975,38976,38977,38978,38979,38980,38981,38982,38983,38984,38985,38986,38987,38988,38989,38990,38991,38992,38993,38994,38995,38996,38997,38998,38999,39000,39001,39002,39003,39004,39005,39006,39007,39008,39009,39010,39011,39012,39013,39014,39015,39016,39017,39018,39019,39020,39021,39022,39023,39024,39025,39026,39027,39028,39029,39030,39031,39032,39033,39034,39035,39036,39037,39038,39039,39040,39041,39042,39043,39044,39045,39046,39047,39048,39049,39050,39051,39052,39053,39054,39055,39056,39057,39058,39059,39060,39061,39062,39063,39064,39065,39066,39067,39068,39069,39070,39071,39072,39073,39074,39075,39076,39077,39078,39079,39080,39081,39082,39083,39084,39085,39086,39087,39088,39089,39090,39091,39092,39093,39094,39095,39096,39097,39098,39099,39100,39101,39102,39103,39104,39105,39106,39107,39108,39109,39110,39111,39112,39113,39114,39115,39116,39117,39118,39119,39120,39121,39122,39123,39124,39125,39126,39127,39128,39129,39130,39131,39132,39133,39134,39135,39136,39137,39138,39139,39140,39141,39142,39143,39144,39145,39146,39147,39148,39149,39150,39151,39152,39153,39154,39155,39156,39157,39158,39159,39160,39161,39162,39163,39164,39165,39166,39167,39168,39169,39170,39171,39172,39173,39174,39175,39176,39177,39178,39179,39180,39181,39182,39183,39184,39185,39186,39187,39188,39189,39190,39191,39192,39193,39194,39195,39196,39197,39198,39199,39200,39201,39202,39203,39204,39205,39206,39207,39208,39209,39210,39211,39212,39213,39214,39215,39216,39217,39218,39219,39220,39221,39222,39223,39224,39225,39226,39227,39228,39229,39230,39231,39232,39233,39234,39235,39236,39237,39238,39239,39240,39241,39242,39243,39244,39245,39246,39247,39248,39249,39250,39251,39252,39253,39254,39255,39256,39257,39258,39259,39260,39261,39262,39263,39264,39265,39266,39267,39268,39269,39270,39271,39272,39273,39274,39275,39276,39277,39278,39279,39280,39281,39282,39283,39284,39285,39286,39287,39288,39289,39290,39291,39292,39293,39294,39295,39296,39297,39298,39299,39300,39301,39302,39303,39304,39305,39306,39307,39308,39309,39310,39311,39312,39313,39314,39315,39316,39317,39318,39319,39320,39321,39322,39323,39324,39325,39326,39327,39328,39329,39330,39331,39332,39333,39334,39335,39336,39337,39338,39339,39340,39341,39342,39343,39344,39345,39346,39347,39348,39349,39350,39351,39352,39353,39354,39355,39356,39357,39358,39359,39360,39361,39362,39363,39364,39365,39366,39367,39368,39369,39370,39371,39372,39373,39374,39375,39376,39377,39378,39379,39380,39381,39382,39383,39384,39385,39386,39387,39388,39389,39390,39391,39392,39393,39394,39395,39396,39397,39398,39399,39400,39401,39402,39403,39404,39405,39406,39407,39408,39409,39410,39411,39412,39413,39414,39415,39416,39417,39418,39419,39420,39421,39422,39423,39424,39425,39426,39427,39428,39429,39430,39431,39432,39433,39434,39435,39436,39437,39438,39439,39440,39441,39442,39443,39444,39445,39446,39447,39448,39449,39450,39451,39452,39453,39454,39455,39456,39457,39458,39459,39460,39461,39462,39463,39464,39465,39466,39467,39468,39469,39470,39471,39472,39473,39474,39475,39476,39477,39478,39479,39480,39481,39482,39483,39484,39485,39486,39487,39488,39489,39490,39491,39492,39493,39494,39495,39496,39497,39498,39499,39500,39501,39502,39503,39504,39505,39506,39507,39508,39509,39510,39511,39512,39513,39514,39515,39516,39517,39518,39519,39520,39521,39522,39523,39524,39525,39526,39527,39528,39529,39530,39531,39532,39533,39534,39535,39536,39537,39538,39539,39540,39541,39542,39543,39544,39545,39546,39547,39548,39549,39550,39551,39552,39553,39554,39555,39556,39557,39558,39559,39560,39561,39562,39563,39564,39565,39566,39567,39568,39569,39570,39571,39572,39573,39574,39575,39576,39577,39578,39579,39580,39581,39582,39583,39584,39585,39586,39587,39588,39589,39590,39591,39592,39593,39594,39595,39596,39597,39598,39599,39600,39601,39602,39603,39604,39605,39606,39607,39608,39609,39610,39611,39612,39613,39614,39615,39616,39617,39618,39619,39620,39621,39622,39623,39624,39625,39626,39627,39628,39629,39630,39631,39632,39633,39634,39635,39636,39637,39638,39639,39640,39641,39642,39643,39644,39645,39646,39647,39648,39649,39650,39651,39652,39653,39654,39655,39656,39657,39658,39659,39660,39661,39662,39663,39664,39665,39666,39667,39668,39669,39670,39671,39672,39673,39674,39675,39676,39677,39678,39679,39680,39681,39682,39683,39684,39685,39686,39687,39688,39689,39690,39691,39692,39693,39694,39695,39696,39697,39698,39699,39700,39701,39702,39703,39704,39705,39706,39707,39708,39709,39710,39711,39712,39713,39714,39715,39716,39717,39718,39719,39720,39721,39722,39723,39724,39725,39726,39727,39728,39729,39730,39731,39732,39733,39734,39735,39736,39737,39738,39739,39740,39741,39742,39743,39744,39745,39746,39747,39748,39749,39750,39751,39752,39753,39754,39755,39756,39757,39758,39759,39760,39761,39762,39763,39764,39765,39766,39767,39768,39769,39770,39771,39772,39773,39774,39775,39776,39777,39778,39779,39780,39781,39782,39783,39784,39785,39786,39787,39788,39789,39790,39791,39792,39793,39794,39795,39796,39797,39798,39799,39800,39801,39802,39803,39804,39805,39806,39807,39808,39809,39810,39811,39812,39813,39814,39815,39816,39817,39818,39819,39820,39821,39822,39823,39824,39825,39826,39827,39828,39829,39830,39831,39832,39833,39834,39835,39836,39837,39838,39839,39840,39841,39842,39843,39844,39845,39846,39847,39848,39849,39850,39851,39852,39853,39854,39855,39856,39857,39858,39859,39860,39861,39862,39863,39864,39865,39866,39867,39868,39869,39870,39871,39872,39873,39874,39875,39876,39877,39878,39879,39880,39881,39882,39883,39884,39885,39886,39887,39888,39889,39890,39891,39892,39893,39894,39895,39896,39897,39898,39899,39900,39901,39902,39903,39904,39905,39906,39907,39908,39909,39910,39911,39912,39913,39914,39915,39916,39917,39918,39919,39920,39921,39922,39923,39924,39925,39926,39927,39928,39929,39930,39931,39932,39933,39934,39935,39936,39937,39938,39939,39940,39941,39942,39943,39944,39945,39946,39947,39948,39949,39950,39951,39952,39953,39954,39955,39956,39957,39958,39959,39960,39961,39962,39963,39964,39965,39966,39967,39968,39969,39970,39971,39972,39973,39974,39975,39976,39977,39978,39979,39980,39981,39982,39983,39984,39985,39986,39987,39988,39989,39990,39991,39992,39993,39994,39995,39996,39997,39998,39999,40000,40001,40002,40003,40004,40005,40006,40007,40008,40009,40010,40011,40012,40013,40014,40015,40016,40017,40018,40019,40020,40021,40022,40023,40024,40025,40026,40027,40028,40029,40030,40031,40032,40033,40034,40035,40036,40037,40038,40039,40040,40041,40042,40043,40044,40045,40046,40047,40048,40049,40050,40051,40052,40053,40054,40055,40056,40057,40058,40059,40060,40061,40062,40063,40064,40065,40066,40067,40068,40069,40070,40071,40072,40073,40074,40075,40076,40077,40078,40079,40080,40081,40082,40083,40084,40085,40086,40087,40088,40089,40090,40091,40092,40093,40094,40095,40096,40097,40098,40099,40100,40101,40102,40103,40104,40105,40106,40107,40108,40109,40110,40111,40112,40113,40114,40115,40116,40117,40118,40119,40120,40121,40122,40123,40124,40125,40126,40127,40128,40129,40130,40131,40132,40133,40134,40135,40136,40137,40138,40139,40140,40141,40142,40143,40144,40145,40146,40147,40148,40149,40150,40151,40152,40153,40154,40155,40156,40157,40158,40159,40160,40161,40162,40163,40164,40165,40166,40167,40168,40169,40170,40171,40172,40173,40174,40175,40176,40177,40178,40179,40180,40181,40182,40183,40184,40185,40186,40187,40188,40189,40190,40191,40192,40193,40194,40195,40196,40197,40198,40199,40200,40201,40202,40203,40204,40205,40206,40207,40208,40209,40210,40211,40212,40213,40214,40215,40216,40217,40218,40219,40220,40221,40222,40223,40224,40225,40226,40227,40228,40229,40230,40231,40232,40233,40234,40235,40236,40237,40238,40239,40240,40241,40242,40243,40244,40245,40246,40247,40248,40249,40250,40251,40252,40253,40254,40255,40256,40257,40258,40259,40260,40261,40262,40263,40264,40265,40266,40267,40268,40269,40270,40271,40272,40273,40274,40275,40276,40277,40278,40279,40280,40281,40282,40283,40284,40285,40286,40287,40288,40289,40290,40291,40292,40293,40294,40295,40296,40297,40298,40299,40300,40301,40302,40303,40304,40305,40306,40307,40308,40309,40310,40311,40312,40313,40314,40315,40316,40317,40318,40319,40320,40321,40322,40323,40324,40325,40326,40327,40328,40329,40330,40331,40332,40333,40334,40335,40336,40337,40338,40339,40340,40341,40342,40343,40344,40345,40346,40347,40348,40349,40350,40351,40352,40353,40354,40355,40356,40357,40358,40359,40360,40361,40362,40363,40364,40365,40366,40367,40368,40369,40370,40371,40372,40373,40374,40375,40376,40377,40378,40379,40380,40381,40382,40383,40384,40385,40386,40387,40388,40389,40390,40391,40392,40393,40394,40395,40396,40397,40398,40399,40400,40401,40402,40403,40404,40405,40406,40407,40408,40409,40410,40411,40412,40413,40414,40415,40416,40417,40418,40419,40420,40421,40422,40423,40424,40425,40426,40427,40428,40429,40430,40431,40432,40433,40434,40435,40436,40437,40438,40439,40440,40441,40442,40443,40444,40445,40446,40447,40448,40449,40450,40451,40452,40453,40454,40455,40456,40457,40458,40459,40460,40461,40462,40463,40464,40465,40466,40467,40468,40469,40470,40471,40472,40473,40474,40475,40476,40477,40478,40479,40480,40481,40482,40483,40484,40485,40486,40487,40488,40489,40490,40491,40492,40493,40494,40495,40496,40497,40498,40499,40500,40501,40502,40503,40504,40505,40506,40507,40508,40509,40510,40511,40512,40513,40514,40515,40516,40517,40518,40519,40520,40521,40522,40523,40524,40525,40526,40527,40528,40529,40530,40531,40532,40533,40534,40535,40536,40537,40538,40539,40540,40541,40542,40543,40544,40545,40546,40547,40548,40549,40550,40551,40552,40553,40554,40555,40556,40557,40558,40559,40560,40561,40562,40563,40564,40565,40566,40567,40568,40569,40570,40571,40572,40573,40574,40575,40576,40577,40578,40579,40580,40581,40582,40583,40584,40585,40586,40587,40588,40589,40590,40591,40592,40593,40594,40595,40596,40597,40598,40599,40600,40601,40602,40603,40604,40605,40606,40607,40608,40609,40610,40611,40612,40613,40614,40615,40616,40617,40618,40619,40620,40621,40622,40623,40624,40625,40626,40627,40628,40629,40630,40631,40632,40633,40634,40635,40636,40637,40638,40639,40640,40641,40642,40643,40644,40645,40646,40647,40648,40649,40650,40651,40652,40653,40654,40655,40656,40657,40658,40659,40660,40661,40662,40663,40664,40665,40666,40667,40668,40669,40670,40671,40672,40673,40674,40675,40676,40677,40678,40679,40680,40681,40682,40683,40684,40685,40686,40687,40688,40689,40690,40691,40692,40693,40694,40695,40696,40697,40698,40699,40700,40701,40702,40703,40704,40705,40706,40707,40708,40709,40710,40711,40712,40713,40714,40715,40716,40717,40718,40719,40720,40721,40722,40723,40724,40725,40726,40727,40728,40729,40730,40731,40732,40733,40734,40735,40736,40737,40738,40739,40740,40741,40742,40743,40744,40745,40746,40747,40748,40749,40750,40751,40752,40753,40754,40755,40756,40757,40758,40759,40760,40761,40762,40763,40764,40765,40766,40767,40768,40769,40770,40771,40772,40773,40774,40775,40776,40777,40778,40779,40780,40781,40782,40783,40784,40785,40786,40787,40788,40789,40790,40791,40792,40793,40794,40795,40796,40797,40798,40799,40800,40801,40802,40803,40804,40805,40806,40807,40808,40809,40810,40811,40812,40813,40814,40815,40816,40817,40818,40819,40820,40821,40822,40823,40824,40825,40826,40827,40828,40829,40830,40831,40832,40833,40834,40835,40836,40837,40838,40839,40840,40841,40842,40843,40844,40845,40846,40847,40848,40849,40850,40851,40852,40853,40854,40855,40856,40857,40858,40859,40860,40861,40862,40863,40864,40865,40866,40867,40868,40869,40870,40871,40872,40873,40874,40875,40876,40877,40878,40879,40880,40881,40882,40883,40884,40885,40886,40887,40888,40889,40890,40891,40892,40893,40894,40895,40896,40897,40898,40899,40900,40901,40902,40903,40904,40905,40906,40907,40908,40960,40961,40962,40963,40964,40965,40966,40967,40968,40969,40970,40971,40972,40973,40974,40975,40976,40977,40978,40979,40980,40981,40982,40983,40984,40985,40986,40987,40988,40989,40990,40991,40992,40993,40994,40995,40996,40997,40998,40999,41000,41001,41002,41003,41004,41005,41006,41007,41008,41009,41010,41011,41012,41013,41014,41015,41016,41017,41018,41019,41020,41021,41022,41023,41024,41025,41026,41027,41028,41029,41030,41031,41032,41033,41034,41035,41036,41037,41038,41039,41040,41041,41042,41043,41044,41045,41046,41047,41048,41049,41050,41051,41052,41053,41054,41055,41056,41057,41058,41059,41060,41061,41062,41063,41064,41065,41066,41067,41068,41069,41070,41071,41072,41073,41074,41075,41076,41077,41078,41079,41080,41081,41082,41083,41084,41085,41086,41087,41088,41089,41090,41091,41092,41093,41094,41095,41096,41097,41098,41099,41100,41101,41102,41103,41104,41105,41106,41107,41108,41109,41110,41111,41112,41113,41114,41115,41116,41117,41118,41119,41120,41121,41122,41123,41124,41125,41126,41127,41128,41129,41130,41131,41132,41133,41134,41135,41136,41137,41138,41139,41140,41141,41142,41143,41144,41145,41146,41147,41148,41149,41150,41151,41152,41153,41154,41155,41156,41157,41158,41159,41160,41161,41162,41163,41164,41165,41166,41167,41168,41169,41170,41171,41172,41173,41174,41175,41176,41177,41178,41179,41180,41181,41182,41183,41184,41185,41186,41187,41188,41189,41190,41191,41192,41193,41194,41195,41196,41197,41198,41199,41200,41201,41202,41203,41204,41205,41206,41207,41208,41209,41210,41211,41212,41213,41214,41215,41216,41217,41218,41219,41220,41221,41222,41223,41224,41225,41226,41227,41228,41229,41230,41231,41232,41233,41234,41235,41236,41237,41238,41239,41240,41241,41242,41243,41244,41245,41246,41247,41248,41249,41250,41251,41252,41253,41254,41255,41256,41257,41258,41259,41260,41261,41262,41263,41264,41265,41266,41267,41268,41269,41270,41271,41272,41273,41274,41275,41276,41277,41278,41279,41280,41281,41282,41283,41284,41285,41286,41287,41288,41289,41290,41291,41292,41293,41294,41295,41296,41297,41298,41299,41300,41301,41302,41303,41304,41305,41306,41307,41308,41309,41310,41311,41312,41313,41314,41315,41316,41317,41318,41319,41320,41321,41322,41323,41324,41325,41326,41327,41328,41329,41330,41331,41332,41333,41334,41335,41336,41337,41338,41339,41340,41341,41342,41343,41344,41345,41346,41347,41348,41349,41350,41351,41352,41353,41354,41355,41356,41357,41358,41359,41360,41361,41362,41363,41364,41365,41366,41367,41368,41369,41370,41371,41372,41373,41374,41375,41376,41377,41378,41379,41380,41381,41382,41383,41384,41385,41386,41387,41388,41389,41390,41391,41392,41393,41394,41395,41396,41397,41398,41399,41400,41401,41402,41403,41404,41405,41406,41407,41408,41409,41410,41411,41412,41413,41414,41415,41416,41417,41418,41419,41420,41421,41422,41423,41424,41425,41426,41427,41428,41429,41430,41431,41432,41433,41434,41435,41436,41437,41438,41439,41440,41441,41442,41443,41444,41445,41446,41447,41448,41449,41450,41451,41452,41453,41454,41455,41456,41457,41458,41459,41460,41461,41462,41463,41464,41465,41466,41467,41468,41469,41470,41471,41472,41473,41474,41475,41476,41477,41478,41479,41480,41481,41482,41483,41484,41485,41486,41487,41488,41489,41490,41491,41492,41493,41494,41495,41496,41497,41498,41499,41500,41501,41502,41503,41504,41505,41506,41507,41508,41509,41510,41511,41512,41513,41514,41515,41516,41517,41518,41519,41520,41521,41522,41523,41524,41525,41526,41527,41528,41529,41530,41531,41532,41533,41534,41535,41536,41537,41538,41539,41540,41541,41542,41543,41544,41545,41546,41547,41548,41549,41550,41551,41552,41553,41554,41555,41556,41557,41558,41559,41560,41561,41562,41563,41564,41565,41566,41567,41568,41569,41570,41571,41572,41573,41574,41575,41576,41577,41578,41579,41580,41581,41582,41583,41584,41585,41586,41587,41588,41589,41590,41591,41592,41593,41594,41595,41596,41597,41598,41599,41600,41601,41602,41603,41604,41605,41606,41607,41608,41609,41610,41611,41612,41613,41614,41615,41616,41617,41618,41619,41620,41621,41622,41623,41624,41625,41626,41627,41628,41629,41630,41631,41632,41633,41634,41635,41636,41637,41638,41639,41640,41641,41642,41643,41644,41645,41646,41647,41648,41649,41650,41651,41652,41653,41654,41655,41656,41657,41658,41659,41660,41661,41662,41663,41664,41665,41666,41667,41668,41669,41670,41671,41672,41673,41674,41675,41676,41677,41678,41679,41680,41681,41682,41683,41684,41685,41686,41687,41688,41689,41690,41691,41692,41693,41694,41695,41696,41697,41698,41699,41700,41701,41702,41703,41704,41705,41706,41707,41708,41709,41710,41711,41712,41713,41714,41715,41716,41717,41718,41719,41720,41721,41722,41723,41724,41725,41726,41727,41728,41729,41730,41731,41732,41733,41734,41735,41736,41737,41738,41739,41740,41741,41742,41743,41744,41745,41746,41747,41748,41749,41750,41751,41752,41753,41754,41755,41756,41757,41758,41759,41760,41761,41762,41763,41764,41765,41766,41767,41768,41769,41770,41771,41772,41773,41774,41775,41776,41777,41778,41779,41780,41781,41782,41783,41784,41785,41786,41787,41788,41789,41790,41791,41792,41793,41794,41795,41796,41797,41798,41799,41800,41801,41802,41803,41804,41805,41806,41807,41808,41809,41810,41811,41812,41813,41814,41815,41816,41817,41818,41819,41820,41821,41822,41823,41824,41825,41826,41827,41828,41829,41830,41831,41832,41833,41834,41835,41836,41837,41838,41839,41840,41841,41842,41843,41844,41845,41846,41847,41848,41849,41850,41851,41852,41853,41854,41855,41856,41857,41858,41859,41860,41861,41862,41863,41864,41865,41866,41867,41868,41869,41870,41871,41872,41873,41874,41875,41876,41877,41878,41879,41880,41881,41882,41883,41884,41885,41886,41887,41888,41889,41890,41891,41892,41893,41894,41895,41896,41897,41898,41899,41900,41901,41902,41903,41904,41905,41906,41907,41908,41909,41910,41911,41912,41913,41914,41915,41916,41917,41918,41919,41920,41921,41922,41923,41924,41925,41926,41927,41928,41929,41930,41931,41932,41933,41934,41935,41936,41937,41938,41939,41940,41941,41942,41943,41944,41945,41946,41947,41948,41949,41950,41951,41952,41953,41954,41955,41956,41957,41958,41959,41960,41961,41962,41963,41964,41965,41966,41967,41968,41969,41970,41971,41972,41973,41974,41975,41976,41977,41978,41979,41980,41981,41982,41983,41984,41985,41986,41987,41988,41989,41990,41991,41992,41993,41994,41995,41996,41997,41998,41999,42000,42001,42002,42003,42004,42005,42006,42007,42008,42009,42010,42011,42012,42013,42014,42015,42016,42017,42018,42019,42020,42021,42022,42023,42024,42025,42026,42027,42028,42029,42030,42031,42032,42033,42034,42035,42036,42037,42038,42039,42040,42041,42042,42043,42044,42045,42046,42047,42048,42049,42050,42051,42052,42053,42054,42055,42056,42057,42058,42059,42060,42061,42062,42063,42064,42065,42066,42067,42068,42069,42070,42071,42072,42073,42074,42075,42076,42077,42078,42079,42080,42081,42082,42083,42084,42085,42086,42087,42088,42089,42090,42091,42092,42093,42094,42095,42096,42097,42098,42099,42100,42101,42102,42103,42104,42105,42106,42107,42108,42109,42110,42111,42112,42113,42114,42115,42116,42117,42118,42119,42120,42121,42122,42123,42124,42192,42193,42194,42195,42196,42197,42198,42199,42200,42201,42202,42203,42204,42205,42206,42207,42208,42209,42210,42211,42212,42213,42214,42215,42216,42217,42218,42219,42220,42221,42222,42223,42224,42225,42226,42227,42228,42229,42230,42231,42232,42233,42234,42235,42236,42237,42240,42241,42242,42243,42244,42245,42246,42247,42248,42249,42250,42251,42252,42253,42254,42255,42256,42257,42258,42259,42260,42261,42262,42263,42264,42265,42266,42267,42268,42269,42270,42271,42272,42273,42274,42275,42276,42277,42278,42279,42280,42281,42282,42283,42284,42285,42286,42287,42288,42289,42290,42291,42292,42293,42294,42295,42296,42297,42298,42299,42300,42301,42302,42303,42304,42305,42306,42307,42308,42309,42310,42311,42312,42313,42314,42315,42316,42317,42318,42319,42320,42321,42322,42323,42324,42325,42326,42327,42328,42329,42330,42331,42332,42333,42334,42335,42336,42337,42338,42339,42340,42341,42342,42343,42344,42345,42346,42347,42348,42349,42350,42351,42352,42353,42354,42355,42356,42357,42358,42359,42360,42361,42362,42363,42364,42365,42366,42367,42368,42369,42370,42371,42372,42373,42374,42375,42376,42377,42378,42379,42380,42381,42382,42383,42384,42385,42386,42387,42388,42389,42390,42391,42392,42393,42394,42395,42396,42397,42398,42399,42400,42401,42402,42403,42404,42405,42406,42407,42408,42409,42410,42411,42412,42413,42414,42415,42416,42417,42418,42419,42420,42421,42422,42423,42424,42425,42426,42427,42428,42429,42430,42431,42432,42433,42434,42435,42436,42437,42438,42439,42440,42441,42442,42443,42444,42445,42446,42447,42448,42449,42450,42451,42452,42453,42454,42455,42456,42457,42458,42459,42460,42461,42462,42463,42464,42465,42466,42467,42468,42469,42470,42471,42472,42473,42474,42475,42476,42477,42478,42479,42480,42481,42482,42483,42484,42485,42486,42487,42488,42489,42490,42491,42492,42493,42494,42495,42496,42497,42498,42499,42500,42501,42502,42503,42504,42505,42506,42507,42508,42512,42513,42514,42515,42516,42517,42518,42519,42520,42521,42522,42523,42524,42525,42526,42527,42538,42539,42560,42561,42562,42563,42564,42565,42566,42567,42568,42569,42570,42571,42572,42573,42574,42575,42576,42577,42578,42579,42580,42581,42582,42583,42584,42585,42586,42587,42588,42589,42590,42591,42592,42593,42594,42595,42596,42597,42598,42599,42600,42601,42602,42603,42604,42605,42606,42623,42624,42625,42626,42627,42628,42629,42630,42631,42632,42633,42634,42635,42636,42637,42638,42639,42640,42641,42642,42643,42644,42645,42646,42647,42656,42657,42658,42659,42660,42661,42662,42663,42664,42665,42666,42667,42668,42669,42670,42671,42672,42673,42674,42675,42676,42677,42678,42679,42680,42681,42682,42683,42684,42685,42686,42687,42688,42689,42690,42691,42692,42693,42694,42695,42696,42697,42698,42699,42700,42701,42702,42703,42704,42705,42706,42707,42708,42709,42710,42711,42712,42713,42714,42715,42716,42717,42718,42719,42720,42721,42722,42723,42724,42725,42726,42727,42728,42729,42730,42731,42732,42733,42734,42735,42775,42776,42777,42778,42779,42780,42781,42782,42783,42786,42787,42788,42789,42790,42791,42792,42793,42794,42795,42796,42797,42798,42799,42800,42801,42802,42803,42804,42805,42806,42807,42808,42809,42810,42811,42812,42813,42814,42815,42816,42817,42818,42819,42820,42821,42822,42823,42824,42825,42826,42827,42828,42829,42830,42831,42832,42833,42834,42835,42836,42837,42838,42839,42840,42841,42842,42843,42844,42845,42846,42847,42848,42849,42850,42851,42852,42853,42854,42855,42856,42857,42858,42859,42860,42861,42862,42863,42864,42865,42866,42867,42868,42869,42870,42871,42872,42873,42874,42875,42876,42877,42878,42879,42880,42881,42882,42883,42884,42885,42886,42887,42888,42891,42892,42893,42894,42896,42897,42898,42899,42912,42913,42914,42915,42916,42917,42918,42919,42920,42921,42922,43000,43001,43002,43003,43004,43005,43006,43007,43008,43009,43011,43012,43013,43015,43016,43017,43018,43020,43021,43022,43023,43024,43025,43026,43027,43028,43029,43030,43031,43032,43033,43034,43035,43036,43037,43038,43039,43040,43041,43042,43072,43073,43074,43075,43076,43077,43078,43079,43080,43081,43082,43083,43084,43085,43086,43087,43088,43089,43090,43091,43092,43093,43094,43095,43096,43097,43098,43099,43100,43101,43102,43103,43104,43105,43106,43107,43108,43109,43110,43111,43112,43113,43114,43115,43116,43117,43118,43119,43120,43121,43122,43123,43138,43139,43140,43141,43142,43143,43144,43145,43146,43147,43148,43149,43150,43151,43152,43153,43154,43155,43156,43157,43158,43159,43160,43161,43162,43163,43164,43165,43166,43167,43168,43169,43170,43171,43172,43173,43174,43175,43176,43177,43178,43179,43180,43181,43182,43183,43184,43185,43186,43187,43250,43251,43252,43253,43254,43255,43259,43274,43275,43276,43277,43278,43279,43280,43281,43282,43283,43284,43285,43286,43287,43288,43289,43290,43291,43292,43293,43294,43295,43296,43297,43298,43299,43300,43301,43312,43313,43314,43315,43316,43317,43318,43319,43320,43321,43322,43323,43324,43325,43326,43327,43328,43329,43330,43331,43332,43333,43334,43360,43361,43362,43363,43364,43365,43366,43367,43368,43369,43370,43371,43372,43373,43374,43375,43376,43377,43378,43379,43380,43381,43382,43383,43384,43385,43386,43387,43388,43396,43397,43398,43399,43400,43401,43402,43403,43404,43405,43406,43407,43408,43409,43410,43411,43412,43413,43414,43415,43416,43417,43418,43419,43420,43421,43422,43423,43424,43425,43426,43427,43428,43429,43430,43431,43432,43433,43434,43435,43436,43437,43438,43439,43440,43441,43442,43471,43520,43521,43522,43523,43524,43525,43526,43527,43528,43529,43530,43531,43532,43533,43534,43535,43536,43537,43538,43539,43540,43541,43542,43543,43544,43545,43546,43547,43548,43549,43550,43551,43552,43553,43554,43555,43556,43557,43558,43559,43560,43584,43585,43586,43588,43589,43590,43591,43592,43593,43594,43595,43616,43617,43618,43619,43620,43621,43622,43623,43624,43625,43626,43627,43628,43629,43630,43631,43632,43633,43634,43635,43636,43637,43638,43642,43648,43649,43650,43651,43652,43653,43654,43655,43656,43657,43658,43659,43660,43661,43662,43663,43664,43665,43666,43667,43668,43669,43670,43671,43672,43673,43674,43675,43676,43677,43678,43679,43680,43681,43682,43683,43684,43685,43686,43687,43688,43689,43690,43691,43692,43693,43694,43695,43697,43701,43702,43705,43706,43707,43708,43709,43712,43714,43739,43740,43741,43744,43745,43746,43747,43748,43749,43750,43751,43752,43753,43754,43762,43763,43764,43777,43778,43779,43780,43781,43782,43785,43786,43787,43788,43789,43790,43793,43794,43795,43796,43797,43798,43808,43809,43810,43811,43812,43813,43814,43816,43817,43818,43819,43820,43821,43822,43968,43969,43970,43971,43972,43973,43974,43975,43976,43977,43978,43979,43980,43981,43982,43983,43984,43985,43986,43987,43988,43989,43990,43991,43992,43993,43994,43995,43996,43997,43998,43999,44000,44001,44002,44032,44033,44034,44035,44036,44037,44038,44039,44040,44041,44042,44043,44044,44045,44046,44047,44048,44049,44050,44051,44052,44053,44054,44055,44056,44057,44058,44059,44060,44061,44062,44063,44064,44065,44066,44067,44068,44069,44070,44071,44072,44073,44074,44075,44076,44077,44078,44079,44080,44081,44082,44083,44084,44085,44086,44087,44088,44089,44090,44091,44092,44093,44094,44095,44096,44097,44098,44099,44100,44101,44102,44103,44104,44105,44106,44107,44108,44109,44110,44111,44112,44113,44114,44115,44116,44117,44118,44119,44120,44121,44122,44123,44124,44125,44126,44127,44128,44129,44130,44131,44132,44133,44134,44135,44136,44137,44138,44139,44140,44141,44142,44143,44144,44145,44146,44147,44148,44149,44150,44151,44152,44153,44154,44155,44156,44157,44158,44159,44160,44161,44162,44163,44164,44165,44166,44167,44168,44169,44170,44171,44172,44173,44174,44175,44176,44177,44178,44179,44180,44181,44182,44183,44184,44185,44186,44187,44188,44189,44190,44191,44192,44193,44194,44195,44196,44197,44198,44199,44200,44201,44202,44203,44204,44205,44206,44207,44208,44209,44210,44211,44212,44213,44214,44215,44216,44217,44218,44219,44220,44221,44222,44223,44224,44225,44226,44227,44228,44229,44230,44231,44232,44233,44234,44235,44236,44237,44238,44239,44240,44241,44242,44243,44244,44245,44246,44247,44248,44249,44250,44251,44252,44253,44254,44255,44256,44257,44258,44259,44260,44261,44262,44263,44264,44265,44266,44267,44268,44269,44270,44271,44272,44273,44274,44275,44276,44277,44278,44279,44280,44281,44282,44283,44284,44285,44286,44287,44288,44289,44290,44291,44292,44293,44294,44295,44296,44297,44298,44299,44300,44301,44302,44303,44304,44305,44306,44307,44308,44309,44310,44311,44312,44313,44314,44315,44316,44317,44318,44319,44320,44321,44322,44323,44324,44325,44326,44327,44328,44329,44330,44331,44332,44333,44334,44335,44336,44337,44338,44339,44340,44341,44342,44343,44344,44345,44346,44347,44348,44349,44350,44351,44352,44353,44354,44355,44356,44357,44358,44359,44360,44361,44362,44363,44364,44365,44366,44367,44368,44369,44370,44371,44372,44373,44374,44375,44376,44377,44378,44379,44380,44381,44382,44383,44384,44385,44386,44387,44388,44389,44390,44391,44392,44393,44394,44395,44396,44397,44398,44399,44400,44401,44402,44403,44404,44405,44406,44407,44408,44409,44410,44411,44412,44413,44414,44415,44416,44417,44418,44419,44420,44421,44422,44423,44424,44425,44426,44427,44428,44429,44430,44431,44432,44433,44434,44435,44436,44437,44438,44439,44440,44441,44442,44443,44444,44445,44446,44447,44448,44449,44450,44451,44452,44453,44454,44455,44456,44457,44458,44459,44460,44461,44462,44463,44464,44465,44466,44467,44468,44469,44470,44471,44472,44473,44474,44475,44476,44477,44478,44479,44480,44481,44482,44483,44484,44485,44486,44487,44488,44489,44490,44491,44492,44493,44494,44495,44496,44497,44498,44499,44500,44501,44502,44503,44504,44505,44506,44507,44508,44509,44510,44511,44512,44513,44514,44515,44516,44517,44518,44519,44520,44521,44522,44523,44524,44525,44526,44527,44528,44529,44530,44531,44532,44533,44534,44535,44536,44537,44538,44539,44540,44541,44542,44543,44544,44545,44546,44547,44548,44549,44550,44551,44552,44553,44554,44555,44556,44557,44558,44559,44560,44561,44562,44563,44564,44565,44566,44567,44568,44569,44570,44571,44572,44573,44574,44575,44576,44577,44578,44579,44580,44581,44582,44583,44584,44585,44586,44587,44588,44589,44590,44591,44592,44593,44594,44595,44596,44597,44598,44599,44600,44601,44602,44603,44604,44605,44606,44607,44608,44609,44610,44611,44612,44613,44614,44615,44616,44617,44618,44619,44620,44621,44622,44623,44624,44625,44626,44627,44628,44629,44630,44631,44632,44633,44634,44635,44636,44637,44638,44639,44640,44641,44642,44643,44644,44645,44646,44647,44648,44649,44650,44651,44652,44653,44654,44655,44656,44657,44658,44659,44660,44661,44662,44663,44664,44665,44666,44667,44668,44669,44670,44671,44672,44673,44674,44675,44676,44677,44678,44679,44680,44681,44682,44683,44684,44685,44686,44687,44688,44689,44690,44691,44692,44693,44694,44695,44696,44697,44698,44699,44700,44701,44702,44703,44704,44705,44706,44707,44708,44709,44710,44711,44712,44713,44714,44715,44716,44717,44718,44719,44720,44721,44722,44723,44724,44725,44726,44727,44728,44729,44730,44731,44732,44733,44734,44735,44736,44737,44738,44739,44740,44741,44742,44743,44744,44745,44746,44747,44748,44749,44750,44751,44752,44753,44754,44755,44756,44757,44758,44759,44760,44761,44762,44763,44764,44765,44766,44767,44768,44769,44770,44771,44772,44773,44774,44775,44776,44777,44778,44779,44780,44781,44782,44783,44784,44785,44786,44787,44788,44789,44790,44791,44792,44793,44794,44795,44796,44797,44798,44799,44800,44801,44802,44803,44804,44805,44806,44807,44808,44809,44810,44811,44812,44813,44814,44815,44816,44817,44818,44819,44820,44821,44822,44823,44824,44825,44826,44827,44828,44829,44830,44831,44832,44833,44834,44835,44836,44837,44838,44839,44840,44841,44842,44843,44844,44845,44846,44847,44848,44849,44850,44851,44852,44853,44854,44855,44856,44857,44858,44859,44860,44861,44862,44863,44864,44865,44866,44867,44868,44869,44870,44871,44872,44873,44874,44875,44876,44877,44878,44879,44880,44881,44882,44883,44884,44885,44886,44887,44888,44889,44890,44891,44892,44893,44894,44895,44896,44897,44898,44899,44900,44901,44902,44903,44904,44905,44906,44907,44908,44909,44910,44911,44912,44913,44914,44915,44916,44917,44918,44919,44920,44921,44922,44923,44924,44925,44926,44927,44928,44929,44930,44931,44932,44933,44934,44935,44936,44937,44938,44939,44940,44941,44942,44943,44944,44945,44946,44947,44948,44949,44950,44951,44952,44953,44954,44955,44956,44957,44958,44959,44960,44961,44962,44963,44964,44965,44966,44967,44968,44969,44970,44971,44972,44973,44974,44975,44976,44977,44978,44979,44980,44981,44982,44983,44984,44985,44986,44987,44988,44989,44990,44991,44992,44993,44994,44995,44996,44997,44998,44999,45000,45001,45002,45003,45004,45005,45006,45007,45008,45009,45010,45011,45012,45013,45014,45015,45016,45017,45018,45019,45020,45021,45022,45023,45024,45025,45026,45027,45028,45029,45030,45031,45032,45033,45034,45035,45036,45037,45038,45039,45040,45041,45042,45043,45044,45045,45046,45047,45048,45049,45050,45051,45052,45053,45054,45055,45056,45057,45058,45059,45060,45061,45062,45063,45064,45065,45066,45067,45068,45069,45070,45071,45072,45073,45074,45075,45076,45077,45078,45079,45080,45081,45082,45083,45084,45085,45086,45087,45088,45089,45090,45091,45092,45093,45094,45095,45096,45097,45098,45099,45100,45101,45102,45103,45104,45105,45106,45107,45108,45109,45110,45111,45112,45113,45114,45115,45116,45117,45118,45119,45120,45121,45122,45123,45124,45125,45126,45127,45128,45129,45130,45131,45132,45133,45134,45135,45136,45137,45138,45139,45140,45141,45142,45143,45144,45145,45146,45147,45148,45149,45150,45151,45152,45153,45154,45155,45156,45157,45158,45159,45160,45161,45162,45163,45164,45165,45166,45167,45168,45169,45170,45171,45172,45173,45174,45175,45176,45177,45178,45179,45180,45181,45182,45183,45184,45185,45186,45187,45188,45189,45190,45191,45192,45193,45194,45195,45196,45197,45198,45199,45200,45201,45202,45203,45204,45205,45206,45207,45208,45209,45210,45211,45212,45213,45214,45215,45216,45217,45218,45219,45220,45221,45222,45223,45224,45225,45226,45227,45228,45229,45230,45231,45232,45233,45234,45235,45236,45237,45238,45239,45240,45241,45242,45243,45244,45245,45246,45247,45248,45249,45250,45251,45252,45253,45254,45255,45256,45257,45258,45259,45260,45261,45262,45263,45264,45265,45266,45267,45268,45269,45270,45271,45272,45273,45274,45275,45276,45277,45278,45279,45280,45281,45282,45283,45284,45285,45286,45287,45288,45289,45290,45291,45292,45293,45294,45295,45296,45297,45298,45299,45300,45301,45302,45303,45304,45305,45306,45307,45308,45309,45310,45311,45312,45313,45314,45315,45316,45317,45318,45319,45320,45321,45322,45323,45324,45325,45326,45327,45328,45329,45330,45331,45332,45333,45334,45335,45336,45337,45338,45339,45340,45341,45342,45343,45344,45345,45346,45347,45348,45349,45350,45351,45352,45353,45354,45355,45356,45357,45358,45359,45360,45361,45362,45363,45364,45365,45366,45367,45368,45369,45370,45371,45372,45373,45374,45375,45376,45377,45378,45379,45380,45381,45382,45383,45384,45385,45386,45387,45388,45389,45390,45391,45392,45393,45394,45395,45396,45397,45398,45399,45400,45401,45402,45403,45404,45405,45406,45407,45408,45409,45410,45411,45412,45413,45414,45415,45416,45417,45418,45419,45420,45421,45422,45423,45424,45425,45426,45427,45428,45429,45430,45431,45432,45433,45434,45435,45436,45437,45438,45439,45440,45441,45442,45443,45444,45445,45446,45447,45448,45449,45450,45451,45452,45453,45454,45455,45456,45457,45458,45459,45460,45461,45462,45463,45464,45465,45466,45467,45468,45469,45470,45471,45472,45473,45474,45475,45476,45477,45478,45479,45480,45481,45482,45483,45484,45485,45486,45487,45488,45489,45490,45491,45492,45493,45494,45495,45496,45497,45498,45499,45500,45501,45502,45503,45504,45505,45506,45507,45508,45509,45510,45511,45512,45513,45514,45515,45516,45517,45518,45519,45520,45521,45522,45523,45524,45525,45526,45527,45528,45529,45530,45531,45532,45533,45534,45535,45536,45537,45538,45539,45540,45541,45542,45543,45544,45545,45546,45547,45548,45549,45550,45551,45552,45553,45554,45555,45556,45557,45558,45559,45560,45561,45562,45563,45564,45565,45566,45567,45568,45569,45570,45571,45572,45573,45574,45575,45576,45577,45578,45579,45580,45581,45582,45583,45584,45585,45586,45587,45588,45589,45590,45591,45592,45593,45594,45595,45596,45597,45598,45599,45600,45601,45602,45603,45604,45605,45606,45607,45608,45609,45610,45611,45612,45613,45614,45615,45616,45617,45618,45619,45620,45621,45622,45623,45624,45625,45626,45627,45628,45629,45630,45631,45632,45633,45634,45635,45636,45637,45638,45639,45640,45641,45642,45643,45644,45645,45646,45647,45648,45649,45650,45651,45652,45653,45654,45655,45656,45657,45658,45659,45660,45661,45662,45663,45664,45665,45666,45667,45668,45669,45670,45671,45672,45673,45674,45675,45676,45677,45678,45679,45680,45681,45682,45683,45684,45685,45686,45687,45688,45689,45690,45691,45692,45693,45694,45695,45696,45697,45698,45699,45700,45701,45702,45703,45704,45705,45706,45707,45708,45709,45710,45711,45712,45713,45714,45715,45716,45717,45718,45719,45720,45721,45722,45723,45724,45725,45726,45727,45728,45729,45730,45731,45732,45733,45734,45735,45736,45737,45738,45739,45740,45741,45742,45743,45744,45745,45746,45747,45748,45749,45750,45751,45752,45753,45754,45755,45756,45757,45758,45759,45760,45761,45762,45763,45764,45765,45766,45767,45768,45769,45770,45771,45772,45773,45774,45775,45776,45777,45778,45779,45780,45781,45782,45783,45784,45785,45786,45787,45788,45789,45790,45791,45792,45793,45794,45795,45796,45797,45798,45799,45800,45801,45802,45803,45804,45805,45806,45807,45808,45809,45810,45811,45812,45813,45814,45815,45816,45817,45818,45819,45820,45821,45822,45823,45824,45825,45826,45827,45828,45829,45830,45831,45832,45833,45834,45835,45836,45837,45838,45839,45840,45841,45842,45843,45844,45845,45846,45847,45848,45849,45850,45851,45852,45853,45854,45855,45856,45857,45858,45859,45860,45861,45862,45863,45864,45865,45866,45867,45868,45869,45870,45871,45872,45873,45874,45875,45876,45877,45878,45879,45880,45881,45882,45883,45884,45885,45886,45887,45888,45889,45890,45891,45892,45893,45894,45895,45896,45897,45898,45899,45900,45901,45902,45903,45904,45905,45906,45907,45908,45909,45910,45911,45912,45913,45914,45915,45916,45917,45918,45919,45920,45921,45922,45923,45924,45925,45926,45927,45928,45929,45930,45931,45932,45933,45934,45935,45936,45937,45938,45939,45940,45941,45942,45943,45944,45945,45946,45947,45948,45949,45950,45951,45952,45953,45954,45955,45956,45957,45958,45959,45960,45961,45962,45963,45964,45965,45966,45967,45968,45969,45970,45971,45972,45973,45974,45975,45976,45977,45978,45979,45980,45981,45982,45983,45984,45985,45986,45987,45988,45989,45990,45991,45992,45993,45994,45995,45996,45997,45998,45999,46000,46001,46002,46003,46004,46005,46006,46007,46008,46009,46010,46011,46012,46013,46014,46015,46016,46017,46018,46019,46020,46021,46022,46023,46024,46025,46026,46027,46028,46029,46030,46031,46032,46033,46034,46035,46036,46037,46038,46039,46040,46041,46042,46043,46044,46045,46046,46047,46048,46049,46050,46051,46052,46053,46054,46055,46056,46057,46058,46059,46060,46061,46062,46063,46064,46065,46066,46067,46068,46069,46070,46071,46072,46073,46074,46075,46076,46077,46078,46079,46080,46081,46082,46083,46084,46085,46086,46087,46088,46089,46090,46091,46092,46093,46094,46095,46096,46097,46098,46099,46100,46101,46102,46103,46104,46105,46106,46107,46108,46109,46110,46111,46112,46113,46114,46115,46116,46117,46118,46119,46120,46121,46122,46123,46124,46125,46126,46127,46128,46129,46130,46131,46132,46133,46134,46135,46136,46137,46138,46139,46140,46141,46142,46143,46144,46145,46146,46147,46148,46149,46150,46151,46152,46153,46154,46155,46156,46157,46158,46159,46160,46161,46162,46163,46164,46165,46166,46167,46168,46169,46170,46171,46172,46173,46174,46175,46176,46177,46178,46179,46180,46181,46182,46183,46184,46185,46186,46187,46188,46189,46190,46191,46192,46193,46194,46195,46196,46197,46198,46199,46200,46201,46202,46203,46204,46205,46206,46207,46208,46209,46210,46211,46212,46213,46214,46215,46216,46217,46218,46219,46220,46221,46222,46223,46224,46225,46226,46227,46228,46229,46230,46231,46232,46233,46234,46235,46236,46237,46238,46239,46240,46241,46242,46243,46244,46245,46246,46247,46248,46249,46250,46251,46252,46253,46254,46255,46256,46257,46258,46259,46260,46261,46262,46263,46264,46265,46266,46267,46268,46269,46270,46271,46272,46273,46274,46275,46276,46277,46278,46279,46280,46281,46282,46283,46284,46285,46286,46287,46288,46289,46290,46291,46292,46293,46294,46295,46296,46297,46298,46299,46300,46301,46302,46303,46304,46305,46306,46307,46308,46309,46310,46311,46312,46313,46314,46315,46316,46317,46318,46319,46320,46321,46322,46323,46324,46325,46326,46327,46328,46329,46330,46331,46332,46333,46334,46335,46336,46337,46338,46339,46340,46341,46342,46343,46344,46345,46346,46347,46348,46349,46350,46351,46352,46353,46354,46355,46356,46357,46358,46359,46360,46361,46362,46363,46364,46365,46366,46367,46368,46369,46370,46371,46372,46373,46374,46375,46376,46377,46378,46379,46380,46381,46382,46383,46384,46385,46386,46387,46388,46389,46390,46391,46392,46393,46394,46395,46396,46397,46398,46399,46400,46401,46402,46403,46404,46405,46406,46407,46408,46409,46410,46411,46412,46413,46414,46415,46416,46417,46418,46419,46420,46421,46422,46423,46424,46425,46426,46427,46428,46429,46430,46431,46432,46433,46434,46435,46436,46437,46438,46439,46440,46441,46442,46443,46444,46445,46446,46447,46448,46449,46450,46451,46452,46453,46454,46455,46456,46457,46458,46459,46460,46461,46462,46463,46464,46465,46466,46467,46468,46469,46470,46471,46472,46473,46474,46475,46476,46477,46478,46479,46480,46481,46482,46483,46484,46485,46486,46487,46488,46489,46490,46491,46492,46493,46494,46495,46496,46497,46498,46499,46500,46501,46502,46503,46504,46505,46506,46507,46508,46509,46510,46511,46512,46513,46514,46515,46516,46517,46518,46519,46520,46521,46522,46523,46524,46525,46526,46527,46528,46529,46530,46531,46532,46533,46534,46535,46536,46537,46538,46539,46540,46541,46542,46543,46544,46545,46546,46547,46548,46549,46550,46551,46552,46553,46554,46555,46556,46557,46558,46559,46560,46561,46562,46563,46564,46565,46566,46567,46568,46569,46570,46571,46572,46573,46574,46575,46576,46577,46578,46579,46580,46581,46582,46583,46584,46585,46586,46587,46588,46589,46590,46591,46592,46593,46594,46595,46596,46597,46598,46599,46600,46601,46602,46603,46604,46605,46606,46607,46608,46609,46610,46611,46612,46613,46614,46615,46616,46617,46618,46619,46620,46621,46622,46623,46624,46625,46626,46627,46628,46629,46630,46631,46632,46633,46634,46635,46636,46637,46638,46639,46640,46641,46642,46643,46644,46645,46646,46647,46648,46649,46650,46651,46652,46653,46654,46655,46656,46657,46658,46659,46660,46661,46662,46663,46664,46665,46666,46667,46668,46669,46670,46671,46672,46673,46674,46675,46676,46677,46678,46679,46680,46681,46682,46683,46684,46685,46686,46687,46688,46689,46690,46691,46692,46693,46694,46695,46696,46697,46698,46699,46700,46701,46702,46703,46704,46705,46706,46707,46708,46709,46710,46711,46712,46713,46714,46715,46716,46717,46718,46719,46720,46721,46722,46723,46724,46725,46726,46727,46728,46729,46730,46731,46732,46733,46734,46735,46736,46737,46738,46739,46740,46741,46742,46743,46744,46745,46746,46747,46748,46749,46750,46751,46752,46753,46754,46755,46756,46757,46758,46759,46760,46761,46762,46763,46764,46765,46766,46767,46768,46769,46770,46771,46772,46773,46774,46775,46776,46777,46778,46779,46780,46781,46782,46783,46784,46785,46786,46787,46788,46789,46790,46791,46792,46793,46794,46795,46796,46797,46798,46799,46800,46801,46802,46803,46804,46805,46806,46807,46808,46809,46810,46811,46812,46813,46814,46815,46816,46817,46818,46819,46820,46821,46822,46823,46824,46825,46826,46827,46828,46829,46830,46831,46832,46833,46834,46835,46836,46837,46838,46839,46840,46841,46842,46843,46844,46845,46846,46847,46848,46849,46850,46851,46852,46853,46854,46855,46856,46857,46858,46859,46860,46861,46862,46863,46864,46865,46866,46867,46868,46869,46870,46871,46872,46873,46874,46875,46876,46877,46878,46879,46880,46881,46882,46883,46884,46885,46886,46887,46888,46889,46890,46891,46892,46893,46894,46895,46896,46897,46898,46899,46900,46901,46902,46903,46904,46905,46906,46907,46908,46909,46910,46911,46912,46913,46914,46915,46916,46917,46918,46919,46920,46921,46922,46923,46924,46925,46926,46927,46928,46929,46930,46931,46932,46933,46934,46935,46936,46937,46938,46939,46940,46941,46942,46943,46944,46945,46946,46947,46948,46949,46950,46951,46952,46953,46954,46955,46956,46957,46958,46959,46960,46961,46962,46963,46964,46965,46966,46967,46968,46969,46970,46971,46972,46973,46974,46975,46976,46977,46978,46979,46980,46981,46982,46983,46984,46985,46986,46987,46988,46989,46990,46991,46992,46993,46994,46995,46996,46997,46998,46999,47000,47001,47002,47003,47004,47005,47006,47007,47008,47009,47010,47011,47012,47013,47014,47015,47016,47017,47018,47019,47020,47021,47022,47023,47024,47025,47026,47027,47028,47029,47030,47031,47032,47033,47034,47035,47036,47037,47038,47039,47040,47041,47042,47043,47044,47045,47046,47047,47048,47049,47050,47051,47052,47053,47054,47055,47056,47057,47058,47059,47060,47061,47062,47063,47064,47065,47066,47067,47068,47069,47070,47071,47072,47073,47074,47075,47076,47077,47078,47079,47080,47081,47082,47083,47084,47085,47086,47087,47088,47089,47090,47091,47092,47093,47094,47095,47096,47097,47098,47099,47100,47101,47102,47103,47104,47105,47106,47107,47108,47109,47110,47111,47112,47113,47114,47115,47116,47117,47118,47119,47120,47121,47122,47123,47124,47125,47126,47127,47128,47129,47130,47131,47132,47133,47134,47135,47136,47137,47138,47139,47140,47141,47142,47143,47144,47145,47146,47147,47148,47149,47150,47151,47152,47153,47154,47155,47156,47157,47158,47159,47160,47161,47162,47163,47164,47165,47166,47167,47168,47169,47170,47171,47172,47173,47174,47175,47176,47177,47178,47179,47180,47181,47182,47183,47184,47185,47186,47187,47188,47189,47190,47191,47192,47193,47194,47195,47196,47197,47198,47199,47200,47201,47202,47203,47204,47205,47206,47207,47208,47209,47210,47211,47212,47213,47214,47215,47216,47217,47218,47219,47220,47221,47222,47223,47224,47225,47226,47227,47228,47229,47230,47231,47232,47233,47234,47235,47236,47237,47238,47239,47240,47241,47242,47243,47244,47245,47246,47247,47248,47249,47250,47251,47252,47253,47254,47255,47256,47257,47258,47259,47260,47261,47262,47263,47264,47265,47266,47267,47268,47269,47270,47271,47272,47273,47274,47275,47276,47277,47278,47279,47280,47281,47282,47283,47284,47285,47286,47287,47288,47289,47290,47291,47292,47293,47294,47295,47296,47297,47298,47299,47300,47301,47302,47303,47304,47305,47306,47307,47308,47309,47310,47311,47312,47313,47314,47315,47316,47317,47318,47319,47320,47321,47322,47323,47324,47325,47326,47327,47328,47329,47330,47331,47332,47333,47334,47335,47336,47337,47338,47339,47340,47341,47342,47343,47344,47345,47346,47347,47348,47349,47350,47351,47352,47353,47354,47355,47356,47357,47358,47359,47360,47361,47362,47363,47364,47365,47366,47367,47368,47369,47370,47371,47372,47373,47374,47375,47376,47377,47378,47379,47380,47381,47382,47383,47384,47385,47386,47387,47388,47389,47390,47391,47392,47393,47394,47395,47396,47397,47398,47399,47400,47401,47402,47403,47404,47405,47406,47407,47408,47409,47410,47411,47412,47413,47414,47415,47416,47417,47418,47419,47420,47421,47422,47423,47424,47425,47426,47427,47428,47429,47430,47431,47432,47433,47434,47435,47436,47437,47438,47439,47440,47441,47442,47443,47444,47445,47446,47447,47448,47449,47450,47451,47452,47453,47454,47455,47456,47457,47458,47459,47460,47461,47462,47463,47464,47465,47466,47467,47468,47469,47470,47471,47472,47473,47474,47475,47476,47477,47478,47479,47480,47481,47482,47483,47484,47485,47486,47487,47488,47489,47490,47491,47492,47493,47494,47495,47496,47497,47498,47499,47500,47501,47502,47503,47504,47505,47506,47507,47508,47509,47510,47511,47512,47513,47514,47515,47516,47517,47518,47519,47520,47521,47522,47523,47524,47525,47526,47527,47528,47529,47530,47531,47532,47533,47534,47535,47536,47537,47538,47539,47540,47541,47542,47543,47544,47545,47546,47547,47548,47549,47550,47551,47552,47553,47554,47555,47556,47557,47558,47559,47560,47561,47562,47563,47564,47565,47566,47567,47568,47569,47570,47571,47572,47573,47574,47575,47576,47577,47578,47579,47580,47581,47582,47583,47584,47585,47586,47587,47588,47589,47590,47591,47592,47593,47594,47595,47596,47597,47598,47599,47600,47601,47602,47603,47604,47605,47606,47607,47608,47609,47610,47611,47612,47613,47614,47615,47616,47617,47618,47619,47620,47621,47622,47623,47624,47625,47626,47627,47628,47629,47630,47631,47632,47633,47634,47635,47636,47637,47638,47639,47640,47641,47642,47643,47644,47645,47646,47647,47648,47649,47650,47651,47652,47653,47654,47655,47656,47657,47658,47659,47660,47661,47662,47663,47664,47665,47666,47667,47668,47669,47670,47671,47672,47673,47674,47675,47676,47677,47678,47679,47680,47681,47682,47683,47684,47685,47686,47687,47688,47689,47690,47691,47692,47693,47694,47695,47696,47697,47698,47699,47700,47701,47702,47703,47704,47705,47706,47707,47708,47709,47710,47711,47712,47713,47714,47715,47716,47717,47718,47719,47720,47721,47722,47723,47724,47725,47726,47727,47728,47729,47730,47731,47732,47733,47734,47735,47736,47737,47738,47739,47740,47741,47742,47743,47744,47745,47746,47747,47748,47749,47750,47751,47752,47753,47754,47755,47756,47757,47758,47759,47760,47761,47762,47763,47764,47765,47766,47767,47768,47769,47770,47771,47772,47773,47774,47775,47776,47777,47778,47779,47780,47781,47782,47783,47784,47785,47786,47787,47788,47789,47790,47791,47792,47793,47794,47795,47796,47797,47798,47799,47800,47801,47802,47803,47804,47805,47806,47807,47808,47809,47810,47811,47812,47813,47814,47815,47816,47817,47818,47819,47820,47821,47822,47823,47824,47825,47826,47827,47828,47829,47830,47831,47832,47833,47834,47835,47836,47837,47838,47839,47840,47841,47842,47843,47844,47845,47846,47847,47848,47849,47850,47851,47852,47853,47854,47855,47856,47857,47858,47859,47860,47861,47862,47863,47864,47865,47866,47867,47868,47869,47870,47871,47872,47873,47874,47875,47876,47877,47878,47879,47880,47881,47882,47883,47884,47885,47886,47887,47888,47889,47890,47891,47892,47893,47894,47895,47896,47897,47898,47899,47900,47901,47902,47903,47904,47905,47906,47907,47908,47909,47910,47911,47912,47913,47914,47915,47916,47917,47918,47919,47920,47921,47922,47923,47924,47925,47926,47927,47928,47929,47930,47931,47932,47933,47934,47935,47936,47937,47938,47939,47940,47941,47942,47943,47944,47945,47946,47947,47948,47949,47950,47951,47952,47953,47954,47955,47956,47957,47958,47959,47960,47961,47962,47963,47964,47965,47966,47967,47968,47969,47970,47971,47972,47973,47974,47975,47976,47977,47978,47979,47980,47981,47982,47983,47984,47985,47986,47987,47988,47989,47990,47991,47992,47993,47994,47995,47996,47997,47998,47999,48000,48001,48002,48003,48004,48005,48006,48007,48008,48009,48010,48011,48012,48013,48014,48015,48016,48017,48018,48019,48020,48021,48022,48023,48024,48025,48026,48027,48028,48029,48030,48031,48032,48033,48034,48035,48036,48037,48038,48039,48040,48041,48042,48043,48044,48045,48046,48047,48048,48049,48050,48051,48052,48053,48054,48055,48056,48057,48058,48059,48060,48061,48062,48063,48064,48065,48066,48067,48068,48069,48070,48071,48072,48073,48074,48075,48076,48077,48078,48079,48080,48081,48082,48083,48084,48085,48086,48087,48088,48089,48090,48091,48092,48093,48094,48095,48096,48097,48098,48099,48100,48101,48102,48103,48104,48105,48106,48107,48108,48109,48110,48111,48112,48113,48114,48115,48116,48117,48118,48119,48120,48121,48122,48123,48124,48125,48126,48127,48128,48129,48130,48131,48132,48133,48134,48135,48136,48137,48138,48139,48140,48141,48142,48143,48144,48145,48146,48147,48148,48149,48150,48151,48152,48153,48154,48155,48156,48157,48158,48159,48160,48161,48162,48163,48164,48165,48166,48167,48168,48169,48170,48171,48172,48173,48174,48175,48176,48177,48178,48179,48180,48181,48182,48183,48184,48185,48186,48187,48188,48189,48190,48191,48192,48193,48194,48195,48196,48197,48198,48199,48200,48201,48202,48203,48204,48205,48206,48207,48208,48209,48210,48211,48212,48213,48214,48215,48216,48217,48218,48219,48220,48221,48222,48223,48224,48225,48226,48227,48228,48229,48230,48231,48232,48233,48234,48235,48236,48237,48238,48239,48240,48241,48242,48243,48244,48245,48246,48247,48248,48249,48250,48251,48252,48253,48254,48255,48256,48257,48258,48259,48260,48261,48262,48263,48264,48265,48266,48267,48268,48269,48270,48271,48272,48273,48274,48275,48276,48277,48278,48279,48280,48281,48282,48283,48284,48285,48286,48287,48288,48289,48290,48291,48292,48293,48294,48295,48296,48297,48298,48299,48300,48301,48302,48303,48304,48305,48306,48307,48308,48309,48310,48311,48312,48313,48314,48315,48316,48317,48318,48319,48320,48321,48322,48323,48324,48325,48326,48327,48328,48329,48330,48331,48332,48333,48334,48335,48336,48337,48338,48339,48340,48341,48342,48343,48344,48345,48346,48347,48348,48349,48350,48351,48352,48353,48354,48355,48356,48357,48358,48359,48360,48361,48362,48363,48364,48365,48366,48367,48368,48369,48370,48371,48372,48373,48374,48375,48376,48377,48378,48379,48380,48381,48382,48383,48384,48385,48386,48387,48388,48389,48390,48391,48392,48393,48394,48395,48396,48397,48398,48399,48400,48401,48402,48403,48404,48405,48406,48407,48408,48409,48410,48411,48412,48413,48414,48415,48416,48417,48418,48419,48420,48421,48422,48423,48424,48425,48426,48427,48428,48429,48430,48431,48432,48433,48434,48435,48436,48437,48438,48439,48440,48441,48442,48443,48444,48445,48446,48447,48448,48449,48450,48451,48452,48453,48454,48455,48456,48457,48458,48459,48460,48461,48462,48463,48464,48465,48466,48467,48468,48469,48470,48471,48472,48473,48474,48475,48476,48477,48478,48479,48480,48481,48482,48483,48484,48485,48486,48487,48488,48489,48490,48491,48492,48493,48494,48495,48496,48497,48498,48499,48500,48501,48502,48503,48504,48505,48506,48507,48508,48509,48510,48511,48512,48513,48514,48515,48516,48517,48518,48519,48520,48521,48522,48523,48524,48525,48526,48527,48528,48529,48530,48531,48532,48533,48534,48535,48536,48537,48538,48539,48540,48541,48542,48543,48544,48545,48546,48547,48548,48549,48550,48551,48552,48553,48554,48555,48556,48557,48558,48559,48560,48561,48562,48563,48564,48565,48566,48567,48568,48569,48570,48571,48572,48573,48574,48575,48576,48577,48578,48579,48580,48581,48582,48583,48584,48585,48586,48587,48588,48589,48590,48591,48592,48593,48594,48595,48596,48597,48598,48599,48600,48601,48602,48603,48604,48605,48606,48607,48608,48609,48610,48611,48612,48613,48614,48615,48616,48617,48618,48619,48620,48621,48622,48623,48624,48625,48626,48627,48628,48629,48630,48631,48632,48633,48634,48635,48636,48637,48638,48639,48640,48641,48642,48643,48644,48645,48646,48647,48648,48649,48650,48651,48652,48653,48654,48655,48656,48657,48658,48659,48660,48661,48662,48663,48664,48665,48666,48667,48668,48669,48670,48671,48672,48673,48674,48675,48676,48677,48678,48679,48680,48681,48682,48683,48684,48685,48686,48687,48688,48689,48690,48691,48692,48693,48694,48695,48696,48697,48698,48699,48700,48701,48702,48703,48704,48705,48706,48707,48708,48709,48710,48711,48712,48713,48714,48715,48716,48717,48718,48719,48720,48721,48722,48723,48724,48725,48726,48727,48728,48729,48730,48731,48732,48733,48734,48735,48736,48737,48738,48739,48740,48741,48742,48743,48744,48745,48746,48747,48748,48749,48750,48751,48752,48753,48754,48755,48756,48757,48758,48759,48760,48761,48762,48763,48764,48765,48766,48767,48768,48769,48770,48771,48772,48773,48774,48775,48776,48777,48778,48779,48780,48781,48782,48783,48784,48785,48786,48787,48788,48789,48790,48791,48792,48793,48794,48795,48796,48797,48798,48799,48800,48801,48802,48803,48804,48805,48806,48807,48808,48809,48810,48811,48812,48813,48814,48815,48816,48817,48818,48819,48820,48821,48822,48823,48824,48825,48826,48827,48828,48829,48830,48831,48832,48833,48834,48835,48836,48837,48838,48839,48840,48841,48842,48843,48844,48845,48846,48847,48848,48849,48850,48851,48852,48853,48854,48855,48856,48857,48858,48859,48860,48861,48862,48863,48864,48865,48866,48867,48868,48869,48870,48871,48872,48873,48874,48875,48876,48877,48878,48879,48880,48881,48882,48883,48884,48885,48886,48887,48888,48889,48890,48891,48892,48893,48894,48895,48896,48897,48898,48899,48900,48901,48902,48903,48904,48905,48906,48907,48908,48909,48910,48911,48912,48913,48914,48915,48916,48917,48918,48919,48920,48921,48922,48923,48924,48925,48926,48927,48928,48929,48930,48931,48932,48933,48934,48935,48936,48937,48938,48939,48940,48941,48942,48943,48944,48945,48946,48947,48948,48949,48950,48951,48952,48953,48954,48955,48956,48957,48958,48959,48960,48961,48962,48963,48964,48965,48966,48967,48968,48969,48970,48971,48972,48973,48974,48975,48976,48977,48978,48979,48980,48981,48982,48983,48984,48985,48986,48987,48988,48989,48990,48991,48992,48993,48994,48995,48996,48997,48998,48999,49000,49001,49002,49003,49004,49005,49006,49007,49008,49009,49010,49011,49012,49013,49014,49015,49016,49017,49018,49019,49020,49021,49022,49023,49024,49025,49026,49027,49028,49029,49030,49031,49032,49033,49034,49035,49036,49037,49038,49039,49040,49041,49042,49043,49044,49045,49046,49047,49048,49049,49050,49051,49052,49053,49054,49055,49056,49057,49058,49059,49060,49061,49062,49063,49064,49065,49066,49067,49068,49069,49070,49071,49072,49073,49074,49075,49076,49077,49078,49079,49080,49081,49082,49083,49084,49085,49086,49087,49088,49089,49090,49091,49092,49093,49094,49095,49096,49097,49098,49099,49100,49101,49102,49103,49104,49105,49106,49107,49108,49109,49110,49111,49112,49113,49114,49115,49116,49117,49118,49119,49120,49121,49122,49123,49124,49125,49126,49127,49128,49129,49130,49131,49132,49133,49134,49135,49136,49137,49138,49139,49140,49141,49142,49143,49144,49145,49146,49147,49148,49149,49150,49151,49152,49153,49154,49155,49156,49157,49158,49159,49160,49161,49162,49163,49164,49165,49166,49167,49168,49169,49170,49171,49172,49173,49174,49175,49176,49177,49178,49179,49180,49181,49182,49183,49184,49185,49186,49187,49188,49189,49190,49191,49192,49193,49194,49195,49196,49197,49198,49199,49200,49201,49202,49203,49204,49205,49206,49207,49208,49209,49210,49211,49212,49213,49214,49215,49216,49217,49218,49219,49220,49221,49222,49223,49224,49225,49226,49227,49228,49229,49230,49231,49232,49233,49234,49235,49236,49237,49238,49239,49240,49241,49242,49243,49244,49245,49246,49247,49248,49249,49250,49251,49252,49253,49254,49255,49256,49257,49258,49259,49260,49261,49262,49263,49264,49265,49266,49267,49268,49269,49270,49271,49272,49273,49274,49275,49276,49277,49278,49279,49280,49281,49282,49283,49284,49285,49286,49287,49288,49289,49290,49291,49292,49293,49294,49295,49296,49297,49298,49299,49300,49301,49302,49303,49304,49305,49306,49307,49308,49309,49310,49311,49312,49313,49314,49315,49316,49317,49318,49319,49320,49321,49322,49323,49324,49325,49326,49327,49328,49329,49330,49331,49332,49333,49334,49335,49336,49337,49338,49339,49340,49341,49342,49343,49344,49345,49346,49347,49348,49349,49350,49351,49352,49353,49354,49355,49356,49357,49358,49359,49360,49361,49362,49363,49364,49365,49366,49367,49368,49369,49370,49371,49372,49373,49374,49375,49376,49377,49378,49379,49380,49381,49382,49383,49384,49385,49386,49387,49388,49389,49390,49391,49392,49393,49394,49395,49396,49397,49398,49399,49400,49401,49402,49403,49404,49405,49406,49407,49408,49409,49410,49411,49412,49413,49414,49415,49416,49417,49418,49419,49420,49421,49422,49423,49424,49425,49426,49427,49428,49429,49430,49431,49432,49433,49434,49435,49436,49437,49438,49439,49440,49441,49442,49443,49444,49445,49446,49447,49448,49449,49450,49451,49452,49453,49454,49455,49456,49457,49458,49459,49460,49461,49462,49463,49464,49465,49466,49467,49468,49469,49470,49471,49472,49473,49474,49475,49476,49477,49478,49479,49480,49481,49482,49483,49484,49485,49486,49487,49488,49489,49490,49491,49492,49493,49494,49495,49496,49497,49498,49499,49500,49501,49502,49503,49504,49505,49506,49507,49508,49509,49510,49511,49512,49513,49514,49515,49516,49517,49518,49519,49520,49521,49522,49523,49524,49525,49526,49527,49528,49529,49530,49531,49532,49533,49534,49535,49536,49537,49538,49539,49540,49541,49542,49543,49544,49545,49546,49547,49548,49549,49550,49551,49552,49553,49554,49555,49556,49557,49558,49559,49560,49561,49562,49563,49564,49565,49566,49567,49568,49569,49570,49571,49572,49573,49574,49575,49576,49577,49578,49579,49580,49581,49582,49583,49584,49585,49586,49587,49588,49589,49590,49591,49592,49593,49594,49595,49596,49597,49598,49599,49600,49601,49602,49603,49604,49605,49606,49607,49608,49609,49610,49611,49612,49613,49614,49615,49616,49617,49618,49619,49620,49621,49622,49623,49624,49625,49626,49627,49628,49629,49630,49631,49632,49633,49634,49635,49636,49637,49638,49639,49640,49641,49642,49643,49644,49645,49646,49647,49648,49649,49650,49651,49652,49653,49654,49655,49656,49657,49658,49659,49660,49661,49662,49663,49664,49665,49666,49667,49668,49669,49670,49671,49672,49673,49674,49675,49676,49677,49678,49679,49680,49681,49682,49683,49684,49685,49686,49687,49688,49689,49690,49691,49692,49693,49694,49695,49696,49697,49698,49699,49700,49701,49702,49703,49704,49705,49706,49707,49708,49709,49710,49711,49712,49713,49714,49715,49716,49717,49718,49719,49720,49721,49722,49723,49724,49725,49726,49727,49728,49729,49730,49731,49732,49733,49734,49735,49736,49737,49738,49739,49740,49741,49742,49743,49744,49745,49746,49747,49748,49749,49750,49751,49752,49753,49754,49755,49756,49757,49758,49759,49760,49761,49762,49763,49764,49765,49766,49767,49768,49769,49770,49771,49772,49773,49774,49775,49776,49777,49778,49779,49780,49781,49782,49783,49784,49785,49786,49787,49788,49789,49790,49791,49792,49793,49794,49795,49796,49797,49798,49799,49800,49801,49802,49803,49804,49805,49806,49807,49808,49809,49810,49811,49812,49813,49814,49815,49816,49817,49818,49819,49820,49821,49822,49823,49824,49825,49826,49827,49828,49829,49830,49831,49832,49833,49834,49835,49836,49837,49838,49839,49840,49841,49842,49843,49844,49845,49846,49847,49848,49849,49850,49851,49852,49853,49854,49855,49856,49857,49858,49859,49860,49861,49862,49863,49864,49865,49866,49867,49868,49869,49870,49871,49872,49873,49874,49875,49876,49877,49878,49879,49880,49881,49882,49883,49884,49885,49886,49887,49888,49889,49890,49891,49892,49893,49894,49895,49896,49897,49898,49899,49900,49901,49902,49903,49904,49905,49906,49907,49908,49909,49910,49911,49912,49913,49914,49915,49916,49917,49918,49919,49920,49921,49922,49923,49924,49925,49926,49927,49928,49929,49930,49931,49932,49933,49934,49935,49936,49937,49938,49939,49940,49941,49942,49943,49944,49945,49946,49947,49948,49949,49950,49951,49952,49953,49954,49955,49956,49957,49958,49959,49960,49961,49962,49963,49964,49965,49966,49967,49968,49969,49970,49971,49972,49973,49974,49975,49976,49977,49978,49979,49980,49981,49982,49983,49984,49985,49986,49987,49988,49989,49990,49991,49992,49993,49994,49995,49996,49997,49998,49999,50000,50001,50002,50003,50004,50005,50006,50007,50008,50009,50010,50011,50012,50013,50014,50015,50016,50017,50018,50019,50020,50021,50022,50023,50024,50025,50026,50027,50028,50029,50030,50031,50032,50033,50034,50035,50036,50037,50038,50039,50040,50041,50042,50043,50044,50045,50046,50047,50048,50049,50050,50051,50052,50053,50054,50055,50056,50057,50058,50059,50060,50061,50062,50063,50064,50065,50066,50067,50068,50069,50070,50071,50072,50073,50074,50075,50076,50077,50078,50079,50080,50081,50082,50083,50084,50085,50086,50087,50088,50089,50090,50091,50092,50093,50094,50095,50096,50097,50098,50099,50100,50101,50102,50103,50104,50105,50106,50107,50108,50109,50110,50111,50112,50113,50114,50115,50116,50117,50118,50119,50120,50121,50122,50123,50124,50125,50126,50127,50128,50129,50130,50131,50132,50133,50134,50135,50136,50137,50138,50139,50140,50141,50142,50143,50144,50145,50146,50147,50148,50149,50150,50151,50152,50153,50154,50155,50156,50157,50158,50159,50160,50161,50162,50163,50164,50165,50166,50167,50168,50169,50170,50171,50172,50173,50174,50175,50176,50177,50178,50179,50180,50181,50182,50183,50184,50185,50186,50187,50188,50189,50190,50191,50192,50193,50194,50195,50196,50197,50198,50199,50200,50201,50202,50203,50204,50205,50206,50207,50208,50209,50210,50211,50212,50213,50214,50215,50216,50217,50218,50219,50220,50221,50222,50223,50224,50225,50226,50227,50228,50229,50230,50231,50232,50233,50234,50235,50236,50237,50238,50239,50240,50241,50242,50243,50244,50245,50246,50247,50248,50249,50250,50251,50252,50253,50254,50255,50256,50257,50258,50259,50260,50261,50262,50263,50264,50265,50266,50267,50268,50269,50270,50271,50272,50273,50274,50275,50276,50277,50278,50279,50280,50281,50282,50283,50284,50285,50286,50287,50288,50289,50290,50291,50292,50293,50294,50295,50296,50297,50298,50299,50300,50301,50302,50303,50304,50305,50306,50307,50308,50309,50310,50311,50312,50313,50314,50315,50316,50317,50318,50319,50320,50321,50322,50323,50324,50325,50326,50327,50328,50329,50330,50331,50332,50333,50334,50335,50336,50337,50338,50339,50340,50341,50342,50343,50344,50345,50346,50347,50348,50349,50350,50351,50352,50353,50354,50355,50356,50357,50358,50359,50360,50361,50362,50363,50364,50365,50366,50367,50368,50369,50370,50371,50372,50373,50374,50375,50376,50377,50378,50379,50380,50381,50382,50383,50384,50385,50386,50387,50388,50389,50390,50391,50392,50393,50394,50395,50396,50397,50398,50399,50400,50401,50402,50403,50404,50405,50406,50407,50408,50409,50410,50411,50412,50413,50414,50415,50416,50417,50418,50419,50420,50421,50422,50423,50424,50425,50426,50427,50428,50429,50430,50431,50432,50433,50434,50435,50436,50437,50438,50439,50440,50441,50442,50443,50444,50445,50446,50447,50448,50449,50450,50451,50452,50453,50454,50455,50456,50457,50458,50459,50460,50461,50462,50463,50464,50465,50466,50467,50468,50469,50470,50471,50472,50473,50474,50475,50476,50477,50478,50479,50480,50481,50482,50483,50484,50485,50486,50487,50488,50489,50490,50491,50492,50493,50494,50495,50496,50497,50498,50499,50500,50501,50502,50503,50504,50505,50506,50507,50508,50509,50510,50511,50512,50513,50514,50515,50516,50517,50518,50519,50520,50521,50522,50523,50524,50525,50526,50527,50528,50529,50530,50531,50532,50533,50534,50535,50536,50537,50538,50539,50540,50541,50542,50543,50544,50545,50546,50547,50548,50549,50550,50551,50552,50553,50554,50555,50556,50557,50558,50559,50560,50561,50562,50563,50564,50565,50566,50567,50568,50569,50570,50571,50572,50573,50574,50575,50576,50577,50578,50579,50580,50581,50582,50583,50584,50585,50586,50587,50588,50589,50590,50591,50592,50593,50594,50595,50596,50597,50598,50599,50600,50601,50602,50603,50604,50605,50606,50607,50608,50609,50610,50611,50612,50613,50614,50615,50616,50617,50618,50619,50620,50621,50622,50623,50624,50625,50626,50627,50628,50629,50630,50631,50632,50633,50634,50635,50636,50637,50638,50639,50640,50641,50642,50643,50644,50645,50646,50647,50648,50649,50650,50651,50652,50653,50654,50655,50656,50657,50658,50659,50660,50661,50662,50663,50664,50665,50666,50667,50668,50669,50670,50671,50672,50673,50674,50675,50676,50677,50678,50679,50680,50681,50682,50683,50684,50685,50686,50687,50688,50689,50690,50691,50692,50693,50694,50695,50696,50697,50698,50699,50700,50701,50702,50703,50704,50705,50706,50707,50708,50709,50710,50711,50712,50713,50714,50715,50716,50717,50718,50719,50720,50721,50722,50723,50724,50725,50726,50727,50728,50729,50730,50731,50732,50733,50734,50735,50736,50737,50738,50739,50740,50741,50742,50743,50744,50745,50746,50747,50748,50749,50750,50751,50752,50753,50754,50755,50756,50757,50758,50759,50760,50761,50762,50763,50764,50765,50766,50767,50768,50769,50770,50771,50772,50773,50774,50775,50776,50777,50778,50779,50780,50781,50782,50783,50784,50785,50786,50787,50788,50789,50790,50791,50792,50793,50794,50795,50796,50797,50798,50799,50800,50801,50802,50803,50804,50805,50806,50807,50808,50809,50810,50811,50812,50813,50814,50815,50816,50817,50818,50819,50820,50821,50822,50823,50824,50825,50826,50827,50828,50829,50830,50831,50832,50833,50834,50835,50836,50837,50838,50839,50840,50841,50842,50843,50844,50845,50846,50847,50848,50849,50850,50851,50852,50853,50854,50855,50856,50857,50858,50859,50860,50861,50862,50863,50864,50865,50866,50867,50868,50869,50870,50871,50872,50873,50874,50875,50876,50877,50878,50879,50880,50881,50882,50883,50884,50885,50886,50887,50888,50889,50890,50891,50892,50893,50894,50895,50896,50897,50898,50899,50900,50901,50902,50903,50904,50905,50906,50907,50908,50909,50910,50911,50912,50913,50914,50915,50916,50917,50918,50919,50920,50921,50922,50923,50924,50925,50926,50927,50928,50929,50930,50931,50932,50933,50934,50935,50936,50937,50938,50939,50940,50941,50942,50943,50944,50945,50946,50947,50948,50949,50950,50951,50952,50953,50954,50955,50956,50957,50958,50959,50960,50961,50962,50963,50964,50965,50966,50967,50968,50969,50970,50971,50972,50973,50974,50975,50976,50977,50978,50979,50980,50981,50982,50983,50984,50985,50986,50987,50988,50989,50990,50991,50992,50993,50994,50995,50996,50997,50998,50999,51000,51001,51002,51003,51004,51005,51006,51007,51008,51009,51010,51011,51012,51013,51014,51015,51016,51017,51018,51019,51020,51021,51022,51023,51024,51025,51026,51027,51028,51029,51030,51031,51032,51033,51034,51035,51036,51037,51038,51039,51040,51041,51042,51043,51044,51045,51046,51047,51048,51049,51050,51051,51052,51053,51054,51055,51056,51057,51058,51059,51060,51061,51062,51063,51064,51065,51066,51067,51068,51069,51070,51071,51072,51073,51074,51075,51076,51077,51078,51079,51080,51081,51082,51083,51084,51085,51086,51087,51088,51089,51090,51091,51092,51093,51094,51095,51096,51097,51098,51099,51100,51101,51102,51103,51104,51105,51106,51107,51108,51109,51110,51111,51112,51113,51114,51115,51116,51117,51118,51119,51120,51121,51122,51123,51124,51125,51126,51127,51128,51129,51130,51131,51132,51133,51134,51135,51136,51137,51138,51139,51140,51141,51142,51143,51144,51145,51146,51147,51148,51149,51150,51151,51152,51153,51154,51155,51156,51157,51158,51159,51160,51161,51162,51163,51164,51165,51166,51167,51168,51169,51170,51171,51172,51173,51174,51175,51176,51177,51178,51179,51180,51181,51182,51183,51184,51185,51186,51187,51188,51189,51190,51191,51192,51193,51194,51195,51196,51197,51198,51199,51200,51201,51202,51203,51204,51205,51206,51207,51208,51209,51210,51211,51212,51213,51214,51215,51216,51217,51218,51219,51220,51221,51222,51223,51224,51225,51226,51227,51228,51229,51230,51231,51232,51233,51234,51235,51236,51237,51238,51239,51240,51241,51242,51243,51244,51245,51246,51247,51248,51249,51250,51251,51252,51253,51254,51255,51256,51257,51258,51259,51260,51261,51262,51263,51264,51265,51266,51267,51268,51269,51270,51271,51272,51273,51274,51275,51276,51277,51278,51279,51280,51281,51282,51283,51284,51285,51286,51287,51288,51289,51290,51291,51292,51293,51294,51295,51296,51297,51298,51299,51300,51301,51302,51303,51304,51305,51306,51307,51308,51309,51310,51311,51312,51313,51314,51315,51316,51317,51318,51319,51320,51321,51322,51323,51324,51325,51326,51327,51328,51329,51330,51331,51332,51333,51334,51335,51336,51337,51338,51339,51340,51341,51342,51343,51344,51345,51346,51347,51348,51349,51350,51351,51352,51353,51354,51355,51356,51357,51358,51359,51360,51361,51362,51363,51364,51365,51366,51367,51368,51369,51370,51371,51372,51373,51374,51375,51376,51377,51378,51379,51380,51381,51382,51383,51384,51385,51386,51387,51388,51389,51390,51391,51392,51393,51394,51395,51396,51397,51398,51399,51400,51401,51402,51403,51404,51405,51406,51407,51408,51409,51410,51411,51412,51413,51414,51415,51416,51417,51418,51419,51420,51421,51422,51423,51424,51425,51426,51427,51428,51429,51430,51431,51432,51433,51434,51435,51436,51437,51438,51439,51440,51441,51442,51443,51444,51445,51446,51447,51448,51449,51450,51451,51452,51453,51454,51455,51456,51457,51458,51459,51460,51461,51462,51463,51464,51465,51466,51467,51468,51469,51470,51471,51472,51473,51474,51475,51476,51477,51478,51479,51480,51481,51482,51483,51484,51485,51486,51487,51488,51489,51490,51491,51492,51493,51494,51495,51496,51497,51498,51499,51500,51501,51502,51503,51504,51505,51506,51507,51508,51509,51510,51511,51512,51513,51514,51515,51516,51517,51518,51519,51520,51521,51522,51523,51524,51525,51526,51527,51528,51529,51530,51531,51532,51533,51534,51535,51536,51537,51538,51539,51540,51541,51542,51543,51544,51545,51546,51547,51548,51549,51550,51551,51552,51553,51554,51555,51556,51557,51558,51559,51560,51561,51562,51563,51564,51565,51566,51567,51568,51569,51570,51571,51572,51573,51574,51575,51576,51577,51578,51579,51580,51581,51582,51583,51584,51585,51586,51587,51588,51589,51590,51591,51592,51593,51594,51595,51596,51597,51598,51599,51600,51601,51602,51603,51604,51605,51606,51607,51608,51609,51610,51611,51612,51613,51614,51615,51616,51617,51618,51619,51620,51621,51622,51623,51624,51625,51626,51627,51628,51629,51630,51631,51632,51633,51634,51635,51636,51637,51638,51639,51640,51641,51642,51643,51644,51645,51646,51647,51648,51649,51650,51651,51652,51653,51654,51655,51656,51657,51658,51659,51660,51661,51662,51663,51664,51665,51666,51667,51668,51669,51670,51671,51672,51673,51674,51675,51676,51677,51678,51679,51680,51681,51682,51683,51684,51685,51686,51687,51688,51689,51690,51691,51692,51693,51694,51695,51696,51697,51698,51699,51700,51701,51702,51703,51704,51705,51706,51707,51708,51709,51710,51711,51712,51713,51714,51715,51716,51717,51718,51719,51720,51721,51722,51723,51724,51725,51726,51727,51728,51729,51730,51731,51732,51733,51734,51735,51736,51737,51738,51739,51740,51741,51742,51743,51744,51745,51746,51747,51748,51749,51750,51751,51752,51753,51754,51755,51756,51757,51758,51759,51760,51761,51762,51763,51764,51765,51766,51767,51768,51769,51770,51771,51772,51773,51774,51775,51776,51777,51778,51779,51780,51781,51782,51783,51784,51785,51786,51787,51788,51789,51790,51791,51792,51793,51794,51795,51796,51797,51798,51799,51800,51801,51802,51803,51804,51805,51806,51807,51808,51809,51810,51811,51812,51813,51814,51815,51816,51817,51818,51819,51820,51821,51822,51823,51824,51825,51826,51827,51828,51829,51830,51831,51832,51833,51834,51835,51836,51837,51838,51839,51840,51841,51842,51843,51844,51845,51846,51847,51848,51849,51850,51851,51852,51853,51854,51855,51856,51857,51858,51859,51860,51861,51862,51863,51864,51865,51866,51867,51868,51869,51870,51871,51872,51873,51874,51875,51876,51877,51878,51879,51880,51881,51882,51883,51884,51885,51886,51887,51888,51889,51890,51891,51892,51893,51894,51895,51896,51897,51898,51899,51900,51901,51902,51903,51904,51905,51906,51907,51908,51909,51910,51911,51912,51913,51914,51915,51916,51917,51918,51919,51920,51921,51922,51923,51924,51925,51926,51927,51928,51929,51930,51931,51932,51933,51934,51935,51936,51937,51938,51939,51940,51941,51942,51943,51944,51945,51946,51947,51948,51949,51950,51951,51952,51953,51954,51955,51956,51957,51958,51959,51960,51961,51962,51963,51964,51965,51966,51967,51968,51969,51970,51971,51972,51973,51974,51975,51976,51977,51978,51979,51980,51981,51982,51983,51984,51985,51986,51987,51988,51989,51990,51991,51992,51993,51994,51995,51996,51997,51998,51999,52000,52001,52002,52003,52004,52005,52006,52007,52008,52009,52010,52011,52012,52013,52014,52015,52016,52017,52018,52019,52020,52021,52022,52023,52024,52025,52026,52027,52028,52029,52030,52031,52032,52033,52034,52035,52036,52037,52038,52039,52040,52041,52042,52043,52044,52045,52046,52047,52048,52049,52050,52051,52052,52053,52054,52055,52056,52057,52058,52059,52060,52061,52062,52063,52064,52065,52066,52067,52068,52069,52070,52071,52072,52073,52074,52075,52076,52077,52078,52079,52080,52081,52082,52083,52084,52085,52086,52087,52088,52089,52090,52091,52092,52093,52094,52095,52096,52097,52098,52099,52100,52101,52102,52103,52104,52105,52106,52107,52108,52109,52110,52111,52112,52113,52114,52115,52116,52117,52118,52119,52120,52121,52122,52123,52124,52125,52126,52127,52128,52129,52130,52131,52132,52133,52134,52135,52136,52137,52138,52139,52140,52141,52142,52143,52144,52145,52146,52147,52148,52149,52150,52151,52152,52153,52154,52155,52156,52157,52158,52159,52160,52161,52162,52163,52164,52165,52166,52167,52168,52169,52170,52171,52172,52173,52174,52175,52176,52177,52178,52179,52180,52181,52182,52183,52184,52185,52186,52187,52188,52189,52190,52191,52192,52193,52194,52195,52196,52197,52198,52199,52200,52201,52202,52203,52204,52205,52206,52207,52208,52209,52210,52211,52212,52213,52214,52215,52216,52217,52218,52219,52220,52221,52222,52223,52224,52225,52226,52227,52228,52229,52230,52231,52232,52233,52234,52235,52236,52237,52238,52239,52240,52241,52242,52243,52244,52245,52246,52247,52248,52249,52250,52251,52252,52253,52254,52255,52256,52257,52258,52259,52260,52261,52262,52263,52264,52265,52266,52267,52268,52269,52270,52271,52272,52273,52274,52275,52276,52277,52278,52279,52280,52281,52282,52283,52284,52285,52286,52287,52288,52289,52290,52291,52292,52293,52294,52295,52296,52297,52298,52299,52300,52301,52302,52303,52304,52305,52306,52307,52308,52309,52310,52311,52312,52313,52314,52315,52316,52317,52318,52319,52320,52321,52322,52323,52324,52325,52326,52327,52328,52329,52330,52331,52332,52333,52334,52335,52336,52337,52338,52339,52340,52341,52342,52343,52344,52345,52346,52347,52348,52349,52350,52351,52352,52353,52354,52355,52356,52357,52358,52359,52360,52361,52362,52363,52364,52365,52366,52367,52368,52369,52370,52371,52372,52373,52374,52375,52376,52377,52378,52379,52380,52381,52382,52383,52384,52385,52386,52387,52388,52389,52390,52391,52392,52393,52394,52395,52396,52397,52398,52399,52400,52401,52402,52403,52404,52405,52406,52407,52408,52409,52410,52411,52412,52413,52414,52415,52416,52417,52418,52419,52420,52421,52422,52423,52424,52425,52426,52427,52428,52429,52430,52431,52432,52433,52434,52435,52436,52437,52438,52439,52440,52441,52442,52443,52444,52445,52446,52447,52448,52449,52450,52451,52452,52453,52454,52455,52456,52457,52458,52459,52460,52461,52462,52463,52464,52465,52466,52467,52468,52469,52470,52471,52472,52473,52474,52475,52476,52477,52478,52479,52480,52481,52482,52483,52484,52485,52486,52487,52488,52489,52490,52491,52492,52493,52494,52495,52496,52497,52498,52499,52500,52501,52502,52503,52504,52505,52506,52507,52508,52509,52510,52511,52512,52513,52514,52515,52516,52517,52518,52519,52520,52521,52522,52523,52524,52525,52526,52527,52528,52529,52530,52531,52532,52533,52534,52535,52536,52537,52538,52539,52540,52541,52542,52543,52544,52545,52546,52547,52548,52549,52550,52551,52552,52553,52554,52555,52556,52557,52558,52559,52560,52561,52562,52563,52564,52565,52566,52567,52568,52569,52570,52571,52572,52573,52574,52575,52576,52577,52578,52579,52580,52581,52582,52583,52584,52585,52586,52587,52588,52589,52590,52591,52592,52593,52594,52595,52596,52597,52598,52599,52600,52601,52602,52603,52604,52605,52606,52607,52608,52609,52610,52611,52612,52613,52614,52615,52616,52617,52618,52619,52620,52621,52622,52623,52624,52625,52626,52627,52628,52629,52630,52631,52632,52633,52634,52635,52636,52637,52638,52639,52640,52641,52642,52643,52644,52645,52646,52647,52648,52649,52650,52651,52652,52653,52654,52655,52656,52657,52658,52659,52660,52661,52662,52663,52664,52665,52666,52667,52668,52669,52670,52671,52672,52673,52674,52675,52676,52677,52678,52679,52680,52681,52682,52683,52684,52685,52686,52687,52688,52689,52690,52691,52692,52693,52694,52695,52696,52697,52698,52699,52700,52701,52702,52703,52704,52705,52706,52707,52708,52709,52710,52711,52712,52713,52714,52715,52716,52717,52718,52719,52720,52721,52722,52723,52724,52725,52726,52727,52728,52729,52730,52731,52732,52733,52734,52735,52736,52737,52738,52739,52740,52741,52742,52743,52744,52745,52746,52747,52748,52749,52750,52751,52752,52753,52754,52755,52756,52757,52758,52759,52760,52761,52762,52763,52764,52765,52766,52767,52768,52769,52770,52771,52772,52773,52774,52775,52776,52777,52778,52779,52780,52781,52782,52783,52784,52785,52786,52787,52788,52789,52790,52791,52792,52793,52794,52795,52796,52797,52798,52799,52800,52801,52802,52803,52804,52805,52806,52807,52808,52809,52810,52811,52812,52813,52814,52815,52816,52817,52818,52819,52820,52821,52822,52823,52824,52825,52826,52827,52828,52829,52830,52831,52832,52833,52834,52835,52836,52837,52838,52839,52840,52841,52842,52843,52844,52845,52846,52847,52848,52849,52850,52851,52852,52853,52854,52855,52856,52857,52858,52859,52860,52861,52862,52863,52864,52865,52866,52867,52868,52869,52870,52871,52872,52873,52874,52875,52876,52877,52878,52879,52880,52881,52882,52883,52884,52885,52886,52887,52888,52889,52890,52891,52892,52893,52894,52895,52896,52897,52898,52899,52900,52901,52902,52903,52904,52905,52906,52907,52908,52909,52910,52911,52912,52913,52914,52915,52916,52917,52918,52919,52920,52921,52922,52923,52924,52925,52926,52927,52928,52929,52930,52931,52932,52933,52934,52935,52936,52937,52938,52939,52940,52941,52942,52943,52944,52945,52946,52947,52948,52949,52950,52951,52952,52953,52954,52955,52956,52957,52958,52959,52960,52961,52962,52963,52964,52965,52966,52967,52968,52969,52970,52971,52972,52973,52974,52975,52976,52977,52978,52979,52980,52981,52982,52983,52984,52985,52986,52987,52988,52989,52990,52991,52992,52993,52994,52995,52996,52997,52998,52999,53000,53001,53002,53003,53004,53005,53006,53007,53008,53009,53010,53011,53012,53013,53014,53015,53016,53017,53018,53019,53020,53021,53022,53023,53024,53025,53026,53027,53028,53029,53030,53031,53032,53033,53034,53035,53036,53037,53038,53039,53040,53041,53042,53043,53044,53045,53046,53047,53048,53049,53050,53051,53052,53053,53054,53055,53056,53057,53058,53059,53060,53061,53062,53063,53064,53065,53066,53067,53068,53069,53070,53071,53072,53073,53074,53075,53076,53077,53078,53079,53080,53081,53082,53083,53084,53085,53086,53087,53088,53089,53090,53091,53092,53093,53094,53095,53096,53097,53098,53099,53100,53101,53102,53103,53104,53105,53106,53107,53108,53109,53110,53111,53112,53113,53114,53115,53116,53117,53118,53119,53120,53121,53122,53123,53124,53125,53126,53127,53128,53129,53130,53131,53132,53133,53134,53135,53136,53137,53138,53139,53140,53141,53142,53143,53144,53145,53146,53147,53148,53149,53150,53151,53152,53153,53154,53155,53156,53157,53158,53159,53160,53161,53162,53163,53164,53165,53166,53167,53168,53169,53170,53171,53172,53173,53174,53175,53176,53177,53178,53179,53180,53181,53182,53183,53184,53185,53186,53187,53188,53189,53190,53191,53192,53193,53194,53195,53196,53197,53198,53199,53200,53201,53202,53203,53204,53205,53206,53207,53208,53209,53210,53211,53212,53213,53214,53215,53216,53217,53218,53219,53220,53221,53222,53223,53224,53225,53226,53227,53228,53229,53230,53231,53232,53233,53234,53235,53236,53237,53238,53239,53240,53241,53242,53243,53244,53245,53246,53247,53248,53249,53250,53251,53252,53253,53254,53255,53256,53257,53258,53259,53260,53261,53262,53263,53264,53265,53266,53267,53268,53269,53270,53271,53272,53273,53274,53275,53276,53277,53278,53279,53280,53281,53282,53283,53284,53285,53286,53287,53288,53289,53290,53291,53292,53293,53294,53295,53296,53297,53298,53299,53300,53301,53302,53303,53304,53305,53306,53307,53308,53309,53310,53311,53312,53313,53314,53315,53316,53317,53318,53319,53320,53321,53322,53323,53324,53325,53326,53327,53328,53329,53330,53331,53332,53333,53334,53335,53336,53337,53338,53339,53340,53341,53342,53343,53344,53345,53346,53347,53348,53349,53350,53351,53352,53353,53354,53355,53356,53357,53358,53359,53360,53361,53362,53363,53364,53365,53366,53367,53368,53369,53370,53371,53372,53373,53374,53375,53376,53377,53378,53379,53380,53381,53382,53383,53384,53385,53386,53387,53388,53389,53390,53391,53392,53393,53394,53395,53396,53397,53398,53399,53400,53401,53402,53403,53404,53405,53406,53407,53408,53409,53410,53411,53412,53413,53414,53415,53416,53417,53418,53419,53420,53421,53422,53423,53424,53425,53426,53427,53428,53429,53430,53431,53432,53433,53434,53435,53436,53437,53438,53439,53440,53441,53442,53443,53444,53445,53446,53447,53448,53449,53450,53451,53452,53453,53454,53455,53456,53457,53458,53459,53460,53461,53462,53463,53464,53465,53466,53467,53468,53469,53470,53471,53472,53473,53474,53475,53476,53477,53478,53479,53480,53481,53482,53483,53484,53485,53486,53487,53488,53489,53490,53491,53492,53493,53494,53495,53496,53497,53498,53499,53500,53501,53502,53503,53504,53505,53506,53507,53508,53509,53510,53511,53512,53513,53514,53515,53516,53517,53518,53519,53520,53521,53522,53523,53524,53525,53526,53527,53528,53529,53530,53531,53532,53533,53534,53535,53536,53537,53538,53539,53540,53541,53542,53543,53544,53545,53546,53547,53548,53549,53550,53551,53552,53553,53554,53555,53556,53557,53558,53559,53560,53561,53562,53563,53564,53565,53566,53567,53568,53569,53570,53571,53572,53573,53574,53575,53576,53577,53578,53579,53580,53581,53582,53583,53584,53585,53586,53587,53588,53589,53590,53591,53592,53593,53594,53595,53596,53597,53598,53599,53600,53601,53602,53603,53604,53605,53606,53607,53608,53609,53610,53611,53612,53613,53614,53615,53616,53617,53618,53619,53620,53621,53622,53623,53624,53625,53626,53627,53628,53629,53630,53631,53632,53633,53634,53635,53636,53637,53638,53639,53640,53641,53642,53643,53644,53645,53646,53647,53648,53649,53650,53651,53652,53653,53654,53655,53656,53657,53658,53659,53660,53661,53662,53663,53664,53665,53666,53667,53668,53669,53670,53671,53672,53673,53674,53675,53676,53677,53678,53679,53680,53681,53682,53683,53684,53685,53686,53687,53688,53689,53690,53691,53692,53693,53694,53695,53696,53697,53698,53699,53700,53701,53702,53703,53704,53705,53706,53707,53708,53709,53710,53711,53712,53713,53714,53715,53716,53717,53718,53719,53720,53721,53722,53723,53724,53725,53726,53727,53728,53729,53730,53731,53732,53733,53734,53735,53736,53737,53738,53739,53740,53741,53742,53743,53744,53745,53746,53747,53748,53749,53750,53751,53752,53753,53754,53755,53756,53757,53758,53759,53760,53761,53762,53763,53764,53765,53766,53767,53768,53769,53770,53771,53772,53773,53774,53775,53776,53777,53778,53779,53780,53781,53782,53783,53784,53785,53786,53787,53788,53789,53790,53791,53792,53793,53794,53795,53796,53797,53798,53799,53800,53801,53802,53803,53804,53805,53806,53807,53808,53809,53810,53811,53812,53813,53814,53815,53816,53817,53818,53819,53820,53821,53822,53823,53824,53825,53826,53827,53828,53829,53830,53831,53832,53833,53834,53835,53836,53837,53838,53839,53840,53841,53842,53843,53844,53845,53846,53847,53848,53849,53850,53851,53852,53853,53854,53855,53856,53857,53858,53859,53860,53861,53862,53863,53864,53865,53866,53867,53868,53869,53870,53871,53872,53873,53874,53875,53876,53877,53878,53879,53880,53881,53882,53883,53884,53885,53886,53887,53888,53889,53890,53891,53892,53893,53894,53895,53896,53897,53898,53899,53900,53901,53902,53903,53904,53905,53906,53907,53908,53909,53910,53911,53912,53913,53914,53915,53916,53917,53918,53919,53920,53921,53922,53923,53924,53925,53926,53927,53928,53929,53930,53931,53932,53933,53934,53935,53936,53937,53938,53939,53940,53941,53942,53943,53944,53945,53946,53947,53948,53949,53950,53951,53952,53953,53954,53955,53956,53957,53958,53959,53960,53961,53962,53963,53964,53965,53966,53967,53968,53969,53970,53971,53972,53973,53974,53975,53976,53977,53978,53979,53980,53981,53982,53983,53984,53985,53986,53987,53988,53989,53990,53991,53992,53993,53994,53995,53996,53997,53998,53999,54000,54001,54002,54003,54004,54005,54006,54007,54008,54009,54010,54011,54012,54013,54014,54015,54016,54017,54018,54019,54020,54021,54022,54023,54024,54025,54026,54027,54028,54029,54030,54031,54032,54033,54034,54035,54036,54037,54038,54039,54040,54041,54042,54043,54044,54045,54046,54047,54048,54049,54050,54051,54052,54053,54054,54055,54056,54057,54058,54059,54060,54061,54062,54063,54064,54065,54066,54067,54068,54069,54070,54071,54072,54073,54074,54075,54076,54077,54078,54079,54080,54081,54082,54083,54084,54085,54086,54087,54088,54089,54090,54091,54092,54093,54094,54095,54096,54097,54098,54099,54100,54101,54102,54103,54104,54105,54106,54107,54108,54109,54110,54111,54112,54113,54114,54115,54116,54117,54118,54119,54120,54121,54122,54123,54124,54125,54126,54127,54128,54129,54130,54131,54132,54133,54134,54135,54136,54137,54138,54139,54140,54141,54142,54143,54144,54145,54146,54147,54148,54149,54150,54151,54152,54153,54154,54155,54156,54157,54158,54159,54160,54161,54162,54163,54164,54165,54166,54167,54168,54169,54170,54171,54172,54173,54174,54175,54176,54177,54178,54179,54180,54181,54182,54183,54184,54185,54186,54187,54188,54189,54190,54191,54192,54193,54194,54195,54196,54197,54198,54199,54200,54201,54202,54203,54204,54205,54206,54207,54208,54209,54210,54211,54212,54213,54214,54215,54216,54217,54218,54219,54220,54221,54222,54223,54224,54225,54226,54227,54228,54229,54230,54231,54232,54233,54234,54235,54236,54237,54238,54239,54240,54241,54242,54243,54244,54245,54246,54247,54248,54249,54250,54251,54252,54253,54254,54255,54256,54257,54258,54259,54260,54261,54262,54263,54264,54265,54266,54267,54268,54269,54270,54271,54272,54273,54274,54275,54276,54277,54278,54279,54280,54281,54282,54283,54284,54285,54286,54287,54288,54289,54290,54291,54292,54293,54294,54295,54296,54297,54298,54299,54300,54301,54302,54303,54304,54305,54306,54307,54308,54309,54310,54311,54312,54313,54314,54315,54316,54317,54318,54319,54320,54321,54322,54323,54324,54325,54326,54327,54328,54329,54330,54331,54332,54333,54334,54335,54336,54337,54338,54339,54340,54341,54342,54343,54344,54345,54346,54347,54348,54349,54350,54351,54352,54353,54354,54355,54356,54357,54358,54359,54360,54361,54362,54363,54364,54365,54366,54367,54368,54369,54370,54371,54372,54373,54374,54375,54376,54377,54378,54379,54380,54381,54382,54383,54384,54385,54386,54387,54388,54389,54390,54391,54392,54393,54394,54395,54396,54397,54398,54399,54400,54401,54402,54403,54404,54405,54406,54407,54408,54409,54410,54411,54412,54413,54414,54415,54416,54417,54418,54419,54420,54421,54422,54423,54424,54425,54426,54427,54428,54429,54430,54431,54432,54433,54434,54435,54436,54437,54438,54439,54440,54441,54442,54443,54444,54445,54446,54447,54448,54449,54450,54451,54452,54453,54454,54455,54456,54457,54458,54459,54460,54461,54462,54463,54464,54465,54466,54467,54468,54469,54470,54471,54472,54473,54474,54475,54476,54477,54478,54479,54480,54481,54482,54483,54484,54485,54486,54487,54488,54489,54490,54491,54492,54493,54494,54495,54496,54497,54498,54499,54500,54501,54502,54503,54504,54505,54506,54507,54508,54509,54510,54511,54512,54513,54514,54515,54516,54517,54518,54519,54520,54521,54522,54523,54524,54525,54526,54527,54528,54529,54530,54531,54532,54533,54534,54535,54536,54537,54538,54539,54540,54541,54542,54543,54544,54545,54546,54547,54548,54549,54550,54551,54552,54553,54554,54555,54556,54557,54558,54559,54560,54561,54562,54563,54564,54565,54566,54567,54568,54569,54570,54571,54572,54573,54574,54575,54576,54577,54578,54579,54580,54581,54582,54583,54584,54585,54586,54587,54588,54589,54590,54591,54592,54593,54594,54595,54596,54597,54598,54599,54600,54601,54602,54603,54604,54605,54606,54607,54608,54609,54610,54611,54612,54613,54614,54615,54616,54617,54618,54619,54620,54621,54622,54623,54624,54625,54626,54627,54628,54629,54630,54631,54632,54633,54634,54635,54636,54637,54638,54639,54640,54641,54642,54643,54644,54645,54646,54647,54648,54649,54650,54651,54652,54653,54654,54655,54656,54657,54658,54659,54660,54661,54662,54663,54664,54665,54666,54667,54668,54669,54670,54671,54672,54673,54674,54675,54676,54677,54678,54679,54680,54681,54682,54683,54684,54685,54686,54687,54688,54689,54690,54691,54692,54693,54694,54695,54696,54697,54698,54699,54700,54701,54702,54703,54704,54705,54706,54707,54708,54709,54710,54711,54712,54713,54714,54715,54716,54717,54718,54719,54720,54721,54722,54723,54724,54725,54726,54727,54728,54729,54730,54731,54732,54733,54734,54735,54736,54737,54738,54739,54740,54741,54742,54743,54744,54745,54746,54747,54748,54749,54750,54751,54752,54753,54754,54755,54756,54757,54758,54759,54760,54761,54762,54763,54764,54765,54766,54767,54768,54769,54770,54771,54772,54773,54774,54775,54776,54777,54778,54779,54780,54781,54782,54783,54784,54785,54786,54787,54788,54789,54790,54791,54792,54793,54794,54795,54796,54797,54798,54799,54800,54801,54802,54803,54804,54805,54806,54807,54808,54809,54810,54811,54812,54813,54814,54815,54816,54817,54818,54819,54820,54821,54822,54823,54824,54825,54826,54827,54828,54829,54830,54831,54832,54833,54834,54835,54836,54837,54838,54839,54840,54841,54842,54843,54844,54845,54846,54847,54848,54849,54850,54851,54852,54853,54854,54855,54856,54857,54858,54859,54860,54861,54862,54863,54864,54865,54866,54867,54868,54869,54870,54871,54872,54873,54874,54875,54876,54877,54878,54879,54880,54881,54882,54883,54884,54885,54886,54887,54888,54889,54890,54891,54892,54893,54894,54895,54896,54897,54898,54899,54900,54901,54902,54903,54904,54905,54906,54907,54908,54909,54910,54911,54912,54913,54914,54915,54916,54917,54918,54919,54920,54921,54922,54923,54924,54925,54926,54927,54928,54929,54930,54931,54932,54933,54934,54935,54936,54937,54938,54939,54940,54941,54942,54943,54944,54945,54946,54947,54948,54949,54950,54951,54952,54953,54954,54955,54956,54957,54958,54959,54960,54961,54962,54963,54964,54965,54966,54967,54968,54969,54970,54971,54972,54973,54974,54975,54976,54977,54978,54979,54980,54981,54982,54983,54984,54985,54986,54987,54988,54989,54990,54991,54992,54993,54994,54995,54996,54997,54998,54999,55000,55001,55002,55003,55004,55005,55006,55007,55008,55009,55010,55011,55012,55013,55014,55015,55016,55017,55018,55019,55020,55021,55022,55023,55024,55025,55026,55027,55028,55029,55030,55031,55032,55033,55034,55035,55036,55037,55038,55039,55040,55041,55042,55043,55044,55045,55046,55047,55048,55049,55050,55051,55052,55053,55054,55055,55056,55057,55058,55059,55060,55061,55062,55063,55064,55065,55066,55067,55068,55069,55070,55071,55072,55073,55074,55075,55076,55077,55078,55079,55080,55081,55082,55083,55084,55085,55086,55087,55088,55089,55090,55091,55092,55093,55094,55095,55096,55097,55098,55099,55100,55101,55102,55103,55104,55105,55106,55107,55108,55109,55110,55111,55112,55113,55114,55115,55116,55117,55118,55119,55120,55121,55122,55123,55124,55125,55126,55127,55128,55129,55130,55131,55132,55133,55134,55135,55136,55137,55138,55139,55140,55141,55142,55143,55144,55145,55146,55147,55148,55149,55150,55151,55152,55153,55154,55155,55156,55157,55158,55159,55160,55161,55162,55163,55164,55165,55166,55167,55168,55169,55170,55171,55172,55173,55174,55175,55176,55177,55178,55179,55180,55181,55182,55183,55184,55185,55186,55187,55188,55189,55190,55191,55192,55193,55194,55195,55196,55197,55198,55199,55200,55201,55202,55203,55216,55217,55218,55219,55220,55221,55222,55223,55224,55225,55226,55227,55228,55229,55230,55231,55232,55233,55234,55235,55236,55237,55238,55243,55244,55245,55246,55247,55248,55249,55250,55251,55252,55253,55254,55255,55256,55257,55258,55259,55260,55261,55262,55263,55264,55265,55266,55267,55268,55269,55270,55271,55272,55273,55274,55275,55276,55277,55278,55279,55280,55281,55282,55283,55284,55285,55286,55287,55288,55289,55290,55291,63744,63745,63746,63747,63748,63749,63750,63751,63752,63753,63754,63755,63756,63757,63758,63759,63760,63761,63762,63763,63764,63765,63766,63767,63768,63769,63770,63771,63772,63773,63774,63775,63776,63777,63778,63779,63780,63781,63782,63783,63784,63785,63786,63787,63788,63789,63790,63791,63792,63793,63794,63795,63796,63797,63798,63799,63800,63801,63802,63803,63804,63805,63806,63807,63808,63809,63810,63811,63812,63813,63814,63815,63816,63817,63818,63819,63820,63821,63822,63823,63824,63825,63826,63827,63828,63829,63830,63831,63832,63833,63834,63835,63836,63837,63838,63839,63840,63841,63842,63843,63844,63845,63846,63847,63848,63849,63850,63851,63852,63853,63854,63855,63856,63857,63858,63859,63860,63861,63862,63863,63864,63865,63866,63867,63868,63869,63870,63871,63872,63873,63874,63875,63876,63877,63878,63879,63880,63881,63882,63883,63884,63885,63886,63887,63888,63889,63890,63891,63892,63893,63894,63895,63896,63897,63898,63899,63900,63901,63902,63903,63904,63905,63906,63907,63908,63909,63910,63911,63912,63913,63914,63915,63916,63917,63918,63919,63920,63921,63922,63923,63924,63925,63926,63927,63928,63929,63930,63931,63932,63933,63934,63935,63936,63937,63938,63939,63940,63941,63942,63943,63944,63945,63946,63947,63948,63949,63950,63951,63952,63953,63954,63955,63956,63957,63958,63959,63960,63961,63962,63963,63964,63965,63966,63967,63968,63969,63970,63971,63972,63973,63974,63975,63976,63977,63978,63979,63980,63981,63982,63983,63984,63985,63986,63987,63988,63989,63990,63991,63992,63993,63994,63995,63996,63997,63998,63999,64000,64001,64002,64003,64004,64005,64006,64007,64008,64009,64010,64011,64012,64013,64014,64015,64016,64017,64018,64019,64020,64021,64022,64023,64024,64025,64026,64027,64028,64029,64030,64031,64032,64033,64034,64035,64036,64037,64038,64039,64040,64041,64042,64043,64044,64045,64046,64047,64048,64049,64050,64051,64052,64053,64054,64055,64056,64057,64058,64059,64060,64061,64062,64063,64064,64065,64066,64067,64068,64069,64070,64071,64072,64073,64074,64075,64076,64077,64078,64079,64080,64081,64082,64083,64084,64085,64086,64087,64088,64089,64090,64091,64092,64093,64094,64095,64096,64097,64098,64099,64100,64101,64102,64103,64104,64105,64106,64107,64108,64109,64112,64113,64114,64115,64116,64117,64118,64119,64120,64121,64122,64123,64124,64125,64126,64127,64128,64129,64130,64131,64132,64133,64134,64135,64136,64137,64138,64139,64140,64141,64142,64143,64144,64145,64146,64147,64148,64149,64150,64151,64152,64153,64154,64155,64156,64157,64158,64159,64160,64161,64162,64163,64164,64165,64166,64167,64168,64169,64170,64171,64172,64173,64174,64175,64176,64177,64178,64179,64180,64181,64182,64183,64184,64185,64186,64187,64188,64189,64190,64191,64192,64193,64194,64195,64196,64197,64198,64199,64200,64201,64202,64203,64204,64205,64206,64207,64208,64209,64210,64211,64212,64213,64214,64215,64216,64217,64256,64257,64258,64259,64260,64261,64262,64275,64276,64277,64278,64279,64285,64287,64288,64289,64290,64291,64292,64293,64294,64295,64296,64298,64299,64300,64301,64302,64303,64304,64305,64306,64307,64308,64309,64310,64312,64313,64314,64315,64316,64318,64320,64321,64323,64324,64326,64327,64328,64329,64330,64331,64332,64333,64334,64335,64336,64337,64338,64339,64340,64341,64342,64343,64344,64345,64346,64347,64348,64349,64350,64351,64352,64353,64354,64355,64356,64357,64358,64359,64360,64361,64362,64363,64364,64365,64366,64367,64368,64369,64370,64371,64372,64373,64374,64375,64376,64377,64378,64379,64380,64381,64382,64383,64384,64385,64386,64387,64388,64389,64390,64391,64392,64393,64394,64395,64396,64397,64398,64399,64400,64401,64402,64403,64404,64405,64406,64407,64408,64409,64410,64411,64412,64413,64414,64415,64416,64417,64418,64419,64420,64421,64422,64423,64424,64425,64426,64427,64428,64429,64430,64431,64432,64433,64467,64468,64469,64470,64471,64472,64473,64474,64475,64476,64477,64478,64479,64480,64481,64482,64483,64484,64485,64486,64487,64488,64489,64490,64491,64492,64493,64494,64495,64496,64497,64498,64499,64500,64501,64502,64503,64504,64505,64506,64507,64508,64509,64510,64511,64512,64513,64514,64515,64516,64517,64518,64519,64520,64521,64522,64523,64524,64525,64526,64527,64528,64529,64530,64531,64532,64533,64534,64535,64536,64537,64538,64539,64540,64541,64542,64543,64544,64545,64546,64547,64548,64549,64550,64551,64552,64553,64554,64555,64556,64557,64558,64559,64560,64561,64562,64563,64564,64565,64566,64567,64568,64569,64570,64571,64572,64573,64574,64575,64576,64577,64578,64579,64580,64581,64582,64583,64584,64585,64586,64587,64588,64589,64590,64591,64592,64593,64594,64595,64596,64597,64598,64599,64600,64601,64602,64603,64604,64605,64606,64607,64608,64609,64610,64611,64612,64613,64614,64615,64616,64617,64618,64619,64620,64621,64622,64623,64624,64625,64626,64627,64628,64629,64630,64631,64632,64633,64634,64635,64636,64637,64638,64639,64640,64641,64642,64643,64644,64645,64646,64647,64648,64649,64650,64651,64652,64653,64654,64655,64656,64657,64658,64659,64660,64661,64662,64663,64664,64665,64666,64667,64668,64669,64670,64671,64672,64673,64674,64675,64676,64677,64678,64679,64680,64681,64682,64683,64684,64685,64686,64687,64688,64689,64690,64691,64692,64693,64694,64695,64696,64697,64698,64699,64700,64701,64702,64703,64704,64705,64706,64707,64708,64709,64710,64711,64712,64713,64714,64715,64716,64717,64718,64719,64720,64721,64722,64723,64724,64725,64726,64727,64728,64729,64730,64731,64732,64733,64734,64735,64736,64737,64738,64739,64740,64741,64742,64743,64744,64745,64746,64747,64748,64749,64750,64751,64752,64753,64754,64755,64756,64757,64758,64759,64760,64761,64762,64763,64764,64765,64766,64767,64768,64769,64770,64771,64772,64773,64774,64775,64776,64777,64778,64779,64780,64781,64782,64783,64784,64785,64786,64787,64788,64789,64790,64791,64792,64793,64794,64795,64796,64797,64798,64799,64800,64801,64802,64803,64804,64805,64806,64807,64808,64809,64810,64811,64812,64813,64814,64815,64816,64817,64818,64819,64820,64821,64822,64823,64824,64825,64826,64827,64828,64829,64848,64849,64850,64851,64852,64853,64854,64855,64856,64857,64858,64859,64860,64861,64862,64863,64864,64865,64866,64867,64868,64869,64870,64871,64872,64873,64874,64875,64876,64877,64878,64879,64880,64881,64882,64883,64884,64885,64886,64887,64888,64889,64890,64891,64892,64893,64894,64895,64896,64897,64898,64899,64900,64901,64902,64903,64904,64905,64906,64907,64908,64909,64910,64911,64914,64915,64916,64917,64918,64919,64920,64921,64922,64923,64924,64925,64926,64927,64928,64929,64930,64931,64932,64933,64934,64935,64936,64937,64938,64939,64940,64941,64942,64943,64944,64945,64946,64947,64948,64949,64950,64951,64952,64953,64954,64955,64956,64957,64958,64959,64960,64961,64962,64963,64964,64965,64966,64967,65008,65009,65010,65011,65012,65013,65014,65015,65016,65017,65018,65019,65136,65137,65138,65139,65140,65142,65143,65144,65145,65146,65147,65148,65149,65150,65151,65152,65153,65154,65155,65156,65157,65158,65159,65160,65161,65162,65163,65164,65165,65166,65167,65168,65169,65170,65171,65172,65173,65174,65175,65176,65177,65178,65179,65180,65181,65182,65183,65184,65185,65186,65187,65188,65189,65190,65191,65192,65193,65194,65195,65196,65197,65198,65199,65200,65201,65202,65203,65204,65205,65206,65207,65208,65209,65210,65211,65212,65213,65214,65215,65216,65217,65218,65219,65220,65221,65222,65223,65224,65225,65226,65227,65228,65229,65230,65231,65232,65233,65234,65235,65236,65237,65238,65239,65240,65241,65242,65243,65244,65245,65246,65247,65248,65249,65250,65251,65252,65253,65254,65255,65256,65257,65258,65259,65260,65261,65262,65263,65264,65265,65266,65267,65268,65269,65270,65271,65272,65273,65274,65275,65276,65313,65314,65315,65316,65317,65318,65319,65320,65321,65322,65323,65324,65325,65326,65327,65328,65329,65330,65331,65332,65333,65334,65335,65336,65337,65338,65345,65346,65347,65348,65349,65350,65351,65352,65353,65354,65355,65356,65357,65358,65359,65360,65361,65362,65363,65364,65365,65366,65367,65368,65369,65370,65382,65383,65384,65385,65386,65387,65388,65389,65390,65391,65392,65393,65394,65395,65396,65397,65398,65399,65400,65401,65402,65403,65404,65405,65406,65407,65408,65409,65410,65411,65412,65413,65414,65415,65416,65417,65418,65419,65420,65421,65422,65423,65424,65425,65426,65427,65428,65429,65430,65431,65432,65433,65434,65435,65436,65437,65438,65439,65440,65441,65442,65443,65444,65445,65446,65447,65448,65449,65450,65451,65452,65453,65454,65455,65456,65457,65458,65459,65460,65461,65462,65463,65464,65465,65466,65467,65468,65469,65470,65474,65475,65476,65477,65478,65479,65482,65483,65484,65485,65486,65487,65490,65491,65492,65493,65494,65495,65498,65499,65500';
      exports_1("nonAsciiIdentifierStartTable", nonAsciiIdentifierStartTable = str.split(',').map(function(code) {
        return parseInt(code, 10);
      }));
    }
  };
});

System.register("src/mode/javascript/non-ascii-identifier-part-only.js", [], function(exports_1) {
  var str,
      nonAsciiIdentifierPartTable;
  return {
    setters: [],
    execute: function() {
      str = '768,769,770,771,772,773,774,775,776,777,778,779,780,781,782,783,784,785,786,787,788,789,790,791,792,793,794,795,796,797,798,799,800,801,802,803,804,805,806,807,808,809,810,811,812,813,814,815,816,817,818,819,820,821,822,823,824,825,826,827,828,829,830,831,832,833,834,835,836,837,838,839,840,841,842,843,844,845,846,847,848,849,850,851,852,853,854,855,856,857,858,859,860,861,862,863,864,865,866,867,868,869,870,871,872,873,874,875,876,877,878,879,1155,1156,1157,1158,1159,1425,1426,1427,1428,1429,1430,1431,1432,1433,1434,1435,1436,1437,1438,1439,1440,1441,1442,1443,1444,1445,1446,1447,1448,1449,1450,1451,1452,1453,1454,1455,1456,1457,1458,1459,1460,1461,1462,1463,1464,1465,1466,1467,1468,1469,1471,1473,1474,1476,1477,1479,1552,1553,1554,1555,1556,1557,1558,1559,1560,1561,1562,1611,1612,1613,1614,1615,1616,1617,1618,1619,1620,1621,1622,1623,1624,1625,1626,1627,1628,1629,1630,1631,1632,1633,1634,1635,1636,1637,1638,1639,1640,1641,1648,1750,1751,1752,1753,1754,1755,1756,1759,1760,1761,1762,1763,1764,1767,1768,1770,1771,1772,1773,1776,1777,1778,1779,1780,1781,1782,1783,1784,1785,1809,1840,1841,1842,1843,1844,1845,1846,1847,1848,1849,1850,1851,1852,1853,1854,1855,1856,1857,1858,1859,1860,1861,1862,1863,1864,1865,1866,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,2027,2028,2029,2030,2031,2032,2033,2034,2035,2070,2071,2072,2073,2075,2076,2077,2078,2079,2080,2081,2082,2083,2085,2086,2087,2089,2090,2091,2092,2093,2137,2138,2139,2276,2277,2278,2279,2280,2281,2282,2283,2284,2285,2286,2287,2288,2289,2290,2291,2292,2293,2294,2295,2296,2297,2298,2299,2300,2301,2302,2304,2305,2306,2307,2362,2363,2364,2366,2367,2368,2369,2370,2371,2372,2373,2374,2375,2376,2377,2378,2379,2380,2381,2382,2383,2385,2386,2387,2388,2389,2390,2391,2402,2403,2406,2407,2408,2409,2410,2411,2412,2413,2414,2415,2433,2434,2435,2492,2494,2495,2496,2497,2498,2499,2500,2503,2504,2507,2508,2509,2519,2530,2531,2534,2535,2536,2537,2538,2539,2540,2541,2542,2543,2561,2562,2563,2620,2622,2623,2624,2625,2626,2631,2632,2635,2636,2637,2641,2662,2663,2664,2665,2666,2667,2668,2669,2670,2671,2672,2673,2677,2689,2690,2691,2748,2750,2751,2752,2753,2754,2755,2756,2757,2759,2760,2761,2763,2764,2765,2786,2787,2790,2791,2792,2793,2794,2795,2796,2797,2798,2799,2817,2818,2819,2876,2878,2879,2880,2881,2882,2883,2884,2887,2888,2891,2892,2893,2902,2903,2914,2915,2918,2919,2920,2921,2922,2923,2924,2925,2926,2927,2946,3006,3007,3008,3009,3010,3014,3015,3016,3018,3019,3020,3021,3031,3046,3047,3048,3049,3050,3051,3052,3053,3054,3055,3073,3074,3075,3134,3135,3136,3137,3138,3139,3140,3142,3143,3144,3146,3147,3148,3149,3157,3158,3170,3171,3174,3175,3176,3177,3178,3179,3180,3181,3182,3183,3202,3203,3260,3262,3263,3264,3265,3266,3267,3268,3270,3271,3272,3274,3275,3276,3277,3285,3286,3298,3299,3302,3303,3304,3305,3306,3307,3308,3309,3310,3311,3330,3331,3390,3391,3392,3393,3394,3395,3396,3398,3399,3400,3402,3403,3404,3405,3415,3426,3427,3430,3431,3432,3433,3434,3435,3436,3437,3438,3439,3458,3459,3530,3535,3536,3537,3538,3539,3540,3542,3544,3545,3546,3547,3548,3549,3550,3551,3570,3571,3633,3636,3637,3638,3639,3640,3641,3642,3655,3656,3657,3658,3659,3660,3661,3662,3664,3665,3666,3667,3668,3669,3670,3671,3672,3673,3761,3764,3765,3766,3767,3768,3769,3771,3772,3784,3785,3786,3787,3788,3789,3792,3793,3794,3795,3796,3797,3798,3799,3800,3801,3864,3865,3872,3873,3874,3875,3876,3877,3878,3879,3880,3881,3893,3895,3897,3902,3903,3953,3954,3955,3956,3957,3958,3959,3960,3961,3962,3963,3964,3965,3966,3967,3968,3969,3970,3971,3972,3974,3975,3981,3982,3983,3984,3985,3986,3987,3988,3989,3990,3991,3993,3994,3995,3996,3997,3998,3999,4000,4001,4002,4003,4004,4005,4006,4007,4008,4009,4010,4011,4012,4013,4014,4015,4016,4017,4018,4019,4020,4021,4022,4023,4024,4025,4026,4027,4028,4038,4139,4140,4141,4142,4143,4144,4145,4146,4147,4148,4149,4150,4151,4152,4153,4154,4155,4156,4157,4158,4160,4161,4162,4163,4164,4165,4166,4167,4168,4169,4182,4183,4184,4185,4190,4191,4192,4194,4195,4196,4199,4200,4201,4202,4203,4204,4205,4209,4210,4211,4212,4226,4227,4228,4229,4230,4231,4232,4233,4234,4235,4236,4237,4239,4240,4241,4242,4243,4244,4245,4246,4247,4248,4249,4250,4251,4252,4253,4957,4958,4959,5906,5907,5908,5938,5939,5940,5970,5971,6002,6003,6068,6069,6070,6071,6072,6073,6074,6075,6076,6077,6078,6079,6080,6081,6082,6083,6084,6085,6086,6087,6088,6089,6090,6091,6092,6093,6094,6095,6096,6097,6098,6099,6109,6112,6113,6114,6115,6116,6117,6118,6119,6120,6121,6155,6156,6157,6160,6161,6162,6163,6164,6165,6166,6167,6168,6169,6313,6432,6433,6434,6435,6436,6437,6438,6439,6440,6441,6442,6443,6448,6449,6450,6451,6452,6453,6454,6455,6456,6457,6458,6459,6470,6471,6472,6473,6474,6475,6476,6477,6478,6479,6576,6577,6578,6579,6580,6581,6582,6583,6584,6585,6586,6587,6588,6589,6590,6591,6592,6600,6601,6608,6609,6610,6611,6612,6613,6614,6615,6616,6617,6679,6680,6681,6682,6683,6741,6742,6743,6744,6745,6746,6747,6748,6749,6750,6752,6753,6754,6755,6756,6757,6758,6759,6760,6761,6762,6763,6764,6765,6766,6767,6768,6769,6770,6771,6772,6773,6774,6775,6776,6777,6778,6779,6780,6783,6784,6785,6786,6787,6788,6789,6790,6791,6792,6793,6800,6801,6802,6803,6804,6805,6806,6807,6808,6809,6912,6913,6914,6915,6916,6964,6965,6966,6967,6968,6969,6970,6971,6972,6973,6974,6975,6976,6977,6978,6979,6980,6992,6993,6994,6995,6996,6997,6998,6999,7000,7001,7019,7020,7021,7022,7023,7024,7025,7026,7027,7040,7041,7042,7073,7074,7075,7076,7077,7078,7079,7080,7081,7082,7083,7084,7085,7088,7089,7090,7091,7092,7093,7094,7095,7096,7097,7142,7143,7144,7145,7146,7147,7148,7149,7150,7151,7152,7153,7154,7155,7204,7205,7206,7207,7208,7209,7210,7211,7212,7213,7214,7215,7216,7217,7218,7219,7220,7221,7222,7223,7232,7233,7234,7235,7236,7237,7238,7239,7240,7241,7248,7249,7250,7251,7252,7253,7254,7255,7256,7257,7376,7377,7378,7380,7381,7382,7383,7384,7385,7386,7387,7388,7389,7390,7391,7392,7393,7394,7395,7396,7397,7398,7399,7400,7405,7410,7411,7412,7616,7617,7618,7619,7620,7621,7622,7623,7624,7625,7626,7627,7628,7629,7630,7631,7632,7633,7634,7635,7636,7637,7638,7639,7640,7641,7642,7643,7644,7645,7646,7647,7648,7649,7650,7651,7652,7653,7654,7676,7677,7678,7679,8204,8205,8255,8256,8276,8400,8401,8402,8403,8404,8405,8406,8407,8408,8409,8410,8411,8412,8417,8421,8422,8423,8424,8425,8426,8427,8428,8429,8430,8431,8432,11503,11504,11505,11647,11744,11745,11746,11747,11748,11749,11750,11751,11752,11753,11754,11755,11756,11757,11758,11759,11760,11761,11762,11763,11764,11765,11766,11767,11768,11769,11770,11771,11772,11773,11774,11775,12330,12331,12332,12333,12334,12335,12441,12442,42528,42529,42530,42531,42532,42533,42534,42535,42536,42537,42607,42612,42613,42614,42615,42616,42617,42618,42619,42620,42621,42655,42736,42737,43010,43014,43019,43043,43044,43045,43046,43047,43136,43137,43188,43189,43190,43191,43192,43193,43194,43195,43196,43197,43198,43199,43200,43201,43202,43203,43204,43216,43217,43218,43219,43220,43221,43222,43223,43224,43225,43232,43233,43234,43235,43236,43237,43238,43239,43240,43241,43242,43243,43244,43245,43246,43247,43248,43249,43264,43265,43266,43267,43268,43269,43270,43271,43272,43273,43302,43303,43304,43305,43306,43307,43308,43309,43335,43336,43337,43338,43339,43340,43341,43342,43343,43344,43345,43346,43347,43392,43393,43394,43395,43443,43444,43445,43446,43447,43448,43449,43450,43451,43452,43453,43454,43455,43456,43472,43473,43474,43475,43476,43477,43478,43479,43480,43481,43561,43562,43563,43564,43565,43566,43567,43568,43569,43570,43571,43572,43573,43574,43587,43596,43597,43600,43601,43602,43603,43604,43605,43606,43607,43608,43609,43643,43696,43698,43699,43700,43703,43704,43710,43711,43713,43755,43756,43757,43758,43759,43765,43766,44003,44004,44005,44006,44007,44008,44009,44010,44012,44013,44016,44017,44018,44019,44020,44021,44022,44023,44024,44025,64286,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65056,65057,65058,65059,65060,65061,65062,65075,65076,65101,65102,65103,65296,65297,65298,65299,65300,65301,65302,65303,65304,65305,65343';
      exports_1("nonAsciiIdentifierPartTable", nonAsciiIdentifierPartTable = str.split(',').map(function(code) {
        return parseInt(code, 10);
      }));
    }
  };
});

"use strict";
System.register("src/mode/javascript/lex.js", ["./EventEmitter", "./reg", "./state", "./ascii-identifier-data", "./non-ascii-identifier-start", "./non-ascii-identifier-part-only"], function(exports_1) {
  var EventEmitter_1,
      reg_1,
      state_1,
      ascii_identifier_data_1,
      ascii_identifier_data_2,
      non_ascii_identifier_start_1,
      non_ascii_identifier_part_only_1;
  var Token,
      Context,
      Lexer;
  function some(xs, callback) {
    for (var i = 0,
        iLength = xs.length; i < iLength; i++) {
      if (callback(xs[i])) {
        return true;
      }
    }
    return false;
  }
  function asyncTrigger() {
    var _checks = [];
    return {
      push: function(fn) {
        _checks.push(fn);
      },
      check: function() {
        for (var check = 0; check < _checks.length; ++check) {
          _checks[check]();
        }
        _checks.splice(0, _checks.length);
      }
    };
  }
  return {
    setters: [function(EventEmitter_1_1) {
      EventEmitter_1 = EventEmitter_1_1;
    }, function(reg_1_1) {
      reg_1 = reg_1_1;
    }, function(state_1_1) {
      state_1 = state_1_1;
    }, function(ascii_identifier_data_1_1) {
      ascii_identifier_data_1 = ascii_identifier_data_1_1;
      ascii_identifier_data_2 = ascii_identifier_data_1_1;
    }, function(non_ascii_identifier_start_1_1) {
      non_ascii_identifier_start_1 = non_ascii_identifier_start_1_1;
    }, function(non_ascii_identifier_part_only_1_1) {
      non_ascii_identifier_part_only_1 = non_ascii_identifier_part_only_1_1;
    }],
    execute: function() {
      Token = {
        Identifier: 1,
        Punctuator: 2,
        NumericLiteral: 3,
        StringLiteral: 4,
        Comment: 5,
        Keyword: 6,
        NullLiteral: 7,
        BooleanLiteral: 8,
        RegExp: 9,
        TemplateHead: 10,
        TemplateMiddle: 11,
        TemplateTail: 12,
        NoSubstTemplate: 13
      };
      exports_1("Context", Context = {
        Block: 1,
        Template: 2
      });
      Lexer = (function() {
        function Lexer(source) {
          this._lines = [];
          var lines = source;
          if (typeof lines === "string") {
            lines = lines.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
          }
          if (lines[0] && lines[0].substr(0, 2) === "#!") {
            if (lines[0].indexOf("node") !== -1) {
              state_1.state.option.node = true;
            }
            lines[0] = "";
          }
          this.emitter = new EventEmitter_1.default();
          this.source = source;
          this.setLines(lines);
          this.prereg = true;
          this.line = 0;
          this.char = 1;
          this.from = 1;
          this.input = "";
          this.inComment = false;
          this.context = [];
          this.templateStarts = [];
          for (var i = 0; i < state_1.state.option.indent; i += 1) {
            state_1.state.tab += " ";
          }
        }
        Lexer.prototype.inContext = function(ctxType) {
          return this.context.length > 0 && this.context[this.context.length - 1].type === ctxType;
        };
        Lexer.prototype.pushContext = function(ctxType) {
          this.context.push({type: ctxType});
        };
        Lexer.prototype.popContext = function() {
          return this.context.pop();
        };
        Lexer.prototype.isContext = function(context) {
          return this.context.length > 0 && this.context[this.context.length - 1] === context;
        };
        Lexer.prototype.currentContext = function() {
          return this.context.length > 0 && this.context[this.context.length - 1];
        };
        Lexer.prototype.getLines = function() {
          this._lines = state_1.state.lines;
          return this._lines;
        };
        Lexer.prototype.setLines = function(val) {
          this._lines = val;
          state_1.state.lines = this._lines;
        };
        Lexer.prototype.peek = function(i) {
          return this.input.charAt(i || 0);
        };
        Lexer.prototype.skip = function(i) {
          i = i || 1;
          this.char += i;
          this.input = this.input.slice(i);
        };
        Lexer.prototype.on = function(names, listener) {
          names.split(" ").forEach(function(name) {
            this.emitter.on(name, listener);
          }.bind(this));
        };
        Lexer.prototype.trigger = function(unused0, unused1) {
          this.emitter.emit.apply(this.emitter, Array.prototype.slice.call(arguments));
        };
        Lexer.prototype.triggerAsync = function(type, args, checks, fn) {
          checks.push(function() {
            if (fn()) {
              this.trigger(type, args);
            }
          }.bind(this));
        };
        Lexer.prototype.scanPunctuator = function() {
          var ch1 = this.peek();
          var ch2,
              ch3,
              ch4;
          switch (ch1) {
            case ".":
              if ((/^[0-9]$/).test(this.peek(1))) {
                return null;
              }
              if (this.peek(1) === "." && this.peek(2) === ".") {
                return {
                  type: Token.Punctuator,
                  value: "..."
                };
              }
            case "(":
            case ")":
            case ";":
            case ",":
            case "[":
            case "]":
            case ":":
            case "~":
            case "?":
              return {
                type: Token.Punctuator,
                value: ch1
              };
            case "{":
              this.pushContext(Context.Block);
              return {
                type: Token.Punctuator,
                value: ch1
              };
            case "}":
              if (this.inContext(Context.Block)) {
                this.popContext();
              }
              return {
                type: Token.Punctuator,
                value: ch1
              };
            case "#":
              return {
                type: Token.Punctuator,
                value: ch1
              };
            case "":
              return null;
          }
          ch2 = this.peek(1);
          ch3 = this.peek(2);
          ch4 = this.peek(3);
          if (ch1 === ">" && ch2 === ">" && ch3 === ">" && ch4 === "=") {
            return {
              type: Token.Punctuator,
              value: ">>>="
            };
          }
          if (ch1 === "=" && ch2 === "=" && ch3 === "=") {
            return {
              type: Token.Punctuator,
              value: "==="
            };
          }
          if (ch1 === "!" && ch2 === "=" && ch3 === "=") {
            return {
              type: Token.Punctuator,
              value: "!=="
            };
          }
          if (ch1 === ">" && ch2 === ">" && ch3 === ">") {
            return {
              type: Token.Punctuator,
              value: ">>>"
            };
          }
          if (ch1 === "<" && ch2 === "<" && ch3 === "=") {
            return {
              type: Token.Punctuator,
              value: "<<="
            };
          }
          if (ch1 === ">" && ch2 === ">" && ch3 === "=") {
            return {
              type: Token.Punctuator,
              value: ">>="
            };
          }
          if (ch1 === "=" && ch2 === ">") {
            return {
              type: Token.Punctuator,
              value: ch1 + ch2
            };
          }
          if (ch1 === ch2 && ("+-<>&|".indexOf(ch1) >= 0)) {
            return {
              type: Token.Punctuator,
              value: ch1 + ch2
            };
          }
          if ("<>=!+-*%&|^/".indexOf(ch1) >= 0) {
            if (ch2 === "=") {
              return {
                type: Token.Punctuator,
                value: ch1 + ch2
              };
            }
            return {
              type: Token.Punctuator,
              value: ch1
            };
          }
          return null;
        };
        Lexer.prototype.scanComments = function() {
          var ch1 = this.peek();
          var ch2 = this.peek(1);
          var rest = this.input.substr(2);
          var startLine = this.line;
          var startChar = this.char;
          var self = this;
          function commentToken(label, body, opt) {
            var special = ["jshint", "jslint", "members", "member", "globals", "global", "exported"];
            var isSpecial = false;
            var value = label + body;
            var commentType = "plain";
            opt = opt || {};
            if (opt.isMultiline) {
              value += "*/";
            }
            body = body.replace(/\n/g, " ");
            if (label === "/*" && reg_1.fallsThrough.test(body)) {
              isSpecial = true;
              commentType = "falls through";
            }
            special.forEach(function(str) {
              if (isSpecial) {
                return;
              }
              if (label === "//" && str !== "jshint") {
                return;
              }
              if (body.charAt(str.length) === " " && body.substr(0, str.length) === str) {
                isSpecial = true;
                label = label + str;
                body = body.substr(str.length);
              }
              if (!isSpecial && body.charAt(0) === " " && body.charAt(str.length + 1) === " " && body.substr(1, str.length) === str) {
                isSpecial = true;
                label = label + " " + str;
                body = body.substr(str.length + 1);
              }
              if (!isSpecial) {
                return;
              }
              switch (str) {
                case "member":
                  commentType = "members";
                  break;
                case "global":
                  commentType = "globals";
                  break;
                default:
                  var options = body.split(":").map(function(v) {
                    return v.replace(/^\s+/, "").replace(/\s+$/, "");
                  });
                  if (options.length === 2) {
                    switch (options[0]) {
                      case "ignore":
                        switch (options[1]) {
                          case "start":
                            self.ignoringLinterErrors = true;
                            isSpecial = false;
                            break;
                          case "end":
                            self.ignoringLinterErrors = false;
                            isSpecial = false;
                            break;
                        }
                    }
                  }
                  commentType = str;
              }
            });
            return {
              type: Token.Comment,
              commentType: commentType,
              value: value,
              body: body,
              isSpecial: isSpecial,
              isMultiline: opt.isMultiline || false,
              isMalformed: opt.isMalformed || false
            };
          }
          if (ch1 === "*" && ch2 === "/") {
            this.trigger("error", {
              code: "E018",
              line: startLine,
              character: startChar
            });
            this.skip(2);
            return null;
          }
          if (ch1 !== "/" || (ch2 !== "*" && ch2 !== "/")) {
            return null;
          }
          if (ch2 === "/") {
            this.skip(this.input.length);
            return commentToken("//", rest);
          }
          var body = "";
          if (ch2 === "*") {
            this.inComment = true;
            this.skip(2);
            while (this.peek() !== "*" || this.peek(1) !== "/") {
              if (this.peek() === "") {
                body += "\n";
                if (!this.nextLine()) {
                  this.trigger("error", {
                    code: "E017",
                    line: startLine,
                    character: startChar
                  });
                  this.inComment = false;
                  return commentToken("/*", body, {
                    isMultiline: true,
                    isMalformed: true
                  });
                }
              } else {
                body += this.peek();
                this.skip();
              }
            }
            this.skip(2);
            this.inComment = false;
            return commentToken("/*", body, {isMultiline: true});
          }
        };
        Lexer.prototype.scanKeyword = function() {
          var result = /^[a-zA-Z_$][a-zA-Z0-9_$]*/.exec(this.input);
          var keywords = ["if", "in", "do", "var", "for", "new", "try", "let", "this", "else", "case", "void", "with", "enum", "while", "break", "catch", "throw", "const", "yield", "class", "super", "return", "typeof", "delete", "switch", "export", "import", "default", "finally", "extends", "function", "continue", "debugger", "instanceof"];
          if (result && keywords.indexOf(result[0]) >= 0) {
            return {
              type: Token.Keyword,
              value: result[0]
            };
          }
          return null;
        };
        Lexer.prototype.scanIdentifier = function() {
          var id = "";
          var index = 0;
          var type,
              char;
          function isNonAsciiIdentifierStart(code) {
            return non_ascii_identifier_start_1.nonAsciiIdentifierStartTable.indexOf(code) > -1;
          }
          function isNonAsciiIdentifierPart(code) {
            return isNonAsciiIdentifierStart(code) || non_ascii_identifier_part_only_1.nonAsciiIdentifierPartTable.indexOf(code) > -1;
          }
          function isHexDigit(str) {
            return (/^[0-9a-fA-F]$/).test(str);
          }
          var readUnicodeEscapeSequence = function() {
            index += 1;
            if (this.peek(index) !== "u") {
              return null;
            }
            var ch1 = this.peek(index + 1);
            var ch2 = this.peek(index + 2);
            var ch3 = this.peek(index + 3);
            var ch4 = this.peek(index + 4);
            var code;
            if (isHexDigit(ch1) && isHexDigit(ch2) && isHexDigit(ch3) && isHexDigit(ch4)) {
              code = parseInt(ch1 + ch2 + ch3 + ch4, 16);
              if (ascii_identifier_data_2.asciiIdentifierPartTable[code] || isNonAsciiIdentifierPart(code)) {
                index += 5;
                return "\\u" + ch1 + ch2 + ch3 + ch4;
              }
              return null;
            }
            return null;
          }.bind(this);
          var getIdentifierStart = function() {
            var chr = this.peek(index);
            var code = chr.charCodeAt(0);
            if (code === 92) {
              return readUnicodeEscapeSequence();
            }
            if (code < 128) {
              if (ascii_identifier_data_1.asciiIdentifierStartTable[code]) {
                index += 1;
                return chr;
              }
              return null;
            }
            if (isNonAsciiIdentifierStart(code)) {
              index += 1;
              return chr;
            }
            return null;
          }.bind(this);
          var getIdentifierPart = function() {
            var chr = this.peek(index);
            var code = chr.charCodeAt(0);
            if (code === 92) {
              return readUnicodeEscapeSequence();
            }
            if (code < 128) {
              if (ascii_identifier_data_2.asciiIdentifierPartTable[code]) {
                index += 1;
                return chr;
              }
              return null;
            }
            if (isNonAsciiIdentifierPart(code)) {
              index += 1;
              return chr;
            }
            return null;
          }.bind(this);
          function removeEscapeSequences(id) {
            return id.replace(/\\u([0-9a-fA-F]{4})/g, function(m0, codepoint) {
              return String.fromCharCode(parseInt(codepoint, 16));
            });
          }
          char = getIdentifierStart();
          if (char === null) {
            return null;
          }
          id = char;
          for (; ; ) {
            char = getIdentifierPart();
            if (char === null) {
              break;
            }
            id += char;
          }
          switch (id) {
            case "true":
            case "false":
              type = Token.BooleanLiteral;
              break;
            case "null":
              type = Token.NullLiteral;
              break;
            default:
              type = Token.Identifier;
          }
          return {
            type: type,
            value: removeEscapeSequences(id),
            text: id,
            tokenLength: id.length
          };
        };
        Lexer.prototype.scanNumericLiteral = function() {
          var index = 0;
          var value = "";
          var length = this.input.length;
          var char = this.peek(index);
          var bad;
          var isAllowedDigit = isDecimalDigit;
          var base = 10;
          var isLegacy = false;
          function isDecimalDigit(str) {
            return (/^[0-9]$/).test(str);
          }
          function isOctalDigit(str) {
            return (/^[0-7]$/).test(str);
          }
          function isBinaryDigit(str) {
            return (/^[01]$/).test(str);
          }
          function isHexDigit(str) {
            return (/^[0-9a-fA-F]$/).test(str);
          }
          function isIdentifierStart(ch) {
            return (ch === "$") || (ch === "_") || (ch === "\\") || (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
          }
          if (char !== "." && !isDecimalDigit(char)) {
            return null;
          }
          if (char !== ".") {
            value = this.peek(index);
            index += 1;
            char = this.peek(index);
            if (value === "0") {
              if (char === "x" || char === "X") {
                isAllowedDigit = isHexDigit;
                base = 16;
                index += 1;
                value += char;
              }
              if (char === "o" || char === "O") {
                isAllowedDigit = isOctalDigit;
                base = 8;
                if (!state_1.state.inES6(true)) {
                  this.trigger("warning", {
                    code: "W119",
                    line: this.line,
                    character: this.char,
                    data: ["Octal integer literal", "6"]
                  });
                }
                index += 1;
                value += char;
              }
              if (char === "b" || char === "B") {
                isAllowedDigit = isBinaryDigit;
                base = 2;
                if (!state_1.state.inES6(true)) {
                  this.trigger("warning", {
                    code: "W119",
                    line: this.line,
                    character: this.char,
                    data: ["Binary integer literal", "6"]
                  });
                }
                index += 1;
                value += char;
              }
              if (isOctalDigit(char)) {
                isAllowedDigit = isOctalDigit;
                base = 8;
                isLegacy = true;
                bad = false;
                index += 1;
                value += char;
              }
              if (!isOctalDigit(char) && isDecimalDigit(char)) {
                index += 1;
                value += char;
              }
            }
            while (index < length) {
              char = this.peek(index);
              if (isLegacy && isDecimalDigit(char)) {
                bad = true;
              } else if (!isAllowedDigit(char)) {
                break;
              }
              value += char;
              index += 1;
            }
            if (isAllowedDigit !== isDecimalDigit) {
              if (!isLegacy && value.length <= 2) {
                return {
                  type: Token.NumericLiteral,
                  value: value,
                  isMalformed: true
                };
              }
              if (index < length) {
                char = this.peek(index);
                if (isIdentifierStart(char)) {
                  return null;
                }
              }
              return {
                type: Token.NumericLiteral,
                value: value,
                base: base,
                isLegacy: isLegacy,
                isMalformed: false
              };
            }
          }
          if (char === ".") {
            value += char;
            index += 1;
            while (index < length) {
              char = this.peek(index);
              if (!isDecimalDigit(char)) {
                break;
              }
              value += char;
              index += 1;
            }
          }
          if (char === "e" || char === "E") {
            value += char;
            index += 1;
            char = this.peek(index);
            if (char === "+" || char === "-") {
              value += this.peek(index);
              index += 1;
            }
            char = this.peek(index);
            if (isDecimalDigit(char)) {
              value += char;
              index += 1;
              while (index < length) {
                char = this.peek(index);
                if (!isDecimalDigit(char)) {
                  break;
                }
                value += char;
                index += 1;
              }
            } else {
              return null;
            }
          }
          if (index < length) {
            char = this.peek(index);
            if (isIdentifierStart(char)) {
              return null;
            }
          }
          return {
            type: Token.NumericLiteral,
            value: value,
            base: base,
            isMalformed: !isFinite(parseFloat(value))
          };
        };
        Lexer.prototype.scanEscapeSequence = function(checks) {
          var allowNewLine = false;
          var jump = 1;
          this.skip();
          var char = this.peek();
          switch (char) {
            case "'":
              this.triggerAsync("warning", {
                code: "W114",
                line: this.line,
                character: this.char,
                data: ["\\'"]
              }, checks, function() {
                return state_1.state.jsonMode;
              });
              break;
            case "b":
              char = "\\b";
              break;
            case "f":
              char = "\\f";
              break;
            case "n":
              char = "\\n";
              break;
            case "r":
              char = "\\r";
              break;
            case "t":
              char = "\\t";
              break;
            case "0":
              char = "\\0";
              var n = parseInt(this.peek(1), 10);
              this.triggerAsync("warning", {
                code: "W115",
                line: this.line,
                character: this.char
              }, checks, function() {
                return n >= 0 && n <= 7 && state_1.state.isStrict();
              });
              break;
            case "u":
              var hexCode = this.input.substr(1, 4);
              var code = parseInt(hexCode, 16);
              if (isNaN(code)) {
                this.trigger("warning", {
                  code: "W052",
                  line: this.line,
                  character: this.char,
                  data: ["u" + hexCode]
                });
              }
              char = String.fromCharCode(code);
              jump = 5;
              break;
            case "v":
              this.triggerAsync("warning", {
                code: "W114",
                line: this.line,
                character: this.char,
                data: ["\\v"]
              }, checks, function() {
                return state_1.state.jsonMode;
              });
              char = "\v";
              break;
            case "x":
              var x = parseInt(this.input.substr(1, 2), 16);
              this.triggerAsync("warning", {
                code: "W114",
                line: this.line,
                character: this.char,
                data: ["\\x-"]
              }, checks, function() {
                return state_1.state.jsonMode;
              });
              char = String.fromCharCode(x);
              jump = 3;
              break;
            case "\\":
              char = "\\\\";
              break;
            case "\"":
              char = "\\\"";
              break;
            case "/":
              break;
            case "":
              allowNewLine = true;
              char = "";
              break;
          }
          return {
            char: char,
            jump: jump,
            allowNewLine: allowNewLine
          };
        };
        Lexer.prototype.scanTemplateLiteral = function(checks) {
          var tokenType;
          var value = "";
          var ch;
          var startLine = this.line;
          var startChar = this.char;
          var depth = this.templateStarts.length;
          if (this.peek() === "`") {
            if (!state_1.state.inES6(true)) {
              this.trigger("warning", {
                code: "W119",
                line: this.line,
                character: this.char,
                data: ["template literal syntax", "6"]
              });
            }
            tokenType = Token.TemplateHead;
            this.templateStarts.push({
              line: this.line,
              char: this.char
            });
            depth = this.templateStarts.length;
            this.skip(1);
            this.pushContext(Context.Template);
          } else if (this.inContext(Context.Template) && this.peek() === "}") {
            tokenType = Token.TemplateMiddle;
          } else {
            return null;
          }
          while (this.peek() !== "`") {
            while ((ch = this.peek()) === "") {
              value += "\n";
              if (!this.nextLine()) {
                var startPos = this.templateStarts.pop();
                this.trigger("error", {
                  code: "E052",
                  line: startPos.line,
                  character: startPos.char
                });
                return {
                  type: tokenType,
                  value: value,
                  startLine: startLine,
                  startChar: startChar,
                  isUnclosed: true,
                  depth: depth,
                  context: this.popContext()
                };
              }
            }
            if (ch === '$' && this.peek(1) === '{') {
              value += '${';
              this.skip(2);
              return {
                type: tokenType,
                value: value,
                startLine: startLine,
                startChar: startChar,
                isUnclosed: false,
                depth: depth,
                context: this.currentContext()
              };
            } else if (ch === '\\') {
              var escape = this.scanEscapeSequence(checks);
              value += escape.char;
              this.skip(escape.jump);
            } else if (ch !== '`') {
              value += ch;
              this.skip(1);
            }
          }
          tokenType = tokenType === Token.TemplateHead ? Token.NoSubstTemplate : Token.TemplateTail;
          this.skip(1);
          this.templateStarts.pop();
          return {
            type: tokenType,
            value: value,
            startLine: startLine,
            startChar: startChar,
            isUnclosed: false,
            depth: depth,
            context: this.popContext()
          };
        };
        Lexer.prototype.scanStringLiteral = function(checks) {
          var quote = this.peek();
          if (quote !== "\"" && quote !== "'") {
            return null;
          }
          this.triggerAsync("warning", {
            code: "W108",
            line: this.line,
            character: this.char
          }, checks, function() {
            return state_1.state.jsonMode && quote !== "\"";
          });
          var value = "";
          var startLine = this.line;
          var startChar = this.char;
          var allowNewLine = false;
          this.skip();
          while (this.peek() !== quote) {
            if (this.peek() === "") {
              if (!allowNewLine) {
                this.trigger("warning", {
                  code: "W112",
                  line: this.line,
                  character: this.char
                });
              } else {
                allowNewLine = false;
                this.triggerAsync("warning", {
                  code: "W043",
                  line: this.line,
                  character: this.char
                }, checks, function() {
                  return !state_1.state.option.multistr;
                });
                this.triggerAsync("warning", {
                  code: "W042",
                  line: this.line,
                  character: this.char
                }, checks, function() {
                  return state_1.state.jsonMode && state_1.state.option.multistr;
                });
              }
              if (!this.nextLine()) {
                this.trigger("error", {
                  code: "E029",
                  line: startLine,
                  character: startChar
                });
                return {
                  type: Token.StringLiteral,
                  value: value,
                  startLine: startLine,
                  startChar: startChar,
                  isUnclosed: true,
                  quote: quote
                };
              }
            } else {
              allowNewLine = false;
              var char = this.peek();
              var jump = 1;
              if (char < " ") {
                this.trigger("warning", {
                  code: "W113",
                  line: this.line,
                  character: this.char,
                  data: ["<non-printable>"]
                });
              }
              if (char === "\\") {
                var parsed = this.scanEscapeSequence(checks);
                char = parsed.char;
                jump = parsed.jump;
                allowNewLine = parsed.allowNewLine;
              }
              value += char;
              this.skip(jump);
            }
          }
          this.skip();
          return {
            type: Token.StringLiteral,
            value: value,
            startLine: startLine,
            startChar: startChar,
            isUnclosed: false,
            quote: quote
          };
        };
        Lexer.prototype.scanRegExp = function() {
          var index = 0;
          var length = this.input.length;
          var char = this.peek();
          var value = char;
          var body = "";
          var flags = [];
          var malformed = false;
          var isCharSet = false;
          var terminated;
          var scanUnexpectedChars = function() {
            if (char < " ") {
              malformed = true;
              this.trigger("warning", {
                code: "W048",
                line: this.line,
                character: this.char
              });
            }
            if (char === "<") {
              malformed = true;
              this.trigger("warning", {
                code: "W049",
                line: this.line,
                character: this.char,
                data: [char]
              });
            }
          }.bind(this);
          if (!this.prereg || char !== "/") {
            return null;
          }
          index += 1;
          terminated = false;
          while (index < length) {
            char = this.peek(index);
            value += char;
            body += char;
            if (isCharSet) {
              if (char === "]") {
                if (this.peek(index - 1) !== "\\" || this.peek(index - 2) === "\\") {
                  isCharSet = false;
                }
              }
              if (char === "\\") {
                index += 1;
                char = this.peek(index);
                body += char;
                value += char;
                scanUnexpectedChars();
              }
              index += 1;
              continue;
            }
            if (char === "\\") {
              index += 1;
              char = this.peek(index);
              body += char;
              value += char;
              scanUnexpectedChars();
              if (char === "/") {
                index += 1;
                continue;
              }
              if (char === "[") {
                index += 1;
                continue;
              }
            }
            if (char === "[") {
              isCharSet = true;
              index += 1;
              continue;
            }
            if (char === "/") {
              body = body.substr(0, body.length - 1);
              terminated = true;
              index += 1;
              break;
            }
            index += 1;
          }
          if (!terminated) {
            this.trigger("error", {
              code: "E015",
              line: this.line,
              character: this.from
            });
            return void this.trigger("fatal", {
              line: this.line,
              from: this.from
            });
          }
          while (index < length) {
            char = this.peek(index);
            if (!/[gim]/.test(char)) {
              break;
            }
            flags.push(char);
            value += char;
            index += 1;
          }
          try {
            new RegExp(body, flags.join(""));
          } catch (err) {
            malformed = true;
            this.trigger("error", {
              code: "E016",
              line: this.line,
              character: this.char,
              data: [err.message]
            });
          }
          return {
            type: Token.RegExp,
            value: value,
            flags: flags,
            isMalformed: malformed
          };
        };
        Lexer.prototype.scanNonBreakingSpaces = function() {
          return state_1.state.option.nonbsp ? this.input.search(/(\u00A0)/) : -1;
        };
        Lexer.prototype.scanUnsafeChars = function() {
          return this.input.search(reg_1.unsafeChars);
        };
        Lexer.prototype.next = function(checks) {
          this.from = this.char;
          while (/\s/.test(this.peek())) {
            this.from += 1;
            this.skip();
          }
          var match = this.scanComments() || this.scanStringLiteral(checks) || this.scanTemplateLiteral(checks);
          if (match) {
            return match;
          }
          match = this.scanRegExp() || this.scanPunctuator() || this.scanKeyword() || this.scanIdentifier() || this.scanNumericLiteral();
          if (match) {
            this.skip(match['tokenLength'] || match.value.length);
            return match;
          }
          return null;
        };
        Lexer.prototype.nextLine = function() {
          var char;
          if (this.line >= this.getLines().length) {
            return false;
          }
          this.input = this.getLines()[this.line];
          this.line += 1;
          this.char = 1;
          this.from = 1;
          var inputTrimmed = this.input.trim();
          var startsWith = function(unused0, unused1) {
            return some(arguments, function(prefix) {
              return inputTrimmed.indexOf(prefix) === 0;
            });
          };
          var endsWith = function(unused) {
            return some(arguments, function(suffix) {
              return inputTrimmed.indexOf(suffix, inputTrimmed.length - suffix.length) !== -1;
            });
          };
          if (this.ignoringLinterErrors === true) {
            if (!startsWith("/*", "//") && !(this.inComment && endsWith("*/"))) {
              this.input = "";
            }
          }
          char = this.scanNonBreakingSpaces();
          if (char >= 0) {
            this.trigger("warning", {
              code: "W125",
              line: this.line,
              character: char + 1
            });
          }
          this.input = this.input.replace(/\t/g, state_1.state.tab);
          char = this.scanUnsafeChars();
          if (char >= 0) {
            this.trigger("warning", {
              code: "W100",
              line: this.line,
              character: char
            });
          }
          if (!this.ignoringLinterErrors && state_1.state.option.maxlen && state_1.state.option.maxlen < this.input.length) {
            var inComment = this.inComment || startsWith.call(inputTrimmed, "//") || startsWith.call(inputTrimmed, "/*");
            var shouldTriggerError = !inComment || !reg_1.maxlenException.test(inputTrimmed);
            if (shouldTriggerError) {
              this.trigger("warning", {
                code: "W101",
                line: this.line,
                character: this.input.length
              });
            }
          }
          return true;
        };
        Lexer.prototype.start = function() {
          this.nextLine();
        };
        Lexer.prototype.token = function() {
          var checks = asyncTrigger();
          var token;
          function isReserved(token, isProperty) {
            if (!token.reserved) {
              return false;
            }
            var meta = token.meta;
            if (meta && meta.isFutureReservedWord && state_1.state.inES5()) {
              if (!meta.es5) {
                return false;
              }
              if (meta.strictOnly) {
                if (!state_1.state.option.strict && !state_1.state.isStrict()) {
                  return false;
                }
              }
              if (isProperty) {
                return false;
              }
            }
            return true;
          }
          var create = function(type, value, isProperty, token) {
            var obj;
            if (type !== "(endline)" && type !== "(end)") {
              this.prereg = false;
            }
            if (type === "(punctuator)") {
              switch (value) {
                case ".":
                case ")":
                case "~":
                case "#":
                case "]":
                case "++":
                case "--":
                  this.prereg = false;
                  break;
                default:
                  this.prereg = true;
              }
              obj = Object.create(state_1.state.syntax[value] || state_1.state.syntax["(error)"]);
            }
            if (type === "(identifier)") {
              if (value === "return" || value === "case" || value === "typeof") {
                this.prereg = true;
              }
              if (state_1.state.syntax[value]) {
                obj = Object.create(state_1.state.syntax[value] || state_1.state.syntax["(error)"]);
                if (!isReserved(obj, isProperty && type === "(identifier)")) {
                  obj = null;
                }
              }
            }
            if (!obj) {
              obj = Object.create(state_1.state.syntax[type]);
            }
            obj.identifier = (type === "(identifier)");
            obj.type = obj.type || type;
            obj.value = value;
            obj.line = this.line;
            obj.character = this.char;
            obj.from = this.from;
            if (obj.identifier && token)
              obj.raw_text = token.text || token.value;
            if (token && token.startLine && token.startLine !== this.line) {
              obj.startLine = token.startLine;
            }
            if (token && token.context) {
              obj.context = token.context;
            }
            if (token && token.depth) {
              obj.depth = token.depth;
            }
            if (token && token.isUnclosed) {
              obj.isUnclosed = token.isUnclosed;
            }
            if (isProperty && obj.identifier) {
              obj.isProperty = isProperty;
            }
            obj.check = checks.check;
            return obj;
          }.bind(this);
          for (; ; ) {
            if (!this.input.length) {
              if (this.nextLine()) {
                return create("(endline)", "");
              }
              if (this.exhausted) {
                return null;
              }
              this.exhausted = true;
              return create("(end)", "");
            }
            token = this.next(checks);
            if (!token) {
              if (this.input.length) {
                this.trigger("error", {
                  code: "E024",
                  line: this.line,
                  character: this.char,
                  data: [this.peek()]
                });
                this.input = "";
              }
              continue;
            }
            switch (token.type) {
              case Token.StringLiteral:
                this.triggerAsync("String", {
                  line: this.line,
                  char: this.char,
                  from: this.from,
                  startLine: token.startLine,
                  startChar: token.startChar,
                  value: token.value,
                  quote: token.quote
                }, checks, function() {
                  return true;
                });
                return create("(string)", token.value, null, token);
              case Token.TemplateHead:
                this.trigger("TemplateHead", {
                  line: this.line,
                  char: this.char,
                  from: this.from,
                  startLine: token.startLine,
                  startChar: token.startChar,
                  value: token.value
                });
                return create("(template)", token.value, null, token);
              case Token.TemplateMiddle:
                this.trigger("TemplateMiddle", {
                  line: this.line,
                  char: this.char,
                  from: this.from,
                  startLine: token.startLine,
                  startChar: token.startChar,
                  value: token.value
                });
                return create("(template middle)", token.value, null, token);
              case Token.TemplateTail:
                this.trigger("TemplateTail", {
                  line: this.line,
                  char: this.char,
                  from: this.from,
                  startLine: token.startLine,
                  startChar: token.startChar,
                  value: token.value
                });
                return create("(template tail)", token.value, null, token);
              case Token.NoSubstTemplate:
                this.trigger("NoSubstTemplate", {
                  line: this.line,
                  char: this.char,
                  from: this.from,
                  startLine: token.startLine,
                  startChar: token.startChar,
                  value: token.value
                });
                return create("(no subst template)", token.value, null, token);
              case Token.Identifier:
                this.triggerAsync("Identifier", {
                  line: this.line,
                  char: this.char,
                  from: this.from,
                  name: token.value,
                  raw_name: token.text,
                  isProperty: state_1.state.tokens.curr.id === "."
                }, checks, function() {
                  return true;
                });
              case Token.Keyword:
              case Token.NullLiteral:
              case Token.BooleanLiteral:
                return create("(identifier)", token.value, state_1.state.tokens.curr.id === ".", token);
              case Token.NumericLiteral:
                if (token.isMalformed) {
                  this.trigger("warning", {
                    code: "W045",
                    line: this.line,
                    character: this.char,
                    data: [token.value]
                  });
                }
                this.triggerAsync("warning", {
                  code: "W114",
                  line: this.line,
                  character: this.char,
                  data: ["0x-"]
                }, checks, function() {
                  return token.base === 16 && state_1.state.jsonMode;
                });
                this.triggerAsync("warning", {
                  code: "W115",
                  line: this.line,
                  character: this.char
                }, checks, function() {
                  return state_1.state.isStrict() && token.base === 8 && token.isLegacy;
                });
                this.trigger("Number", {
                  line: this.line,
                  char: this.char,
                  from: this.from,
                  value: token.value,
                  base: token.base,
                  isMalformed: token.malformed
                });
                return create("(number)", token.value);
              case Token.RegExp:
                return create("(regexp)", token.value);
              case Token.Comment:
                state_1.state.tokens.curr.comment = true;
                if (token.isSpecial) {
                  return {
                    id: '(comment)',
                    value: token.value,
                    body: token.body,
                    type: token.commentType,
                    isSpecial: token.isSpecial,
                    line: this.line,
                    character: this.char,
                    from: this.from
                  };
                }
                break;
              case "":
                break;
              default:
                return create("(punctuator)", token.value);
            }
          }
        };
        return Lexer;
      })();
      exports_1("default", Lexer);
    }
  };
});

"use strict";
System.register("src/mode/javascript/reg.js", [], function(exports_1) {
  var unsafeString,
      unsafeChars,
      needEsc,
      needEscGlobal,
      starSlash,
      identifierRegExp,
      javascriptURL,
      fallsThrough,
      maxlenException;
  return {
    setters: [],
    execute: function() {
      exports_1("unsafeString", unsafeString = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i);
      exports_1("unsafeChars", unsafeChars = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/);
      exports_1("needEsc", needEsc = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/);
      exports_1("needEscGlobal", needEscGlobal = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g);
      exports_1("starSlash", starSlash = /\*\//);
      exports_1("identifierRegExp", identifierRegExp = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/);
      exports_1("javascriptURL", javascriptURL = /^(?:javascript|jscript|ecmascript|vbscript|livescript)\s*:/i);
      exports_1("fallsThrough", fallsThrough = /^\s*falls?\sthrough\s*$/);
      exports_1("maxlenException", maxlenException = /^(?:(?:\/\/|\/\*|\*) ?)?[^ ]+$/);
    }
  };
});

"use strict";
System.register("src/mode/javascript/name-stack.js", [], function(exports_1) {
  var NameStack;
  return {
    setters: [],
    execute: function() {
      NameStack = (function() {
        function NameStack() {
          this.pop = function() {
            this._stack.pop();
          };
          this._stack = [];
        }
        Object.defineProperty(NameStack.prototype, "length", {
          get: function() {
            return this._stack.length;
          },
          enumerable: true,
          configurable: true
        });
        NameStack.prototype.push = function() {
          this._stack.push(null);
        };
        NameStack.prototype.set = function(token) {
          this._stack[this.length - 1] = token;
        };
        NameStack.prototype.infer = function() {
          var nameToken = this._stack[this.length - 1];
          var prefix = "";
          var type;
          if (!nameToken || nameToken.type === "class") {
            nameToken = this._stack[this.length - 2];
          }
          if (!nameToken) {
            return "(empty)";
          }
          type = nameToken.type;
          if (type !== "(string)" && type !== "(number)" && type !== "(identifier)" && type !== "default") {
            return "(expression)";
          }
          if (nameToken.accessorType) {
            prefix = nameToken.accessorType + " ";
          }
          return prefix + nameToken.value;
        };
        return NameStack;
      })();
      exports_1("default", NameStack);
    }
  };
});

"use strict";
System.register("src/mode/javascript/state.js", ["./name-stack"], function(exports_1) {
  var name_stack_1;
  var state;
  return {
    setters: [function(name_stack_1_1) {
      name_stack_1 = name_stack_1_1;
    }],
    execute: function() {
      exports_1("state", state = {
        option: {},
        cache: {},
        condition: void 0,
        directive: {},
        forinifcheckneeded: false,
        forinifchecks: void 0,
        funct: null,
        ignored: {},
        tab: "",
        lines: [],
        syntax: {},
        jsonMode: false,
        nameStack: new name_stack_1.default(),
        tokens: {
          prev: null,
          next: null,
          curr: null
        },
        inClassBody: false,
        ignoredLines: {},
        isStrict: function() {
          return this.directive["use strict"] || this.inClassBody || this.option.module || this.option.strict === "implied";
        },
        inMoz: function() {
          return this.option.moz;
        },
        inES6: function(strict) {
          if (strict) {
            return this.option.esversion === 6;
          }
          return this.option.moz || this.option.esversion >= 6;
        },
        inES5: function(strict) {
          if (strict) {
            return (!this.option.esversion || this.option.esversion === 5) && !this.option.moz;
          }
          return !this.option.esversion || this.option.esversion >= 5 || this.option.moz;
        },
        reset: function() {
          this.tokens = {
            prev: null,
            next: null,
            curr: null
          };
          this.option = {};
          this.funct = null;
          this.ignored = {};
          this.directive = {};
          this.jsonMode = false;
          this.jsonWarnings = [];
          this.lines = [];
          this.tab = "";
          this.cache = {};
          this.ignoredLines = {};
          this.forinifcheckneeded = false;
          this.nameStack = new name_stack_1.default();
          this.inClassBody = false;
        }
      });
    }
  };
});

"use strict";
System.register("src/mode/javascript/style.js", [], function(exports_1) {
  function register(linter) {
    linter.on("Identifier", function style_scanProto(data) {
      if (linter.getOption("proto")) {
        return;
      }
      if (data.name === "__proto__") {
        linter.warn("W103", {
          line: data.line,
          char: data.char,
          data: [data.name, "6"]
        });
      }
    });
    linter.on("Identifier", function style_scanIterator(data) {
      if (linter.getOption("iterator")) {
        return;
      }
      if (data.name === "__iterator__") {
        linter.warn("W103", {
          line: data.line,
          char: data.char,
          data: [data.name]
        });
      }
    });
    linter.on("Identifier", function style_scanCamelCase(data) {
      if (!linter.getOption("camelcase")) {
        return;
      }
      if (data.name.replace(/^_+|_+$/g, "").indexOf("_") > -1 && !data.name.match(/^[A-Z0-9_]*$/)) {
        linter.warn("W106", {
          line: data.line,
          char: data.from,
          data: [data.name]
        });
      }
    });
    linter.on("String", function style_scanQuotes(data) {
      var quotmark = linter.getOption("quotmark");
      var code;
      if (!quotmark) {
        return;
      }
      if (quotmark === "single" && data.quote !== "'") {
        code = "W109";
      }
      if (quotmark === "double" && data.quote !== "\"") {
        code = "W108";
      }
      if (quotmark === true) {
        if (!linter.getCache("quotmark")) {
          linter.setCache("quotmark", data.quote);
        }
        if (linter.getCache("quotmark") !== data.quote) {
          code = "W110";
        }
      }
      if (code) {
        linter.warn(code, {
          line: data.line,
          char: data.char
        });
      }
    });
    linter.on("Number", function style_scanNumbers(data) {
      if (data.value.charAt(0) === ".") {
        linter.warn("W008", {
          line: data.line,
          char: data.char,
          data: [data.value]
        });
      }
      if (data.value.substr(data.value.length - 1) === ".") {
        linter.warn("W047", {
          line: data.line,
          char: data.char,
          data: [data.value]
        });
      }
      if (/^00+/.test(data.value)) {
        linter.warn("W046", {
          line: data.line,
          char: data.char,
          data: [data.value]
        });
      }
    });
    linter.on("String", function style_scanJavaScriptURLs(data) {
      var re = /^(?:javascript|jscript|ecmascript|vbscript|livescript)\s*:/i;
      if (linter.getOption("scripturl")) {
        return;
      }
      if (re.test(data.value)) {
        linter.warn("W107", {
          line: data.line,
          char: data.char
        });
      }
    });
  }
  exports_1("register", register);
  return {
    setters: [],
    execute: function() {
      ;
    }
  };
});

"use strict";
System.register("src/mode/javascript/options.js", [], function(exports_1) {
  var bool,
      val,
      inverted,
      validNames,
      renamed,
      removed,
      noenforceall;
  return {
    setters: [],
    execute: function() {
      exports_1("bool", bool = {
        enforcing: {
          bitwise: true,
          freeze: true,
          camelcase: true,
          curly: true,
          eqeqeq: true,
          futurehostile: true,
          notypeof: true,
          es3: true,
          es5: true,
          forin: true,
          funcscope: true,
          immed: true,
          iterator: true,
          newcap: true,
          noarg: true,
          nocomma: true,
          noempty: true,
          nonbsp: true,
          nonew: true,
          undef: true,
          singleGroups: false,
          varstmt: false,
          enforceall: false
        },
        relaxing: {
          asi: true,
          multistr: true,
          debug: true,
          boss: true,
          evil: true,
          globalstrict: true,
          plusplus: true,
          proto: true,
          scripturl: true,
          sub: true,
          supernew: true,
          laxbreak: true,
          laxcomma: true,
          validthis: true,
          withstmt: true,
          moz: true,
          noyield: true,
          eqnull: true,
          lastsemic: true,
          loopfunc: true,
          expr: true,
          esnext: true,
          elision: true
        },
        environments: {
          mootools: true,
          couch: true,
          jasmine: true,
          jquery: true,
          node: true,
          qunit: true,
          rhino: true,
          shelljs: true,
          prototypejs: true,
          yui: true,
          mocha: true,
          module: true,
          wsh: true,
          worker: true,
          nonstandard: true,
          browser: true,
          browserify: true,
          devel: true,
          dojo: true,
          typed: true,
          phantom: true
        },
        obsolete: {
          onecase: true,
          regexp: true,
          regexdash: true
        }
      });
      exports_1("val", val = {
        maxlen: false,
        indent: false,
        maxerr: false,
        predef: false,
        globals: false,
        quotmark: false,
        scope: false,
        maxstatements: false,
        maxdepth: false,
        maxparams: false,
        maxcomplexity: false,
        shadow: false,
        strict: true,
        unused: true,
        latedef: false,
        ignore: false,
        ignoreDelimiters: false,
        esversion: 5
      });
      exports_1("inverted", inverted = {
        bitwise: true,
        forin: true,
        newcap: true,
        plusplus: true,
        regexp: true,
        undef: true,
        eqeqeq: true,
        strict: true
      });
      exports_1("validNames", validNames = Object.keys(val).concat(Object.keys(bool.relaxing)).concat(Object.keys(bool.enforcing)).concat(Object.keys(bool.obsolete)).concat(Object.keys(bool.environments)));
      exports_1("renamed", renamed = {
        eqeq: "eqeqeq",
        windows: "wsh",
        sloppy: "strict"
      });
      exports_1("removed", removed = {
        nomen: true,
        onevar: true,
        passfail: true,
        white: true,
        gcl: true,
        smarttabs: true,
        trailing: true
      });
      exports_1("noenforceall", noenforceall = {
        varstmt: true,
        strict: true
      });
    }
  };
});

System.register("src/mode/javascript/EventEmitter.js", [], function(exports_1) {
  var EventEmitter;
  function isFunction(arg) {
    return typeof arg === 'function';
  }
  function isNumber(arg) {
    return typeof arg === 'number';
  }
  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }
  function isUndefined(arg) {
    return arg === void 0;
  }
  return {
    setters: [],
    execute: function() {
      EventEmitter = (function() {
        function EventEmitter() {
          this.once = function(type, listener) {
            if (!isFunction(listener))
              throw TypeError('listener must be a function');
            var fired = false;
            function g() {
              this.removeListener(type, g);
              if (!fired) {
                fired = true;
                listener.apply(this, arguments);
              }
            }
            g['listener'] = listener;
            this.on(type, g);
            return this;
          };
          this._events = this._events || {};
          this._maxListeners = this._maxListeners || undefined;
        }
        EventEmitter.prototype.setMaxListeners = function(n) {
          if (!isNumber(n) || n < 0 || isNaN(n))
            throw TypeError('n must be a positive number');
          this._maxListeners = n;
          return this;
        };
        EventEmitter.prototype.emit = function(type, event, listener) {
          var er,
              handler,
              len,
              args,
              i,
              listeners;
          if (!this._events)
            this._events = {};
          if (type === 'error') {
            if (!this._events.error || (isObject(this._events.error) && !this._events.error.length)) {
              er = arguments[1];
              if (er instanceof Error) {
                throw er;
              }
              throw TypeError('Uncaught, unspecified "error" event.');
            }
          }
          handler = this._events[type];
          if (isUndefined(handler))
            return false;
          if (isFunction(handler)) {
            switch (arguments.length) {
              case 1:
                handler.call(this);
                break;
              case 2:
                handler.call(this, arguments[1]);
                break;
              case 3:
                handler.call(this, arguments[1], arguments[2]);
                break;
              default:
                len = arguments.length;
                args = new Array(len - 1);
                for (i = 1; i < len; i++)
                  args[i - 1] = arguments[i];
                handler.apply(this, args);
            }
          } else if (isObject(handler)) {
            len = arguments.length;
            args = new Array(len - 1);
            for (i = 1; i < len; i++)
              args[i - 1] = arguments[i];
            listeners = handler.slice();
            len = listeners.length;
            for (i = 0; i < len; i++)
              listeners[i].apply(this, args);
          }
          return true;
        };
        EventEmitter.prototype.on = function(type, listener) {
          var m;
          if (!isFunction(listener))
            throw TypeError('listener must be a function');
          if (!this._events)
            this._events = {};
          if (this._events.newListener)
            this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);
          if (!this._events[type])
            this._events[type] = listener;
          else if (isObject(this._events[type]))
            this._events[type].push(listener);
          else
            this._events[type] = [this._events[type], listener];
          if (isObject(this._events[type]) && !this._events[type].warned) {
            var m;
            if (!isUndefined(this._maxListeners)) {
              m = this._maxListeners;
            } else {
              m = EventEmitter.defaultMaxListeners;
            }
            if (m && m > 0 && this._events[type].length > m) {
              this._events[type].warned = true;
              console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
              if (typeof console.trace === 'function') {
                console.trace();
              }
            }
          }
          return this;
        };
        EventEmitter.prototype.off = function(type, listener) {
          var list,
              position,
              length,
              i;
          if (!isFunction(listener))
            throw TypeError('listener must be a function');
          if (!this._events || !this._events[type])
            return this;
          list = this._events[type];
          length = list.length;
          position = -1;
          if (list === listener || (isFunction(list.listener) && list.listener === listener)) {
            delete this._events[type];
            if (this._events.removeListener)
              this.emit('removeListener', type, listener);
          } else if (isObject(list)) {
            for (i = length; i-- > 0; ) {
              if (list[i] === listener || (list[i].listener && list[i].listener === listener)) {
                position = i;
                break;
              }
            }
            if (position < 0)
              return this;
            if (list.length === 1) {
              list.length = 0;
              delete this._events[type];
            } else {
              list.splice(position, 1);
            }
            if (this._events.removeListener)
              this.emit('removeListener', type, listener);
          }
          return this;
        };
        EventEmitter.prototype.removeAllListeners = function(type) {
          var key,
              listeners;
          if (!this._events)
            return this;
          if (!this._events.removeListener) {
            if (arguments.length === 0)
              this._events = {};
            else if (this._events[type])
              delete this._events[type];
            return this;
          }
          if (arguments.length === 0) {
            for (key in this._events) {
              if (key === 'removeListener')
                continue;
              this.removeAllListeners(key);
            }
            this.removeAllListeners('removeListener');
            this._events = {};
            return this;
          }
          listeners = this._events[type];
          if (isFunction(listeners)) {
            this.off(type, listeners);
          } else {
            while (listeners.length)
              this.off(type, listeners[listeners.length - 1]);
          }
          delete this._events[type];
          return this;
        };
        EventEmitter.prototype.listeners = function(type) {
          var ret;
          if (!this._events || !this._events[type])
            ret = [];
          else if (isFunction(this._events[type]))
            ret = [this._events[type]];
          else
            ret = this._events[type].slice();
          return ret;
        };
        EventEmitter.listenerCount = function(emitter, type) {
          var ret;
          if (!emitter._events || !emitter._events[type])
            ret = 0;
          else if (isFunction(emitter._events[type]))
            ret = 1;
          else
            ret = emitter._events[type].length;
          return ret;
        };
        EventEmitter.defaultMaxListeners = 10;
        return EventEmitter;
      })();
      exports_1("default", EventEmitter);
    }
  };
});

System.register("src/fp/sliceArgs.js", [], function(exports_1) {
  function sliceArgs(args, start, end) {
    if (start === void 0) {
      start = 0;
    }
    if (end === void 0) {
      end = args.length;
    }
    var sliced = [];
    for (var i = start; i < end; i++) {
      sliced.push(args[i]);
    }
    return sliced;
  }
  exports_1("default", sliceArgs);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/fp/findLastIndex.js", [], function(exports_1) {
  function findLastIndex(xs, callback) {
    for (var i = xs.length - 1; i >= 0; i--) {
      var x = xs[i];
      if (callback(x)) {
        return i;
      }
    }
    return -1;
  }
  exports_1("default", findLastIndex);
  return {
    setters: [],
    execute: function() {}
  };
});

"use strict";
System.register("src/mode/javascript/scope-manager.js", ["./EventEmitter", "../../fp/has", "../../fp/sliceArgs", "../../fp/findLastIndex"], function(exports_1) {
  var EventEmitter_1,
      has_1,
      sliceArgs_1,
      findLastIndex_1;
  var marker,
      scopeManager;
  return {
    setters: [function(EventEmitter_1_1) {
      EventEmitter_1 = EventEmitter_1_1;
    }, function(has_1_1) {
      has_1 = has_1_1;
    }, function(sliceArgs_1_1) {
      sliceArgs_1 = sliceArgs_1_1;
    }, function(findLastIndex_1_1) {
      findLastIndex_1 = findLastIndex_1_1;
    }],
    execute: function() {
      marker = {};
      exports_1("scopeManager", scopeManager = function(state, predefined, exported, declared) {
        var _current;
        var _scopeStack = [];
        function _newScope(type) {
          _current = {
            "(labels)": Object.create(null),
            "(usages)": Object.create(null),
            "(breakLabels)": Object.create(null),
            "(parent)": _current,
            "(type)": type,
            "(params)": (type === "functionparams" || type === "catchparams") ? [] : null
          };
          _scopeStack.push(_current);
        }
        _newScope("global");
        _current["(predefined)"] = predefined;
        var _currentFunctBody = _current;
        var usedPredefinedAndGlobals = Object.create(null);
        var impliedGlobals = Object.create(null);
        var unuseds = [];
        var emitter = new EventEmitter_1.default();
        function warning(code, token, unused1, unused2) {
          emitter.emit("warning", {
            code: code,
            token: token,
            data: sliceArgs_1.default(arguments, 2)
          });
        }
        function error(code, token, unused) {
          emitter.emit("warning", {
            code: code,
            token: token,
            data: sliceArgs_1.default(arguments, 2)
          });
        }
        function _setupUsages(labelName) {
          if (!_current["(usages)"][labelName]) {
            _current["(usages)"][labelName] = {
              "(modified)": [],
              "(reassigned)": [],
              "(tokens)": []
            };
          }
        }
        var _getUnusedOption = function(unused_opt) {
          if (unused_opt === undefined) {
            unused_opt = state.option.unused;
          }
          if (unused_opt === true) {
            unused_opt = "last-param";
          }
          return unused_opt;
        };
        var _warnUnused = function(name, tkn, type, unused_opt) {
          var line = tkn.line;
          var chr = tkn.from;
          var raw_name = tkn.raw_text || name;
          unused_opt = _getUnusedOption(unused_opt);
          var warnable_types = {
            "vars": ["var"],
            "last-param": ["var", "param"],
            "strict": ["var", "param", "last-param"]
          };
          if (unused_opt) {
            if (warnable_types[unused_opt] && warnable_types[unused_opt].indexOf(type) !== -1) {
              warning("W098", {
                line: line,
                from: chr
              }, raw_name);
            }
          }
          if (unused_opt || type === "var") {
            unuseds.push({
              name: name,
              line: line,
              character: chr
            });
          }
        };
        function _checkForUnused() {
          if (_current["(type)"] === "functionparams") {
            _checkParams();
            return;
          }
          var curentLabels = _current["(labels)"];
          for (var labelName in curentLabels) {
            if (curentLabels[labelName]) {
              if (curentLabels[labelName]["(type)"] !== "exception" && curentLabels[labelName]["(unused)"]) {
                _warnUnused(labelName, curentLabels[labelName]["(token)"], "var");
              }
            }
          }
        }
        function _checkParams() {
          var params = _current["(params)"];
          if (!params) {
            return;
          }
          var param = params.pop();
          var unused_opt;
          while (param) {
            var label = _current["(labels)"][param];
            unused_opt = _getUnusedOption(state.funct["(unusedOption)"]);
            if (param === "undefined")
              return;
            if (label["(unused)"]) {
              _warnUnused(param, label["(token)"], "param", state.funct["(unusedOption)"]);
            } else if (unused_opt === "last-param") {
              return;
            }
            param = params.pop();
          }
        }
        function _getLabel(labelName) {
          for (var i = _scopeStack.length - 1; i >= 0; --i) {
            var scopeLabels = _scopeStack[i]["(labels)"];
            if (scopeLabels[labelName]) {
              return scopeLabels;
            }
          }
        }
        function usedSoFarInCurrentFunction(labelName) {
          for (var i = _scopeStack.length - 1; i >= 0; i--) {
            var current = _scopeStack[i];
            if (current["(usages)"][labelName]) {
              return current["(usages)"][labelName];
            }
            if (current === _currentFunctBody) {
              break;
            }
          }
          return false;
        }
        function _checkOuterShadow(labelName, token, unused) {
          if (state.option.shadow !== "outer") {
            return;
          }
          var isGlobal = _currentFunctBody["(type)"] === "global",
              isNewFunction = _current["(type)"] === "functionparams";
          var outsideCurrentFunction = !isGlobal;
          for (var i = 0; i < _scopeStack.length; i++) {
            var stackItem = _scopeStack[i];
            if (!isNewFunction && _scopeStack[i + 1] === _currentFunctBody) {
              outsideCurrentFunction = false;
            }
            if (outsideCurrentFunction && stackItem["(labels)"][labelName]) {
              warning("W123", token, labelName);
            }
            if (stackItem["(breakLabels)"][labelName]) {
              warning("W123", token, labelName);
            }
          }
        }
        function _latedefWarning(type, labelName, token) {
          if (state.option.latedef) {
            if ((state.option.latedef === true && type === "function") || type !== "function") {
              warning("W003", token, labelName);
            }
          }
        }
        var scopeManagerInst = {
          on: function(names, listener) {
            names.split(" ").forEach(function(name) {
              emitter.on(name, listener);
            });
          },
          isPredefined: function(labelName) {
            return !this.has(labelName) && has_1.default(_scopeStack[0]["(predefined)"], labelName);
          },
          stack: function(type) {
            var previousScope = _current;
            _newScope(type);
            if (!type && previousScope["(type)"] === "functionparams") {
              _current["(isFuncBody)"] = true;
              _current["(context)"] = _currentFunctBody;
              _currentFunctBody = _current;
            }
          },
          unstack: function() {
            var subScope = _scopeStack.length > 1 ? _scopeStack[_scopeStack.length - 2] : null;
            var isUnstackingFunctionBody = _current === _currentFunctBody,
                isUnstackingFunctionParams = _current["(type)"] === "functionparams",
                isUnstackingFunctionOuter = _current["(type)"] === "functionouter";
            var i,
                j;
            var currentUsages = _current["(usages)"];
            var currentLabels = _current["(labels)"];
            var usedLabelNameList = Object.keys(currentUsages);
            if (currentUsages.__proto__ && usedLabelNameList.indexOf("__proto__") === -1) {
              usedLabelNameList.push("__proto__");
            }
            for (i = 0; i < usedLabelNameList.length; i++) {
              var usedLabelName = usedLabelNameList[i];
              var usage = currentUsages[usedLabelName];
              var usedLabel = currentLabels[usedLabelName];
              if (usedLabel) {
                var usedLabelType = usedLabel["(type)"];
                if (usedLabel["(useOutsideOfScope)"] && !state.option.funcscope) {
                  var usedTokens = usage["(tokens)"];
                  if (usedTokens) {
                    for (j = 0; j < usedTokens.length; j++) {
                      if (usedLabel["(function)"] === usedTokens[j]["(function)"]) {
                        error("W038", usedTokens[j], usedLabelName);
                      }
                    }
                  }
                }
                _current["(labels)"][usedLabelName]["(unused)"] = false;
                if (usedLabelType === "const" && usage["(modified)"]) {
                  for (j = 0; j < usage["(modified)"].length; j++) {
                    error("E013", usage["(modified)"][j], usedLabelName);
                  }
                }
                if ((usedLabelType === "function" || usedLabelType === "class") && usage["(reassigned)"]) {
                  for (j = 0; j < usage["(reassigned)"].length; j++) {
                    if (!usage["(reassigned)"][j].ignoreW021) {
                      warning("W021", usage["(reassigned)"][j], usedLabelName, usedLabelType);
                    }
                  }
                }
                continue;
              }
              if (isUnstackingFunctionOuter) {
                state.funct["(isCapturing)"] = true;
              }
              if (subScope) {
                if (!subScope["(usages)"][usedLabelName]) {
                  subScope["(usages)"][usedLabelName] = usage;
                  if (isUnstackingFunctionBody) {
                    subScope["(usages)"][usedLabelName]["(onlyUsedSubFunction)"] = true;
                  }
                } else {
                  var subScopeUsage = subScope["(usages)"][usedLabelName];
                  subScopeUsage["(modified)"] = subScopeUsage["(modified)"].concat(usage["(modified)"]);
                  subScopeUsage["(tokens)"] = subScopeUsage["(tokens)"].concat(usage["(tokens)"]);
                  subScopeUsage["(reassigned)"] = subScopeUsage["(reassigned)"].concat(usage["(reassigned)"]);
                  subScopeUsage["(onlyUsedSubFunction)"] = false;
                }
              } else {
                if (typeof _current["(predefined)"][usedLabelName] === "boolean") {
                  delete declared[usedLabelName];
                  usedPredefinedAndGlobals[usedLabelName] = marker;
                  if (_current["(predefined)"][usedLabelName] === false && usage["(reassigned)"]) {
                    for (j = 0; j < usage["(reassigned)"].length; j++) {
                      if (!usage["(reassigned)"][j].ignoreW020) {
                        warning("W020", usage["(reassigned)"][j]);
                      }
                    }
                  }
                } else {
                  if (usage["(tokens)"]) {
                    for (j = 0; j < usage["(tokens)"].length; j++) {
                      var undefinedToken = usage["(tokens)"][j];
                      if (!undefinedToken.forgiveUndef) {
                        if (state.option.undef && !undefinedToken.ignoreUndef) {
                          warning("W117", undefinedToken, usedLabelName);
                        }
                        if (impliedGlobals[usedLabelName]) {
                          impliedGlobals[usedLabelName].line.push(undefinedToken.line);
                        } else {
                          impliedGlobals[usedLabelName] = {
                            name: usedLabelName,
                            line: [undefinedToken.line]
                          };
                        }
                      }
                    }
                  }
                }
              }
            }
            if (!subScope) {
              Object.keys(declared).forEach(function(labelNotUsed) {
                _warnUnused(labelNotUsed, declared[labelNotUsed], "var");
              });
            }
            if (subScope && !isUnstackingFunctionBody && !isUnstackingFunctionParams && !isUnstackingFunctionOuter) {
              var labelNames = Object.keys(currentLabels);
              for (i = 0; i < labelNames.length; i++) {
                var defLabelName = labelNames[i];
                var defLabel = currentLabels[defLabelName];
                if (!defLabel["(blockscoped)"] && defLabel["(type)"] !== "exception") {
                  var shadowed = subScope["(labels)"][defLabelName];
                  if (shadowed) {
                    shadowed["(unused)"] &= defLabel["(unused)"];
                  } else {
                    defLabel["(useOutsideOfScope)"] = _currentFunctBody["(type)"] !== "global" && !this.funct.has(defLabelName, {excludeCurrent: true});
                    subScope["(labels)"][defLabelName] = defLabel;
                  }
                  delete currentLabels[defLabelName];
                }
              }
            }
            _checkForUnused();
            _scopeStack.pop();
            if (isUnstackingFunctionBody) {
              _currentFunctBody = _scopeStack[findLastIndex_1.default(_scopeStack, function(scope) {
                return scope["(isFuncBody)"] || scope["(type)"] === "global";
              })];
            }
            _current = subScope;
          },
          addParam: function(labelName, token, type) {
            type = type || "param";
            if (type === "exception") {
              var previouslyDefinedLabelType = this.funct.labeltype(labelName);
              if (previouslyDefinedLabelType && previouslyDefinedLabelType !== "exception") {
                if (!state.option.node) {
                  warning("W002", state.tokens.next, labelName);
                }
              }
            }
            if (has_1.default(_current["(labels)"], labelName)) {
              _current["(labels)"][labelName].duplicated = true;
            } else {
              _checkOuterShadow(labelName, token, type);
              _current["(labels)"][labelName] = {
                "(type)": type,
                "(token)": token,
                "(unused)": true
              };
              _current["(params)"].push(labelName);
            }
            if (has_1.default(_current["(usages)"], labelName)) {
              var usage = _current["(usages)"][labelName];
              if (usage["(onlyUsedSubFunction)"]) {
                _latedefWarning(type, labelName, token);
              } else {
                warning("E056", token, labelName, type);
              }
            }
          },
          validateParams: function() {
            if (_currentFunctBody["(type)"] === "global") {
              return;
            }
            var isStrict = state.isStrict();
            var currentFunctParamScope = _currentFunctBody["(parent)"];
            if (!currentFunctParamScope["(params)"]) {
              return;
            }
            currentFunctParamScope["(params)"].forEach(function(labelName) {
              var label = currentFunctParamScope["(labels)"][labelName];
              if (label && label.duplicated) {
                if (isStrict) {
                  warning("E011", label["(token)"], labelName);
                } else if (state.option.shadow !== true) {
                  warning("W004", label["(token)"], labelName);
                }
              }
            });
          },
          getUsedOrDefinedGlobals: function() {
            var list = Object.keys(usedPredefinedAndGlobals);
            if (usedPredefinedAndGlobals.__proto__ === marker && list.indexOf("__proto__") === -1) {
              list.push("__proto__");
            }
            return list;
          },
          getImpliedGlobals: function() {
            var values = values(impliedGlobals);
            var hasProto = false;
            if (impliedGlobals.__proto__) {
              hasProto = values.some(function(value) {
                return value.name === "__proto__";
              });
              if (!hasProto) {
                values.push(impliedGlobals.__proto__);
              }
            }
            return values;
          },
          getUnuseds: function() {
            return unuseds;
          },
          has: function(labelName, unused) {
            return Boolean(_getLabel(labelName));
          },
          labeltype: function(labelName) {
            var scopeLabels = _getLabel(labelName);
            if (scopeLabels) {
              return scopeLabels[labelName]["(type)"];
            }
            return null;
          },
          addExported: function(labelName) {
            var globalLabels = _scopeStack[0]["(labels)"];
            if (has_1.default(declared, labelName)) {
              delete declared[labelName];
            } else if (has_1.default(globalLabels, labelName)) {
              globalLabels[labelName]["(unused)"] = false;
            } else {
              for (var i = 1; i < _scopeStack.length; i++) {
                var scope = _scopeStack[i];
                if (!scope["(type)"]) {
                  if (has_1.default(scope["(labels)"], labelName) && !scope["(labels)"][labelName]["(blockscoped)"]) {
                    scope["(labels)"][labelName]["(unused)"] = false;
                    return;
                  }
                } else {
                  break;
                }
              }
              exported[labelName] = true;
            }
          },
          setExported: function(labelName, token) {
            this.block.use(labelName, token);
          },
          addlabel: function(labelName, opts) {
            var type = opts.type;
            var token = opts.token;
            var isblockscoped = type === "let" || type === "const" || type === "class";
            var isexported = (isblockscoped ? _current : _currentFunctBody)["(type)"] === "global" && has_1.default(exported, labelName);
            _checkOuterShadow(labelName, token, type);
            if (isblockscoped) {
              var declaredInCurrentScope = _current["(labels)"][labelName];
              if (!declaredInCurrentScope && _current === _currentFunctBody && _current["(type)"] !== "global") {
                declaredInCurrentScope = !!_currentFunctBody["(parent)"]["(labels)"][labelName];
              }
              if (!declaredInCurrentScope && _current["(usages)"][labelName]) {
                var usage = _current["(usages)"][labelName];
                if (usage["(onlyUsedSubFunction)"]) {
                  _latedefWarning(type, labelName, token);
                } else {
                  warning("E056", token, labelName, type);
                }
              }
              if (declaredInCurrentScope) {
                warning("E011", token, labelName);
              } else if (state.option.shadow === "outer") {
                if (scopeManagerInst.funct.has(labelName)) {
                  warning("W004", token, labelName);
                }
              }
              scopeManagerInst.block.add(labelName, type, token, !isexported);
            } else {
              var declaredInCurrentFunctionScope = scopeManagerInst.funct.has(labelName);
              if (!declaredInCurrentFunctionScope && usedSoFarInCurrentFunction(labelName)) {
                _latedefWarning(type, labelName, token);
              }
              if (scopeManagerInst.funct.has(labelName, {onlyBlockscoped: true})) {
                warning("E011", token, labelName);
              } else if (state.option.shadow !== true) {
                if (declaredInCurrentFunctionScope && labelName !== "__proto__") {
                  if (_currentFunctBody["(type)"] !== "global") {
                    warning("W004", token, labelName);
                  }
                }
              }
              scopeManagerInst.funct.add(labelName, type, token, !isexported);
              if (_currentFunctBody["(type)"] === "global") {
                usedPredefinedAndGlobals[labelName] = marker;
              }
            }
          },
          funct: {
            labeltype: function(labelName, options) {
              var onlyBlockscoped = options && options.onlyBlockscoped;
              var excludeParams = options && options.excludeParams;
              var currentScopeIndex = _scopeStack.length - (options && options.excludeCurrent ? 2 : 1);
              for (var i = currentScopeIndex; i >= 0; i--) {
                var current = _scopeStack[i];
                if (current["(labels)"][labelName] && (!onlyBlockscoped || current["(labels)"][labelName]["(blockscoped)"])) {
                  return current["(labels)"][labelName]["(type)"];
                }
                var scopeCheck = excludeParams ? _scopeStack[i - 1] : current;
                if (scopeCheck && scopeCheck["(type)"] === "functionparams") {
                  return null;
                }
              }
              return null;
            },
            hasBreakLabel: function(labelName) {
              for (var i = _scopeStack.length - 1; i >= 0; i--) {
                var current = _scopeStack[i];
                if (current["(breakLabels)"][labelName]) {
                  return true;
                }
                if (current["(type)"] === "functionparams") {
                  return false;
                }
              }
              return false;
            },
            has: function(labelName, options) {
              return Boolean(this.labeltype(labelName, options));
            },
            add: function(labelName, type, tok, unused) {
              _current["(labels)"][labelName] = {
                "(type)": type,
                "(token)": tok,
                "(blockscoped)": false,
                "(function)": _currentFunctBody,
                "(unused)": unused
              };
            }
          },
          block: {
            isGlobal: function() {
              return _current["(type)"] === "global";
            },
            use: function(labelName, token) {
              var paramScope = _currentFunctBody["(parent)"];
              if (paramScope && paramScope["(labels)"][labelName] && paramScope["(labels)"][labelName]["(type)"] === "param") {
                if (!scopeManagerInst.funct.has(labelName, {
                  excludeParams: true,
                  onlyBlockscoped: true
                })) {
                  paramScope["(labels)"][labelName]["(unused)"] = false;
                }
              }
              if (token && (state.ignored.W117 || state.option.undef === false)) {
                token.ignoreUndef = true;
              }
              _setupUsages(labelName);
              if (token) {
                token["(function)"] = _currentFunctBody;
                _current["(usages)"][labelName]["(tokens)"].push(token);
              }
            },
            reassign: function(labelName, token) {
              token.ignoreW020 = state.ignored.W020;
              token.ignoreW021 = state.ignored.W021;
              this.modify(labelName, token);
              _current["(usages)"][labelName]["(reassigned)"].push(token);
            },
            modify: function(labelName, token) {
              _setupUsages(labelName);
              _current["(usages)"][labelName]["(modified)"].push(token);
            },
            add: function(labelName, type, tok, unused) {
              _current["(labels)"][labelName] = {
                "(type)": type,
                "(token)": tok,
                "(blockscoped)": true,
                "(unused)": unused
              };
            },
            addBreakLabel: function(labelName, opts) {
              var token = opts.token;
              if (scopeManagerInst.funct.hasBreakLabel(labelName)) {
                warning("E011", token, labelName);
              } else if (state.option.shadow === "outer") {
                if (scopeManagerInst.funct.has(labelName)) {
                  warning("W004", token, labelName);
                } else {
                  _checkOuterShadow(labelName, token);
                }
              }
              _current["(breakLabels)"][labelName] = token;
            }
          }
        };
        return scopeManagerInst;
      });
    }
  };
});

System.register("src/fp/contains.js", [], function(exports_1) {
  function contains(xs, x) {
    for (var i = 0,
        iLength = xs.length; i < iLength; i++) {
      if (xs[i] === x) {
        return true;
      }
    }
    return false;
  }
  exports_1("default", contains);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/fp/clone.js", [], function(exports_1) {
  function clone(x) {
    var keys = Object.keys(x);
    var result = {};
    for (var i = 0,
        iLength = keys.length; i < iLength; i++) {
      var key = keys[i];
      var prop = x[key];
      result[key] = prop;
    }
    return result;
  }
  exports_1("default", clone);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/fp/each.js", [], function(exports_1) {
  function each(obj, callback) {
    if (!obj) {
      return;
    }
    var keys = Object.keys(obj);
    for (var i = 0,
        iLength = keys.length; i < iLength; i++) {
      var key = keys[i];
      var value = obj[key];
      callback(value, key);
    }
  }
  exports_1("default", each);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/fp/extend.js", [], function(exports_1) {
  function extend(obj, x) {
    var keys = Object.keys(x);
    for (var i = 0,
        iLength = keys.length; i < iLength; i++) {
      var key = keys[i];
      var prop = x[key];
      obj[key] = prop;
    }
    return obj;
  }
  exports_1("default", extend);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/fp/has.js", [], function(exports_1) {
  function has(obj, v) {
    if (typeof v === 'undefined') {
      return false;
    }
    if (typeof v !== 'string') {
      console.warn("has(obj, v): v must be a string, v => " + v);
    }
    if (obj && obj.hasOwnProperty) {
      return obj.hasOwnProperty(v);
    } else {
      return false;
    }
  }
  exports_1("default", has);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/fp/isEmpty.js", [], function(exports_1) {
  function isEmpty(xs) {
    return Object.keys(xs).length === 0;
  }
  exports_1("default", isEmpty);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/fp/isNumber.js", [], function(exports_1) {
  function isNumber(value) {
    return typeof value === 'number';
  }
  exports_1("default", isNumber);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/fp/reject.js", [], function(exports_1) {
  function reject(xs, callback) {
    var result = [];
    for (var i = 0,
        iLength = xs.length; i < iLength; i++) {
      var x = xs[i];
      if (!callback(x)) {
        result.push(x);
      }
    }
    return result;
  }
  exports_1("default", reject);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/fp/zip.js", [], function(exports_1) {
  function zip(xs, ys) {
    var zs;
    for (var i = 0,
        iLength = xs.length; i < iLength; i++) {
      var x = xs[i];
      var y = xs[i];
      var z = [x, y];
      zs.push(z);
    }
    return zs;
  }
  exports_1("default", zip);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/mode/javascript/jshint.js", ["./EventEmitter", "./vars", "./messages", "./lex", "./reg", "./state", "./style", "./options", "./scope-manager", "../../fp/contains", "../../fp/clone", "../../fp/each", "../../fp/extend", "../../fp/has", "../../fp/isEmpty", "../../fp/isNumber", "../../fp/reject", "../../fp/zip"], function(exports_1) {
  var EventEmitter_1,
      vars_1,
      messages_1,
      lex_1,
      reg_1,
      state_1,
      style_1,
      options_1,
      scope_manager_1,
      contains_1,
      clone_1,
      each_1,
      extend_1,
      has_1,
      isEmpty_1,
      isNumber_1,
      reject_1,
      zip_1;
  var JSHINT;
  return {
    setters: [function(EventEmitter_1_1) {
      EventEmitter_1 = EventEmitter_1_1;
    }, function(vars_1_1) {
      vars_1 = vars_1_1;
    }, function(messages_1_1) {
      messages_1 = messages_1_1;
    }, function(lex_1_1) {
      lex_1 = lex_1_1;
    }, function(reg_1_1) {
      reg_1 = reg_1_1;
    }, function(state_1_1) {
      state_1 = state_1_1;
    }, function(style_1_1) {
      style_1 = style_1_1;
    }, function(options_1_1) {
      options_1 = options_1_1;
    }, function(scope_manager_1_1) {
      scope_manager_1 = scope_manager_1_1;
    }, function(contains_1_1) {
      contains_1 = contains_1_1;
    }, function(clone_1_1) {
      clone_1 = clone_1_1;
    }, function(each_1_1) {
      each_1 = each_1_1;
    }, function(extend_1_1) {
      extend_1 = extend_1_1;
    }, function(has_1_1) {
      has_1 = has_1_1;
    }, function(isEmpty_1_1) {
      isEmpty_1 = isEmpty_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }, function(reject_1_1) {
      reject_1 = reject_1_1;
    }, function(zip_1_1) {
      zip_1 = zip_1_1;
    }],
    execute: function() {
      exports_1("JSHINT", JSHINT = (function() {
        "use strict";
        var api,
            bang = {
              "<": true,
              "<=": true,
              "==": true,
              "===": true,
              "!==": true,
              "!=": true,
              ">": true,
              ">=": true,
              "+": true,
              "-": true,
              "*": true,
              "/": true,
              "%": true
            },
            declared,
            functionicity = ["closure", "exception", "global", "label", "outer", "unused", "var"],
            functions,
            inblock,
            indent,
            lookahead,
            lex,
            member,
            membersOnly,
            predefined,
            stack,
            urls,
            extraModules = [],
            emitter = new EventEmitter_1.default();
        function checkOption(name, t) {
          name = name.trim();
          if (/^[+-]W\d{3}$/g.test(name)) {
            return true;
          }
          if (options_1.validNames.indexOf(name) === -1) {
            if (t.type !== "jslint" && !has_1.default(options_1.removed, name)) {
              error("E001", t, name);
              return false;
            }
          }
          return true;
        }
        function isString(obj) {
          return Object.prototype.toString.call(obj) === "[object String]";
        }
        function isIdentifier(tkn, value) {
          if (!tkn)
            return false;
          if (!tkn.identifier || tkn.value !== value)
            return false;
          return true;
        }
        function isReserved(token) {
          if (!token.reserved) {
            return false;
          }
          var meta = token.meta;
          if (meta && meta.isFutureReservedWord && state_1.state.inES5()) {
            if (!meta.es5) {
              return false;
            }
            if (meta.strictOnly) {
              if (!state_1.state.option.strict && !state_1.state.isStrict()) {
                return false;
              }
            }
            if (token.isProperty) {
              return false;
            }
          }
          return true;
        }
        function supplant(str, data) {
          return str.replace(/\{([^{}]*)\}/g, function(a, b) {
            var r = data[b];
            return typeof r === "string" || typeof r === "number" ? r : a;
          });
        }
        function combine(dest, src) {
          Object.keys(src).forEach(function(name) {
            if (has_1.default(JSHINT.blacklist, name))
              return;
            dest[name] = src[name];
          });
        }
        function processenforceall() {
          if (state_1.state.option.enforceall) {
            for (var enforceopt in options_1.bool.enforcing) {
              if (state_1.state.option[enforceopt] === void 0 && !options_1.noenforceall[enforceopt]) {
                state_1.state.option[enforceopt] = true;
              }
            }
            for (var relaxopt in options_1.bool.relaxing) {
              if (state_1.state.option[relaxopt] === void 0) {
                state_1.state.option[relaxopt] = false;
              }
            }
          }
        }
        function assume() {
          processenforceall();
          if (!state_1.state.option.esversion && !state_1.state.option.moz) {
            if (state_1.state.option.es3) {
              state_1.state.option.esversion = 3;
            } else if (state_1.state.option.esnext) {
              state_1.state.option.esversion = 6;
            } else {
              state_1.state.option.esversion = 5;
            }
          }
          if (state_1.state.inES5()) {
            combine(predefined, vars_1.ecmaIdentifiers[5]);
          }
          if (state_1.state.inES6()) {
            combine(predefined, vars_1.ecmaIdentifiers[6]);
          }
          if (state_1.state.option.strict === "global" && "globalstrict" in state_1.state.option) {
            quit("E059", state_1.state.tokens.next, "strict", "globalstrict");
          }
          if (state_1.state.option.module) {
            if (state_1.state.option.strict === true) {
              state_1.state.option.strict = "global";
            }
            if (!state_1.state.inES6()) {
              warning("W134", state_1.state.tokens.next, "module", 6);
            }
          }
          if (state_1.state.option.couch) {
            combine(predefined, vars_1.couch);
          }
          if (state_1.state.option.qunit) {
            combine(predefined, vars_1.qunit);
          }
          if (state_1.state.option.rhino) {
            combine(predefined, vars_1.rhino);
          }
          if (state_1.state.option.shelljs) {
            combine(predefined, vars_1.shelljs);
            combine(predefined, vars_1.node);
          }
          if (state_1.state.option.typed) {
            combine(predefined, vars_1.typed);
          }
          if (state_1.state.option.phantom) {
            combine(predefined, vars_1.phantom);
            if (state_1.state.option.strict === true) {
              state_1.state.option.strict = "global";
            }
          }
          if (state_1.state.option.prototypejs) {
            combine(predefined, vars_1.prototypejs);
          }
          if (state_1.state.option.node) {
            combine(predefined, vars_1.node);
            combine(predefined, vars_1.typed);
            if (state_1.state.option.strict === true) {
              state_1.state.option.strict = "global";
            }
          }
          if (state_1.state.option.devel) {
            combine(predefined, vars_1.devel);
          }
          if (state_1.state.option.dojo) {
            combine(predefined, vars_1.dojo);
          }
          if (state_1.state.option.browser) {
            combine(predefined, vars_1.browser);
            combine(predefined, vars_1.typed);
          }
          if (state_1.state.option.browserify) {
            combine(predefined, vars_1.browser);
            combine(predefined, vars_1.typed);
            combine(predefined, vars_1.browserify);
            if (state_1.state.option.strict === true) {
              state_1.state.option.strict = "global";
            }
          }
          if (state_1.state.option.nonstandard) {
            combine(predefined, vars_1.nonstandard);
          }
          if (state_1.state.option.jasmine) {
            combine(predefined, vars_1.jasmine);
          }
          if (state_1.state.option.jquery) {
            combine(predefined, vars_1.jquery);
          }
          if (state_1.state.option.mootools) {
            combine(predefined, vars_1.mootools);
          }
          if (state_1.state.option.worker) {
            combine(predefined, vars_1.worker);
          }
          if (state_1.state.option.wsh) {
            combine(predefined, vars_1.wsh);
          }
          if (state_1.state.option.globalstrict && state_1.state.option.strict !== false) {
            state_1.state.option.strict = "global";
          }
          if (state_1.state.option.yui) {
            combine(predefined, vars_1.yui);
          }
          if (state_1.state.option.mocha) {
            combine(predefined, vars_1.mocha);
          }
        }
        function quit(code, token, a, b) {
          var percentage = Math.floor((token.line / state_1.state.lines.length) * 100);
          var message = messages_1.errors[code].desc;
          var exception = {
            name: "JSHintError",
            line: token.line,
            character: token.from,
            message: message + " (" + percentage + "% scanned).",
            raw: message,
            code: code,
            a: a,
            b: b,
            reason: void 0
          };
          exception.reason = supplant(message, exception) + " (" + percentage + "% scanned).";
          throw exception;
        }
        function removeIgnoredMessages() {
          var ignored = state_1.state.ignoredLines;
          if (isEmpty_1.default(ignored)) {
            return;
          }
          var errors = JSHINT.errors;
          JSHINT.errors = reject_1.default(errors, function(err) {
            return ignored[err.line];
          });
        }
        function warning(code, t, a, b, c, d) {
          var ch,
              l,
              w,
              msg;
          if (/^W\d{3}$/.test(code)) {
            if (state_1.state.ignored[code])
              return;
            msg = messages_1.warnings[code];
          } else if (/E\d{3}/.test(code)) {
            msg = messages_1.errors[code];
          } else if (/I\d{3}/.test(code)) {
            msg = messages_1.info[code];
          }
          t = t || state_1.state.tokens.next || {};
          if (t.id === "(end)") {
            t = state_1.state.tokens.curr;
          }
          l = t.line;
          ch = t.from;
          w = {
            id: "(error)",
            raw: msg.desc,
            code: msg.code,
            evidence: state_1.state.lines[l - 1] || "",
            line: l,
            character: ch,
            scope: JSHINT.scope,
            a: a,
            b: b,
            c: c,
            d: d
          };
          w.reason = supplant(msg.desc, w);
          JSHINT.errors.push(w);
          removeIgnoredMessages();
          if (JSHINT.errors.length >= state_1.state.option.maxerr)
            quit("E043", t);
          return w;
        }
        function warningAt(m, l, ch, a, b, c, d) {
          return warning(m, {
            line: l,
            from: ch
          }, a, b, c, d);
        }
        function error(m, t, a, b, c, d) {
          warning(m, t, a, b, c, d);
        }
        function errorAt(m, l, ch, a, b, c, d) {
          return error(m, {
            line: l,
            from: ch
          }, a, b, c, d);
        }
        function addInternalSrc(elem, src) {
          var i;
          i = {
            id: "(internal)",
            elem: elem,
            value: src
          };
          JSHINT.internals.push(i);
          return i;
        }
        function doOption() {
          var nt = state_1.state.tokens.next;
          var body = nt.body.split(",").map(function(s) {
            return s.trim();
          });
          var predef = {};
          if (nt.type === "globals") {
            body.forEach(function(g, idx) {
              g = g.split(":");
              var key = (g[0] || "").trim();
              var val = (g[1] || "").trim();
              if (key === "-" || !key.length) {
                if (idx > 0 && idx === body.length - 1) {
                  return;
                }
                error("E002", nt);
                return;
              }
              if (key.charAt(0) === "-") {
                key = key.slice(1);
                val = false;
                JSHINT.blacklist[key] = key;
                delete predefined[key];
              } else {
                predef[key] = (val === "true");
              }
            });
            combine(predefined, predef);
            for (var key in predef) {
              if (has_1.default(predef, key)) {
                declared[key] = nt;
              }
            }
          }
          if (nt.type === "exported") {
            body.forEach(function(e, idx) {
              if (!e.length) {
                if (idx > 0 && idx === body.length - 1) {
                  return;
                }
                error("E002", nt);
                return;
              }
              state_1.state.funct["(scope)"].addExported(e);
            });
          }
          if (nt.type === "members") {
            membersOnly = membersOnly || {};
            body.forEach(function(m) {
              var ch1 = m.charAt(0);
              var ch2 = m.charAt(m.length - 1);
              if (ch1 === ch2 && (ch1 === "\"" || ch1 === "'")) {
                m = m.substr(1, m.length - 2).replace("\\\"", "\"");
              }
              membersOnly[m] = false;
            });
          }
          var numvals = ["maxstatements", "maxparams", "maxdepth", "maxcomplexity", "maxerr", "maxlen", "indent"];
          if (nt.type === "jshint" || nt.type === "jslint") {
            body.forEach(function(g) {
              g = g.split(":");
              var key = (g[0] || "").trim();
              var val = (g[1] || "").trim();
              if (!checkOption(key, nt)) {
                return;
              }
              if (numvals.indexOf(key) >= 0) {
                if (val !== "false") {
                  val = +val;
                  if (typeof val !== "number" || !isFinite(val) || val <= 0 || Math.floor(val) !== val) {
                    error("E032", nt, g[1].trim());
                    return;
                  }
                  state_1.state.option[key] = val;
                } else {
                  state_1.state.option[key] = key === "indent" ? 4 : false;
                }
                return;
              }
              if (key === "es5") {
                if (val === "true" && state_1.state.option.es5) {
                  warning("I003");
                }
              }
              if (key === "validthis") {
                if (state_1.state.funct["(global)"])
                  return void error("E009");
                if (val !== "true" && val !== "false")
                  return void error("E002", nt);
                state_1.state.option.validthis = (val === "true");
                return;
              }
              if (key === "quotmark") {
                switch (val) {
                  case "true":
                  case "false":
                    state_1.state.option.quotmark = (val === "true");
                    break;
                  case "double":
                  case "single":
                    state_1.state.option.quotmark = val;
                    break;
                  default:
                    error("E002", nt);
                }
                return;
              }
              if (key === "shadow") {
                switch (val) {
                  case "true":
                    state_1.state.option.shadow = true;
                    break;
                  case "outer":
                    state_1.state.option.shadow = "outer";
                    break;
                  case "false":
                  case "inner":
                    state_1.state.option.shadow = "inner";
                    break;
                  default:
                    error("E002", nt);
                }
                return;
              }
              if (key === "unused") {
                switch (val) {
                  case "true":
                    state_1.state.option.unused = true;
                    break;
                  case "false":
                    state_1.state.option.unused = false;
                    break;
                  case "vars":
                  case "strict":
                    state_1.state.option.unused = val;
                    break;
                  default:
                    error("E002", nt);
                }
                return;
              }
              if (key === "latedef") {
                switch (val) {
                  case "true":
                    state_1.state.option.latedef = true;
                    break;
                  case "false":
                    state_1.state.option.latedef = false;
                    break;
                  case "nofunc":
                    state_1.state.option.latedef = "nofunc";
                    break;
                  default:
                    error("E002", nt);
                }
                return;
              }
              if (key === "ignore") {
                switch (val) {
                  case "line":
                    state_1.state.ignoredLines[nt.line] = true;
                    removeIgnoredMessages();
                    break;
                  default:
                    error("E002", nt);
                }
                return;
              }
              if (key === "strict") {
                switch (val) {
                  case "true":
                    state_1.state.option.strict = true;
                    break;
                  case "false":
                    state_1.state.option.strict = false;
                    break;
                  case "func":
                  case "global":
                  case "implied":
                    state_1.state.option.strict = val;
                    break;
                  default:
                    error("E002", nt);
                }
                return;
              }
              if (key === "module") {
                if (!hasParsedCode(state_1.state.funct)) {
                  error("E055", state_1.state.tokens.next, "module");
                }
              }
              var esversions = {
                es3: 3,
                es5: 5,
                esnext: 6
              };
              if (has_1.default(esversions, key)) {
                switch (val) {
                  case "true":
                    state_1.state.option.moz = false;
                    state_1.state.option.esversion = esversions[key];
                    break;
                  case "false":
                    if (!state_1.state.option.moz) {
                      state_1.state.option.esversion = 5;
                    }
                    break;
                  default:
                    error("E002", nt);
                }
                return;
              }
              if (key === "esversion") {
                switch (val) {
                  case "5":
                    if (state_1.state.inES5(true)) {
                      warning("I003");
                    }
                  case "3":
                  case "6":
                    state_1.state.option.moz = false;
                    state_1.state.option.esversion = +val;
                    break;
                  case "2015":
                    state_1.state.option.moz = false;
                    state_1.state.option.esversion = 6;
                    break;
                  default:
                    error("E002", nt);
                }
                if (!hasParsedCode(state_1.state.funct)) {
                  error("E055", state_1.state.tokens.next, "esversion");
                }
                return;
              }
              var match = /^([+-])(W\d{3})$/g.exec(key);
              if (match) {
                state_1.state.ignored[match[2]] = (match[1] === "-");
                return;
              }
              var tn;
              if (val === "true" || val === "false") {
                if (nt.type === "jslint") {
                  tn = options_1.renamed[key] || key;
                  state_1.state.option[tn] = (val === "true");
                  if (options_1.inverted[tn] !== void 0) {
                    state_1.state.option[tn] = !state_1.state.option[tn];
                  }
                } else {
                  state_1.state.option[key] = (val === "true");
                }
                return;
              }
              error("E002", nt);
            });
            assume();
          }
        }
        function peek(p) {
          var i = p || 0,
              j = lookahead.length,
              t;
          if (i < j) {
            return lookahead[i];
          }
          while (j <= i) {
            t = lookahead[j];
            if (!t) {
              t = lookahead[j] = lex.token();
            }
            j += 1;
          }
          if (!t && state_1.state.tokens.next.id === "(end)") {
            return state_1.state.tokens.next;
          }
          return t;
        }
        function peekIgnoreEOL() {
          var i = 0;
          var t;
          do {
            t = peek(i++);
          } while (t.id === "(endline)");
          return t;
        }
        function advance(id, t) {
          switch (state_1.state.tokens.curr.id) {
            case "(number)":
              if (state_1.state.tokens.next.id === ".") {
                warning("W005", state_1.state.tokens.curr);
              }
              break;
            case "-":
              if (state_1.state.tokens.next.id === "-" || state_1.state.tokens.next.id === "--") {
                warning("W006");
              }
              break;
            case "+":
              if (state_1.state.tokens.next.id === "+" || state_1.state.tokens.next.id === "++") {
                warning("W007");
              }
              break;
          }
          if (id && state_1.state.tokens.next.id !== id) {
            if (t) {
              if (state_1.state.tokens.next.id === "(end)") {
                error("E019", t, t.id);
              } else {
                error("E020", state_1.state.tokens.next, id, t.id, t.line, state_1.state.tokens.next.value);
              }
            } else if (state_1.state.tokens.next.type !== "(identifier)" || state_1.state.tokens.next.value !== id) {
              warning("W116", state_1.state.tokens.next, id, state_1.state.tokens.next.value);
            }
          }
          state_1.state.tokens.prev = state_1.state.tokens.curr;
          state_1.state.tokens.curr = state_1.state.tokens.next;
          for (; ; ) {
            state_1.state.tokens.next = lookahead.shift() || lex.token();
            if (!state_1.state.tokens.next) {
              quit("E041", state_1.state.tokens.curr);
            }
            if (state_1.state.tokens.next.id === "(end)" || state_1.state.tokens.next.id === "(error)") {
              return;
            }
            if (state_1.state.tokens.next.check) {
              state_1.state.tokens.next.check();
            }
            if (state_1.state.tokens.next.isSpecial) {
              if (state_1.state.tokens.next.type === "falls through") {
                state_1.state.tokens.curr.caseFallsThrough = true;
              } else {
                doOption();
              }
            } else {
              if (state_1.state.tokens.next.id !== "(endline)") {
                break;
              }
            }
          }
        }
        function isInfix(token) {
          return token.infix || (!token.identifier && !token.template && !!token.led);
        }
        function isEndOfExpr() {
          var curr = state_1.state.tokens.curr;
          var next = state_1.state.tokens.next;
          if (next.id === ";" || next.id === "}" || next.id === ":") {
            return true;
          }
          if (isInfix(next) === isInfix(curr) || (curr.id === "yield" && state_1.state.inMoz())) {
            return curr.line !== startLine(next);
          }
          return false;
        }
        function isBeginOfExpr(prev) {
          return !prev.left && prev.arity !== "unary";
        }
        function expression(rbp, initial) {
          var left,
              isArray = false,
              isObject = false,
              isLetExpr = false;
          state_1.state.nameStack.push();
          if (!initial && state_1.state.tokens.next.value === "let" && peek(0).value === "(") {
            if (!state_1.state.inMoz()) {
              warning("W118", state_1.state.tokens.next, "let expressions");
            }
            isLetExpr = true;
            state_1.state.funct["(scope)"].stack();
            advance("let");
            advance("(");
            state_1.state.tokens.prev.fud();
            advance(")");
          }
          if (state_1.state.tokens.next.id === "(end)")
            error("E006", state_1.state.tokens.curr);
          var isDangerous = state_1.state.option.asi && state_1.state.tokens.prev.line !== startLine(state_1.state.tokens.curr) && contains_1.default(["]", ")"], state_1.state.tokens.prev.id) && contains_1.default(["[", "("], state_1.state.tokens.curr.id);
          if (isDangerous)
            warning("W014", state_1.state.tokens.curr, state_1.state.tokens.curr.id);
          advance();
          if (initial) {
            state_1.state.funct["(verb)"] = state_1.state.tokens.curr.value;
            state_1.state.tokens.curr.beginsStmt = true;
          }
          if (initial === true && state_1.state.tokens.curr.fud) {
            left = state_1.state.tokens.curr.fud();
          } else {
            if (state_1.state.tokens.curr.nud) {
              left = state_1.state.tokens.curr.nud();
            } else {
              error("E030", state_1.state.tokens.curr, state_1.state.tokens.curr.id);
            }
            while ((rbp < state_1.state.tokens.next.lbp || state_1.state.tokens.next.type === "(template)") && !isEndOfExpr()) {
              isArray = state_1.state.tokens.curr.value === "Array";
              isObject = state_1.state.tokens.curr.value === "Object";
              if (left && (left.value || (left.first && left.first.value))) {
                if (left.value !== "new" || (left.first && left.first.value && left.first.value === ".")) {
                  isArray = false;
                  if (left.value !== state_1.state.tokens.curr.value) {
                    isObject = false;
                  }
                }
              }
              advance();
              if (isArray && state_1.state.tokens.curr.id === "(" && state_1.state.tokens.next.id === ")") {
                warning("W009", state_1.state.tokens.curr);
              }
              if (isObject && state_1.state.tokens.curr.id === "(" && state_1.state.tokens.next.id === ")") {
                warning("W010", state_1.state.tokens.curr);
              }
              if (left && state_1.state.tokens.curr.led) {
                left = state_1.state.tokens.curr.led(left);
              } else {
                error("E033", state_1.state.tokens.curr, state_1.state.tokens.curr.id);
              }
            }
          }
          if (isLetExpr) {
            state_1.state.funct["(scope)"].unstack();
          }
          state_1.state.nameStack.pop();
          return left;
        }
        function startLine(token) {
          return token.startLine || token.line;
        }
        function nobreaknonadjacent(left, right) {
          left = left || state_1.state.tokens.curr;
          right = right || state_1.state.tokens.next;
          if (!state_1.state.option.laxbreak && left.line !== startLine(right)) {
            warning("W014", right, right.value);
          }
        }
        function nolinebreak(t) {
          t = t || state_1.state.tokens.curr;
          if (t.line !== startLine(state_1.state.tokens.next)) {
            warning("E022", t, t.value);
          }
        }
        function nobreakcomma(left, right) {
          if (left.line !== startLine(right)) {
            if (!state_1.state.option.laxcomma) {
              if (comma['first']) {
                warning("I001");
                comma['first'] = false;
              }
              warning("W014", left, right.value);
            }
          }
        }
        function comma(opts) {
          opts = opts || {};
          if (!opts.peek) {
            nobreakcomma(state_1.state.tokens.curr, state_1.state.tokens.next);
            advance(",");
          } else {
            nobreakcomma(state_1.state.tokens.prev, state_1.state.tokens.curr);
          }
          if (state_1.state.tokens.next.identifier && !(opts.property && state_1.state.inES5())) {
            switch (state_1.state.tokens.next.value) {
              case "break":
              case "case":
              case "catch":
              case "continue":
              case "default":
              case "do":
              case "else":
              case "finally":
              case "for":
              case "if":
              case "in":
              case "instanceof":
              case "return":
              case "switch":
              case "throw":
              case "try":
              case "var":
              case "let":
              case "while":
              case "with":
                error("E024", state_1.state.tokens.next, state_1.state.tokens.next.value);
                return false;
            }
          }
          if (state_1.state.tokens.next.type === "(punctuator)") {
            switch (state_1.state.tokens.next.value) {
              case "}":
              case "]":
              case ",":
                if (opts.allowTrailing) {
                  return true;
                }
              case ")":
                error("E024", state_1.state.tokens.next, state_1.state.tokens.next.value);
                return false;
            }
          }
          return true;
        }
        function symbol(s, p) {
          var x = state_1.state.syntax[s];
          if (!x || typeof x !== "object") {
            state_1.state.syntax[s] = x = {
              id: s,
              lbp: p,
              value: s
            };
          }
          return x;
        }
        function delim(s) {
          var x = symbol(s, 0);
          x.delim = true;
          return x;
        }
        function stmt(s, f) {
          var x = delim(s);
          x.identifier = x.reserved = true;
          x.fud = f;
          return x;
        }
        function blockstmt(s, f) {
          var x = stmt(s, f);
          x.block = true;
          return x;
        }
        function reserveName(x) {
          var c = x.id.charAt(0);
          if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) {
            x.identifier = x.reserved = true;
          }
          return x;
        }
        function prefix(s, f) {
          var x = symbol(s, 150);
          reserveName(x);
          x.nud = (typeof f === "function") ? f : function() {
            this.arity = "unary";
            this.right = expression(150);
            if (this.id === "++" || this.id === "--") {
              if (state_1.state.option.plusplus) {
                warning("W016", this, this.id);
              } else if (this.right && (!this.right.identifier || isReserved(this.right)) && this.right.id !== "." && this.right.id !== "[") {
                warning("W017", this);
              }
              if (this.right && this.right.isMetaProperty) {
                error("E031", this);
              } else if (this.right && this.right.identifier) {
                state_1.state.funct["(scope)"].block.modify(this.right.value, this);
              }
            }
            return this;
          };
          return x;
        }
        function type(s, func) {
          var x = delim(s);
          x.type = s;
          x.nud = func;
          return x;
        }
        function reserve(name, func) {
          var x = type(name, func);
          x.identifier = true;
          x.reserved = true;
          return x;
        }
        function FutureReservedWord(name, meta) {
          var x = type(name, (meta && meta.nud) || function() {
            return this;
          });
          meta = meta || {};
          meta.isFutureReservedWord = true;
          x.value = name;
          x.identifier = true;
          x.reserved = true;
          x.meta = meta;
          return x;
        }
        function reservevar(s, v) {
          return reserve(s, function() {
            if (typeof v === "function") {
              v(this);
            }
            return this;
          });
        }
        function infix(s, f, p, w) {
          var x = symbol(s, p);
          reserveName(x);
          x.infix = true;
          x.led = function(left) {
            if (!w) {
              nobreaknonadjacent(state_1.state.tokens.prev, state_1.state.tokens.curr);
            }
            if ((s === "in" || s === "instanceof") && left.id === "!") {
              warning("W018", left, "!");
            }
            if (typeof f === "function") {
              return f(left, this);
            } else {
              this.left = left;
              this.right = expression(p);
              return this;
            }
          };
          return x;
        }
        function application(s) {
          var x = symbol(s, 42);
          x.led = function(left) {
            nobreaknonadjacent(state_1.state.tokens.prev, state_1.state.tokens.curr);
            this.left = left;
            this.right = doFunction({
              type: "arrow",
              loneArg: left
            });
            return this;
          };
          return x;
        }
        function relation(s, f) {
          var x = symbol(s, 100);
          x.led = function(left) {
            nobreaknonadjacent(state_1.state.tokens.prev, state_1.state.tokens.curr);
            this.left = left;
            var right = this.right = expression(100);
            if (isIdentifier(left, "NaN") || isIdentifier(right, "NaN")) {
              warning("W019", this);
            } else if (f) {
              f.apply(this, [left, right]);
            }
            if (!left || !right) {
              quit("E041", state_1.state.tokens.curr);
            }
            if (left.id === "!") {
              warning("W018", left, "!");
            }
            if (right.id === "!") {
              warning("W018", right, "!");
            }
            return this;
          };
          return x;
        }
        function isPoorRelation(node) {
          return node && ((node.type === "(number)" && +node.value === 0) || (node.type === "(string)" && node.value === "") || (node.type === "null" && !state_1.state.option.eqnull) || node.type === "true" || node.type === "false" || node.type === "undefined");
        }
        var typeofValues = {};
        typeofValues.legacy = ["xml", "unknown"];
        typeofValues.es3 = ["undefined", "boolean", "number", "string", "function", "object"];
        typeofValues.es3 = typeofValues.es3.concat(typeofValues.legacy);
        typeofValues.es6 = typeofValues.es3.concat("symbol");
        function isTypoTypeof(left, right, state) {
          var values;
          if (state.option.notypeof)
            return false;
          if (!left || !right)
            return false;
          values = state.inES6() ? typeofValues.es6 : typeofValues.es3;
          if (right.type === "(identifier)" && right.value === "typeof" && left.type === "(string)")
            return !contains_1.default(values, left.value);
          return false;
        }
        function isGlobalEval(left, state) {
          var isGlobal = false;
          if (left.type === "this" && state.funct["(context)"] === null) {
            isGlobal = true;
          } else if (left.type === "(identifier)") {
            if (state.option.node && left.value === "global") {
              isGlobal = true;
            } else if (state.option.browser && (left.value === "window" || left.value === "document")) {
              isGlobal = true;
            }
          }
          return isGlobal;
        }
        function findNativePrototype(left) {
          var natives = ["Array", "ArrayBuffer", "Boolean", "Collator", "DataView", "Date", "DateTimeFormat", "Error", "EvalError", "Float32Array", "Float64Array", "Function", "Infinity", "Intl", "Int16Array", "Int32Array", "Int8Array", "Iterator", "Number", "NumberFormat", "Object", "RangeError", "ReferenceError", "RegExp", "StopIteration", "String", "SyntaxError", "TypeError", "Uint16Array", "Uint32Array", "Uint8Array", "Uint8ClampedArray", "URIError"];
          function walkPrototype(obj) {
            if (typeof obj !== "object")
              return;
            return obj.right === "prototype" ? obj : walkPrototype(obj.left);
          }
          function walkNative(obj) {
            while (!obj.identifier && typeof obj.left === "object")
              obj = obj.left;
            if (obj.identifier && natives.indexOf(obj.value) >= 0)
              return obj.value;
          }
          var prototype = walkPrototype(left);
          if (prototype)
            return walkNative(prototype);
        }
        function checkLeftSideAssign(left, assignToken, options) {
          var allowDestructuring = options && options.allowDestructuring;
          assignToken = assignToken || left;
          if (state_1.state.option.freeze) {
            var nativeObject = findNativePrototype(left);
            if (nativeObject)
              warning("W121", left, nativeObject);
          }
          if (left.identifier && !left.isMetaProperty) {
            state_1.state.funct["(scope)"].block.reassign(left.value, left);
          }
          if (left.id === ".") {
            if (!left.left || left.left.value === "arguments" && !state_1.state.isStrict()) {
              warning("E031", assignToken);
            }
            state_1.state.nameStack.set(state_1.state.tokens.prev);
            return true;
          } else if (left.id === "{" || left.id === "[") {
            if (allowDestructuring && state_1.state.tokens.curr.left.destructAssign) {
              state_1.state.tokens.curr.left.destructAssign.forEach(function(t) {
                if (t.id) {
                  state_1.state.funct["(scope)"].block.modify(t.id, t.token);
                }
              });
            } else {
              if (left.id === "{" || !left.left) {
                warning("E031", assignToken);
              } else if (left.left.value === "arguments" && !state_1.state.isStrict()) {
                warning("E031", assignToken);
              }
            }
            if (left.id === "[") {
              state_1.state.nameStack.set(left.right);
            }
            return true;
          } else if (left.isMetaProperty) {
            error("E031", assignToken);
            return true;
          } else if (left.identifier && !isReserved(left)) {
            if (state_1.state.funct["(scope)"].labeltype(left.value) === "exception") {
              warning("W022", left);
            }
            state_1.state.nameStack.set(left);
            return true;
          }
          if (left === state_1.state.syntax["function"]) {
            warning("W023", state_1.state.tokens.curr);
          }
          return false;
        }
        function assignop(s, f, p) {
          var x = infix(s, typeof f === "function" ? f : function(left, that) {
            that.left = left;
            if (left && checkLeftSideAssign(left, that, {allowDestructuring: true})) {
              that.right = expression(10);
              return that;
            }
            error("E031", that);
          }, p);
          x.exps = true;
          x.assign = true;
          return x;
        }
        function bitwise(s, f, p) {
          var x = symbol(s, p);
          reserveName(x);
          x.led = (typeof f === "function") ? f : function(left) {
            if (state_1.state.option.bitwise) {
              warning("W016", this, this.id);
            }
            this.left = left;
            this.right = expression(p);
            return this;
          };
          return x;
        }
        function bitwiseassignop(s) {
          return assignop(s, function(left, that) {
            if (state_1.state.option.bitwise) {
              warning("W016", that, that.id);
            }
            if (left && checkLeftSideAssign(left, that)) {
              that.right = expression(10);
              return that;
            }
            error("E031", that);
          }, 20);
        }
        function suffix(s) {
          var x = symbol(s, 150);
          x.led = function(left) {
            if (state_1.state.option.plusplus) {
              warning("W016", this, this.id);
            } else if ((!left.identifier || isReserved(left)) && left.id !== "." && left.id !== "[") {
              warning("W017", this);
            }
            if (left.isMetaProperty) {
              error("E031", this);
            } else if (left && left.identifier) {
              state_1.state.funct["(scope)"].block.modify(left.value, left);
            }
            this.left = left;
            return this;
          };
          return x;
        }
        function optionalidentifier(fnparam, prop, preserve) {
          if (!state_1.state.tokens.next.identifier) {
            return;
          }
          if (!preserve) {
            advance();
          }
          var curr = state_1.state.tokens.curr;
          var val = state_1.state.tokens.curr.value;
          if (!isReserved(curr)) {
            return val;
          }
          if (prop) {
            if (state_1.state.inES5()) {
              return val;
            }
          }
          if (fnparam && val === "undefined") {
            return val;
          }
          warning("W024", state_1.state.tokens.curr, state_1.state.tokens.curr.id);
          return val;
        }
        function identifier(fnparam, prop) {
          var i = optionalidentifier(fnparam, prop, false);
          if (i) {
            return i;
          }
          if (state_1.state.tokens.next.value === "...") {
            if (!state_1.state.inES6(true)) {
              warning("W119", state_1.state.tokens.next, "spread/rest operator", "6");
            }
            advance();
            if (checkPunctuator(state_1.state.tokens.next, "...")) {
              warning("E024", state_1.state.tokens.next, "...");
              while (checkPunctuator(state_1.state.tokens.next, "...")) {
                advance();
              }
            }
            if (!state_1.state.tokens.next.identifier) {
              warning("E024", state_1.state.tokens.curr, "...");
              return;
            }
            return identifier(fnparam, prop);
          } else {
            error("E030", state_1.state.tokens.next, state_1.state.tokens.next.value);
            if (state_1.state.tokens.next.id !== ";") {
              advance();
            }
          }
        }
        function reachable(controlToken) {
          var i = 0,
              t;
          if (state_1.state.tokens.next.id !== ";" || controlToken.inBracelessBlock) {
            return;
          }
          for (; ; ) {
            do {
              t = peek(i);
              i += 1;
            } while (t.id !== "(end)" && t.id === "(comment)");
            if (t.reach) {
              return;
            }
            if (t.id !== "(endline)") {
              if (t.id === "function") {
                if (state_1.state.option.latedef === true) {
                  warning("W026", t);
                }
                break;
              }
              warning("W027", t, t.value, controlToken.value);
              break;
            }
          }
        }
        function parseFinalSemicolon() {
          if (state_1.state.tokens.next.id !== ";") {
            if (state_1.state.tokens.next.isUnclosed)
              return advance();
            var sameLine = startLine(state_1.state.tokens.next) === state_1.state.tokens.curr.line && state_1.state.tokens.next.id !== "(end)";
            var blockEnd = checkPunctuator(state_1.state.tokens.next, "}");
            if (sameLine && !blockEnd) {
              errorAt("E058", state_1.state.tokens.curr.line, state_1.state.tokens.curr.character);
            } else if (!state_1.state.option.asi) {
              if ((blockEnd && !state_1.state.option.lastsemic) || !sameLine) {
                warningAt("W033", state_1.state.tokens.curr.line, state_1.state.tokens.curr.character);
              }
            }
          } else {
            advance(";");
          }
        }
        function statement() {
          var i = indent,
              r,
              t = state_1.state.tokens.next,
              hasOwnScope = false;
          if (t.id === ";") {
            advance(";");
            return;
          }
          var res = isReserved(t);
          if (res && t.meta && t.meta.isFutureReservedWord && peek().id === ":") {
            warning("W024", t, t.id);
            res = false;
          }
          if (t.identifier && !res && peek().id === ":") {
            advance();
            advance(":");
            hasOwnScope = true;
            state_1.state.funct["(scope)"].stack();
            state_1.state.funct["(scope)"].block.addBreakLabel(t.value, {token: state_1.state.tokens.curr});
            if (!state_1.state.tokens.next.labelled && state_1.state.tokens.next.value !== "{") {
              warning("W028", state_1.state.tokens.next, t.value, state_1.state.tokens.next.value);
            }
            state_1.state.tokens.next.label = t.value;
            t = state_1.state.tokens.next;
          }
          if (t.id === "{") {
            var iscase = (state_1.state.funct["(verb)"] === "case" && state_1.state.tokens.curr.value === ":");
            block(true, true, false, false, iscase);
            return;
          }
          r = expression(0, true);
          if (r && !(r.identifier && r.value === "function") && !(r.type === "(punctuator)" && r.left && r.left.identifier && r.left.value === "function")) {
            if (!state_1.state.isStrict() && state_1.state.option.strict === "global") {
              warning("E007");
            }
          }
          if (!t.block) {
            if (!state_1.state.option.expr && (!r || !r.exps)) {
              warning("W030", state_1.state.tokens.curr);
            } else if (state_1.state.option.nonew && r && r.left && r.id === "(" && r.left.id === "new") {
              warning("W031", t);
            }
            parseFinalSemicolon();
          }
          indent = i;
          if (hasOwnScope) {
            state_1.state.funct["(scope)"].unstack();
          }
          return r;
        }
        function statements() {
          var a = [],
              p;
          while (!state_1.state.tokens.next.reach && state_1.state.tokens.next.id !== "(end)") {
            if (state_1.state.tokens.next.id === ";") {
              p = peek();
              if (!p || (p.id !== "(" && p.id !== "[")) {
                warning("W032");
              }
              advance(";");
            } else {
              a.push(statement());
            }
          }
          return a;
        }
        function directives() {
          var i,
              p,
              pn;
          while (state_1.state.tokens.next.id === "(string)") {
            p = peek(0);
            if (p.id === "(endline)") {
              i = 1;
              do {
                pn = peek(i++);
              } while (pn.id === "(endline)");
              if (pn.id === ";") {
                p = pn;
              } else if (pn.value === "[" || pn.value === ".") {
                break;
              } else if (!state_1.state.option.asi || pn.value === "(") {
                warning("W033", state_1.state.tokens.next);
              }
            } else if (p.id === "." || p.id === "[") {
              break;
            } else if (p.id !== ";") {
              warning("W033", p);
            }
            advance();
            var directive = state_1.state.tokens.curr.value;
            if (state_1.state.directive[directive] || (directive === "use strict" && state_1.state.option.strict === "implied")) {
              warning("W034", state_1.state.tokens.curr, directive);
            }
            state_1.state.directive[directive] = true;
            if (p.id === ";") {
              advance(";");
            }
          }
          if (state_1.state.isStrict()) {
            state_1.state.option.undef = true;
          }
        }
        function block(ordinary, stmt, isfunc, isfatarrow, iscase) {
          var a,
              b = inblock,
              old_indent = indent,
              m,
              t,
              line,
              d;
          inblock = ordinary;
          t = state_1.state.tokens.next;
          var metrics = state_1.state.funct["(metrics)"];
          metrics.nestedBlockDepth += 1;
          metrics.verifyMaxNestedBlockDepthPerFunction();
          if (state_1.state.tokens.next.id === "{") {
            advance("{");
            state_1.state.funct["(scope)"].stack();
            state_1.state.funct["(noblockscopedvar)"] = false;
            line = state_1.state.tokens.curr.line;
            if (state_1.state.tokens.next.id !== "}") {
              indent += state_1.state.option.indent;
              while (!ordinary && state_1.state.tokens.next.from > indent) {
                indent += state_1.state.option.indent;
              }
              if (isfunc) {
                m = {};
                for (d in state_1.state.directive) {
                  if (has_1.default(state_1.state.directive, d)) {
                    m[d] = state_1.state.directive[d];
                  }
                }
                directives();
                if (state_1.state.option.strict && state_1.state.funct["(context)"]["(global)"]) {
                  if (!m["use strict"] && !state_1.state.isStrict()) {
                    warning("E007");
                  }
                }
              }
              a = statements();
              metrics.statementCount += a.length;
              indent -= state_1.state.option.indent;
            }
            advance("}", t);
            if (isfunc) {
              state_1.state.funct["(scope)"].validateParams();
              if (m) {
                state_1.state.directive = m;
              }
            }
            state_1.state.funct["(scope)"].unstack();
            indent = old_indent;
          } else if (!ordinary) {
            if (isfunc) {
              state_1.state.funct["(scope)"].stack();
              m = {};
              if (stmt && !isfatarrow && !state_1.state.inMoz()) {
                error("W118", state_1.state.tokens.curr, "function closure expressions");
              }
              if (!stmt) {
                for (d in state_1.state.directive) {
                  if (has_1.default(state_1.state.directive, d)) {
                    m[d] = state_1.state.directive[d];
                  }
                }
              }
              expression(10);
              if (state_1.state.option.strict && state_1.state.funct["(context)"]["(global)"]) {
                if (!m["use strict"] && !state_1.state.isStrict()) {
                  warning("E007");
                }
              }
              state_1.state.funct["(scope)"].unstack();
            } else {
              error("E021", state_1.state.tokens.next, "{", state_1.state.tokens.next.value);
            }
          } else {
            state_1.state.funct["(noblockscopedvar)"] = state_1.state.tokens.next.id !== "for";
            state_1.state.funct["(scope)"].stack();
            if (!stmt || state_1.state.option.curly) {
              warning("W116", state_1.state.tokens.next, "{", state_1.state.tokens.next.value);
            }
            state_1.state.tokens.next.inBracelessBlock = true;
            indent += state_1.state.option.indent;
            a = [statement()];
            indent -= state_1.state.option.indent;
            state_1.state.funct["(scope)"].unstack();
            delete state_1.state.funct["(noblockscopedvar)"];
          }
          switch (state_1.state.funct["(verb)"]) {
            case "break":
            case "continue":
            case "return":
            case "throw":
              if (iscase) {
                break;
              }
            default:
              state_1.state.funct["(verb)"] = null;
          }
          inblock = b;
          if (ordinary && state_1.state.option.noempty && (!a || a.length === 0)) {
            warning("W035", state_1.state.tokens.prev);
          }
          metrics.nestedBlockDepth -= 1;
          return a;
        }
        function countMember(m) {
          if (membersOnly && typeof membersOnly[m] !== "boolean") {
            warning("W036", state_1.state.tokens.curr, m);
          }
          if (typeof member[m] === "number") {
            member[m] += 1;
          } else {
            member[m] = 1;
          }
        }
        type("(number)", function() {
          return this;
        });
        type("(string)", function() {
          return this;
        });
        state_1.state.syntax["(identifier)"] = {
          type: "(identifier)",
          lbp: 0,
          identifier: true,
          nud: function() {
            var v = this.value;
            if (state_1.state.tokens.next.id === "=>") {
              return this;
            }
            if (!state_1.state.funct["(comparray)"].check(v)) {
              state_1.state.funct["(scope)"].block.use(v, state_1.state.tokens.curr);
            }
            return this;
          },
          led: function() {
            error("E033", state_1.state.tokens.next, state_1.state.tokens.next.value);
          }
        };
        var baseTemplateSyntax = {
          lbp: 0,
          identifier: false,
          template: true
        };
        state_1.state.syntax["(template)"] = extend_1.default({
          type: "(template)",
          nud: doTemplateLiteral,
          led: doTemplateLiteral,
          noSubst: false
        }, baseTemplateSyntax);
        state_1.state.syntax["(template middle)"] = extend_1.default({
          type: "(template middle)",
          middle: true,
          noSubst: false
        }, baseTemplateSyntax);
        state_1.state.syntax["(template tail)"] = extend_1.default({
          type: "(template tail)",
          tail: true,
          noSubst: false
        }, baseTemplateSyntax);
        state_1.state.syntax["(no subst template)"] = extend_1.default({
          type: "(template)",
          nud: doTemplateLiteral,
          led: doTemplateLiteral,
          noSubst: true,
          tail: true
        }, baseTemplateSyntax);
        type("(regexp)", function() {
          return this;
        });
        delim("(endline)");
        (function(x) {
          x.line = x.from = 0;
        })(delim("(begin)"));
        delim("(end)").reach = true;
        delim("(error)").reach = true;
        delim("}").reach = true;
        delim(")");
        delim("]");
        delim("\"").reach = true;
        delim("'").reach = true;
        delim(";");
        delim(":").reach = true;
        delim("#");
        reserve("else");
        reserve("case").reach = true;
        reserve("catch");
        reserve("default").reach = true;
        reserve("finally");
        reservevar("arguments", function(x) {
          if (state_1.state.isStrict() && state_1.state.funct["(global)"]) {
            warning("E008", x);
          }
        });
        reservevar("eval");
        reservevar("false");
        reservevar("Infinity");
        reservevar("null");
        reservevar("this", function(x) {
          if (state_1.state.isStrict() && !isMethod() && !state_1.state.option.validthis && ((state_1.state.funct["(statement)"] && state_1.state.funct["(name)"].charAt(0) > "Z") || state_1.state.funct["(global)"])) {
            warning("W040", x);
          }
        });
        reservevar("true");
        reservevar("undefined");
        assignop("=", "assign", 20);
        assignop("+=", "assignadd", 20);
        assignop("-=", "assignsub", 20);
        assignop("*=", "assignmult", 20);
        assignop("/=", "assigndiv", 20).nud = function() {
          error("E014");
        };
        assignop("%=", "assignmod", 20);
        bitwiseassignop("&=");
        bitwiseassignop("|=");
        bitwiseassignop("^=");
        bitwiseassignop("<<=");
        bitwiseassignop(">>=");
        bitwiseassignop(">>>=");
        infix(",", function(left, that) {
          var expr;
          that.exprs = [left];
          if (state_1.state.option.nocomma) {
            warning("W127");
          }
          if (!comma({peek: true})) {
            return that;
          }
          while (true) {
            if (!(expr = expression(10))) {
              break;
            }
            that.exprs.push(expr);
            if (state_1.state.tokens.next.value !== "," || !comma()) {
              break;
            }
          }
          return that;
        }, 10, true);
        infix("?", function(left, that) {
          increaseComplexityCount();
          that.left = left;
          that.right = expression(10);
          advance(":");
          that["else"] = expression(10);
          return that;
        }, 30);
        var orPrecendence = 40;
        infix("||", function(left, that) {
          increaseComplexityCount();
          that.left = left;
          that.right = expression(orPrecendence);
          return that;
        }, orPrecendence);
        infix("&&", "and", 50);
        bitwise("|", "bitor", 70);
        bitwise("^", "bitxor", 80);
        bitwise("&", "bitand", 90);
        relation("==", function(left, right) {
          var eqnull = state_1.state.option.eqnull && ((left && left.value) === "null" || (right && right.value) === "null");
          switch (true) {
            case !eqnull && state_1.state.option.eqeqeq:
              this.from = this.character;
              warning("W116", this, "===", "==");
              break;
            case isPoorRelation(left):
              warning("W041", this, "===", left.value);
              break;
            case isPoorRelation(right):
              warning("W041", this, "===", right.value);
              break;
            case isTypoTypeof(right, left, state_1.state):
              warning("W122", this, right.value);
              break;
            case isTypoTypeof(left, right, state_1.state):
              warning("W122", this, left.value);
              break;
          }
          return this;
        });
        relation("===", function(left, right) {
          if (isTypoTypeof(right, left, state_1.state)) {
            warning("W122", this, right.value);
          } else if (isTypoTypeof(left, right, state_1.state)) {
            warning("W122", this, left.value);
          }
          return this;
        });
        relation("!=", function(left, right) {
          var eqnull = state_1.state.option.eqnull && ((left && left.value) === "null" || (right && right.value) === "null");
          if (!eqnull && state_1.state.option.eqeqeq) {
            this.from = this.character;
            warning("W116", this, "!==", "!=");
          } else if (isPoorRelation(left)) {
            warning("W041", this, "!==", left.value);
          } else if (isPoorRelation(right)) {
            warning("W041", this, "!==", right.value);
          } else if (isTypoTypeof(right, left, state_1.state)) {
            warning("W122", this, right.value);
          } else if (isTypoTypeof(left, right, state_1.state)) {
            warning("W122", this, left.value);
          }
          return this;
        });
        relation("!==", function(left, right) {
          if (isTypoTypeof(right, left, state_1.state)) {
            warning("W122", this, right.value);
          } else if (isTypoTypeof(left, right, state_1.state)) {
            warning("W122", this, left.value);
          }
          return this;
        });
        relation("<");
        relation(">");
        relation("<=");
        relation(">=");
        bitwise("<<", "shiftleft", 120);
        bitwise(">>", "shiftright", 120);
        bitwise(">>>", "shiftrightunsigned", 120);
        infix("in", "in", 120);
        infix("instanceof", "instanceof", 120);
        infix("+", function(left, that) {
          var right;
          that.left = left;
          that.right = right = expression(130);
          if (left && right && left.id === "(string)" && right.id === "(string)") {
            left.value += right.value;
            left.character = right.character;
            if (!state_1.state.option.scripturl && reg_1.javascriptURL.test(left.value)) {
              warning("W050", left);
            }
            return left;
          }
          return that;
        }, 130);
        prefix("+", "num");
        prefix("+++", function() {
          warning("W007");
          this.arity = "unary";
          this.right = expression(150);
          return this;
        });
        infix("+++", function(left) {
          warning("W007");
          this.left = left;
          this.right = expression(130);
          return this;
        }, 130);
        infix("-", "sub", 130);
        prefix("-", "neg");
        prefix("---", function() {
          warning("W006");
          this.arity = "unary";
          this.right = expression(150);
          return this;
        });
        infix("---", function(left) {
          warning("W006");
          this.left = left;
          this.right = expression(130);
          return this;
        }, 130);
        infix("*", "mult", 140);
        infix("/", "div", 140);
        infix("%", "mod", 140);
        suffix("++");
        prefix("++", "preinc");
        state_1.state.syntax["++"].exps = true;
        suffix("--");
        prefix("--", "predec");
        state_1.state.syntax["--"].exps = true;
        prefix("delete", function() {
          var p = expression(10);
          if (!p) {
            return this;
          }
          if (p.id !== "." && p.id !== "[") {
            warning("W051");
          }
          this.first = p;
          if (p.identifier && !state_1.state.isStrict()) {
            p.forgiveUndef = true;
          }
          return this;
        }).exps = true;
        prefix("~", function() {
          if (state_1.state.option.bitwise) {
            warning("W016", this, "~");
          }
          this.arity = "unary";
          this.right = expression(150);
          return this;
        });
        prefix("...", function() {
          if (!state_1.state.inES6(true)) {
            warning("W119", this, "spread/rest operator", "6");
          }
          if (!state_1.state.tokens.next.identifier && state_1.state.tokens.next.type !== "(string)" && !checkPunctuators(state_1.state.tokens.next, ["[", "("])) {
            error("E030", state_1.state.tokens.next, state_1.state.tokens.next.value);
          }
          expression(150);
          return this;
        });
        prefix("!", function() {
          this.arity = "unary";
          this.right = expression(150);
          if (!this.right) {
            quit("E041", this);
          }
          if (bang[this.right.id] === true) {
            warning("W018", this, "!");
          }
          return this;
        });
        prefix("typeof", (function() {
          var p = expression(150);
          this.first = this.right = p;
          if (!p) {
            quit("E041", this);
          }
          if (p.identifier) {
            p.forgiveUndef = true;
          }
          return this;
        }));
        prefix("new", function() {
          var mp = metaProperty("target", function() {
            if (!state_1.state.inES6(true)) {
              warning("W119", state_1.state.tokens.prev, "new.target", "6");
            }
            var inFunction,
                c = state_1.state.funct;
            while (c) {
              inFunction = !c["(global)"];
              if (!c["(arrow)"]) {
                break;
              }
              c = c["(context)"];
            }
            if (!inFunction) {
              warning("W136", state_1.state.tokens.prev, "new.target");
            }
          });
          if (mp) {
            return mp;
          }
          var c = expression(155),
              i;
          if (c && c.id !== "function") {
            if (c.identifier) {
              c["new"] = true;
              switch (c.value) {
                case "Number":
                case "String":
                case "Boolean":
                case "Math":
                case "JSON":
                  warning("W053", state_1.state.tokens.prev, c.value);
                  break;
                case "Symbol":
                  if (state_1.state.inES6()) {
                    warning("W053", state_1.state.tokens.prev, c.value);
                  }
                  break;
                case "Function":
                  if (!state_1.state.option.evil) {
                    warning("W054");
                  }
                  break;
                case "Date":
                case "RegExp":
                case "this":
                  break;
                default:
                  if (c.id !== "function") {
                    i = c.value.substr(0, 1);
                    if (state_1.state.option.newcap && (i < "A" || i > "Z") && !state_1.state.funct["(scope)"].isPredefined(c.value)) {
                      warning("W055", state_1.state.tokens.curr);
                    }
                  }
              }
            } else {
              if (c.id !== "." && c.id !== "[" && c.id !== "(") {
                warning("W056", state_1.state.tokens.curr);
              }
            }
          } else {
            if (!state_1.state.option.supernew)
              warning("W057", this);
          }
          if (state_1.state.tokens.next.id !== "(" && !state_1.state.option.supernew) {
            warning("W058", state_1.state.tokens.curr, state_1.state.tokens.curr.value);
          }
          this.first = this.right = c;
          return this;
        });
        state_1.state.syntax["new"].exps = true;
        prefix("void").exps = true;
        infix(".", function(left, that) {
          var m = identifier(false, true);
          if (typeof m === "string") {
            countMember(m);
          }
          that.left = left;
          that.right = m;
          if (m && m === "hasOwnProperty" && state_1.state.tokens.next.value === "=") {
            warning("W001");
          }
          if (left && left.value === "arguments" && (m === "callee" || m === "caller")) {
            if (state_1.state.option.noarg)
              warning("W059", left, m);
            else if (state_1.state.isStrict())
              error("E008");
          } else if (!state_1.state.option.evil && left && left.value === "document" && (m === "write" || m === "writeln")) {
            warning("W060", left);
          }
          if (!state_1.state.option.evil && (m === "eval" || m === "execScript")) {
            if (isGlobalEval(left, state_1.state)) {
              warning("W061");
            }
          }
          return that;
        }, 160, true);
        infix("(", function(left, that) {
          if (state_1.state.option.immed && left && !left.immed && left.id === "function") {
            warning("W062");
          }
          var n = 0;
          var p = [];
          if (left) {
            if (left.type === "(identifier)") {
              if (left.value.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/)) {
                if ("Array Number String Boolean Date Object Error Symbol".indexOf(left.value) === -1) {
                  if (left.value === "Math") {
                    warning("W063", left);
                  } else if (state_1.state.option.newcap) {
                    warning("W064", left);
                  }
                }
              }
            }
          }
          if (state_1.state.tokens.next.id !== ")") {
            for (; ; ) {
              p[p.length] = expression(10);
              n += 1;
              if (state_1.state.tokens.next.id !== ",") {
                break;
              }
              comma();
            }
          }
          advance(")");
          if (typeof left === "object") {
            if (!state_1.state.inES5() && left.value === "parseInt" && n === 1) {
              warning("W065", state_1.state.tokens.curr);
            }
            if (!state_1.state.option.evil) {
              if (left.value === "eval" || left.value === "Function" || left.value === "execScript") {
                warning("W061", left);
                if (p[0] && p[0].id === "(string)") {
                  addInternalSrc(left, p[0].value);
                }
              } else if (p[0] && p[0].id === "(string)" && (left.value === "setTimeout" || left.value === "setInterval")) {
                warning("W066", left);
                addInternalSrc(left, p[0].value);
              } else if (p[0] && p[0].id === "(string)" && left.value === "." && left.left.value === "window" && (left.right === "setTimeout" || left.right === "setInterval")) {
                warning("W066", left);
                addInternalSrc(left, p[0].value);
              }
            }
            if (!left.identifier && left.id !== "." && left.id !== "[" && left.id !== "=>" && left.id !== "(" && left.id !== "&&" && left.id !== "||" && left.id !== "?" && !(state_1.state.inES6() && left["(name)"])) {
              warning("W067", that);
            }
          }
          that.left = left;
          return that;
        }, 155, true).exps = true;
        prefix("(", function() {
          var pn = state_1.state.tokens.next,
              pn1,
              i = -1;
          var ret,
              triggerFnExpr,
              first,
              last;
          var parens = 1;
          var opening = state_1.state.tokens.curr;
          var preceeding = state_1.state.tokens.prev;
          var isNecessary = !state_1.state.option.singleGroups;
          do {
            if (pn.value === "(") {
              parens += 1;
            } else if (pn.value === ")") {
              parens -= 1;
            }
            i += 1;
            pn1 = pn;
            pn = peek(i);
          } while (!(parens === 0 && pn1.value === ")") && pn.value !== ";" && pn.type !== "(end)");
          if (state_1.state.tokens.next.id === "function") {
            triggerFnExpr = state_1.state.tokens.next.immed = true;
          }
          if (pn.value === "=>") {
            return doFunction({
              type: "arrow",
              parsedOpening: true
            });
          }
          var exprs = [];
          if (state_1.state.tokens.next.id !== ")") {
            for (; ; ) {
              exprs.push(expression(10));
              if (state_1.state.tokens.next.id !== ",") {
                break;
              }
              if (state_1.state.option.nocomma) {
                warning("W127");
              }
              comma();
            }
          }
          advance(")", this);
          if (state_1.state.option.immed && exprs[0] && exprs[0].id === "function") {
            if (state_1.state.tokens.next.id !== "(" && state_1.state.tokens.next.id !== "." && state_1.state.tokens.next.id !== "[") {
              warning("W068", this);
            }
          }
          if (!exprs.length) {
            return;
          }
          if (exprs.length > 1) {
            ret = Object.create(state_1.state.syntax[","]);
            ret.exprs = exprs;
            first = exprs[0];
            last = exprs[exprs.length - 1];
            if (!isNecessary) {
              isNecessary = preceeding.assign || preceeding.delim;
            }
          } else {
            ret = first = last = exprs[0];
            if (!isNecessary) {
              isNecessary = (opening.beginsStmt && (ret.id === "{" || triggerFnExpr || isFunctor(ret))) || (triggerFnExpr && (!isEndOfExpr() || state_1.state.tokens.prev.id !== "}")) || (isFunctor(ret) && !isEndOfExpr()) || (ret.id === "{" && preceeding.id === "=>") || (ret.type === "(number)" && checkPunctuator(pn, ".") && /^\d+$/.test(ret.value));
            }
          }
          if (ret) {
            if (!isNecessary && (first.left || first.right || ret.exprs)) {
              isNecessary = (!isBeginOfExpr(preceeding) && first.lbp <= preceeding.lbp) || (!isEndOfExpr() && last.lbp < state_1.state.tokens.next.lbp);
            }
            if (!isNecessary) {
              warning("W126", opening);
            }
            ret.paren = true;
          }
          return ret;
        });
        application("=>");
        infix("[", function(left, that) {
          var e = expression(10),
              s;
          if (e && e.type === "(string)") {
            if (!state_1.state.option.evil && (e.value === "eval" || e.value === "execScript")) {
              if (isGlobalEval(left, state_1.state)) {
                warning("W061");
              }
            }
            countMember(e.value);
            if (!state_1.state.option.sub && reg_1.identifierRegExp.test(e.value)) {
              s = state_1.state.syntax[e.value];
              if (!s || !isReserved(s)) {
                warning("W069", state_1.state.tokens.prev, e.value);
              }
            }
          }
          advance("]", that);
          if (e && e.value === "hasOwnProperty" && state_1.state.tokens.next.value === "=") {
            warning("W001");
          }
          that.left = left;
          that.right = e;
          return that;
        }, 160, true);
        function comprehensiveArrayExpression() {
          var res = {};
          res.exps = true;
          state_1.state.funct["(comparray)"].stack();
          var reversed = false;
          if (state_1.state.tokens.next.value !== "for") {
            reversed = true;
            if (!state_1.state.inMoz()) {
              warning("W116", state_1.state.tokens.next, "for", state_1.state.tokens.next.value);
            }
            state_1.state.funct["(comparray)"].setState("use");
            res.right = expression(10);
          }
          advance("for");
          if (state_1.state.tokens.next.value === "each") {
            advance("each");
            if (!state_1.state.inMoz()) {
              warning("W118", state_1.state.tokens.curr, "for each");
            }
          }
          advance("(");
          state_1.state.funct["(comparray)"].setState("define");
          res.left = expression(130);
          if (contains_1.default(["in", "of"], state_1.state.tokens.next.value)) {
            advance();
          } else {
            error("E045", state_1.state.tokens.curr);
          }
          state_1.state.funct["(comparray)"].setState("generate");
          expression(10);
          advance(")");
          if (state_1.state.tokens.next.value === "if") {
            advance("if");
            advance("(");
            state_1.state.funct["(comparray)"].setState("filter");
            res.filter = expression(10);
            advance(")");
          }
          if (!reversed) {
            state_1.state.funct["(comparray)"].setState("use");
            res.right = expression(10);
          }
          advance("]");
          state_1.state.funct["(comparray)"].unstack();
          return res;
        }
        prefix("[", function() {
          var blocktype = lookupBlockType();
          if (blocktype.isCompArray) {
            if (!state_1.state.option.esnext && !state_1.state.inMoz()) {
              warning("W118", state_1.state.tokens.curr, "array comprehension");
            }
            return comprehensiveArrayExpression();
          } else if (blocktype.isDestAssign) {
            this.destructAssign = destructuringPattern({
              openingParsed: true,
              assignment: true
            });
            return this;
          }
          var b = state_1.state.tokens.curr.line !== startLine(state_1.state.tokens.next);
          this.first = [];
          if (b) {
            indent += state_1.state.option.indent;
            if (state_1.state.tokens.next.from === indent + state_1.state.option.indent) {
              indent += state_1.state.option.indent;
            }
          }
          while (state_1.state.tokens.next.id !== "(end)") {
            while (state_1.state.tokens.next.id === ",") {
              if (!state_1.state.option.elision) {
                if (!state_1.state.inES5()) {
                  warning("W070");
                } else {
                  warning("W128");
                  do {
                    advance(",");
                  } while (state_1.state.tokens.next.id === ",");
                  continue;
                }
              }
              advance(",");
            }
            if (state_1.state.tokens.next.id === "]") {
              break;
            }
            this.first.push(expression(10));
            if (state_1.state.tokens.next.id === ",") {
              comma({allowTrailing: true});
              if (state_1.state.tokens.next.id === "]" && !state_1.state.inES5()) {
                warning("W070", state_1.state.tokens.curr);
                break;
              }
            } else {
              break;
            }
          }
          if (b) {
            indent -= state_1.state.option.indent;
          }
          advance("]", this);
          return this;
        });
        function isMethod() {
          return state_1.state.funct["(statement)"] && state_1.state.funct["(statement)"].type === "class" || state_1.state.funct["(context)"] && state_1.state.funct["(context)"]["(verb)"] === "class";
        }
        function isPropertyName(token) {
          return token.identifier || token.id === "(string)" || token.id === "(number)";
        }
        function propertyName(preserveOrToken) {
          var id;
          var preserve = true;
          if (typeof preserveOrToken === "object") {
            id = preserveOrToken;
          } else {
            preserve = preserveOrToken;
            id = optionalidentifier(false, true, preserve);
          }
          if (!id) {
            if (state_1.state.tokens.next.id === "(string)") {
              id = state_1.state.tokens.next.value;
              if (!preserve) {
                advance();
              }
            } else if (state_1.state.tokens.next.id === "(number)") {
              id = state_1.state.tokens.next.value.toString();
              if (!preserve) {
                advance();
              }
            }
          } else if (typeof id === "object") {
            if (id.id === "(string)" || id.id === "(identifier)")
              id = id.value;
            else if (id.id === "(number)")
              id = id.value.toString();
          }
          if (id === "hasOwnProperty") {
            warning("W001");
          }
          return id;
        }
        function functionparams(options) {
          var next;
          var paramsIds = [];
          var ident;
          var tokens = [];
          var t;
          var pastDefault = false;
          var pastRest = false;
          var arity = 0;
          var loneArg = options && options.loneArg;
          if (loneArg && loneArg.identifier === true) {
            state_1.state.funct["(scope)"].addParam(loneArg.value, loneArg);
            return {
              arity: 1,
              params: [loneArg.value]
            };
          }
          next = state_1.state.tokens.next;
          if (!options || !options.parsedOpening) {
            advance("(");
          }
          if (state_1.state.tokens.next.id === ")") {
            advance(")");
            return;
          }
          function addParam(addParamArgs) {
            state_1.state.funct["(scope)"].addParam.apply(state_1.state.funct["(scope)"], addParamArgs);
          }
          for (; ; ) {
            arity++;
            var currentParams = [];
            if (contains_1.default(["{", "["], state_1.state.tokens.next.id)) {
              tokens = destructuringPattern();
              for (t in tokens) {
                t = tokens[t];
                if (t.id) {
                  paramsIds.push(t.id);
                  currentParams.push([t.id, t.token]);
                }
              }
            } else {
              if (checkPunctuator(state_1.state.tokens.next, "..."))
                pastRest = true;
              ident = identifier(true);
              if (ident) {
                paramsIds.push(ident);
                currentParams.push([ident, state_1.state.tokens.curr]);
              } else {
                while (!checkPunctuators(state_1.state.tokens.next, [",", ")"]))
                  advance();
              }
            }
            if (pastDefault) {
              if (state_1.state.tokens.next.id !== "=") {
                error("W138", state_1.state.tokens.curr);
              }
            }
            if (state_1.state.tokens.next.id === "=") {
              if (!state_1.state.inES6()) {
                warning("W119", state_1.state.tokens.next, "default parameters", "6");
              }
              advance("=");
              pastDefault = true;
              expression(10);
            }
            currentParams.forEach(addParam);
            if (state_1.state.tokens.next.id === ",") {
              if (pastRest) {
                warning("W131", state_1.state.tokens.next);
              }
              comma();
            } else {
              advance(")", next);
              return {
                arity: arity,
                params: paramsIds
              };
            }
          }
        }
        function functor(name, token, overwrites) {
          var funct = {
            "(name)": name,
            "(breakage)": 0,
            "(loopage)": 0,
            "(tokens)": {},
            "(properties)": {},
            "(catch)": false,
            "(global)": false,
            "(line)": null,
            "(character)": null,
            "(metrics)": null,
            "(statement)": null,
            "(context)": null,
            "(scope)": null,
            "(comparray)": null,
            "(generator)": null,
            "(arrow)": null,
            "(params)": null
          };
          if (token) {
            extend_1.default(funct, {
              "(line)": token.line,
              "(character)": token.character,
              "(metrics)": createMetrics(token)
            });
          }
          extend_1.default(funct, overwrites);
          if (funct["(context)"]) {
            funct["(scope)"] = funct["(context)"]["(scope)"];
            funct["(comparray)"] = funct["(context)"]["(comparray)"];
          }
          return funct;
        }
        function isFunctor(token) {
          return "(scope)" in token;
        }
        function hasParsedCode(funct) {
          return funct["(global)"] && !funct["(verb)"];
        }
        function doTemplateLiteral(left) {
          var ctx = this.context;
          var noSubst = this.noSubst;
          var depth = this.depth;
          if (!noSubst) {
            while (!end()) {
              if (!state_1.state.tokens.next.template || state_1.state.tokens.next.depth > depth) {
                expression(0);
              } else {
                advance();
              }
            }
          }
          return {
            id: "(template)",
            type: "(template)",
            tag: left
          };
          function end() {
            if (state_1.state.tokens.curr.template && state_1.state.tokens.curr.tail && state_1.state.tokens.curr.context === ctx)
              return true;
            var complete = (state_1.state.tokens.next.template && state_1.state.tokens.next.tail && state_1.state.tokens.next.context === ctx);
            if (complete)
              advance();
            return complete || state_1.state.tokens.next.isUnclosed;
          }
        }
        function doFunction(options) {
          var f,
              token,
              name,
              statement,
              classExprBinding,
              isGenerator,
              isArrow,
              ignoreLoopFunc;
          var oldOption = state_1.state.option;
          var oldIgnored = state_1.state.ignored;
          if (options) {
            name = options.name;
            statement = options.statement;
            classExprBinding = options.classExprBinding;
            isGenerator = options.type === "generator";
            isArrow = options.type === "arrow";
            ignoreLoopFunc = options.ignoreLoopFunc;
          }
          state_1.state.option = Object.create(state_1.state.option);
          state_1.state.ignored = Object.create(state_1.state.ignored);
          state_1.state.funct = functor(name || state_1.state.nameStack.infer(), state_1.state.tokens.next, {
            "(statement)": statement,
            "(context)": state_1.state.funct,
            "(arrow)": isArrow,
            "(generator)": isGenerator
          });
          f = state_1.state.funct;
          token = state_1.state.tokens.curr;
          token.funct = state_1.state.funct;
          functions.push(state_1.state.funct);
          state_1.state.funct["(scope)"].stack("functionouter");
          var internallyAccessibleName = name || classExprBinding;
          if (internallyAccessibleName) {
            state_1.state.funct["(scope)"].block.add(internallyAccessibleName, classExprBinding ? "class" : "function", state_1.state.tokens.curr, false);
          }
          state_1.state.funct["(scope)"].stack("functionparams");
          var paramsInfo = functionparams(options);
          if (paramsInfo) {
            state_1.state.funct["(params)"] = paramsInfo.params;
            state_1.state.funct["(metrics)"].arity = paramsInfo.arity;
            state_1.state.funct["(metrics)"].verifyMaxParametersPerFunction();
          } else {
            state_1.state.funct["(metrics)"].arity = 0;
          }
          if (isArrow) {
            if (!state_1.state.inES6(true)) {
              warning("W119", state_1.state.tokens.curr, "arrow function syntax (=>)", "6");
            }
            if (!options.loneArg) {
              advance("=>");
            }
          }
          block(false, true, true, isArrow);
          if (!state_1.state.option.noyield && isGenerator && state_1.state.funct["(generator)"] !== "yielded") {
            warning("W124", state_1.state.tokens.curr);
          }
          state_1.state.funct["(metrics)"].verifyMaxStatementsPerFunction();
          state_1.state.funct["(metrics)"].verifyMaxComplexityPerFunction();
          state_1.state.funct["(unusedOption)"] = state_1.state.option.unused;
          state_1.state.option = oldOption;
          state_1.state.ignored = oldIgnored;
          state_1.state.funct["(last)"] = state_1.state.tokens.curr.line;
          state_1.state.funct["(lastcharacter)"] = state_1.state.tokens.curr.character;
          state_1.state.funct["(scope)"].unstack();
          state_1.state.funct["(scope)"].unstack();
          state_1.state.funct = state_1.state.funct["(context)"];
          if (!ignoreLoopFunc && !state_1.state.option.loopfunc && state_1.state.funct["(loopage)"]) {
            if (f["(isCapturing)"]) {
              warning("W083", token);
            }
          }
          return f;
        }
        function createMetrics(functionStartToken) {
          return {
            statementCount: 0,
            nestedBlockDepth: -1,
            ComplexityCount: 1,
            arity: 0,
            verifyMaxStatementsPerFunction: function() {
              if (state_1.state.option.maxstatements && this.statementCount > state_1.state.option.maxstatements) {
                warning("W071", functionStartToken, this.statementCount);
              }
            },
            verifyMaxParametersPerFunction: function() {
              if (isNumber_1.default(state_1.state.option.maxparams) && this.arity > state_1.state.option.maxparams) {
                warning("W072", functionStartToken, this.arity);
              }
            },
            verifyMaxNestedBlockDepthPerFunction: function() {
              if (state_1.state.option.maxdepth && this.nestedBlockDepth > 0 && this.nestedBlockDepth === state_1.state.option.maxdepth + 1) {
                warning("W073", null, this.nestedBlockDepth);
              }
            },
            verifyMaxComplexityPerFunction: function() {
              var max = state_1.state.option.maxcomplexity;
              var cc = this.ComplexityCount;
              if (max && cc > max) {
                warning("W074", functionStartToken, cc);
              }
            }
          };
        }
        function increaseComplexityCount() {
          state_1.state.funct["(metrics)"].ComplexityCount += 1;
        }
        function checkCondAssignment(expr) {
          var id,
              paren;
          if (expr) {
            id = expr.id;
            paren = expr.paren;
            if (id === "," && (expr = expr.exprs[expr.exprs.length - 1])) {
              id = expr.id;
              paren = paren || expr.paren;
            }
          }
          switch (id) {
            case "=":
            case "+=":
            case "-=":
            case "*=":
            case "%=":
            case "&=":
            case "|=":
            case "^=":
            case "/=":
              if (!paren && !state_1.state.option.boss) {
                warning("W084");
              }
          }
        }
        function checkProperties(props) {
          if (state_1.state.inES5()) {
            for (var name in props) {
              if (props[name] && props[name].setterToken && !props[name].getterToken) {
                warning("W078", props[name].setterToken);
              }
            }
          }
        }
        function metaProperty(name, c) {
          if (checkPunctuator(state_1.state.tokens.next, ".")) {
            var left = state_1.state.tokens.curr.id;
            advance(".");
            var id = identifier();
            state_1.state.tokens.curr.isMetaProperty = true;
            if (name !== id) {
              error("E057", state_1.state.tokens.prev, left, id);
            } else {
              c();
            }
            return state_1.state.tokens.curr;
          }
        }
        (function(x) {
          x.nud = function() {
            var b,
                f,
                i,
                p,
                t,
                isGeneratorMethod = false,
                nextVal;
            var props = Object.create(null);
            b = state_1.state.tokens.curr.line !== startLine(state_1.state.tokens.next);
            if (b) {
              indent += state_1.state.option.indent;
              if (state_1.state.tokens.next.from === indent + state_1.state.option.indent) {
                indent += state_1.state.option.indent;
              }
            }
            var blocktype = lookupBlockType();
            if (blocktype.isDestAssign) {
              this.destructAssign = destructuringPattern({
                openingParsed: true,
                assignment: true
              });
              return this;
            }
            for (; ; ) {
              if (state_1.state.tokens.next.id === "}") {
                break;
              }
              nextVal = state_1.state.tokens.next.value;
              if (state_1.state.tokens.next.identifier && (peekIgnoreEOL().id === "," || peekIgnoreEOL().id === "}")) {
                if (!state_1.state.inES6()) {
                  warning("W104", state_1.state.tokens.next, "object short notation", "6");
                }
                i = propertyName(true);
                saveProperty(props, i, state_1.state.tokens.next);
                expression(10);
              } else if (peek().id !== ":" && (nextVal === "get" || nextVal === "set")) {
                advance(nextVal);
                if (!state_1.state.inES5()) {
                  error("E034");
                }
                i = propertyName();
                if (!i && !state_1.state.inES6()) {
                  error("E035");
                }
                if (i) {
                  saveAccessor(nextVal, props, i, state_1.state.tokens.curr);
                }
                t = state_1.state.tokens.next;
                f = doFunction();
                p = f["(params)"];
                if (nextVal === "get" && i && p) {
                  warning("W076", t, p[0], i);
                } else if (nextVal === "set" && i && (!p || p.length !== 1)) {
                  warning("W077", t, i);
                }
              } else {
                if (state_1.state.tokens.next.value === "*" && state_1.state.tokens.next.type === "(punctuator)") {
                  if (!state_1.state.inES6()) {
                    warning("W104", state_1.state.tokens.next, "generator functions", "6");
                  }
                  advance("*");
                  isGeneratorMethod = true;
                } else {
                  isGeneratorMethod = false;
                }
                if (state_1.state.tokens.next.id === "[") {
                  i = computedPropertyName();
                  state_1.state.nameStack.set(i);
                } else {
                  state_1.state.nameStack.set(state_1.state.tokens.next);
                  i = propertyName();
                  saveProperty(props, i, state_1.state.tokens.next);
                  if (typeof i !== "string") {
                    break;
                  }
                }
                if (state_1.state.tokens.next.value === "(") {
                  if (!state_1.state.inES6()) {
                    warning("W104", state_1.state.tokens.curr, "concise methods", "6");
                  }
                  doFunction({type: isGeneratorMethod ? "generator" : null});
                } else {
                  advance(":");
                  expression(10);
                }
              }
              countMember(i);
              if (state_1.state.tokens.next.id === ",") {
                comma({
                  allowTrailing: true,
                  property: true
                });
                if (state_1.state.tokens.next.id === ",") {
                  warning("W070", state_1.state.tokens.curr);
                } else if (state_1.state.tokens.next.id === "}" && !state_1.state.inES5()) {
                  warning("W070", state_1.state.tokens.curr);
                }
              } else {
                break;
              }
            }
            if (b) {
              indent -= state_1.state.option.indent;
            }
            advance("}", this);
            checkProperties(props);
            return this;
          };
          x.fud = function() {
            error("E036", state_1.state.tokens.curr);
          };
        }(delim("{")));
        function destructuringPattern(options) {
          var isAssignment = options && options.assignment;
          if (!state_1.state.inES6()) {
            warning("W104", state_1.state.tokens.curr, isAssignment ? "destructuring assignment" : "destructuring binding", "6");
          }
          return destructuringPatternRecursive(options);
        }
        function destructuringPatternRecursive(options) {
          var ids;
          var identifiers = [];
          var openingParsed = options && options.openingParsed;
          var isAssignment = options && options.assignment;
          var recursiveOptions = isAssignment ? {assignment: isAssignment} : null;
          var firstToken = openingParsed ? state_1.state.tokens.curr : state_1.state.tokens.next;
          var nextInnerDE = function() {
            var ident;
            if (checkPunctuators(state_1.state.tokens.next, ["[", "{"])) {
              ids = destructuringPatternRecursive(recursiveOptions);
              for (var key in ids) {
                var id_1 = ids[key];
                identifiers.push({
                  id: id_1.id,
                  token: id_1.token
                });
              }
            } else if (checkPunctuator(state_1.state.tokens.next, ",")) {
              identifiers.push({
                id: null,
                token: state_1.state.tokens.curr
              });
            } else if (checkPunctuator(state_1.state.tokens.next, "(")) {
              advance("(");
              nextInnerDE();
              advance(")");
            } else {
              var is_rest = checkPunctuator(state_1.state.tokens.next, "...");
              if (isAssignment) {
                var identifierToken = is_rest ? peek(0) : state_1.state.tokens.next;
                if (!identifierToken.identifier) {
                  warning("E030", identifierToken, identifierToken.value);
                }
                var assignTarget = expression(155);
                if (assignTarget) {
                  checkLeftSideAssign(assignTarget);
                  if (assignTarget.identifier) {
                    ident = assignTarget.value;
                  }
                }
              } else {
                ident = identifier();
              }
              if (ident) {
                identifiers.push({
                  id: ident,
                  token: state_1.state.tokens.curr
                });
              }
              return is_rest;
            }
            return false;
          };
          var assignmentProperty = function() {
            var id;
            if (checkPunctuator(state_1.state.tokens.next, "[")) {
              advance("[");
              expression(10);
              advance("]");
              advance(":");
              nextInnerDE();
            } else if (state_1.state.tokens.next.id === "(string)" || state_1.state.tokens.next.id === "(number)") {
              advance();
              advance(":");
              nextInnerDE();
            } else {
              id = identifier();
              if (checkPunctuator(state_1.state.tokens.next, ":")) {
                advance(":");
                nextInnerDE();
              } else if (id) {
                if (isAssignment) {
                  checkLeftSideAssign(state_1.state.tokens.curr);
                }
                identifiers.push({
                  id: id,
                  token: state_1.state.tokens.curr
                });
              }
            }
          };
          var id,
              value;
          if (checkPunctuator(firstToken, "[")) {
            if (!openingParsed) {
              advance("[");
            }
            if (checkPunctuator(state_1.state.tokens.next, "]")) {
              warning("W137", state_1.state.tokens.curr);
            }
            var element_after_rest = false;
            while (!checkPunctuator(state_1.state.tokens.next, "]")) {
              if (nextInnerDE() && !element_after_rest && checkPunctuator(state_1.state.tokens.next, ",")) {
                warning("W130", state_1.state.tokens.next);
                element_after_rest = true;
              }
              if (checkPunctuator(state_1.state.tokens.next, "=")) {
                if (checkPunctuator(state_1.state.tokens.prev, "...")) {
                  advance("]");
                } else {
                  advance("=");
                }
                id = state_1.state.tokens.prev;
                value = expression(10);
                if (value && value.type === "undefined") {
                  warning("W080", id, id.value);
                }
              }
              if (!checkPunctuator(state_1.state.tokens.next, "]")) {
                advance(",");
              }
            }
            advance("]");
          } else if (checkPunctuator(firstToken, "{")) {
            if (!openingParsed) {
              advance("{");
            }
            if (checkPunctuator(state_1.state.tokens.next, "}")) {
              warning("W137", state_1.state.tokens.curr);
            }
            while (!checkPunctuator(state_1.state.tokens.next, "}")) {
              assignmentProperty();
              if (checkPunctuator(state_1.state.tokens.next, "=")) {
                advance("=");
                id = state_1.state.tokens.prev;
                value = expression(10);
                if (value && value.type === "undefined") {
                  warning("W080", id, id.value);
                }
              }
              if (!checkPunctuator(state_1.state.tokens.next, "}")) {
                advance(",");
                if (checkPunctuator(state_1.state.tokens.next, "}")) {
                  break;
                }
              }
            }
            advance("}");
          }
          return identifiers;
        }
        function destructuringPatternMatch(tokens, value) {
          var first = value.first;
          if (!first)
            return;
          zip_1.default(tokens, Array.isArray(first) ? first : [first]).forEach(function(val) {
            var token = val[0];
            var value = val[1];
            if (token && value)
              token.first = value;
            else if (token && token.first && !value)
              warning("W080", token.first, token.first.value);
          });
        }
        function blockVariableStatement(type, statement, context) {
          var prefix = context && context.prefix;
          var inexport = context && context.inexport;
          var isLet = type === "let";
          var isConst = type === "const";
          var tokens,
              lone,
              value,
              letblock;
          if (!state_1.state.inES6()) {
            warning("W104", state_1.state.tokens.curr, type, "6");
          }
          if (isLet && state_1.state.tokens.next.value === "(") {
            if (!state_1.state.inMoz()) {
              warning("W118", state_1.state.tokens.next, "let block");
            }
            advance("(");
            state_1.state.funct["(scope)"].stack();
            letblock = true;
          } else if (state_1.state.funct["(noblockscopedvar)"]) {
            error("E048", state_1.state.tokens.curr, isConst ? "Const" : "Let");
          }
          statement.first = [];
          for (; ; ) {
            var names = [];
            if (contains_1.default(["{", "["], state_1.state.tokens.next.value)) {
              tokens = destructuringPattern();
              lone = false;
            } else {
              tokens = [{
                id: identifier(),
                token: state_1.state.tokens.curr
              }];
              lone = true;
            }
            if (!prefix && isConst && state_1.state.tokens.next.id !== "=") {
              warning("E012", state_1.state.tokens.curr, state_1.state.tokens.curr.value);
            }
            for (var name in tokens) {
              if (tokens.hasOwnProperty(name)) {
                var t = tokens[name];
                if (state_1.state.funct["(scope)"].block.isGlobal()) {
                  if (predefined[t.id] === false) {
                    warning("W079", t.token, t.id);
                  }
                }
                if (t.id && !state_1.state.funct["(noblockscopedvar)"]) {
                  state_1.state.funct["(scope)"].addlabel(t.id, {
                    type: type,
                    token: t.token
                  });
                  names.push(t.token);
                  if (lone && inexport) {
                    state_1.state.funct["(scope)"].setExported(t.token.value, t.token);
                  }
                }
              }
            }
            if (state_1.state.tokens.next.id === "=") {
              advance("=");
              if (!prefix && peek(0).id === "=" && state_1.state.tokens.next.identifier) {
                warning("W120", state_1.state.tokens.next, state_1.state.tokens.next.value);
              }
              var id = state_1.state.tokens.prev;
              value = expression(prefix ? 120 : 10);
              if (!prefix && value && value.type === "undefined") {
                warning("W080", id, id.value);
              }
              if (lone) {
                tokens[0].first = value;
              } else {
                destructuringPatternMatch(names, value);
              }
            }
            statement.first = statement.first.concat(names);
            if (state_1.state.tokens.next.id !== ",") {
              break;
            }
            comma();
          }
          if (letblock) {
            advance(")");
            block(true, true);
            statement.block = true;
            state_1.state.funct["(scope)"].unstack();
          }
          return statement;
        }
        var conststatement = stmt("const", function(context) {
          return blockVariableStatement("const", this, context);
        });
        conststatement.exps = true;
        var letstatement = stmt("let", function(context) {
          return blockVariableStatement("let", this, context);
        });
        letstatement.exps = true;
        var varstatement = stmt("var", function(context) {
          var prefix = context && context.prefix;
          var inexport = context && context.inexport;
          var tokens,
              lone,
              value;
          var implied = context && context.implied;
          var report = !(context && context.ignore);
          this.first = [];
          for (; ; ) {
            var names = [];
            if (contains_1.default(["{", "["], state_1.state.tokens.next.value)) {
              tokens = destructuringPattern();
              lone = false;
            } else {
              tokens = [{
                id: identifier(),
                token: state_1.state.tokens.curr
              }];
              lone = true;
            }
            if (!(prefix && implied) && report && state_1.state.option.varstmt) {
              warning("W132", this);
            }
            this.first = this.first.concat(names);
            for (var name in tokens) {
              if (tokens.hasOwnProperty(name)) {
                var t = tokens[name];
                if (!implied && state_1.state.funct["(global)"]) {
                  if (predefined[t.id] === false) {
                    warning("W079", t.token, t.id);
                  } else if (state_1.state.option.futurehostile === false) {
                    if ((!state_1.state.inES5() && vars_1.ecmaIdentifiers[5][t.id] === false) || (!state_1.state.inES6() && vars_1.ecmaIdentifiers[6][t.id] === false)) {
                      warning("W129", t.token, t.id);
                    }
                  }
                }
                if (t.id) {
                  if (implied === "for") {
                    if (!state_1.state.funct["(scope)"].has(t.id)) {
                      if (report)
                        warning("W088", t.token, t.id);
                    }
                    state_1.state.funct["(scope)"].block.use(t.id, t.token);
                  } else {
                    state_1.state.funct["(scope)"].addlabel(t.id, {
                      type: "var",
                      token: t.token
                    });
                    if (lone && inexport) {
                      state_1.state.funct["(scope)"].setExported(t.id, t.token);
                    }
                  }
                  names.push(t.token);
                }
              }
            }
            if (state_1.state.tokens.next.id === "=") {
              state_1.state.nameStack.set(state_1.state.tokens.curr);
              advance("=");
              if (peek(0).id === "=" && state_1.state.tokens.next.identifier) {
                if (!prefix && report && !state_1.state.funct["(params)"] || state_1.state.funct["(params)"].indexOf(state_1.state.tokens.next.value) === -1) {
                  warning("W120", state_1.state.tokens.next, state_1.state.tokens.next.value);
                }
              }
              var id = state_1.state.tokens.prev;
              value = expression(prefix ? 120 : 10);
              if (value && !prefix && report && !state_1.state.funct["(loopage)"] && value.type === "undefined") {
                warning("W080", id, id.value);
              }
              if (lone) {
                tokens[0].first = value;
              } else {
                destructuringPatternMatch(names, value);
              }
            }
            if (state_1.state.tokens.next.id !== ",") {
              break;
            }
            comma();
          }
          return this;
        });
        varstatement.exps = true;
        blockstmt("class", function() {
          return classdef.call(this, true);
        });
        function classdef(isStatement) {
          if (!state_1.state.inES6()) {
            warning("W104", state_1.state.tokens.curr, "class", "6");
          }
          if (isStatement) {
            this.name = identifier();
            state_1.state.funct["(scope)"].addlabel(this.name, {
              type: "class",
              token: state_1.state.tokens.curr
            });
          } else if (state_1.state.tokens.next.identifier && state_1.state.tokens.next.value !== "extends") {
            this.name = identifier();
            this.namedExpr = true;
          } else {
            this.name = state_1.state.nameStack.infer();
          }
          classtail(this);
          return this;
        }
        function classtail(c) {
          var wasInClassBody = state_1.state.inClassBody;
          if (state_1.state.tokens.next.value === "extends") {
            advance("extends");
            c.heritage = expression(10);
          }
          state_1.state.inClassBody = true;
          advance("{");
          c.body = classbody(c);
          advance("}");
          state_1.state.inClassBody = wasInClassBody;
        }
        function classbody(c) {
          var name;
          var isStatic;
          var isGenerator;
          var getset;
          var props = Object.create(null);
          var staticProps = Object.create(null);
          var computed;
          for (var i = 0; state_1.state.tokens.next.id !== "}"; ++i) {
            name = state_1.state.tokens.next;
            isStatic = false;
            isGenerator = false;
            getset = null;
            if (name.id === ";") {
              warning("W032");
              advance(";");
              continue;
            }
            if (name.id === "*") {
              isGenerator = true;
              advance("*");
              name = state_1.state.tokens.next;
            }
            if (name.id === "[") {
              name = computedPropertyName();
              computed = true;
            } else if (isPropertyName(name)) {
              advance();
              computed = false;
              if (name.identifier && name.value === "static") {
                if (checkPunctuator(state_1.state.tokens.next, "*")) {
                  isGenerator = true;
                  advance("*");
                }
                if (isPropertyName(state_1.state.tokens.next) || state_1.state.tokens.next.id === "[") {
                  computed = state_1.state.tokens.next.id === "[";
                  isStatic = true;
                  name = state_1.state.tokens.next;
                  if (state_1.state.tokens.next.id === "[") {
                    name = computedPropertyName();
                  } else
                    advance();
                }
              }
              if (name.identifier && (name.value === "get" || name.value === "set")) {
                if (isPropertyName(state_1.state.tokens.next) || state_1.state.tokens.next.id === "[") {
                  computed = state_1.state.tokens.next.id === "[";
                  getset = name;
                  name = state_1.state.tokens.next;
                  if (state_1.state.tokens.next.id === "[") {
                    name = computedPropertyName();
                  } else
                    advance();
                }
              }
            } else {
              warning("W052", state_1.state.tokens.next, state_1.state.tokens.next.value || state_1.state.tokens.next.type);
              advance();
              continue;
            }
            if (!checkPunctuator(state_1.state.tokens.next, "(")) {
              error("E054", state_1.state.tokens.next, state_1.state.tokens.next.value);
              while (state_1.state.tokens.next.id !== "}" && !checkPunctuator(state_1.state.tokens.next, "(")) {
                advance();
              }
              if (state_1.state.tokens.next.value !== "(") {
                doFunction({statement: c});
              }
            }
            if (!computed) {
              if (getset) {
                saveAccessor(getset.value, isStatic ? staticProps : props, name.value, name, true, isStatic);
              } else {
                if (name.value === "constructor") {
                  state_1.state.nameStack.set(c);
                } else {
                  state_1.state.nameStack.set(name);
                }
                saveProperty(isStatic ? staticProps : props, name.value, name, true, isStatic);
              }
            }
            if (getset && name.value === "constructor") {
              var propDesc = getset.value === "get" ? "class getter method" : "class setter method";
              error("E049", name, propDesc, "constructor");
            } else if (name.value === "prototype") {
              error("E049", name, "class method", "prototype");
            }
            propertyName(name);
            doFunction({
              statement: c,
              type: isGenerator ? "generator" : null,
              classExprBinding: c.namedExpr ? c.name : null
            });
          }
          checkProperties(props);
        }
        blockstmt("function", function(context) {
          var inexport = context && context.inexport;
          var generator = false;
          if (state_1.state.tokens.next.value === "*") {
            advance("*");
            if (state_1.state.inES6(true)) {
              generator = true;
            } else {
              warning("W119", state_1.state.tokens.curr, "function*", "6");
            }
          }
          if (inblock) {
            warning("W082", state_1.state.tokens.curr);
          }
          var i = optionalidentifier();
          state_1.state.funct["(scope)"].addlabel(i, {
            type: "function",
            token: state_1.state.tokens.curr
          });
          if (i === void 0) {
            warning("W025");
          } else if (inexport) {
            state_1.state.funct["(scope)"].setExported(i, state_1.state.tokens.prev);
          }
          doFunction({
            name: i,
            statement: this,
            type: generator ? "generator" : null,
            ignoreLoopFunc: inblock
          });
          if (state_1.state.tokens.next.id === "(" && state_1.state.tokens.next.line === state_1.state.tokens.curr.line) {
            error("E039");
          }
          return this;
        });
        prefix("function", function() {
          var generator = false;
          if (state_1.state.tokens.next.value === "*") {
            if (!state_1.state.inES6()) {
              warning("W119", state_1.state.tokens.curr, "function*", "6");
            }
            advance("*");
            generator = true;
          }
          var i = optionalidentifier();
          doFunction({
            name: i,
            type: generator ? "generator" : null
          });
          return this;
        });
        blockstmt("if", function() {
          var t = state_1.state.tokens.next;
          increaseComplexityCount();
          state_1.state.condition = true;
          advance("(");
          var expr = expression(0);
          checkCondAssignment(expr);
          var forinifcheck = null;
          if (state_1.state.option.forin && state_1.state.forinifcheckneeded) {
            state_1.state.forinifcheckneeded = false;
            forinifcheck = state_1.state.forinifchecks[state_1.state.forinifchecks.length - 1];
            if (expr.type === "(punctuator)" && expr.value === "!") {
              forinifcheck.type = "(negative)";
            } else {
              forinifcheck.type = "(positive)";
            }
          }
          advance(")", t);
          state_1.state.condition = false;
          var s = block(true, true);
          if (forinifcheck && forinifcheck.type === "(negative)") {
            if (s && s[0] && s[0].type === "(identifier)" && s[0].value === "continue") {
              forinifcheck.type = "(negative-with-continue)";
            }
          }
          if (state_1.state.tokens.next.id === "else") {
            advance("else");
            if (state_1.state.tokens.next.id === "if" || state_1.state.tokens.next.id === "switch") {
              statement();
            } else {
              block(true, true);
            }
          }
          return this;
        });
        blockstmt("try", function() {
          var b;
          function doCatch() {
            advance("catch");
            advance("(");
            state_1.state.funct["(scope)"].stack("catchparams");
            if (checkPunctuators(state_1.state.tokens.next, ["[", "{"])) {
              var tokens = destructuringPattern();
              tokens.forEach(function(token) {
                if (token.id) {
                  state_1.state.funct["(scope)"].addParam(token.id, token, "exception");
                }
              });
            } else if (state_1.state.tokens.next.type !== "(identifier)") {
              warning("E030", state_1.state.tokens.next, state_1.state.tokens.next.value);
            } else {
              state_1.state.funct["(scope)"].addParam(identifier(), state_1.state.tokens.curr, "exception");
            }
            if (state_1.state.tokens.next.value === "if") {
              if (!state_1.state.inMoz()) {
                warning("W118", state_1.state.tokens.curr, "catch filter");
              }
              advance("if");
              expression(0);
            }
            advance(")");
            block(false);
            state_1.state.funct["(scope)"].unstack();
          }
          block(true);
          while (state_1.state.tokens.next.id === "catch") {
            increaseComplexityCount();
            if (b && (!state_1.state.inMoz())) {
              warning("W118", state_1.state.tokens.next, "multiple catch blocks");
            }
            doCatch();
            b = true;
          }
          if (state_1.state.tokens.next.id === "finally") {
            advance("finally");
            block(true);
            return;
          }
          if (!b) {
            error("E021", state_1.state.tokens.next, "catch", state_1.state.tokens.next.value);
          }
          return this;
        });
        blockstmt("while", function() {
          var t = state_1.state.tokens.next;
          state_1.state.funct["(breakage)"] += 1;
          state_1.state.funct["(loopage)"] += 1;
          increaseComplexityCount();
          advance("(");
          checkCondAssignment(expression(0));
          advance(")", t);
          block(true, true);
          state_1.state.funct["(breakage)"] -= 1;
          state_1.state.funct["(loopage)"] -= 1;
          return this;
        }).labelled = true;
        blockstmt("with", function() {
          var t = state_1.state.tokens.next;
          if (state_1.state.isStrict()) {
            error("E010", state_1.state.tokens.curr);
          } else if (!state_1.state.option.withstmt) {
            warning("W085", state_1.state.tokens.curr);
          }
          advance("(");
          expression(0);
          advance(")", t);
          block(true, true);
          return this;
        });
        blockstmt("switch", function() {
          var t = state_1.state.tokens.next;
          var g = false;
          var noindent = false;
          state_1.state.funct["(breakage)"] += 1;
          advance("(");
          checkCondAssignment(expression(0));
          advance(")", t);
          t = state_1.state.tokens.next;
          advance("{");
          if (state_1.state.tokens.next.from === indent)
            noindent = true;
          if (!noindent)
            indent += state_1.state.option.indent;
          this.cases = [];
          for (; ; ) {
            switch (state_1.state.tokens.next.id) {
              case "case":
                switch (state_1.state.funct["(verb)"]) {
                  case "yield":
                  case "break":
                  case "case":
                  case "continue":
                  case "return":
                  case "switch":
                  case "throw":
                    break;
                  default:
                    if (!state_1.state.tokens.curr.caseFallsThrough) {
                      warning("W086", state_1.state.tokens.curr, "case");
                    }
                }
                advance("case");
                this.cases.push(expression(0));
                increaseComplexityCount();
                g = true;
                advance(":");
                state_1.state.funct["(verb)"] = "case";
                break;
              case "default":
                switch (state_1.state.funct["(verb)"]) {
                  case "yield":
                  case "break":
                  case "continue":
                  case "return":
                  case "throw":
                    break;
                  default:
                    if (this.cases.length) {
                      if (!state_1.state.tokens.curr.caseFallsThrough) {
                        warning("W086", state_1.state.tokens.curr, "default");
                      }
                    }
                }
                advance("default");
                g = true;
                advance(":");
                break;
              case "}":
                if (!noindent)
                  indent -= state_1.state.option.indent;
                advance("}", t);
                state_1.state.funct["(breakage)"] -= 1;
                state_1.state.funct["(verb)"] = void 0;
                return;
              case "(end)":
                error("E023", state_1.state.tokens.next, "}");
                return;
              default:
                indent += state_1.state.option.indent;
                if (g) {
                  switch (state_1.state.tokens.curr.id) {
                    case ",":
                      error("E040");
                      return;
                    case ":":
                      g = false;
                      statements();
                      break;
                    default:
                      error("E025", state_1.state.tokens.curr);
                      return;
                  }
                } else {
                  if (state_1.state.tokens.curr.id === ":") {
                    advance(":");
                    error("E024", state_1.state.tokens.curr, ":");
                    statements();
                  } else {
                    error("E021", state_1.state.tokens.next, "case", state_1.state.tokens.next.value);
                    return;
                  }
                }
                indent -= state_1.state.option.indent;
            }
          }
        }).labelled = true;
        stmt("debugger", function() {
          if (!state_1.state.option.debug) {
            warning("W087", this);
          }
          return this;
        }).exps = true;
        (function() {
          var x = stmt("do", function() {
            state_1.state.funct["(breakage)"] += 1;
            state_1.state.funct["(loopage)"] += 1;
            increaseComplexityCount();
            this.first = block(true, true);
            advance("while");
            var t = state_1.state.tokens.next;
            advance("(");
            checkCondAssignment(expression(0));
            advance(")", t);
            state_1.state.funct["(breakage)"] -= 1;
            state_1.state.funct["(loopage)"] -= 1;
            return this;
          });
          x.labelled = true;
          x.exps = true;
        }());
        blockstmt("for", function() {
          var s,
              t = state_1.state.tokens.next;
          var letscope = false;
          var foreachtok = null;
          if (t.value === "each") {
            foreachtok = t;
            advance("each");
            if (!state_1.state.inMoz()) {
              warning("W118", state_1.state.tokens.curr, "for each");
            }
          }
          increaseComplexityCount();
          advance("(");
          var nextop;
          var i = 0;
          var inof = ["in", "of"];
          var level = 0;
          var comma;
          var initializer;
          if (checkPunctuators(state_1.state.tokens.next, ["{", "["]))
            ++level;
          do {
            nextop = peek(i);
            ++i;
            if (checkPunctuators(nextop, ["{", "["]))
              ++level;
            else if (checkPunctuators(nextop, ["}", "]"]))
              --level;
            if (level < 0)
              break;
            if (level === 0) {
              if (!comma && checkPunctuator(nextop, ","))
                comma = nextop;
              else if (!initializer && checkPunctuator(nextop, "="))
                initializer = nextop;
            }
          } while (level > 0 || !contains_1.default(inof, nextop.value) && nextop.value !== ";" && nextop.type !== "(end)");
          if (contains_1.default(inof, nextop.value)) {
            if (!state_1.state.inES6() && nextop.value === "of") {
              warning("W104", nextop, "for of", "6");
            }
            var ok = !(initializer || comma);
            if (initializer) {
              error("W133", comma, nextop.value, "initializer is forbidden");
            }
            if (comma) {
              error("W133", comma, nextop.value, "more than one ForBinding");
            }
            if (state_1.state.tokens.next.id === "var") {
              advance("var");
              state_1.state.tokens.curr.fud({prefix: true});
            } else if (state_1.state.tokens.next.id === "let" || state_1.state.tokens.next.id === "const") {
              advance(state_1.state.tokens.next.id);
              letscope = true;
              state_1.state.funct["(scope)"].stack();
              state_1.state.tokens.curr.fud({prefix: true});
            } else {
              Object.create(varstatement).fud({
                prefix: true,
                implied: "for",
                ignore: !ok
              });
            }
            advance(nextop.value);
            expression(20);
            advance(")", t);
            if (nextop.value === "in" && state_1.state.option.forin) {
              state_1.state.forinifcheckneeded = true;
              if (state_1.state.forinifchecks === void 0) {
                state_1.state.forinifchecks = [];
              }
              state_1.state.forinifchecks.push({type: "(none)"});
            }
            state_1.state.funct["(breakage)"] += 1;
            state_1.state.funct["(loopage)"] += 1;
            s = block(true, true);
            if (nextop.value === "in" && state_1.state.option.forin) {
              if (state_1.state.forinifchecks && state_1.state.forinifchecks.length > 0) {
                var check = state_1.state.forinifchecks.pop();
                if (s && s.length > 0 && (typeof s[0] !== "object" || s[0].value !== "if") || check.type === "(positive)" && s.length > 1 || check.type === "(negative)") {
                  warning("W089", this);
                }
              }
              state_1.state.forinifcheckneeded = false;
            }
            state_1.state.funct["(breakage)"] -= 1;
            state_1.state.funct["(loopage)"] -= 1;
          } else {
            if (foreachtok) {
              error("E045", foreachtok);
            }
            if (state_1.state.tokens.next.id !== ";") {
              if (state_1.state.tokens.next.id === "var") {
                advance("var");
                state_1.state.tokens.curr.fud();
              } else if (state_1.state.tokens.next.id === "let") {
                advance("let");
                letscope = true;
                state_1.state.funct["(scope)"].stack();
                state_1.state.tokens.curr.fud();
              } else {
                for (; ; ) {
                  expression(0, "for");
                  if (state_1.state.tokens.next.id !== ",") {
                    break;
                  }
                  comma();
                }
              }
            }
            nolinebreak(state_1.state.tokens.curr);
            advance(";");
            state_1.state.funct["(loopage)"] += 1;
            if (state_1.state.tokens.next.id !== ";") {
              checkCondAssignment(expression(0));
            }
            nolinebreak(state_1.state.tokens.curr);
            advance(";");
            if (state_1.state.tokens.next.id === ";") {
              error("E021", state_1.state.tokens.next, ")", ";");
            }
            if (state_1.state.tokens.next.id !== ")") {
              for (; ; ) {
                expression(0, "for");
                if (state_1.state.tokens.next.id !== ",") {
                  break;
                }
                comma();
              }
            }
            advance(")", t);
            state_1.state.funct["(breakage)"] += 1;
            block(true, true);
            state_1.state.funct["(breakage)"] -= 1;
            state_1.state.funct["(loopage)"] -= 1;
          }
          if (letscope) {
            state_1.state.funct["(scope)"].unstack();
          }
          return this;
        }).labelled = true;
        stmt("break", function() {
          var v = state_1.state.tokens.next.value;
          if (!state_1.state.option.asi)
            nolinebreak(this);
          if (state_1.state.tokens.next.id !== ";" && !state_1.state.tokens.next.reach && state_1.state.tokens.curr.line === startLine(state_1.state.tokens.next)) {
            if (!state_1.state.funct["(scope)"].funct.hasBreakLabel(v)) {
              warning("W090", state_1.state.tokens.next, v);
            }
            this.first = state_1.state.tokens.next;
            advance();
          } else {
            if (state_1.state.funct["(breakage)"] === 0)
              warning("W052", state_1.state.tokens.next, this.value);
          }
          reachable(this);
          return this;
        }).exps = true;
        stmt("continue", function() {
          var v = state_1.state.tokens.next.value;
          if (state_1.state.funct["(breakage)"] === 0)
            warning("W052", state_1.state.tokens.next, this.value);
          if (!state_1.state.funct["(loopage)"])
            warning("W052", state_1.state.tokens.next, this.value);
          if (!state_1.state.option.asi)
            nolinebreak(this);
          if (state_1.state.tokens.next.id !== ";" && !state_1.state.tokens.next.reach) {
            if (state_1.state.tokens.curr.line === startLine(state_1.state.tokens.next)) {
              if (!state_1.state.funct["(scope)"].funct.hasBreakLabel(v)) {
                warning("W090", state_1.state.tokens.next, v);
              }
              this.first = state_1.state.tokens.next;
              advance();
            }
          }
          reachable(this);
          return this;
        }).exps = true;
        stmt("return", function() {
          if (this.line === startLine(state_1.state.tokens.next)) {
            if (state_1.state.tokens.next.id !== ";" && !state_1.state.tokens.next.reach) {
              this.first = expression(0);
              if (this.first && this.first.type === "(punctuator)" && this.first.value === "=" && !this.first.paren && !state_1.state.option.boss) {
                warningAt("W093", this.first.line, this.first.character);
              }
            }
          } else {
            if (state_1.state.tokens.next.type === "(punctuator)" && ["[", "{", "+", "-"].indexOf(state_1.state.tokens.next.value) > -1) {
              nolinebreak(this);
            }
          }
          reachable(this);
          return this;
        }).exps = true;
        (function(x) {
          x.exps = true;
          x.lbp = 25;
        }(prefix("yield", function() {
          var prev = state_1.state.tokens.prev;
          if (state_1.state.inES6(true) && !state_1.state.funct["(generator)"]) {
            if (!("(catch)" === state_1.state.funct["(name)"] && state_1.state.funct["(context)"]["(generator)"])) {
              error("E046", state_1.state.tokens.curr, "yield");
            }
          } else if (!state_1.state.inES6()) {
            warning("W104", state_1.state.tokens.curr, "yield", "6");
          }
          state_1.state.funct["(generator)"] = "yielded";
          var delegatingYield = false;
          if (state_1.state.tokens.next.value === "*") {
            delegatingYield = true;
            advance("*");
          }
          if (this.line === startLine(state_1.state.tokens.next) || !state_1.state.inMoz()) {
            if (delegatingYield || (state_1.state.tokens.next.id !== ";" && !state_1.state.option.asi && !state_1.state.tokens.next.reach && state_1.state.tokens.next.nud)) {
              nobreaknonadjacent(state_1.state.tokens.curr, state_1.state.tokens.next);
              this.first = expression(10);
              if (this.first.type === "(punctuator)" && this.first.value === "=" && !this.first.paren && !state_1.state.option.boss) {
                warningAt("W093", this.first.line, this.first.character);
              }
            }
            if (state_1.state.inMoz() && state_1.state.tokens.next.id !== ")" && (prev.lbp > 30 || (!prev.assign && !isEndOfExpr()) || prev.id === "yield")) {
              error("E050", this);
            }
          } else if (!state_1.state.option.asi) {
            nolinebreak(this);
          }
          return this;
        })));
        stmt("throw", function() {
          nolinebreak(this);
          this.first = expression(20);
          reachable(this);
          return this;
        }).exps = true;
        stmt("import", function() {
          if (!state_1.state.inES6()) {
            warning("W119", state_1.state.tokens.curr, "import", "6");
          }
          if (state_1.state.tokens.next.type === "(string)") {
            advance("(string)");
            return this;
          }
          if (state_1.state.tokens.next.identifier) {
            this.name = identifier();
            state_1.state.funct["(scope)"].addlabel(this.name, {
              type: "const",
              token: state_1.state.tokens.curr
            });
            if (state_1.state.tokens.next.value === ",") {
              advance(",");
            } else {
              advance("from");
              advance("(string)");
              return this;
            }
          }
          if (state_1.state.tokens.next.id === "*") {
            advance("*");
            advance("as");
            if (state_1.state.tokens.next.identifier) {
              this.name = identifier();
              state_1.state.funct["(scope)"].addlabel(this.name, {
                type: "const",
                token: state_1.state.tokens.curr
              });
            }
          } else {
            advance("{");
            for (; ; ) {
              if (state_1.state.tokens.next.value === "}") {
                advance("}");
                break;
              }
              var importName;
              if (state_1.state.tokens.next.type === "default") {
                importName = "default";
                advance("default");
              } else {
                importName = identifier();
              }
              if (state_1.state.tokens.next.value === "as") {
                advance("as");
                importName = identifier();
              }
              state_1.state.funct["(scope)"].addlabel(importName, {
                type: "const",
                token: state_1.state.tokens.curr
              });
              if (state_1.state.tokens.next.value === ",") {
                advance(",");
              } else if (state_1.state.tokens.next.value === "}") {
                advance("}");
                break;
              } else {
                error("E024", state_1.state.tokens.next, state_1.state.tokens.next.value);
                break;
              }
            }
          }
          advance("from");
          advance("(string)");
          return this;
        }).exps = true;
        stmt("export", function() {
          var ok = true;
          var token;
          var identifier;
          if (!state_1.state.inES6()) {
            warning("W119", state_1.state.tokens.curr, "export", "6");
            ok = false;
          }
          if (!state_1.state.funct["(scope)"].block.isGlobal()) {
            error("E053", state_1.state.tokens.curr);
            ok = false;
          }
          if (state_1.state.tokens.next.value === "*") {
            advance("*");
            advance("from");
            advance("(string)");
            return this;
          }
          if (state_1.state.tokens.next.type === "default") {
            state_1.state.nameStack.set(state_1.state.tokens.next);
            advance("default");
            var exportType = state_1.state.tokens.next.id;
            if (exportType === "function" || exportType === "class") {
              this.block = true;
            }
            token = peek();
            expression(10);
            identifier = token.value;
            if (this.block) {
              state_1.state.funct["(scope)"].addlabel(identifier, {
                type: exportType,
                token: token
              });
              state_1.state.funct["(scope)"].setExported(identifier, token);
            }
            return this;
          }
          if (state_1.state.tokens.next.value === "{") {
            advance("{");
            var exportedTokens = [];
            for (; ; ) {
              if (!state_1.state.tokens.next.identifier) {
                error("E030", state_1.state.tokens.next, state_1.state.tokens.next.value);
              }
              advance();
              exportedTokens.push(state_1.state.tokens.curr);
              if (state_1.state.tokens.next.value === "as") {
                advance("as");
                if (!state_1.state.tokens.next.identifier) {
                  error("E030", state_1.state.tokens.next, state_1.state.tokens.next.value);
                }
                advance();
              }
              if (state_1.state.tokens.next.value === ",") {
                advance(",");
              } else if (state_1.state.tokens.next.value === "}") {
                advance("}");
                break;
              } else {
                error("E024", state_1.state.tokens.next, state_1.state.tokens.next.value);
                break;
              }
            }
            if (state_1.state.tokens.next.value === "from") {
              advance("from");
              advance("(string)");
            } else if (ok) {
              exportedTokens.forEach(function(token) {
                state_1.state.funct["(scope)"].setExported(token.value, token);
              });
            }
            return this;
          }
          if (state_1.state.tokens.next.id === "var") {
            advance("var");
            state_1.state.tokens.curr.fud({inexport: true});
          } else if (state_1.state.tokens.next.id === "let") {
            advance("let");
            state_1.state.tokens.curr.fud({inexport: true});
          } else if (state_1.state.tokens.next.id === "const") {
            advance("const");
            state_1.state.tokens.curr.fud({inexport: true});
          } else if (state_1.state.tokens.next.id === "function") {
            this.block = true;
            advance("function");
            state_1.state.syntax["function"].fud({inexport: true});
          } else if (state_1.state.tokens.next.id === "class") {
            this.block = true;
            advance("class");
            var classNameToken = state_1.state.tokens.next;
            state_1.state.syntax["class"].fud();
            state_1.state.funct["(scope)"].setExported(classNameToken.value, classNameToken);
          } else {
            error("E024", state_1.state.tokens.next, state_1.state.tokens.next.value);
          }
          return this;
        }).exps = true;
        FutureReservedWord("abstract");
        FutureReservedWord("boolean");
        FutureReservedWord("byte");
        FutureReservedWord("char");
        FutureReservedWord("class", {
          es5: true,
          nud: classdef
        });
        FutureReservedWord("double");
        FutureReservedWord("enum", {es5: true});
        FutureReservedWord("export", {es5: true});
        FutureReservedWord("extends", {es5: true});
        FutureReservedWord("final");
        FutureReservedWord("float");
        FutureReservedWord("goto");
        FutureReservedWord("implements", {
          es5: true,
          strictOnly: true
        });
        FutureReservedWord("import", {es5: true});
        FutureReservedWord("int");
        FutureReservedWord("interface", {
          es5: true,
          strictOnly: true
        });
        FutureReservedWord("long");
        FutureReservedWord("native");
        FutureReservedWord("package", {
          es5: true,
          strictOnly: true
        });
        FutureReservedWord("private", {
          es5: true,
          strictOnly: true
        });
        FutureReservedWord("protected", {
          es5: true,
          strictOnly: true
        });
        FutureReservedWord("public", {
          es5: true,
          strictOnly: true
        });
        FutureReservedWord("short");
        FutureReservedWord("static", {
          es5: true,
          strictOnly: true
        });
        FutureReservedWord("super", {es5: true});
        FutureReservedWord("synchronized");
        FutureReservedWord("transient");
        FutureReservedWord("volatile");
        var lookupBlockType = function() {
          var pn,
              pn1,
              prev;
          var i = -1;
          var bracketStack = 0;
          var ret = {};
          if (checkPunctuators(state_1.state.tokens.curr, ["[", "{"])) {
            bracketStack += 1;
          }
          do {
            prev = i === -1 ? state_1.state.tokens.curr : pn;
            pn = i === -1 ? state_1.state.tokens.next : peek(i);
            pn1 = peek(i + 1);
            i = i + 1;
            if (checkPunctuators(pn, ["[", "{"])) {
              bracketStack += 1;
            } else if (checkPunctuators(pn, ["]", "}"])) {
              bracketStack -= 1;
            }
            if (bracketStack === 1 && pn.identifier && pn.value === "for" && !checkPunctuator(prev, ".")) {
              ret.isCompArray = true;
              ret.notJson = true;
              break;
            }
            if (bracketStack === 0 && checkPunctuators(pn, ["}", "]"])) {
              if (pn1.value === "=") {
                ret.isDestAssign = true;
                ret.notJson = true;
                break;
              } else if (pn1.value === ".") {
                ret.notJson = true;
                break;
              }
            }
            if (checkPunctuator(pn, ";")) {
              ret.isBlock = true;
              ret.notJson = true;
            }
          } while (bracketStack > 0 && pn.id !== "(end)");
          return ret;
        };
        function saveProperty(props, name, tkn, isClass, isStatic) {
          var msgs = ["key", "class method", "static class method"];
          var msg = msgs[(isClass || false) + (isStatic || false)];
          if (tkn.identifier) {
            name = tkn.value;
          }
          if (props[name] && name !== "__proto__") {
            warning("W075", state_1.state.tokens.next, msg, name);
          } else {
            props[name] = Object.create(null);
          }
          props[name].basic = true;
          props[name].basictkn = tkn;
        }
        function saveAccessor(accessorType, props, name, tkn, isClass, isStatic) {
          var flagName = accessorType === "get" ? "getterToken" : "setterToken";
          var msg = "";
          if (isClass) {
            if (isStatic) {
              msg += "static ";
            }
            msg += accessorType + "ter method";
          } else {
            msg = "key";
          }
          state_1.state.tokens.curr.accessorType = accessorType;
          state_1.state.nameStack.set(tkn);
          if (props[name]) {
            if ((props[name].basic || props[name][flagName]) && name !== "__proto__") {
              warning("W075", state_1.state.tokens.next, msg, name);
            }
          } else {
            props[name] = Object.create(null);
          }
          props[name][flagName] = tkn;
        }
        function computedPropertyName() {
          advance("[");
          if (!state_1.state.inES6()) {
            warning("W119", state_1.state.tokens.curr, "computed property names", "6");
          }
          var value = expression(10);
          advance("]");
          return value;
        }
        function checkPunctuators(token, values) {
          if (token.type === "(punctuator)") {
            return contains_1.default(values, token.value);
          }
          return false;
        }
        function checkPunctuator(token, value) {
          return token.type === "(punctuator)" && token.value === value;
        }
        function destructuringAssignOrJsonValue() {
          var block = lookupBlockType();
          if (block.notJson) {
            if (!state_1.state.inES6() && block.isDestAssign) {
              warning("W104", state_1.state.tokens.curr, "destructuring assignment", "6");
            }
            statements();
          } else {
            state_1.state.option.laxbreak = true;
            state_1.state.jsonMode = true;
            jsonValue();
          }
        }
        var arrayComprehension = function() {
          var CompArray = function() {
            this.mode = "use";
            this.variables = [];
          };
          var _carrays = [];
          var _current;
          function declare(v) {
            var l = _current.variables.filter(function(elt) {
              if (elt.value === v) {
                elt.undef = false;
                return v;
              }
            }).length;
            return l !== 0;
          }
          function use(v) {
            var l = _current.variables.filter(function(elt) {
              if (elt.value === v && !elt.undef) {
                if (elt.unused === true) {
                  elt.unused = false;
                }
                return v;
              }
            }).length;
            return (l === 0);
          }
          return {
            stack: function() {
              _current = new CompArray();
              _carrays.push(_current);
            },
            unstack: function() {
              _current.variables.filter(function(v) {
                if (v.unused)
                  warning("W098", v.token, v.raw_text || v.value);
                if (v.undef)
                  state_1.state.funct["(scope)"].block.use(v.value, v.token);
              });
              _carrays.splice(-1, 1);
              _current = _carrays[_carrays.length - 1];
            },
            setState: function(s) {
              if (contains_1.default(["use", "define", "generate", "filter"], s))
                _current.mode = s;
            },
            check: function(v) {
              if (!_current) {
                return;
              }
              if (_current && _current.mode === "use") {
                if (use(v)) {
                  _current.variables.push({
                    funct: state_1.state.funct,
                    token: state_1.state.tokens.curr,
                    value: v,
                    undef: true,
                    unused: false
                  });
                }
                return true;
              } else if (_current && _current.mode === "define") {
                if (!declare(v)) {
                  _current.variables.push({
                    funct: state_1.state.funct,
                    token: state_1.state.tokens.curr,
                    value: v,
                    undef: false,
                    unused: true
                  });
                }
                return true;
              } else if (_current && _current.mode === "generate") {
                state_1.state.funct["(scope)"].block.use(v, state_1.state.tokens.curr);
                return true;
              } else if (_current && _current.mode === "filter") {
                if (use(v)) {
                  state_1.state.funct["(scope)"].block.use(v, state_1.state.tokens.curr);
                }
                return true;
              }
              return false;
            }
          };
        };
        function jsonValue() {
          function jsonObject() {
            var o = {},
                t = state_1.state.tokens.next;
            advance("{");
            if (state_1.state.tokens.next.id !== "}") {
              for (; ; ) {
                if (state_1.state.tokens.next.id === "(end)") {
                  error("E026", state_1.state.tokens.next, t.line);
                } else if (state_1.state.tokens.next.id === "}") {
                  warning("W094", state_1.state.tokens.curr);
                  break;
                } else if (state_1.state.tokens.next.id === ",") {
                  error("E028", state_1.state.tokens.next);
                } else if (state_1.state.tokens.next.id !== "(string)") {
                  warning("W095", state_1.state.tokens.next, state_1.state.tokens.next.value);
                }
                if (o[state_1.state.tokens.next.value] === true) {
                  warning("W075", state_1.state.tokens.next, "key", state_1.state.tokens.next.value);
                } else if ((state_1.state.tokens.next.value === "__proto__" && !state_1.state.option.proto) || (state_1.state.tokens.next.value === "__iterator__" && !state_1.state.option.iterator)) {
                  warning("W096", state_1.state.tokens.next, state_1.state.tokens.next.value);
                } else {
                  o[state_1.state.tokens.next.value] = true;
                }
                advance();
                advance(":");
                jsonValue();
                if (state_1.state.tokens.next.id !== ",") {
                  break;
                }
                advance(",");
              }
            }
            advance("}");
          }
          function jsonArray() {
            var t = state_1.state.tokens.next;
            advance("[");
            if (state_1.state.tokens.next.id !== "]") {
              for (; ; ) {
                if (state_1.state.tokens.next.id === "(end)") {
                  error("E027", state_1.state.tokens.next, t.line);
                } else if (state_1.state.tokens.next.id === "]") {
                  warning("W094", state_1.state.tokens.curr);
                  break;
                } else if (state_1.state.tokens.next.id === ",") {
                  error("E028", state_1.state.tokens.next);
                }
                jsonValue();
                if (state_1.state.tokens.next.id !== ",") {
                  break;
                }
                advance(",");
              }
            }
            advance("]");
          }
          switch (state_1.state.tokens.next.id) {
            case "{":
              jsonObject();
              break;
            case "[":
              jsonArray();
              break;
            case "true":
            case "false":
            case "null":
            case "(number)":
            case "(string)":
              advance();
              break;
            case "-":
              advance("-");
              advance("(number)");
              break;
            default:
              error("E003", state_1.state.tokens.next);
          }
        }
        var escapeRegex = function(str) {
          return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        };
        var itself = function(s, o, g) {
          var i,
              k,
              x,
              reIgnoreStr,
              reIgnore;
          var optionKeys;
          var newOptionObj = {};
          var newIgnoredObj = {};
          o = clone_1.default(o);
          state_1.state.reset();
          if (o && o.scope) {
            JSHINT.scope = o.scope;
          } else {
            JSHINT.errors = [];
            JSHINT.undefs = [];
            JSHINT.internals = [];
            JSHINT.blacklist = {};
            JSHINT.scope = "(main)";
          }
          predefined = Object.create(null);
          combine(predefined, vars_1.ecmaIdentifiers[3]);
          combine(predefined, vars_1.reservedVars);
          combine(predefined, g || {});
          declared = Object.create(null);
          var exported = Object.create(null);
          if (o) {
            each_1.default(o.predef || null, function(item) {
              var slice,
                  prop;
              if (item[0] === "-") {
                slice = item.slice(1);
                JSHINT.blacklist[slice] = slice;
                delete predefined[slice];
              } else {
                prop = Object.getOwnPropertyDescriptor(o.predef, item);
                predefined[item] = prop ? prop.value : false;
              }
            });
            each_1.default(o.exported || null, function(item) {
              exported[item] = true;
            });
            delete o.predef;
            delete o.exported;
            optionKeys = Object.keys(o);
            for (x = 0; x < optionKeys.length; x++) {
              if (/^-W\d{3}$/g.test(optionKeys[x])) {
                newIgnoredObj[optionKeys[x].slice(1)] = true;
              } else {
                var optionKey = optionKeys[x];
                newOptionObj[optionKey] = o[optionKey];
                if ((optionKey === "esversion" && o[optionKey] === 5) || (optionKey === "es5" && o[optionKey])) {
                  warningAt("I003", 0, 0);
                }
              }
            }
          }
          state_1.state.option = newOptionObj;
          state_1.state.ignored = newIgnoredObj;
          state_1.state.option.indent = state_1.state.option.indent || 4;
          state_1.state.option.maxerr = state_1.state.option.maxerr || 50;
          indent = 1;
          var scopeManagerInst = scope_manager_1.scopeManager(state_1.state, predefined, exported, declared);
          scopeManagerInst.on("warning", function(ev) {
            warning.apply(null, [ev.code, ev.token].concat(ev.data));
          });
          scopeManagerInst.on("error", function(ev) {
            error.apply(null, [ev.code, ev.token].concat(ev.data));
          });
          state_1.state.funct = functor("(global)", null, {
            "(global)": true,
            "(scope)": scopeManagerInst,
            "(comparray)": arrayComprehension(),
            "(metrics)": createMetrics(state_1.state.tokens.next)
          });
          functions = [state_1.state.funct];
          urls = [];
          stack = null;
          member = {};
          membersOnly = null;
          inblock = false;
          lookahead = [];
          if (!isString(s) && !Array.isArray(s)) {
            errorAt("E004", 0);
            return false;
          }
          api = {
            get isJSON() {
              return state_1.state.jsonMode;
            },
            getOption: function(name) {
              return state_1.state.option[name] || null;
            },
            getCache: function(name) {
              return state_1.state.cache[name];
            },
            setCache: function(name, value) {
              state_1.state.cache[name] = value;
            },
            warn: function(code, data) {
              warningAt.apply(null, [code, data.line, data.char].concat(data.data));
            },
            on: function(names, listener) {
              names.split(" ").forEach(function(name) {
                emitter.on(name, listener);
              }.bind(this));
            }
          };
          emitter.removeAllListeners();
          (extraModules || []).forEach(function(func) {
            func(api);
          });
          state_1.state.tokens.prev = state_1.state.tokens.curr = state_1.state.tokens.next = state_1.state.syntax["(begin)"];
          if (o && o.ignoreDelimiters) {
            if (!Array.isArray(o.ignoreDelimiters)) {
              o.ignoreDelimiters = [o.ignoreDelimiters];
            }
            o.ignoreDelimiters.forEach(function(delimiterPair) {
              if (!delimiterPair.start || !delimiterPair.end)
                return;
              reIgnoreStr = escapeRegex(delimiterPair.start) + "[\\s\\S]*?" + escapeRegex(delimiterPair.end);
              reIgnore = new RegExp(reIgnoreStr, "ig");
              s = s.replace(reIgnore, function(match) {
                return match.replace(/./g, " ");
              });
            });
          }
          lex = new lex_1.default(s);
          lex.on("warning", function(ev) {
            warningAt.apply(null, [ev.code, ev.line, ev.character].concat(ev.data));
          });
          lex.on("error", function(ev) {
            errorAt.apply(null, [ev.code, ev.line, ev.character].concat(ev.data));
          });
          lex.on("fatal", function(ev) {
            quit("E041", ev);
          });
          lex.on("Identifier", function(ev) {
            emitter.emit("Identifier", ev);
          });
          lex.on("String", function(ev) {
            emitter.emit("String", ev);
          });
          lex.on("Number", function(ev) {
            emitter.emit("Number", ev);
          });
          lex.start();
          for (var name in o) {
            if (has_1.default(o, name)) {
              checkOption(name, state_1.state.tokens.curr);
            }
          }
          try {
            assume();
            combine(predefined, g || {});
            comma['first'] = true;
            advance();
            switch (state_1.state.tokens.next.id) {
              case "{":
              case "[":
                destructuringAssignOrJsonValue();
                break;
              default:
                directives();
                if (state_1.state.directive["use strict"]) {
                  if (state_1.state.option.strict !== "global" && !((state_1.state.option.strict === true || !state_1.state.option.strict) && (state_1.state.option.globalstrict || state_1.state.option.module || state_1.state.option.node || state_1.state.option.phantom || state_1.state.option.browserify))) {
                    warning("W097", state_1.state.tokens.prev);
                  }
                }
                statements();
            }
            if (state_1.state.tokens.next.id !== "(end)") {
              quit("E041", state_1.state.tokens.curr);
            }
            state_1.state.funct["(scope)"].unstack();
          } catch (err) {
            if (err && err.name === "JSHintError") {
              var nt = state_1.state.tokens.next || {};
              JSHINT.errors.push({
                scope: "(main)",
                raw: err.raw,
                code: err.code,
                reason: err.reason,
                line: err.line || nt.line,
                character: err.character || nt.from
              }, null);
            } else {
              throw err;
            }
          }
          if (JSHINT.scope === "(main)") {
            o = o || {};
            for (i = 0; i < JSHINT.internals.length; i += 1) {
              k = JSHINT.internals[i];
              o.scope = k.elem;
              itself(k.value, o, g);
            }
          }
          return JSHINT.errors.length === 0;
        };
        itself.addModule = function(func) {
          extraModules.push(func);
        };
        itself.addModule(style_1.register);
        itself.data = function() {
          var data = {
            functions: [],
            options: state_1.state.option
          };
          var fu,
              f,
              i,
              j,
              n,
              globals;
          if (itself.errors.length) {
            data.errors = itself.errors;
          }
          if (state_1.state.jsonMode) {
            data.json = true;
          }
          var impliedGlobals = state_1.state.funct["(scope)"].getImpliedGlobals();
          if (impliedGlobals.length > 0) {
            data.implieds = impliedGlobals;
          }
          if (urls.length > 0) {
            data.urls = urls;
          }
          globals = state_1.state.funct["(scope)"].getUsedOrDefinedGlobals();
          if (globals.length > 0) {
            data.globals = globals;
          }
          for (i = 1; i < functions.length; i += 1) {
            f = functions[i];
            fu = {};
            for (j = 0; j < functionicity.length; j += 1) {
              fu[functionicity[j]] = [];
            }
            for (j = 0; j < functionicity.length; j += 1) {
              if (fu[functionicity[j]].length === 0) {
                delete fu[functionicity[j]];
              }
            }
            fu.name = f["(name)"];
            fu.param = f["(params)"];
            fu.line = f["(line)"];
            fu.character = f["(character)"];
            fu.last = f["(last)"];
            fu.lastcharacter = f["(lastcharacter)"];
            fu.metrics = {
              complexity: f["(metrics)"].ComplexityCount,
              parameters: f["(metrics)"].arity,
              statements: f["(metrics)"].statementCount
            };
            data.functions.push(fu);
          }
          var unuseds = state_1.state.funct["(scope)"].getUnuseds();
          if (unuseds.length > 0) {
            data.unused = unuseds;
          }
          for (n in member) {
            if (typeof member[n] === "number") {
              data.member = member;
              break;
            }
          }
          return data;
        };
        itself.jshint = itself;
        return itself;
      }()));
    }
  };
});

System.register("src/mode/JavaScriptWorker.js", ["../lib/mixin", "../worker/Mirror", "./javascript/jshint"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mixin_1,
      Mirror_1,
      jshint_1;
  var disabledWarningsRe,
      errorsRe,
      infoRe,
      JavaScriptWorker;
  function isValidJS(str) {
    try {
      eval("throw 0;" + str);
    } catch (e) {
      if (e === 0)
        return true;
    }
    return false;
  }
  function startRegex(arr) {
    return RegExp("^(" + arr.join("|") + ")");
  }
  return {
    setters: [function(mixin_1_1) {
      mixin_1 = mixin_1_1;
    }, function(Mirror_1_1) {
      Mirror_1 = Mirror_1_1;
    }, function(jshint_1_1) {
      jshint_1 = jshint_1_1;
    }],
    execute: function() {
      disabledWarningsRe = startRegex(["Bad for in variable '(.+)'.", 'Missing "use strict"']);
      errorsRe = startRegex(["Unexpected", "Expected ", "Confusing (plus|minus)", "\\{a\\} unterminated regular expression", "Unclosed ", "Unmatched ", "Unbegun comment", "Bad invocation", "Missing space after", "Missing operator at"]);
      infoRe = startRegex(["Expected an assignment", "Bad escapement of EOL", "Unexpected comma", "Unexpected space", "Missing radix parameter.", "A leading decimal point can", "\\['{a}'\\] is better written in dot notation.", "'{a}' used out of scope"]);
      JavaScriptWorker = (function(_super) {
        __extends(JavaScriptWorker, _super);
        function JavaScriptWorker(host) {
          _super.call(this, host, 500);
          this.setOptions();
        }
        JavaScriptWorker.prototype.setOptions = function(options) {
          this.options = options || {
            esnext: true,
            moz: true,
            devel: true,
            browser: true,
            node: true,
            laxcomma: true,
            laxbreak: true,
            lastsemic: true,
            onevar: false,
            passfail: false,
            maxerr: 100,
            expr: true,
            multistr: true,
            globalstrict: true
          };
          this.doc.getValue() && this.deferredUpdate.schedule(100);
        };
        JavaScriptWorker.prototype.changeOptions = function(options) {
          mixin_1.default(this.options, options);
          this.doc.getValue() && this.deferredUpdate.schedule(100);
        };
        JavaScriptWorker.prototype.onUpdate = function() {
          var value = this.doc.getValue();
          value = value.replace(/^#!.*\n/, "\n");
          if (!value) {
            this.emitAnnotations([]);
            return;
          }
          var annotations = [];
          var maxErrorLevel = isValidJS(value) ? "warning" : "error";
          jshint_1.JSHINT(value, this.options);
          var results = jshint_1.JSHINT.errors;
          var errorAdded = false;
          for (var i = 0; i < results.length; i++) {
            var error = results[i];
            if (!error)
              continue;
            var raw = error.raw;
            var type = "warning";
            if (raw === "Missing semicolon.") {
              var str = error.evidence.substr(error.character);
              str = str.charAt(str.search(/\S/));
              if (maxErrorLevel == "error" && str && /[\w\d{(['"]/.test(str)) {
                error.reason = 'Missing ";" before statement';
                type = "error";
              } else {
                type = "info";
              }
            } else if (disabledWarningsRe.test(raw)) {
              continue;
            } else if (infoRe.test(raw)) {
              type = "info";
            } else if (errorsRe.test(raw)) {
              errorAdded = true;
              type = maxErrorLevel;
            } else if (raw === "'{a}' is not defined.") {
              type = "warning";
            } else if (raw === "'{a}' is defined but never used.") {
              type = "info";
            }
            annotations.push({
              row: error.line - 1,
              column: error.character - 1,
              text: error.reason,
              type: type
            });
            if (errorAdded) {}
          }
          this.emitAnnotations(annotations);
        };
        return JavaScriptWorker;
      })(Mirror_1.default);
      exports_1("default", JavaScriptWorker);
    }
  };
});

System.register("src/lib/mixin.js", [], function(exports_1) {
  function mixin(obj, base) {
    for (var key in base) {
      obj[key] = base[key];
    }
    return obj;
  }
  exports_1("default", mixin);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/lib/delayedCall.js", [], function(exports_1) {
  function delayedCall(fcn, defaultTimeout) {
    var timer = null;
    var callbackWrapper = function() {
      timer = null;
      fcn();
    };
    var _self = function(timeout) {
      if (timer === null) {
        timer = setTimeout(callbackWrapper, timeout || defaultTimeout);
      }
    };
    _self.delay = function(timeout) {
      timer && clearTimeout(timer);
      timer = setTimeout(callbackWrapper, timeout || defaultTimeout);
    };
    _self.schedule = _self;
    _self.call = function() {
      _self.cancel();
      fcn();
    };
    _self.cancel = function() {
      timer && clearTimeout(timer);
      timer = null;
    };
    _self.isPending = function() {
      return timer !== null;
    };
    return _self;
  }
  exports_1("default", delayedCall);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("src/worker/Mirror.js", ["../Document", "../lib/delayedCall"], function(exports_1) {
  var Document_1,
      delayedCall_1;
  var Mirror;
  return {
    setters: [function(Document_1_1) {
      Document_1 = Document_1_1;
    }, function(delayedCall_1_1) {
      delayedCall_1 = delayedCall_1_1;
    }],
    execute: function() {
      Mirror = (function() {
        function Mirror(host, timeout) {
          var _this = this;
          if (timeout === void 0) {
            timeout = 500;
          }
          if (typeof host !== 'object') {
            throw new TypeError("host must be an object.");
          }
          this.host = host;
          this.$timeout = timeout;
          this.doc = new Document_1.default("");
          var deferredUpdate = this.deferredUpdate = delayedCall_1.default(this.onUpdate.bind(this));
          host.on('change', function(e) {
            _this.doc.applyDeltas(e.data);
            if (_this.$timeout) {
              return deferredUpdate.schedule(_this.$timeout);
            } else {
              _this.onUpdate();
            }
          });
        }
        Mirror.prototype.setTimeout = function(timeout) {
          this.$timeout = timeout;
        };
        Mirror.prototype.setValue = function(value) {
          this.doc.setValue(value);
          this.deferredUpdate.schedule(this.$timeout);
        };
        Mirror.prototype.getValue = function(callbackId) {
          this.host.callback(this.doc.getValue(), callbackId);
        };
        Mirror.prototype.emitAnnotations = function(annotations) {
          this.host.emit("annotations", annotations);
        };
        Mirror.prototype.onUpdate = function() {};
        Mirror.prototype.isPending = function() {
          return this.deferredUpdate.isPending();
        };
        return Mirror;
      })();
      exports_1("default", Mirror);
    }
  };
});

System.register("src/mode/TypeScriptWorker.js", ["../lib/mixin", "../worker/Mirror"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mixin_1,
      Mirror_1;
  var TypeScriptWorker;
  return {
    setters: [function(mixin_1_1) {
      mixin_1 = mixin_1_1;
    }, function(Mirror_1_1) {
      Mirror_1 = Mirror_1_1;
    }],
    execute: function() {
      TypeScriptWorker = (function(_super) {
        __extends(TypeScriptWorker, _super);
        function TypeScriptWorker(host) {
          _super.call(this, host, 500);
          this.setOptions();
        }
        TypeScriptWorker.prototype.setOptions = function(options) {
          this.options = options || {};
        };
        TypeScriptWorker.prototype.changeOptions = function(options) {
          mixin_1.default(this.options, options);
          this.deferredUpdate.schedule(100);
        };
        TypeScriptWorker.prototype.onUpdate = function() {
          var annotations = [];
          this.emitAnnotations(annotations);
        };
        return TypeScriptWorker;
      })(Mirror_1.default);
      exports_1("default", TypeScriptWorker);
    }
  };
});

System.register("src/applyDelta.js", [], function(exports_1) {
  function throwDeltaError(delta, errorText) {
    throw "Invalid Delta: " + errorText;
  }
  function positionInDocument(docLines, position) {
    return position.row >= 0 && position.row < docLines.length && position.column >= 0 && position.column <= docLines[position.row].length;
  }
  function validateDelta(docLines, delta) {
    if (delta.action !== "insert" && delta.action !== "remove")
      throwDeltaError(delta, "delta.action must be 'insert' or 'remove'");
    if (!(delta.lines instanceof Array))
      throwDeltaError(delta, "delta.lines must be an Array");
    if (!delta.start || !delta.end)
      throwDeltaError(delta, "delta.start/end must be an present");
    var start = delta.start;
    if (!positionInDocument(docLines, delta.start))
      throwDeltaError(delta, "delta.start must be contained in document");
    var end = delta.end;
    if (delta.action === "remove" && !positionInDocument(docLines, end))
      throwDeltaError(delta, "delta.end must contained in document for 'remove' actions");
    var numRangeRows = end.row - start.row;
    var numRangeLastLineChars = (end.column - (numRangeRows == 0 ? start.column : 0));
    if (numRangeRows != delta.lines.length - 1 || delta.lines[numRangeRows].length != numRangeLastLineChars)
      throwDeltaError(delta, "delta.range must match delta lines");
  }
  function applyDelta(docLines, delta, doNotValidate) {
    if (!doNotValidate) {
      validateDelta(docLines, delta);
    }
    var row = delta.start.row;
    var startColumn = delta.start.column;
    var line = docLines[row] || "";
    switch (delta.action) {
      case "insert":
        var lines = delta.lines;
        if (lines.length === 1) {
          docLines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
        } else {
          var args = [row, 1];
          args = args.concat(delta.lines);
          docLines.splice.apply(docLines, args);
          docLines[row] = line.substring(0, startColumn) + docLines[row];
          docLines[row + delta.lines.length - 1] += line.substring(startColumn);
        }
        break;
      case "remove":
        var endColumn = delta.end.column;
        var endRow = delta.end.row;
        if (row === endRow) {
          docLines[row] = line.substring(0, startColumn) + line.substring(endColumn);
        } else {
          docLines.splice(row, endRow - row + 1, line.substring(0, startColumn) + docLines[endRow].substring(endColumn));
        }
        break;
    }
  }
  exports_1("default", applyDelta);
  return {
    setters: [],
    execute: function() {}
  };
});

"use strict";
System.register("src/Range.js", [], function(exports_1) {
  var Range;
  return {
    setters: [],
    execute: function() {
      Range = (function() {
        function Range(startRow, startColumn, endRow, endColumn) {
          this.start = {
            row: startRow,
            column: startColumn
          };
          this.end = {
            row: endRow,
            column: endColumn
          };
        }
        Range.prototype.isEqual = function(range) {
          return this.start.row === range.start.row && this.end.row === range.end.row && this.start.column === range.start.column && this.end.column === range.end.column;
        };
        Range.prototype.toString = function() {
          return ("Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]");
        };
        Range.prototype.contains = function(row, column) {
          return this.compare(row, column) === 0;
        };
        Range.prototype.compareRange = function(range) {
          var cmp;
          var end = range.end;
          var start = range.start;
          cmp = this.compare(end.row, end.column);
          if (cmp === 1) {
            cmp = this.compare(start.row, start.column);
            if (cmp === 1) {
              return 2;
            } else if (cmp === 0) {
              return 1;
            } else {
              return 0;
            }
          } else if (cmp === -1) {
            return -2;
          } else {
            cmp = this.compare(start.row, start.column);
            if (cmp === -1) {
              return -1;
            } else if (cmp === 1) {
              return 42;
            } else {
              return 0;
            }
          }
        };
        Range.prototype.comparePoint = function(point) {
          return this.compare(point.row, point.column);
        };
        Range.prototype.containsRange = function(range) {
          return this.comparePoint(range.start) === 0 && this.comparePoint(range.end) === 0;
        };
        Range.prototype.intersects = function(range) {
          var cmp = this.compareRange(range);
          return (cmp === -1 || cmp === 0 || cmp === 1);
        };
        Range.prototype.isEnd = function(row, column) {
          return this.end.row === row && this.end.column === column;
        };
        Range.prototype.isStart = function(row, column) {
          return this.start.row === row && this.start.column === column;
        };
        Range.prototype.setStart = function(row, column) {
          this.start.row = row;
          this.start.column = column;
        };
        Range.prototype.setEnd = function(row, column) {
          this.end.row = row;
          this.end.column = column;
        };
        Range.prototype.inside = function(row, column) {
          if (this.compare(row, column) === 0) {
            if (this.isEnd(row, column) || this.isStart(row, column)) {
              return false;
            } else {
              return true;
            }
          }
          return false;
        };
        Range.prototype.insideStart = function(row, column) {
          if (this.compare(row, column) === 0) {
            if (this.isEnd(row, column)) {
              return false;
            } else {
              return true;
            }
          }
          return false;
        };
        Range.prototype.insideEnd = function(row, column) {
          if (this.compare(row, column) === 0) {
            if (this.isStart(row, column)) {
              return false;
            } else {
              return true;
            }
          }
          return false;
        };
        Range.prototype.compare = function(row, column) {
          if (!this.isMultiLine()) {
            if (row === this.start.row) {
              return column < this.start.column ? -1 : (column > this.end.column ? 1 : 0);
            }
          }
          if (row < this.start.row)
            return -1;
          if (row > this.end.row)
            return 1;
          if (this.start.row === row)
            return column >= this.start.column ? 0 : -1;
          if (this.end.row === row)
            return column <= this.end.column ? 0 : 1;
          return 0;
        };
        Range.prototype.compareStart = function(row, column) {
          if (this.start.row === row && this.start.column === column) {
            return -1;
          } else {
            return this.compare(row, column);
          }
        };
        Range.prototype.compareEnd = function(row, column) {
          if (this.end.row === row && this.end.column === column) {
            return 1;
          } else {
            return this.compare(row, column);
          }
        };
        Range.prototype.compareInside = function(row, column) {
          if (this.end.row === row && this.end.column === column) {
            return 1;
          } else if (this.start.row === row && this.start.column === column) {
            return -1;
          } else {
            return this.compare(row, column);
          }
        };
        Range.prototype.clipRows = function(firstRow, lastRow) {
          var start;
          var end;
          if (this.end.row > lastRow)
            end = {
              row: lastRow + 1,
              column: 0
            };
          else if (this.end.row < firstRow)
            end = {
              row: firstRow,
              column: 0
            };
          if (this.start.row > lastRow)
            start = {
              row: lastRow + 1,
              column: 0
            };
          else if (this.start.row < firstRow)
            start = {
              row: firstRow,
              column: 0
            };
          return Range.fromPoints(start || this.start, end || this.end);
        };
        Range.prototype.extend = function(row, column) {
          var cmp = this.compare(row, column);
          if (cmp === 0) {
            return this;
          } else if (cmp === -1) {
            var start = {
              row: row,
              column: column
            };
          } else {
            var end = {
              row: row,
              column: column
            };
          }
          return Range.fromPoints(start || this.start, end || this.end);
        };
        Range.prototype.isEmpty = function() {
          return (this.start.row === this.end.row && this.start.column === this.end.column);
        };
        Range.prototype.isMultiLine = function() {
          return (this.start.row !== this.end.row);
        };
        Range.prototype.clone = function() {
          return Range.fromPoints(this.start, this.end);
        };
        Range.prototype.collapseRows = function() {
          if (this.end.column === 0)
            return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0);
          else
            return new Range(this.start.row, 0, this.end.row, 0);
        };
        Range.prototype.moveBy = function(row, column) {
          this.start.row += row;
          this.start.column += column;
          this.end.row += row;
          this.end.column += column;
        };
        Range.fromPoints = function(start, end) {
          return new Range(start.row, start.column, end.row, end.column);
        };
        Range.comparePoints = function(p1, p2) {
          return p1.row - p2.row || p1.column - p2.column;
        };
        return Range;
      })();
      exports_1("default", Range);
    }
  };
});

"use strict";
System.register("src/Document.js", ["./applyDelta", "./Range"], function(exports_1) {
  var applyDelta_1,
      Range_1;
  var $split,
      Document;
  function clipPosition(doc, position) {
    var length = doc.getLength();
    if (position.row >= length) {
      position.row = Math.max(0, length - 1);
      position.column = doc.getLine(length - 1).length;
    } else {
      position.row = Math.max(0, position.row);
      position.column = Math.min(Math.max(position.column, 0), doc.getLine(position.row).length);
    }
    return position;
  }
  return {
    setters: [function(applyDelta_1_1) {
      applyDelta_1 = applyDelta_1_1;
    }, function(Range_1_1) {
      Range_1 = Range_1_1;
    }],
    execute: function() {
      $split = (function() {
        function foo(text) {
          return text.replace(/\r\n|\r/g, "\n").split("\n");
        }
        function bar(text) {
          return text.split(/\r\n|\r|\n/);
        }
        if ("aaa".split(/a/).length === 0) {
          return foo;
        } else {
          return bar;
        }
      })();
      Document = (function() {
        function Document(textOrLines) {
          this.$lines = [];
          this.$autoNewLine = "";
          this.$newLineMode = "auto";
          this.$lines = [""];
          if (textOrLines.length === 0) {
            this.$lines = [""];
          } else if (Array.isArray(textOrLines)) {
            this.insertMergedLines({
              row: 0,
              column: 0
            }, textOrLines);
          } else {
            this.insert({
              row: 0,
              column: 0
            }, textOrLines);
          }
        }
        Document.prototype.setValue = function(text) {
          var len = this.getLength() - 1;
          this.remove(new Range_1.default(0, 0, len, this.getLine(len).length));
          this.insert({
            row: 0,
            column: 0
          }, text);
        };
        Document.prototype.getValue = function() {
          return this.getAllLines().join(this.getNewLineCharacter());
        };
        Document.prototype.$detectNewLine = function(text) {
          var match = text.match(/^.*?(\r\n|\r|\n)/m);
          this.$autoNewLine = match ? match[1] : "\n";
        };
        Document.prototype.getNewLineCharacter = function() {
          switch (this.$newLineMode) {
            case "windows":
              return "\r\n";
            case "unix":
              return "\n";
            default:
              return this.$autoNewLine || "\n";
          }
        };
        Document.prototype.setNewLineMode = function(newLineMode) {
          if (this.$newLineMode === newLineMode) {
            return;
          }
          this.$newLineMode = newLineMode;
        };
        Document.prototype.getNewLineMode = function() {
          return this.$newLineMode;
        };
        Document.prototype.isNewLine = function(text) {
          return (text == "\r\n" || text == "\r" || text == "\n");
        };
        Document.prototype.getLine = function(row) {
          return this.$lines[row] || "";
        };
        Document.prototype.getLines = function(firstRow, lastRow) {
          return this.$lines.slice(firstRow, lastRow + 1);
        };
        Document.prototype.getAllLines = function() {
          return this.getLines(0, this.getLength());
        };
        Document.prototype.getLength = function() {
          return this.$lines.length;
        };
        Document.prototype.getTextRange = function(range) {
          return this.getLinesForRange(range).join(this.getNewLineCharacter());
        };
        Document.prototype.getLinesForRange = function(range) {
          var lines;
          if (range.start.row === range.end.row) {
            lines = [this.getLine(range.start.row).substring(range.start.column, range.end.column)];
          } else {
            lines = this.getLines(range.start.row, range.end.row);
            lines[0] = (lines[0] || "").substring(range.start.column);
            var l = lines.length - 1;
            if (range.end.row - range.start.row == l) {
              lines[l] = lines[l].substring(0, range.end.column);
            }
          }
          return lines;
        };
        Document.prototype.insert = function(position, text) {
          if (this.getLength() <= 1) {
            this.$detectNewLine(text);
          }
          return this.insertMergedLines(position, $split(text));
        };
        ;
        Document.prototype.insertInLine = function(position, text) {
          var start = this.clippedPos(position.row, position.column);
          var end = this.pos(position.row, position.column + text.length);
          this.applyDelta({
            start: start,
            end: end,
            action: "insert",
            lines: [text]
          }, true);
          return this.clonePos(end);
        };
        Document.prototype.clippedPos = function(row, column) {
          var length = this.getLength();
          if (row === undefined) {
            row = length;
          } else if (row < 0) {
            row = 0;
          } else if (row >= length) {
            row = length - 1;
            column = undefined;
          }
          var line = this.getLine(row);
          if (column == undefined)
            column = line.length;
          column = Math.min(Math.max(column, 0), line.length);
          return {
            row: row,
            column: column
          };
        };
        Document.prototype.clonePos = function(pos) {
          return {
            row: pos.row,
            column: pos.column
          };
        };
        Document.prototype.pos = function(row, column) {
          return {
            row: row,
            column: column
          };
        };
        Document.prototype.insertFullLines = function(row, lines) {
          row = Math.min(Math.max(row, 0), this.getLength());
          var column = 0;
          if (row < this.getLength()) {
            lines = lines.concat([""]);
            column = 0;
          } else {
            lines = [""].concat(lines);
            row--;
            column = this.$lines[row].length;
          }
          return this.insertMergedLines({
            row: row,
            column: column
          }, lines);
        };
        Document.prototype.insertMergedLines = function(position, lines) {
          var start = this.clippedPos(position.row, position.column);
          var end = {
            row: start.row + lines.length - 1,
            column: (lines.length == 1 ? start.column : 0) + lines[lines.length - 1].length
          };
          this.applyDelta({
            start: start,
            end: end,
            action: "insert",
            lines: lines
          });
          return this.clonePos(end);
        };
        Document.prototype.remove = function(range) {
          var start = this.clippedPos(range.start.row, range.start.column);
          var end = this.clippedPos(range.end.row, range.end.column);
          this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({
              start: start,
              end: end
            })
          });
          return this.clonePos(start);
        };
        Document.prototype.removeInLine = function(row, startColumn, endColumn) {
          var start = this.clippedPos(row, startColumn);
          var end = this.clippedPos(row, endColumn);
          this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({
              start: start,
              end: end
            })
          }, true);
          return this.clonePos(start);
        };
        Document.prototype.removeFullLines = function(firstRow, lastRow) {
          firstRow = Math.min(Math.max(0, firstRow), this.getLength() - 1);
          lastRow = Math.min(Math.max(0, lastRow), this.getLength() - 1);
          var deleteFirstNewLine = lastRow == this.getLength() - 1 && firstRow > 0;
          var deleteLastNewLine = lastRow < this.getLength() - 1;
          var startRow = (deleteFirstNewLine ? firstRow - 1 : firstRow);
          var startCol = (deleteFirstNewLine ? this.getLine(startRow).length : 0);
          var endRow = (deleteLastNewLine ? lastRow + 1 : lastRow);
          var endCol = (deleteLastNewLine ? 0 : this.getLine(endRow).length);
          var range = new Range_1.default(startRow, startCol, endRow, endCol);
          var deletedLines = this.$lines.slice(firstRow, lastRow + 1);
          this.applyDelta({
            start: range.start,
            end: range.end,
            action: "remove",
            lines: this.getLinesForRange(range)
          });
          return deletedLines;
        };
        ;
        Document.prototype.removeNewLine = function(row) {
          if (row < this.getLength() - 1 && row >= 0) {
            this.applyDelta({
              start: this.pos(row, this.getLine(row).length),
              end: this.pos(row + 1, 0),
              action: "remove",
              lines: ["", ""]
            });
          }
        };
        Document.prototype.replace = function(range, text) {
          if (text.length === 0 && range.isEmpty()) {
            return range.start;
          }
          if (text === this.getTextRange(range)) {
            return range.end;
          }
          this.remove(range);
          if (text) {
            var end = this.insert(range.start, text);
          } else {
            end = range.start;
          }
          return end;
        };
        Document.prototype.applyDeltas = function(deltas) {
          for (var i = 0; i < deltas.length; i++) {
            this.applyDelta(deltas[i]);
          }
        };
        Document.prototype.revertDeltas = function(deltas) {
          for (var i = deltas.length - 1; i >= 0; i--) {
            this.revertDelta(deltas[i]);
          }
        };
        Document.prototype.applyDelta = function(delta, doNotValidate) {
          var isInsert = delta.action === "insert";
          if (isInsert ? delta.lines.length <= 1 && !delta.lines[0] : !Range_1.default.comparePoints(delta.start, delta.end)) {
            return;
          }
          if (isInsert && delta.lines.length > 20000)
            this.$splitAndapplyLargeDelta(delta, 20000);
          applyDelta_1.default(this.$lines, delta, doNotValidate);
        };
        Document.prototype.$splitAndapplyLargeDelta = function(delta, MAX) {
          var lines = delta.lines;
          var l = lines.length;
          var row = delta.start.row;
          var column = delta.start.column;
          var from = 0,
              to = 0;
          do {
            from = to;
            to += MAX - 1;
            var chunk = lines.slice(from, to);
            if (to > l) {
              delta.lines = chunk;
              delta.start.row = row + from;
              delta.start.column = column;
              break;
            }
            chunk.push("");
            this.applyDelta({
              start: this.pos(row + from, column),
              end: this.pos(row + to, column = 0),
              action: delta.action,
              lines: chunk
            }, true);
          } while (true);
        };
        Document.prototype.revertDelta = function(delta) {
          this.applyDelta({
            start: this.clonePos(delta.start),
            end: this.clonePos(delta.end),
            action: (delta.action === "insert" ? "remove" : "insert"),
            lines: delta.lines.slice()
          });
        };
        ;
        Document.prototype.indexToPosition = function(index, startRow) {
          var lines = this.$lines || this.getAllLines();
          var newlineLength = this.getNewLineCharacter().length;
          for (var i = startRow || 0,
              l = lines.length; i < l; i++) {
            index -= lines[i].length + newlineLength;
            if (index < 0)
              return {
                row: i,
                column: index + lines[i].length + newlineLength
              };
          }
          return {
            row: l - 1,
            column: lines[l - 1].length
          };
        };
        Document.prototype.positionToIndex = function(pos, startRow) {
          var lines = this.$lines || this.getAllLines();
          var newlineLength = this.getNewLineCharacter().length;
          var index = 0;
          var row = Math.min(pos.row, lines.length);
          for (var i = startRow || 0; i < row; ++i)
            index += lines[i].length + newlineLength;
          return index + pos.column;
        };
        return Document;
      })();
      exports_1("default", Document);
    }
  };
});

System.register("src/mode/typescript/ScriptInfo.js", ["../../Document"], function(exports_1) {
  var Document_1;
  var ScriptInfo;
  return {
    setters: [function(Document_1_1) {
      Document_1 = Document_1_1;
    }],
    execute: function() {
      ScriptInfo = (function() {
        function ScriptInfo(textOrLines) {
          this.version = 1;
          this.doc = new Document_1.default(textOrLines);
        }
        ScriptInfo.prototype.updateContent = function(content) {
          this.doc.setValue(content);
          this.version++;
        };
        ScriptInfo.prototype.applyDelta = function(delta) {
          this.doc.applyDelta(delta);
          this.version++;
        };
        ScriptInfo.prototype.getValue = function() {
          return this.doc.getValue();
        };
        return ScriptInfo;
      })();
      exports_1("default", ScriptInfo);
    }
  };
});

System.register("src/mode/typescript/DefaultLanguageServiceHost.js", ["./ScriptInfo"], function(exports_1) {
  var ScriptInfo_1;
  var DefaultLanguageServiceHost;
  return {
    setters: [function(ScriptInfo_1_1) {
      ScriptInfo_1 = ScriptInfo_1_1;
    }],
    execute: function() {
      DefaultLanguageServiceHost = (function() {
        function DefaultLanguageServiceHost() {
          this.compilerOptions = {};
          this.compilerOptions.module = ts.ModuleKind.None;
          this.compilerOptions.target = ts.ScriptTarget.ES3;
          this.scripts = {};
        }
        Object.defineProperty(DefaultLanguageServiceHost.prototype, "moduleKind", {
          get: function() {
            var moduleKind = this.compilerOptions.module;
            switch (moduleKind) {
              case ts.ModuleKind.AMD:
                {
                  return 'amd';
                }
              case ts.ModuleKind.CommonJS:
                {
                  return 'commonjs';
                }
              case ts.ModuleKind.ES2015:
                {
                  return 'es2015';
                }
              case ts.ModuleKind.ES6:
                {
                  return 'es6';
                }
              case ts.ModuleKind.None:
                {
                  return 'none';
                }
              case ts.ModuleKind.System:
                {
                  return 'system';
                }
              case ts.ModuleKind.UMD:
                {
                  return 'umd';
                }
              default:
                {
                  throw new Error("Unrecognized module kind: " + moduleKind);
                }
            }
          },
          set: function(moduleKind) {
            moduleKind = moduleKind.toLowerCase();
            switch (moduleKind) {
              case 'amd':
                {
                  this.compilerOptions.module = ts.ModuleKind.AMD;
                  break;
                }
              case 'commonjs':
                {
                  this.compilerOptions.module = ts.ModuleKind.CommonJS;
                  break;
                }
              case 'es2015':
                {
                  this.compilerOptions.module = ts.ModuleKind.ES2015;
                  break;
                }
              case 'es6':
                {
                  this.compilerOptions.module = ts.ModuleKind.ES6;
                  break;
                }
              case 'none':
                {
                  this.compilerOptions.module = ts.ModuleKind.None;
                  break;
                }
              case 'system':
                {
                  this.compilerOptions.module = ts.ModuleKind.System;
                  break;
                }
              case 'umd':
                {
                  this.compilerOptions.module = ts.ModuleKind.UMD;
                  break;
                }
              default:
                {
                  throw new Error("Unrecognized module kind: " + moduleKind);
                }
            }
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(DefaultLanguageServiceHost.prototype, "scriptTarget", {
          get: function() {
            var scriptTarget = this.compilerOptions.target;
            switch (scriptTarget) {
              case ts.ScriptTarget.ES2015:
                {
                  return 'ES2015';
                }
              case ts.ScriptTarget.ES3:
                {
                  return 'ES3';
                }
              case ts.ScriptTarget.ES5:
                {
                  return 'ES5';
                }
              case ts.ScriptTarget.ES6:
                {
                  return 'ES6';
                }
              case ts.ScriptTarget.Latest:
                {
                  return 'Latest';
                }
              default:
                {
                  throw new Error("Unrecognized script target: " + scriptTarget);
                }
            }
          },
          set: function(scriptTarget) {
            scriptTarget = scriptTarget.toLowerCase();
            switch (scriptTarget) {
              case 'es2015':
                {
                  this.compilerOptions.target = ts.ScriptTarget.ES2015;
                  break;
                }
              case 'es3':
                {
                  this.compilerOptions.target = ts.ScriptTarget.ES3;
                  break;
                }
              case 'es5':
                {
                  this.compilerOptions.target = ts.ScriptTarget.ES5;
                  break;
                }
              case 'es6':
                {
                  this.compilerOptions.target = ts.ScriptTarget.ES6;
                  break;
                }
              case 'latest':
                {
                  this.compilerOptions.target = ts.ScriptTarget.Latest;
                  break;
                }
              default:
                {
                  throw new Error("Unrecognized script target: " + scriptTarget);
                }
            }
          },
          enumerable: true,
          configurable: true
        });
        DefaultLanguageServiceHost.prototype.getScriptFileNames = function() {
          return Object.keys(this.scripts);
        };
        DefaultLanguageServiceHost.prototype.addScript = function(fileName, content) {
          var script = new ScriptInfo_1.default(content);
          this.scripts[fileName] = script;
        };
        DefaultLanguageServiceHost.prototype.ensureScript = function(fileName, content) {
          var script = this.scripts[fileName];
          if (script) {
            script.updateContent(content);
          } else {
            this.addScript(fileName, content);
          }
        };
        DefaultLanguageServiceHost.prototype.applyDelta = function(fileName, delta) {
          var script = this.scripts[fileName];
          if (script) {
            script.applyDelta(delta);
          } else {
            throw new Error("No script with fileName '" + fileName + "'");
          }
        };
        DefaultLanguageServiceHost.prototype.removeScript = function(fileName) {
          var script = this.scripts[fileName];
          if (script) {
            delete this.scripts[fileName];
          }
        };
        DefaultLanguageServiceHost.prototype.setCompilationSettings = function(compilerOptions) {
          this.compilerOptions = compilerOptions;
        };
        DefaultLanguageServiceHost.prototype.getCompilationSettings = function() {
          return this.compilerOptions;
        };
        DefaultLanguageServiceHost.prototype.getNewLine = function() {
          return "\n";
        };
        DefaultLanguageServiceHost.prototype.getScriptVersion = function(fileName) {
          var script = this.scripts[fileName];
          return "" + script.version;
        };
        DefaultLanguageServiceHost.prototype.getScriptSnapshot = function(fileName) {
          var script = this.scripts[fileName];
          if (script) {
            var result = ts.ScriptSnapshot.fromString(script.getValue());
            return result;
          } else {
            return void 0;
          }
        };
        DefaultLanguageServiceHost.prototype.getCurrentDirectory = function() {
          return "";
        };
        DefaultLanguageServiceHost.prototype.getDefaultLibFileName = function(options) {
          return "defaultLib.d.ts";
        };
        return DefaultLanguageServiceHost;
      })();
      exports_1("default", DefaultLanguageServiceHost);
    }
  };
});

System.register("src/mode/typescript/DocumentRegistryInspector.js", [], function(exports_1) {
  var DocumentRegistryInspector;
  return {
    setters: [],
    execute: function() {
      DocumentRegistryInspector = (function() {
        function DocumentRegistryInspector(documentRegistry) {
          this.documentRegistry = documentRegistry;
          this.trace = false;
        }
        DocumentRegistryInspector.prototype.acquireDocument = function(fileName, compilationSettings, scriptSnapshot, version) {
          if (this.trace) {
            console.log("acquireDocument(" + fileName + ", " + JSON.stringify(compilationSettings, null, 2) + ")");
          }
          return this.documentRegistry.acquireDocument(fileName, compilationSettings, scriptSnapshot, version);
        };
        DocumentRegistryInspector.prototype.releaseDocument = function(fileName, compilationSettings) {
          if (this.trace) {
            console.log("releaseDocument(" + fileName + ", " + JSON.stringify(compilationSettings, null, 2) + ")");
          }
          return this.documentRegistry.releaseDocument(fileName, compilationSettings);
        };
        DocumentRegistryInspector.prototype.reportStats = function() {
          if (this.trace) {
            console.log("reportStats()");
          }
          return this.documentRegistry.reportStats();
        };
        DocumentRegistryInspector.prototype.updateDocument = function(fileName, compilationSettings, scriptSnapshot, version) {
          if (this.trace) {
            console.log("updateDocument(" + fileName + ", " + JSON.stringify(compilationSettings, null, 2) + ")");
          }
          return this.documentRegistry.updateDocument(fileName, compilationSettings, scriptSnapshot, version);
        };
        return DocumentRegistryInspector;
      })();
      exports_1("default", DocumentRegistryInspector);
    }
  };
});

System.register("src/mode/LanguageServiceWorker.js", ["./typescript/DefaultLanguageServiceHost", "./typescript/DocumentRegistryInspector"], function(exports_1) {
  var DefaultLanguageServiceHost_1,
      DocumentRegistryInspector_1;
  var useCaseSensitiveFileNames,
      EVENT_APPLY_DELTA,
      EVENT_SET_TRACE,
      EVENT_DEFAULT_LIB_CONTENT,
      EVENT_ENSURE_SCRIPT,
      EVENT_REMOVE_SCRIPT,
      EVENT_SET_MODULE_KIND,
      EVENT_SET_SCRIPT_TARGET,
      EVENT_GET_SYNTAX_ERRORS,
      EVENT_GET_SEMANTIC_ERRORS,
      EVENT_GET_COMPLETIONS_AT_POSITION,
      EVENT_GET_QUICK_INFO_AT_POSITION,
      EVENT_GET_OUTPUT_FILES,
      EVENT_EXPERIMENTAL,
      LanguageServiceWorker;
  function systemModuleName(prefix, fileName, extension) {
    var lastPeriod = fileName.lastIndexOf('.');
    if (lastPeriod >= 0) {
      var name = fileName.substring(0, lastPeriod);
      var suffix = fileName.substring(lastPeriod + 1);
      if (typeof extension === 'string') {
        return [prefix, name, '.', extension].join('');
      } else {
        return [prefix, name].join('');
      }
    } else {
      if (typeof extension === 'string') {
        return [prefix, fileName, '.', extension].join('');
      } else {
        return [prefix, fileName].join('');
      }
    }
  }
  return {
    setters: [function(DefaultLanguageServiceHost_1_1) {
      DefaultLanguageServiceHost_1 = DefaultLanguageServiceHost_1_1;
    }, function(DocumentRegistryInspector_1_1) {
      DocumentRegistryInspector_1 = DocumentRegistryInspector_1_1;
    }],
    execute: function() {
      useCaseSensitiveFileNames = true;
      EVENT_APPLY_DELTA = 'applyDelta';
      EVENT_SET_TRACE = 'setTrace';
      EVENT_DEFAULT_LIB_CONTENT = 'defaultLibContent';
      EVENT_ENSURE_SCRIPT = 'ensureScript';
      EVENT_REMOVE_SCRIPT = 'removeScript';
      EVENT_SET_MODULE_KIND = 'setModuleKind';
      EVENT_SET_SCRIPT_TARGET = 'setScriptTarget';
      EVENT_GET_SYNTAX_ERRORS = 'getSyntaxErrors';
      EVENT_GET_SEMANTIC_ERRORS = 'getSemanticErrors';
      EVENT_GET_COMPLETIONS_AT_POSITION = 'getCompletionsAtPosition';
      EVENT_GET_QUICK_INFO_AT_POSITION = 'getQuickInfoAtPosition';
      EVENT_GET_OUTPUT_FILES = 'getOutputFiles';
      EVENT_EXPERIMENTAL = 'experimental';
      LanguageServiceWorker = (function() {
        function LanguageServiceWorker(sender) {
          var _this = this;
          this.sender = sender;
          this.trace = false;
          this.host = new DefaultLanguageServiceHost_1.default();
          this.documentRegistry = new DocumentRegistryInspector_1.default(ts.createDocumentRegistry(useCaseSensitiveFileNames));
          sender.on(EVENT_SET_TRACE, function(message) {
            var _a = message.data,
                trace = _a.trace,
                callbackId = _a.callbackId;
            try {
              _this.trace = trace;
              _this.documentRegistry.trace;
              if (_this.trace) {
                console.log(EVENT_SET_TRACE + "(" + trace + ")");
                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
              }
              _this.resolve(EVENT_SET_TRACE, void 0, callbackId);
            } catch (err) {
              _this.reject(EVENT_SET_TRACE, err, callbackId);
            }
          });
          sender.on(EVENT_DEFAULT_LIB_CONTENT, function(message) {
            var _a = message.data,
                content = _a.content,
                callbackId = _a.callbackId;
            try {
              if (_this.trace) {
                console.log(EVENT_DEFAULT_LIB_CONTENT + "(" + _this.host.getDefaultLibFileName({}) + ")");
                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
              }
              _this.disposeLS();
              _this.host.ensureScript(_this.host.getDefaultLibFileName({}), content);
              _this.resolve(EVENT_DEFAULT_LIB_CONTENT, void 0, callbackId);
            } catch (reason) {
              _this.reject(EVENT_DEFAULT_LIB_CONTENT, reason, callbackId);
            }
          });
          sender.on(EVENT_ENSURE_SCRIPT, function(message) {
            var _a = message.data,
                fileName = _a.fileName,
                content = _a.content,
                callbackId = _a.callbackId;
            try {
              if (_this.trace) {
                console.log(EVENT_ENSURE_SCRIPT + "(" + fileName + ")");
                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
              }
              _this.disposeLS();
              _this.host.ensureScript(fileName, content);
              _this.resolve(EVENT_ENSURE_SCRIPT, void 0, callbackId);
            } catch (reason) {
              _this.reject(EVENT_ENSURE_SCRIPT, reason, callbackId);
            }
          });
          sender.on(EVENT_APPLY_DELTA, function(message) {
            var _a = message.data,
                fileName = _a.fileName,
                delta = _a.delta,
                callbackId = _a.callbackId;
            try {
              if (_this.trace) {
                console.log(EVENT_APPLY_DELTA + "(" + fileName + ", " + JSON.stringify(delta, null, 2) + ")");
                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
              }
              _this.host.applyDelta(fileName, delta);
              _this.resolve(EVENT_APPLY_DELTA, void 0, callbackId);
            } catch (reason) {
              _this.reject(EVENT_APPLY_DELTA, reason, callbackId);
            }
          });
          sender.on(EVENT_REMOVE_SCRIPT, function(message) {
            var _a = message.data,
                fileName = _a.fileName,
                callbackId = _a.callbackId;
            try {
              if (_this.trace) {
                console.log(EVENT_REMOVE_SCRIPT + "(" + fileName + ")");
                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
              }
              _this.disposeLS();
              _this.host.removeScript(fileName);
              _this.resolve(EVENT_REMOVE_SCRIPT, void 0, callbackId);
            } catch (reason) {
              _this.reject(EVENT_REMOVE_SCRIPT, reason, callbackId);
            }
          });
          sender.on(EVENT_SET_MODULE_KIND, function(message) {
            var _a = message.data,
                moduleKind = _a.moduleKind,
                callbackId = _a.callbackId;
            try {
              if (_this.trace) {
                console.log(EVENT_SET_MODULE_KIND + "(" + moduleKind + ")");
                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
              }
              _this.disposeLS();
              _this.host.moduleKind = moduleKind;
              _this.resolve(EVENT_SET_MODULE_KIND, void 0, callbackId);
            } catch (reason) {
              _this.reject(EVENT_SET_MODULE_KIND, reason, callbackId);
            }
          });
          sender.on(EVENT_SET_SCRIPT_TARGET, function(message) {
            var _a = message.data,
                scriptTarget = _a.scriptTarget,
                callbackId = _a.callbackId;
            try {
              if (_this.trace) {
                console.log(EVENT_SET_SCRIPT_TARGET + "(" + scriptTarget + ")");
                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
              }
              _this.disposeLS();
              _this.host.scriptTarget = scriptTarget;
              _this.resolve(EVENT_SET_SCRIPT_TARGET, void 0, callbackId);
            } catch (reason) {
              _this.reject(EVENT_SET_SCRIPT_TARGET, reason, callbackId);
            }
          });
          sender.on(EVENT_GET_SYNTAX_ERRORS, function(message) {
            var _a = message.data,
                fileName = _a.fileName,
                callbackId = _a.callbackId;
            try {
              if (_this.trace) {
                console.log(EVENT_GET_SYNTAX_ERRORS + "(" + fileName + ")");
                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
              }
              var diagnostics = _this.ensureLS().getSyntacticDiagnostics(fileName);
              var errors = diagnostics.map(function(diagnostic) {
                return {
                  message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
                  start: diagnostic.start,
                  length: diagnostic.length
                };
              });
              _this.resolve(EVENT_GET_SYNTAX_ERRORS, errors, callbackId);
            } catch (reason) {
              _this.reject(EVENT_GET_SYNTAX_ERRORS, reason, callbackId);
            }
          });
          sender.on(EVENT_GET_SEMANTIC_ERRORS, function(message) {
            var _a = message.data,
                fileName = _a.fileName,
                callbackId = _a.callbackId;
            try {
              if (_this.trace) {
                console.log(EVENT_GET_SEMANTIC_ERRORS + "(" + fileName + ")");
                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
              }
              var diagnostics = _this.ensureLS().getSemanticDiagnostics(fileName);
              var errors = diagnostics.map(function(diagnostic) {
                return {
                  message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
                  start: diagnostic.start,
                  length: diagnostic.length
                };
              });
              _this.resolve(EVENT_GET_SEMANTIC_ERRORS, errors, callbackId);
            } catch (reason) {
              _this.reject(EVENT_GET_SEMANTIC_ERRORS, reason, callbackId);
            }
          });
          sender.on(EVENT_GET_COMPLETIONS_AT_POSITION, function(message) {
            var _a = message.data,
                fileName = _a.fileName,
                position = _a.position,
                prefix = _a.prefix,
                callbackId = _a.callbackId;
            try {
              if (_this.trace) {
                console.log(EVENT_GET_COMPLETIONS_AT_POSITION + "(" + fileName + ", " + position + ", " + prefix + ")");
                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
              }
              if (typeof position !== 'number' || isNaN(position)) {
                throw new Error("position must be a number and not NaN");
              }
              var completionInfo = _this.ensureLS().getCompletionsAtPosition(fileName, position);
              if (completionInfo) {
                var completions = completionInfo.entries;
                _this.resolve(EVENT_GET_COMPLETIONS_AT_POSITION, completions, callbackId);
              } else {
                _this.resolve(EVENT_GET_COMPLETIONS_AT_POSITION, [], callbackId);
              }
            } catch (reason) {
              _this.reject(EVENT_GET_COMPLETIONS_AT_POSITION, reason, callbackId);
            }
          });
          sender.on(EVENT_GET_QUICK_INFO_AT_POSITION, function(message) {
            var _a = message.data,
                fileName = _a.fileName,
                position = _a.position,
                callbackId = _a.callbackId;
            try {
              if (_this.trace) {
                console.log(EVENT_GET_QUICK_INFO_AT_POSITION + "(" + fileName + ", " + position + ")");
                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
              }
              if (typeof position !== 'number' || isNaN(position)) {
                throw new Error("position must be a number and not NaN");
              }
              var quickInfo = _this.ensureLS().getQuickInfoAtPosition(fileName, position);
              _this.resolve(EVENT_GET_QUICK_INFO_AT_POSITION, quickInfo, callbackId);
            } catch (reason) {
              _this.reject(EVENT_GET_QUICK_INFO_AT_POSITION, reason, callbackId);
            }
          });
          sender.on(EVENT_GET_OUTPUT_FILES, function(message) {
            var _a = message.data,
                fileName = _a.fileName,
                callbackId = _a.callbackId;
            try {
              if (_this.trace) {
                console.log(EVENT_GET_OUTPUT_FILES + "(" + fileName + ")");
                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
              }
              var sourceFile = _this.ensureLS().getSourceFile(fileName);
              var input = sourceFile.text;
              var transpileOptions = {};
              transpileOptions.compilerOptions = _this.host.getCompilationSettings();
              transpileOptions.fileName = fileName;
              transpileOptions.moduleName = systemModuleName('./', fileName, 'js');
              transpileOptions.reportDiagnostics = false;
              var output = ts.transpileModule(input, transpileOptions);
              var outputFiles = [];
              outputFiles.push({
                name: systemModuleName(void 0, fileName, 'js'),
                text: output.outputText,
                writeByteOrderMark: void 0
              });
              _this.resolve(EVENT_GET_OUTPUT_FILES, outputFiles, callbackId);
            } catch (reason) {
              _this.reject(EVENT_GET_OUTPUT_FILES, reason, callbackId);
            }
          });
          sender.on(EVENT_EXPERIMENTAL, function(message) {
            var _a = message.data,
                fileName = _a.fileName,
                position = _a.position,
                callbackId = _a.callbackId;
            try {
              if (_this.trace) {
                console.log(EVENT_EXPERIMENTAL + "(" + fileName + ", " + position + ")");
                console.log(JSON.stringify(_this.host.getScriptFileNames(), null, 2));
              }
              if (typeof position !== 'number' || isNaN(position)) {
                throw new Error("position must be a number and not NaN");
              }
              var quickInfo = _this.ensureLS().getQuickInfoAtPosition(fileName, position);
              _this.resolve(EVENT_EXPERIMENTAL, quickInfo, callbackId);
            } catch (reason) {
              _this.reject(EVENT_EXPERIMENTAL, reason, callbackId);
            }
          });
        }
        LanguageServiceWorker.prototype.ensureLS = function() {
          if (!this.$service) {
            if (this.trace) {
              console.log("createLanguageService()");
            }
            this.$service = ts.createLanguageService(this.host, this.documentRegistry);
          }
          return this.$service;
        };
        LanguageServiceWorker.prototype.disposeLS = function() {
          if (this.$service) {
            if (this.trace) {
              console.log("LanguageService.dispose()");
            }
            this.$service.dispose();
            this.$service = void 0;
          }
        };
        LanguageServiceWorker.prototype.resolve = function(eventName, value, callbackId) {
          if (this.trace) {
            console.log("resolve(" + eventName + ", " + JSON.stringify(value, null, 2) + ")");
          }
          this.sender.resolve(eventName, value, callbackId);
        };
        LanguageServiceWorker.prototype.reject = function(eventName, reason, callbackId) {
          if (this.trace) {
            console.warn("reject(" + eventName + ", " + reason + ")");
          }
          this.sender.reject(eventName, reason, callbackId);
        };
        return LanguageServiceWorker;
      })();
      exports_1("default", LanguageServiceWorker);
    }
  };
});

"use strict";
System.register("src/lib/event_emitter.js", [], function(exports_1) {
  var stopPropagation,
      preventDefault,
      EventEmitterClass;
  return {
    setters: [],
    execute: function() {
      stopPropagation = function() {
        this.propagationStopped = true;
      };
      preventDefault = function() {
        this.defaultPrevented = true;
      };
      EventEmitterClass = (function() {
        function EventEmitterClass() {}
        EventEmitterClass.prototype._dispatchEvent = function(eventName, event) {
          this._eventRegistry || (this._eventRegistry = {});
          this._defaultHandlers || (this._defaultHandlers = {});
          var listeners = this._eventRegistry[eventName] || [];
          var defaultHandler = this._defaultHandlers[eventName];
          if (!listeners.length && !defaultHandler)
            return;
          if (typeof event !== "object" || !event) {
            event = {};
          }
          if (!event.type) {
            event.type = eventName;
          }
          if (!event.stopPropagation) {
            event.stopPropagation = stopPropagation;
          }
          if (!event.preventDefault) {
            event.preventDefault = preventDefault;
          }
          listeners = listeners.slice();
          for (var i = 0; i < listeners.length; i++) {
            listeners[i](event, this);
            if (event['propagationStopped']) {
              break;
            }
          }
          if (defaultHandler && !event.defaultPrevented) {
            return defaultHandler(event, this);
          }
        };
        EventEmitterClass.prototype._emit = function(eventName, event) {
          return this._dispatchEvent(eventName, event);
        };
        EventEmitterClass.prototype._signal = function(eventName, e) {
          var listeners = (this._eventRegistry || {})[eventName];
          if (!listeners) {
            return;
          }
          listeners = listeners.slice();
          for (var i = 0,
              iLength = listeners.length; i < iLength; i++) {
            listeners[i](e, this);
          }
        };
        EventEmitterClass.prototype.once = function(eventName, callback) {
          var _self = this;
          callback && this.addEventListener(eventName, function newCallback() {
            _self.removeEventListener(eventName, newCallback);
            callback.apply(null, arguments);
          });
        };
        EventEmitterClass.prototype.setDefaultHandler = function(eventName, callback) {
          var handlers = this._defaultHandlers;
          if (!handlers) {
            handlers = this._defaultHandlers = {_disabled_: {}};
          }
          if (handlers[eventName]) {
            var old = handlers[eventName];
            var disabled = handlers._disabled_[eventName];
            if (!disabled)
              handlers._disabled_[eventName] = disabled = [];
            disabled.push(old);
            var i = disabled.indexOf(callback);
            if (i != -1)
              disabled.splice(i, 1);
          }
          handlers[eventName] = callback;
        };
        EventEmitterClass.prototype.removeDefaultHandler = function(eventName, callback) {
          var handlers = this._defaultHandlers;
          if (!handlers) {
            return;
          }
          var disabled = handlers._disabled_[eventName];
          if (handlers[eventName] === callback) {
            var old = handlers[eventName];
            if (disabled)
              this.setDefaultHandler(eventName, disabled.pop());
          } else if (disabled) {
            var i = disabled.indexOf(callback);
            if (i != -1)
              disabled.splice(i, 1);
          }
        };
        EventEmitterClass.prototype.addEventListener = function(eventName, callback, capturing) {
          this._eventRegistry = this._eventRegistry || {};
          var listeners = this._eventRegistry[eventName];
          if (!listeners) {
            listeners = this._eventRegistry[eventName] = [];
          }
          if (listeners.indexOf(callback) === -1) {
            if (capturing) {
              listeners.unshift(callback);
            } else {
              listeners.push(callback);
            }
          }
          return callback;
        };
        EventEmitterClass.prototype.on = function(eventName, callback, capturing) {
          return this.addEventListener(eventName, callback, capturing);
        };
        EventEmitterClass.prototype.removeEventListener = function(eventName, callback) {
          this._eventRegistry = this._eventRegistry || {};
          var listeners = this._eventRegistry[eventName];
          if (!listeners)
            return;
          var index = listeners.indexOf(callback);
          if (index !== -1) {
            listeners.splice(index, 1);
          }
        };
        EventEmitterClass.prototype.removeListener = function(eventName, callback) {
          return this.removeEventListener(eventName, callback);
        };
        EventEmitterClass.prototype.off = function(eventName, callback) {
          return this.removeEventListener(eventName, callback);
        };
        EventEmitterClass.prototype.removeAllListeners = function(eventName) {
          if (this._eventRegistry)
            this._eventRegistry[eventName] = [];
        };
        return EventEmitterClass;
      })();
      exports_1("default", EventEmitterClass);
    }
  };
});

System.register("src/lib/Sender.js", ["./event_emitter"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var event_emitter_1;
  var Sender;
  return {
    setters: [function(event_emitter_1_1) {
      event_emitter_1 = event_emitter_1_1;
    }],
    execute: function() {
      Sender = (function(_super) {
        __extends(Sender, _super);
        function Sender(target) {
          _super.call(this);
          this.target = target;
        }
        Sender.prototype.callback = function(data, callbackId) {
          this.target.postMessage({
            type: "call",
            id: callbackId,
            data: data
          });
        };
        Sender.prototype.emit = function(name, data) {
          this.target.postMessage({
            type: "event",
            name: name,
            data: data
          });
        };
        Sender.prototype.resolve = function(eventName, value, callbackId) {
          var response = {
            value: value,
            callbackId: callbackId
          };
          this.emit(eventName, response);
        };
        Sender.prototype.reject = function(eventName, reason, callbackId) {
          var response = {
            err: "" + reason,
            callbackId: callbackId
          };
          this.emit(eventName, response);
        };
        return Sender;
      })(event_emitter_1.default);
      exports_1("default", Sender);
    }
  };
});

"use strict";
System.register("ace-workers.js", ["./src/mode/ExampleWorker", "./src/mode/HtmlWorker", "./src/mode/JavaScriptWorker", "./src/mode/TypeScriptWorker", "./src/mode/LanguageServiceWorker", "./src/lib/Sender"], function(exports_1) {
  var ExampleWorker_1,
      HtmlWorker_1,
      JavaScriptWorker_1,
      TypeScriptWorker_1,
      LanguageServiceWorker_1,
      Sender_1;
  var main;
  return {
    setters: [function(ExampleWorker_1_1) {
      ExampleWorker_1 = ExampleWorker_1_1;
    }, function(HtmlWorker_1_1) {
      HtmlWorker_1 = HtmlWorker_1_1;
    }, function(JavaScriptWorker_1_1) {
      JavaScriptWorker_1 = JavaScriptWorker_1_1;
    }, function(TypeScriptWorker_1_1) {
      TypeScriptWorker_1 = TypeScriptWorker_1_1;
    }, function(LanguageServiceWorker_1_1) {
      LanguageServiceWorker_1 = LanguageServiceWorker_1_1;
    }, function(Sender_1_1) {
      Sender_1 = Sender_1_1;
    }],
    execute: function() {
      main = {
        get ExampleWorker() {
          return ExampleWorker_1.default;
        },
        get HtmlWorker() {
          return HtmlWorker_1.default;
        },
        get JavaScriptWorker() {
          return JavaScriptWorker_1.default;
        },
        get TypeScriptWorker() {
          return TypeScriptWorker_1.default;
        },
        get LanguageServiceWorker() {
          return LanguageServiceWorker_1.default;
        },
        get Sender() {
          return Sender_1.default;
        }
      };
      exports_1("default", main);
    }
  };
});
