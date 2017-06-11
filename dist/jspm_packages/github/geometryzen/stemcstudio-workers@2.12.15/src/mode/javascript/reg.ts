/*
 * Regular expressions. Some of these are stupidly long.
 */

/*jshint maxlen:1000 */

// Unsafe comment or string (ax)
export const unsafeString: RegExp =
  /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i;

// Unsafe characters that are silently deleted by one or more browsers (cx)
export const unsafeChars: RegExp =
  /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;

// Characters in strings that need escaping (nx and nxg)
export const needEsc =
  /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;

export const needEscGlobal =
  /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

// Star slash (lx)
export const starSlash = /\*\//;

// Identifier (ix)
export const identifierRegExp: RegExp = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/;

// JavaScript URL (jx)
export const javascriptURL = /^(?:javascript|jscript|ecmascript|vbscript|livescript)\s*:/i;

// Catches /* falls through */ comments (ft)
export const fallsThrough = /^\s*falls?\sthrough\s*$/;

// very conservative rule (eg: only one space between the start of the comment and the first character)
// to relax the maxlen option
export const maxlenException = /^(?:(?:\/\/|\/\*|\*) ?)?[^ ]+$/;
