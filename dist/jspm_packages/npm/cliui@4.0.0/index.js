/* */ 
(function(process) {
  var stringWidth = require('string-width');
  var stripAnsi = require('strip-ansi');
  var wrap = require('wrap-ansi');
  var align = {
    right: alignRight,
    center: alignCenter
  };
  var top = 0;
  var right = 1;
  var bottom = 2;
  var left = 3;
  function UI(opts) {
    this.width = opts.width;
    this.wrap = opts.wrap;
    this.rows = [];
  }
  UI.prototype.span = function() {
    var cols = this.div.apply(this, arguments);
    cols.span = true;
  };
  UI.prototype.div = function() {
    if (arguments.length === 0)
      this.div('');
    if (this.wrap && this._shouldApplyLayoutDSL.apply(this, arguments)) {
      return this._applyLayoutDSL(arguments[0]);
    }
    var cols = [];
    for (var i = 0,
        arg; (arg = arguments[i]) !== undefined; i++) {
      if (typeof arg === 'string')
        cols.push(this._colFromString(arg));
      else
        cols.push(arg);
    }
    this.rows.push(cols);
    return cols;
  };
  UI.prototype._shouldApplyLayoutDSL = function() {
    return arguments.length === 1 && typeof arguments[0] === 'string' && /[\t\n]/.test(arguments[0]);
  };
  UI.prototype._applyLayoutDSL = function(str) {
    var _this = this;
    var rows = str.split('\n');
    var leftColumnWidth = 0;
    rows.forEach(function(row) {
      var columns = row.split('\t');
      if (columns.length > 1 && stringWidth(columns[0]) > leftColumnWidth) {
        leftColumnWidth = Math.min(Math.floor(_this.width * 0.5), stringWidth(columns[0]));
      }
    });
    rows.forEach(function(row) {
      var columns = row.split('\t');
      _this.div.apply(_this, columns.map(function(r, i) {
        return {
          text: r.trim(),
          padding: _this._measurePadding(r),
          width: (i === 0 && columns.length > 1) ? leftColumnWidth : undefined
        };
      }));
    });
    return this.rows[this.rows.length - 1];
  };
  UI.prototype._colFromString = function(str) {
    return {
      text: str,
      padding: this._measurePadding(str)
    };
  };
  UI.prototype._measurePadding = function(str) {
    var noAnsi = stripAnsi(str);
    return [0, noAnsi.match(/\s*$/)[0].length, 0, noAnsi.match(/^\s*/)[0].length];
  };
  UI.prototype.toString = function() {
    var _this = this;
    var lines = [];
    _this.rows.forEach(function(row, i) {
      _this.rowToString(row, lines);
    });
    lines = lines.filter(function(line) {
      return !line.hidden;
    });
    return lines.map(function(line) {
      return line.text;
    }).join('\n');
  };
  UI.prototype.rowToString = function(row, lines) {
    var _this = this;
    var padding;
    var rrows = this._rasterize(row);
    var str = '';
    var ts;
    var width;
    var wrapWidth;
    rrows.forEach(function(rrow, r) {
      str = '';
      rrow.forEach(function(col, c) {
        ts = '';
        width = row[c].width;
        wrapWidth = _this._negatePadding(row[c]);
        ts += col;
        for (var i = 0; i < wrapWidth - stringWidth(col); i++) {
          ts += ' ';
        }
        if (row[c].align && row[c].align !== 'left' && _this.wrap) {
          ts = align[row[c].align](ts, wrapWidth);
          if (stringWidth(ts) < wrapWidth)
            ts += new Array(width - stringWidth(ts)).join(' ');
        }
        padding = row[c].padding || [0, 0, 0, 0];
        if (padding[left])
          str += new Array(padding[left] + 1).join(' ');
        str += addBorder(row[c], ts, '| ');
        str += ts;
        str += addBorder(row[c], ts, ' |');
        if (padding[right])
          str += new Array(padding[right] + 1).join(' ');
        if (r === 0 && lines.length > 0) {
          str = _this._renderInline(str, lines[lines.length - 1]);
        }
      });
      lines.push({
        text: str.replace(/ +$/, ''),
        span: row.span
      });
    });
    return lines;
  };
  function addBorder(col, ts, style) {
    if (col.border) {
      if (/[.']-+[.']/.test(ts))
        return '';
      else if (ts.trim().length)
        return style;
      else
        return '  ';
    }
    return '';
  }
  UI.prototype._renderInline = function(source, previousLine) {
    var leadingWhitespace = source.match(/^ */)[0].length;
    var target = previousLine.text;
    var targetTextWidth = stringWidth(target.trimRight());
    if (!previousLine.span)
      return source;
    if (!this.wrap) {
      previousLine.hidden = true;
      return target + source;
    }
    if (leadingWhitespace < targetTextWidth)
      return source;
    previousLine.hidden = true;
    return target.trimRight() + new Array(leadingWhitespace - targetTextWidth + 1).join(' ') + source.trimLeft();
  };
  UI.prototype._rasterize = function(row) {
    var _this = this;
    var i;
    var rrow;
    var rrows = [];
    var widths = this._columnWidths(row);
    var wrapped;
    row.forEach(function(col, c) {
      col.width = widths[c];
      if (_this.wrap)
        wrapped = wrap(col.text, _this._negatePadding(col), {hard: true}).split('\n');
      else
        wrapped = col.text.split('\n');
      if (col.border) {
        wrapped.unshift('.' + new Array(_this._negatePadding(col) + 3).join('-') + '.');
        wrapped.push("'" + new Array(_this._negatePadding(col) + 3).join('-') + "'");
      }
      if (col.padding) {
        for (i = 0; i < (col.padding[top] || 0); i++)
          wrapped.unshift('');
        for (i = 0; i < (col.padding[bottom] || 0); i++)
          wrapped.push('');
      }
      wrapped.forEach(function(str, r) {
        if (!rrows[r])
          rrows.push([]);
        rrow = rrows[r];
        for (var i = 0; i < c; i++) {
          if (rrow[i] === undefined)
            rrow.push('');
        }
        rrow.push(str);
      });
    });
    return rrows;
  };
  UI.prototype._negatePadding = function(col) {
    var wrapWidth = col.width;
    if (col.padding)
      wrapWidth -= (col.padding[left] || 0) + (col.padding[right] || 0);
    if (col.border)
      wrapWidth -= 4;
    return wrapWidth;
  };
  UI.prototype._columnWidths = function(row) {
    var _this = this;
    var widths = [];
    var unset = row.length;
    var unsetWidth;
    var remainingWidth = this.width;
    row.forEach(function(col, i) {
      if (col.width) {
        unset--;
        widths[i] = col.width;
        remainingWidth -= col.width;
      } else {
        widths[i] = undefined;
      }
    });
    if (unset)
      unsetWidth = Math.floor(remainingWidth / unset);
    widths.forEach(function(w, i) {
      if (!_this.wrap)
        widths[i] = row[i].width || stringWidth(row[i].text);
      else if (w === undefined)
        widths[i] = Math.max(unsetWidth, _minWidth(row[i]));
    });
    return widths;
  };
  function _minWidth(col) {
    var padding = col.padding || [];
    var minWidth = 1 + (padding[left] || 0) + (padding[right] || 0);
    if (col.border)
      minWidth += 4;
    return minWidth;
  }
  function getWindowWidth() {
    if (typeof process === 'object' && process.stdout && process.stdout.columns)
      return process.stdout.columns;
  }
  function alignRight(str, width) {
    str = str.trim();
    var padding = '';
    var strWidth = stringWidth(str);
    if (strWidth < width) {
      padding = new Array(width - strWidth + 1).join(' ');
    }
    return padding + str;
  }
  function alignCenter(str, width) {
    str = str.trim();
    var padding = '';
    var strWidth = stringWidth(str.trim());
    if (strWidth < width) {
      padding = new Array(parseInt((width - strWidth) / 2, 10) + 1).join(' ');
    }
    return padding + str;
  }
  module.exports = function(opts) {
    opts = opts || {};
    return new UI({
      width: (opts || {}).width || getWindowWidth() || 80,
      wrap: typeof opts.wrap === 'boolean' ? opts.wrap : true
    });
  };
})(require('process'));
