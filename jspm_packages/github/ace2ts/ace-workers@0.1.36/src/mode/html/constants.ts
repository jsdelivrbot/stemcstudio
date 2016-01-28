/* ***** BEGIN LICENSE BLOCK *****
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 David Geo Holmes <david.geo.holmes@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ***** END LICENSE BLOCK ***** */

export var SVGTagMap = {
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
};

export var MATHMLAttributeMap = {
  definitionurl: 'definitionURL'
};

export var SVGAttributeMap = {
  attributename:  'attributeName',
  attributetype:  'attributeType',
  basefrequency:  'baseFrequency',
  baseprofile:  'baseProfile',
  calcmode:  'calcMode',
  clippathunits:  'clipPathUnits',
  contentscripttype:  'contentScriptType',
  contentstyletype:  'contentStyleType',
  diffuseconstant:  'diffuseConstant',
  edgemode:  'edgeMode',
  externalresourcesrequired:  'externalResourcesRequired',
  filterres:  'filterRes',
  filterunits:  'filterUnits',
  glyphref:  'glyphRef',
  gradienttransform:  'gradientTransform',
  gradientunits:  'gradientUnits',
  kernelmatrix:  'kernelMatrix',
  kernelunitlength:  'kernelUnitLength',
  keypoints:  'keyPoints',
  keysplines:  'keySplines',
  keytimes:  'keyTimes',
  lengthadjust:  'lengthAdjust',
  limitingconeangle:  'limitingConeAngle',
  markerheight:  'markerHeight',
  markerunits:  'markerUnits',
  markerwidth:  'markerWidth',
  maskcontentunits:  'maskContentUnits',
  maskunits:  'maskUnits',
  numoctaves:  'numOctaves',
  pathlength:  'pathLength',
  patterncontentunits:  'patternContentUnits',
  patterntransform:  'patternTransform',
  patternunits:  'patternUnits',
  pointsatx:  'pointsAtX',
  pointsaty:  'pointsAtY',
  pointsatz:  'pointsAtZ',
  preservealpha:  'preserveAlpha',
  preserveaspectratio:  'preserveAspectRatio',
  primitiveunits:  'primitiveUnits',
  refx:  'refX',
  refy:  'refY',
  repeatcount:  'repeatCount',
  repeatdur:  'repeatDur',
  requiredextensions:  'requiredExtensions',
  requiredfeatures:  'requiredFeatures',
  specularconstant:  'specularConstant',
  specularexponent:  'specularExponent',
  spreadmethod:  'spreadMethod',
  startoffset:  'startOffset',
  stddeviation:  'stdDeviation',
  stitchtiles:  'stitchTiles',
  surfacescale:  'surfaceScale',
  systemlanguage:  'systemLanguage',
  tablevalues:  'tableValues',
  targetx:  'targetX',
  targety:  'targetY',
  textlength:  'textLength',
  viewbox:  'viewBox',
  viewtarget:  'viewTarget',
  xchannelselector:  'xChannelSelector',
  ychannelselector:  'yChannelSelector',
  zoomandpan:  'zoomAndPan'
};

export var ForeignAttributeMap = {
  "xlink:actuate": {prefix: "xlink", localName: "actuate", namespaceURI: "http://www.w3.org/1999/xlink"},
  "xlink:arcrole": {prefix: "xlink", localName: "arcrole", namespaceURI: "http://www.w3.org/1999/xlink"},
  "xlink:href": {prefix: "xlink", localName: "href", namespaceURI: "http://www.w3.org/1999/xlink"},
  "xlink:role": {prefix: "xlink", localName: "role", namespaceURI: "http://www.w3.org/1999/xlink"},
  "xlink:show": {prefix: "xlink", localName: "show", namespaceURI: "http://www.w3.org/1999/xlink"},
  "xlink:title": {prefix: "xlink", localName: "title", namespaceURI: "http://www.w3.org/1999/xlink"},
  "xlink:type": {prefix: "xlink", localName: "title", namespaceURI: "http://www.w3.org/1999/xlink"},
  "xml:base": {prefix: "xml", localName: "base", namespaceURI: "http://www.w3.org/XML/1998/namespace"},
  "xml:lang": {prefix: "xml", localName: "lang", namespaceURI: "http://www.w3.org/XML/1998/namespace"},
  "xml:space": {prefix: "xml", localName: "space", namespaceURI: "http://www.w3.org/XML/1998/namespace"},
  "xmlns": {prefix: null, localName: "xmlns", namespaceURI: "http://www.w3.org/2000/xmlns/"},
  "xmlns:xlink": {prefix: "xmlns", localName: "xlink", namespaceURI: "http://www.w3.org/2000/xmlns/"},
};
