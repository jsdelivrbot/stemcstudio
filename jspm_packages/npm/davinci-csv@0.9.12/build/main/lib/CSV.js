/* */ 
(function(Buffer, process) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var CSVError_1 = require('./CSVError');
  var messages_1 = require('./messages');
  var COMMA = ',';
  var SEMICOLON = ';';
  var CR = '\r';
  var LF = '\n';
  var CRLF = CR + LF;
  var APOS = "'";
  var QUOTE = '"';
  var SPACE = ' ';
  var MINUS = '-';
  var PLUS = '+';
  var CsvState;
  (function(CsvState) {
    CsvState[CsvState["START"] = 0] = "START";
    CsvState[CsvState["INTEGER"] = 1] = "INTEGER";
    CsvState[CsvState["DECIMAL"] = 2] = "DECIMAL";
    CsvState[CsvState["SCIENTIFIC"] = 3] = "SCIENTIFIC";
    CsvState[CsvState["APOS_STRING"] = 4] = "APOS_STRING";
    CsvState[CsvState["APOS_ESCAPE"] = 5] = "APOS_ESCAPE";
    CsvState[CsvState["QUOTE_STRING"] = 6] = "QUOTE_STRING";
    CsvState[CsvState["QUOTE_ESCAPE"] = 7] = "QUOTE_ESCAPE";
    CsvState[CsvState["DELIM"] = 8] = "DELIM";
    CsvState[CsvState["ISO8601_HHMM"] = 9] = "ISO8601_HHMM";
    CsvState[CsvState["UNQUOTED_STRING"] = 10] = "UNQUOTED_STRING";
    CsvState[CsvState["EXPONENT"] = 11] = "EXPONENT";
    CsvState[CsvState["SIGNED_EXPONENT"] = 12] = "SIGNED_EXPONENT";
    CsvState[CsvState["NEGATIVE_INTEGER"] = 13] = "NEGATIVE_INTEGER";
    CsvState[CsvState["TRAILING_WHITESPACE"] = 14] = "TRAILING_WHITESPACE";
  })(CsvState || (CsvState = {}));
  function decodeState(state) {
    switch (state) {
      case CsvState.START:
        return "START";
      case CsvState.INTEGER:
        return "INTEGER";
      case CsvState.DECIMAL:
        return "DECIMAL";
      case CsvState.SCIENTIFIC:
        return "SCIENTIFIC";
      case CsvState.APOS_STRING:
        return "APOS_STRING";
      case CsvState.APOS_ESCAPE:
        return "APOS_ESCAPE";
      case CsvState.QUOTE_STRING:
        return "QUOTE_STRING";
      case CsvState.QUOTE_ESCAPE:
        return "QUOTE_ESCAPE";
      case CsvState.DELIM:
        return "DELIM";
      case CsvState.ISO8601_HHMM:
        return "ISO8601_HHMM";
      case CsvState.UNQUOTED_STRING:
        return "UNQUOTED_STRING";
      case CsvState.EXPONENT:
        return "EXPONENT";
      case CsvState.SIGNED_EXPONENT:
        return "SIGNED_EXPONENT";
      case CsvState.NEGATIVE_INTEGER:
        return "NEGATIVE_INTEGER";
      case CsvState.TRAILING_WHITESPACE:
        return "TRAILING_WHITESPACE";
    }
    throw new Error("decodeState(" + state + ")");
  }
  var rxIsInt = /^\d+$/;
  var rxIsFloat = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
  var rxNeedsQuoting = /^\s|\s$|,|"|\n/;
  var trim = (function() {
    if (String.prototype.trim) {
      return function(s) {
        return s.trim();
      };
    } else {
      return function(s) {
        return s.replace(/^\s*/, '').replace(/\s*$/, '');
      };
    }
  }());
  function chomp(s, lineterminator) {
    if (s.charAt(s.length - lineterminator.length) !== lineterminator) {
      return s;
    } else {
      return s.substring(0, s.length - lineterminator.length);
    }
  }
  function normalizeLineTerminator(csvString, dialect) {
    if (dialect === void 0) {
      dialect = {};
    }
    if (!dialect.lineTerminator) {
      return csvString.replace(/(\r\n|\n|\r)/gm, '\n');
    }
    return csvString;
  }
  function dataToArrays(data) {
    var arrays = [];
    var fieldIds = data.fields.map(function(field) {
      return field.id;
    });
    arrays.push(fieldIds);
    var _loop_1 = function(record) {
      var tmp = fieldIds.map(function(fieldId) {
        return record[fieldId];
      });
      arrays.push(tmp);
    };
    for (var _i = 0,
        _a = data.records; _i < _a.length; _i++) {
      var record = _a[_i];
      _loop_1(record);
    }
    return arrays;
  }
  exports.dataToArrays = dataToArrays;
  function normalizeDialectOptions(dialect) {
    var options = {
      delim: COMMA,
      escape: true,
      lineTerm: LF,
      quoteChar: QUOTE,
      skipRows: 0,
      trim: true
    };
    if (dialect) {
      if (typeof dialect.fieldDelimiter === 'string') {
        switch (dialect.fieldDelimiter) {
          case COMMA:
          case SEMICOLON:
            {
              options.delim = dialect.fieldDelimiter;
              break;
            }
          default:
            {
              throw new Error("Unexpected dialect field delimiter " + dialect.fieldDelimiter + ".");
            }
        }
      }
      if (typeof dialect.escapeEmbeddedQuotes === 'boolean') {
        options.escape = dialect.escapeEmbeddedQuotes;
      }
      if (typeof dialect.lineTerminator === 'string') {
        switch (dialect.lineTerminator) {
          case LF:
          case CR:
          case CRLF:
            {
              options.lineTerm = LF;
              break;
            }
          default:
            {
              throw new Error("Unexpected dialect lineTerminator " + dialect.lineTerminator + ".");
            }
        }
      }
      if (typeof dialect.quoteChar === 'string') {
        switch (dialect.quoteChar) {
          case APOS:
          case QUOTE:
            {
              options.quoteChar = dialect.quoteChar;
              break;
            }
          default:
            {
              throw new Error("Unexpected dialect quoteChar " + dialect.quoteChar + ".");
            }
        }
      }
      if (typeof dialect.skipInitialRows === 'number') {
        options.skipRows = dialect.skipInitialRows;
      }
      if (typeof dialect.trimFields === 'boolean') {
        options.trim = dialect.trimFields;
      }
    }
    return options;
  }
  function serialize(data, dialect) {
    var a = (data instanceof Array) ? data : dataToArrays(data);
    var options = normalizeDialectOptions(dialect);
    var fieldToString = function fieldToString(field) {
      if (field === null) {
        field = '';
      } else if (typeof field === "string" && rxNeedsQuoting.test(field)) {
        if (options.escape) {
          field = field.replace(/"/g, '""');
        }
        field = options.quoteChar + field + options.quoteChar;
      } else if (typeof field === "number") {
        field = field.toString(10);
      }
      return field;
    };
    var outBuffer = '';
    for (var i = 0; i < a.length; i += 1) {
      var fields = a[i];
      var rowBuffer = '';
      for (var j = 0; j < fields.length; j += 1) {
        var fieldBuffer = fieldToString(fields[j]);
        if (j === (fields.length - 1)) {
          rowBuffer += fieldBuffer;
          outBuffer += rowBuffer + options.lineTerm;
          rowBuffer = '';
        } else {
          rowBuffer += fieldBuffer + options.delim;
        }
      }
    }
    return outBuffer;
  }
  exports.serialize = serialize;
  function normalizeInputString(csvText, dialect) {
    if (!dialect || (dialect && !dialect.lineTerminator)) {
      csvText = normalizeLineTerminator(csvText, dialect);
    }
    var options = normalizeDialectOptions(dialect);
    return {
      s: chomp(csvText, options.lineTerm),
      options: options
    };
  }
  function parse(csvText, dialect, errors) {
    var _a = normalizeInputString(csvText, dialect),
        s = _a.s,
        options = _a.options;
    var state = CsvState.START;
    var sLength = s.length;
    var ch = '';
    var fieldQuoted = false;
    var quoteBegin = Number.MAX_SAFE_INTEGER;
    var field = '';
    var row = [];
    var out = [];
    var line = 1;
    var column = 0;
    var parseField = function parseField(fieldAsString) {
      if (fieldQuoted) {
        return fieldAsString;
      } else {
        if (fieldAsString === '') {
          return null;
        } else if (options.trim) {
          fieldAsString = trim(fieldAsString);
        }
        if (rxIsInt.test(fieldAsString)) {
          return parseInt(fieldAsString, 10);
        } else if (rxIsFloat.test(fieldAsString)) {
          return parseFloat(fieldAsString);
        } else {
          return fieldAsString;
        }
      }
    };
    var error = function(e) {
      if (errors) {
        errors.push(e);
      } else {
        throw e;
      }
    };
    for (var i = 0; i < sLength; i += 1) {
      ch = s.charAt(i);
      switch (state) {
        case CsvState.START:
          {
            switch (ch) {
              case ' ':
                {
                  break;
                }
              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                {
                  field += ch;
                  state = CsvState.INTEGER;
                  break;
                }
              case QUOTE:
                {
                  quoteBegin = i;
                  state = CsvState.QUOTE_STRING;
                  break;
                }
              case APOS:
                {
                  state = CsvState.APOS_STRING;
                  break;
                }
              case PLUS:
                {
                  state = CsvState.INTEGER;
                  break;
                }
              case MINUS:
                {
                  field += ch;
                  state = CsvState.NEGATIVE_INTEGER;
                  break;
                }
              default:
                {
                  field += ch;
                  state = CsvState.UNQUOTED_STRING;
                }
            }
            break;
          }
        case CsvState.INTEGER:
          {
            switch (ch) {
              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                {
                  field += ch;
                  break;
                }
              case '.':
                {
                  field += ch;
                  state = CsvState.DECIMAL;
                  break;
                }
              case ':':
                {
                  field += ch;
                  state = CsvState.ISO8601_HHMM;
                  break;
                }
              case 'e':
                {
                  field += ch;
                  state = CsvState.EXPONENT;
                  break;
                }
              case COMMA:
                {
                  field = parseField(field);
                  row.push(field);
                  field = '';
                  state = CsvState.DELIM;
                  break;
                }
              case APOS:
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E001];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                  break;
                }
              case QUOTE:
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E002];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                  break;
                }
              case SPACE:
                {
                  field = parseField(field);
                  row.push(field);
                  field = '';
                  state = CsvState.TRAILING_WHITESPACE;
                  break;
                }
              case LF:
                {
                  field = parseField(field);
                  row.push(field);
                  field = '';
                  out.push(row);
                  row = [];
                  state = CsvState.START;
                  break;
                }
              case CR:
                {
                  field = parseField(field);
                  row.push(field);
                  field = '';
                  out.push(row);
                  row = [];
                  state = CsvState.START;
                  break;
                }
              default:
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E003];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                }
            }
            break;
          }
        case CsvState.NEGATIVE_INTEGER:
          {
            switch (ch) {
              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                {
                  field += ch;
                  break;
                }
              case '.':
                {
                  field += ch;
                  state = CsvState.DECIMAL;
                  break;
                }
              default:
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E003];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                }
            }
            break;
          }
        case CsvState.DECIMAL:
          {
            switch (ch) {
              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                {
                  field += ch;
                  break;
                }
              case 'e':
                {
                  field += ch;
                  state = CsvState.EXPONENT;
                  break;
                }
              case options.delim:
                {
                  field = parseField(field);
                  row.push(field);
                  field = '';
                  state = CsvState.DELIM;
                  break;
                }
              case APOS:
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E001];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                  break;
                }
              case QUOTE:
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E002];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                  break;
                }
              case SPACE:
                {
                  field = parseField(field);
                  row.push(field);
                  field = '';
                  state = CsvState.TRAILING_WHITESPACE;
                  break;
                }
              default:
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E003];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                }
            }
            break;
          }
        case CsvState.APOS_STRING:
          {
            switch (ch) {
              case APOS:
                {
                  state = CsvState.APOS_ESCAPE;
                  break;
                }
              default:
                {
                  field += ch;
                  break;
                }
            }
            break;
          }
        case CsvState.QUOTE_STRING:
          {
            switch (ch) {
              case QUOTE:
                {
                  state = CsvState.QUOTE_ESCAPE;
                  break;
                }
              default:
                {
                  field += ch;
                  break;
                }
            }
            break;
          }
        case CsvState.QUOTE_ESCAPE:
          {
            switch (ch) {
              case QUOTE:
                {
                  field += ch;
                  state = CsvState.QUOTE_STRING;
                  break;
                }
              case options.delim:
                {
                  row.push(field);
                  field = '';
                  state = CsvState.DELIM;
                  break;
                }
              case LF:
                {
                  row.push(field);
                  field = '';
                  out.push(row);
                  row = [];
                  state = CsvState.START;
                  break;
                }
              default:
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E003];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                }
            }
            break;
          }
        case CsvState.APOS_ESCAPE:
          {
            switch (ch) {
              case APOS:
                {
                  field += ch;
                  state = CsvState.APOS_STRING;
                  break;
                }
              case options.delim:
                {
                  row.push(field);
                  field = '';
                  state = CsvState.DELIM;
                  break;
                }
              case LF:
                {
                  row.push(field);
                  field = '';
                  out.push(row);
                  row = [];
                  state = CsvState.START;
                  break;
                }
              default:
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E003];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                }
            }
            break;
          }
        case CsvState.DELIM:
          {
            switch (ch) {
              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                {
                  field += ch;
                  state = CsvState.INTEGER;
                  break;
                }
              case SPACE:
                {
                  break;
                }
              case PLUS:
                {
                  state = CsvState.INTEGER;
                  break;
                }
              case MINUS:
                {
                  field += ch;
                  state = CsvState.NEGATIVE_INTEGER;
                  break;
                }
              case QUOTE:
                {
                  quoteBegin = i;
                  state = CsvState.QUOTE_STRING;
                  break;
                }
              case APOS:
                {
                  quoteBegin = i;
                  state = CsvState.APOS_STRING;
                  break;
                }
              default:
                {
                  field += ch;
                  state = CsvState.UNQUOTED_STRING;
                }
            }
            break;
          }
        case CsvState.ISO8601_HHMM:
          {
            switch (ch) {
              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                {
                  field += ch;
                  break;
                }
              case LF:
                {
                  field = parseField(field);
                  row.push(field);
                  field = '';
                  out.push(row);
                  row = [];
                  state = CsvState.START;
                  break;
                }
              case CR:
                {
                  field = parseField(field);
                  row.push(field);
                  field = '';
                  out.push(row);
                  row = [];
                  state = CsvState.START;
                  break;
                }
              default:
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E003];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                }
            }
            break;
          }
        case CsvState.UNQUOTED_STRING:
          {
            switch (ch) {
              case options.delim:
                {
                  row.push(field);
                  field = '';
                  state = CsvState.DELIM;
                  break;
                }
              case LF:
                {
                  row.push(field);
                  field = '';
                  out.push(row);
                  row = [];
                  state = CsvState.START;
                  break;
                }
              case CR:
                {
                  row.push(field);
                  field = '';
                  out.push(row);
                  row = [];
                  state = CsvState.START;
                  break;
                }
              default:
                {
                  field += ch;
                }
            }
            break;
          }
        case CsvState.EXPONENT:
          {
            switch (ch) {
              case PLUS:
              case MINUS:
                {
                  field += ch;
                  state = CsvState.SIGNED_EXPONENT;
                  break;
                }
              case SPACE:
                {
                  field = parseField(field);
                  row.push(field);
                  field = '';
                  state = CsvState.TRAILING_WHITESPACE;
                  break;
                }
              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                {
                  field += ch;
                  break;
                }
              default:
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E003];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                }
            }
            break;
          }
        case CsvState.SIGNED_EXPONENT:
          {
            switch (ch) {
              case SPACE:
                {
                  field = parseField(field);
                  row.push(field);
                  field = '';
                  state = CsvState.TRAILING_WHITESPACE;
                  break;
                }
              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                {
                  field += ch;
                  break;
                }
              case LF:
                {
                  field = parseField(field);
                  row.push(field);
                  field = '';
                  out.push(row);
                  row = [];
                  state = CsvState.START;
                  break;
                }
              case CR:
                {
                  field = parseField(field);
                  row.push(field);
                  field = '';
                  out.push(row);
                  row = [];
                  state = CsvState.START;
                  break;
                }
              default:
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E003];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                }
            }
            break;
          }
        case CsvState.TRAILING_WHITESPACE:
          {
            switch (ch) {
              case '0':
              case '1':
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E004];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                  break;
                }
              default:
                {
                  var msg = messages_1.messages[messages_1.ErrorCode.E003];
                  error(new CSVError_1.CSVError(msg.code, msg.desc, i, line, column));
                }
            }
            break;
          }
        default:
          {
            throw new Error("Unexpected state " + decodeState(state) + " at " + i + " for " + s);
          }
      }
    }
    switch (state) {
      case CsvState.INTEGER:
        {
          field = parseField(field);
          row.push(field);
          field = '';
          out.push(row);
          row = [];
          break;
        }
      case CsvState.DECIMAL:
        {
          field = parseField(field);
          row.push(field);
          field = '';
          out.push(row);
          row = [];
          break;
        }
      case CsvState.EXPONENT:
      case CsvState.SIGNED_EXPONENT:
        {
          field = parseField(field);
          row.push(field);
          field = '';
          out.push(row);
          row = [];
          break;
        }
      case CsvState.APOS_ESCAPE:
        {
          field = parseField(field);
          row.push(field);
          field = '';
          out.push(row);
          row = [];
          break;
        }
      case CsvState.QUOTE_ESCAPE:
        {
          field = parseField(field);
          row.push(field);
          field = '';
          out.push(row);
          row = [];
          break;
        }
      case CsvState.ISO8601_HHMM:
        {
          field = parseField(field);
          row.push(field);
          field = '';
          out.push(row);
          row = [];
          break;
        }
      case CsvState.DELIM:
        {
          row.push(null);
          field = '';
          out.push(row);
          row = [];
          break;
        }
      case CsvState.APOS_STRING:
        {
          var msg = messages_1.messages[messages_1.ErrorCode.E005];
          error(new CSVError_1.CSVError(msg.code, msg.desc, quoteBegin, line, column));
          break;
        }
      case CsvState.QUOTE_STRING:
        {
          var msg = messages_1.messages[messages_1.ErrorCode.E006];
          error(new CSVError_1.CSVError(msg.code, msg.desc, quoteBegin, line, column));
          break;
        }
      case CsvState.START:
        {
          break;
        }
      case CsvState.TRAILING_WHITESPACE:
        {
          break;
        }
      default:
        {
          throw new Error("Unexpected end state " + decodeState(state) + " " + s);
        }
    }
    if (options.skipRows)
      out = out.slice(options.skipRows);
    return out;
  }
  exports.parse = parse;
})(require('buffer').Buffer, require('process'));
