###
A complete cookies reader/writer framework with full unicode support.

https://developer.mozilla.org/en-US/docs/DOM/document.cookie

This framework is released under the GNU Public License, version 3 or later.
http://www.gnu.org/licenses/gpl-3.0-standalone.html

Syntaxes:

* cookies.setItem(name, value[, end[, path[, domain[, secure]]]])
* cookies.getItem(name)
* cookies.removeItem(name[, path])
* cookies.hasItem(name)
###
# Maybe should be a service, not a factory?
angular.module("app").factory('cookie', [() ->

  getItem: (name) ->
    escapedName = escape(name).replace(/[\-\.\+\*]/g, "\\$&")
    return unescape(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*#{escapedName}\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) or null

  setItem: (name, value, end, path, domain, secure) ->
    if not name or /^(?:expires|max\-age|path|domain|secure)$/i.test(name)
      throw new Error("Illegal name")

    if end
      switch end.constructor
        when Number
          expires = if end is Infinity then "; expires=Fri, 31 Dec 9999 23:59:59 GMT" else "; max-age=" + end
        when String
          expires = "; expires=" + end
        when Date
          expires = "; expires=" + end.toGMTString()
        else
          expires = ""
    else
      expires = ""
    domain = if domain then "; domain=#{domain}" else ""
    path = if path then "; path=#{path}" else ""
    secure = if secure then "; secure" else ""
    cookie = "#{escape(name)}=#{escape(value)}#{expires}#{domain}#{path}#{secure}"
    document.cookie = cookie
    return

  removeItem: (name, path) ->
    if not name or not this.hasItem name
      return false
    return this.setItem(name, "", new Date(0), path)

  hasItem: (name) ->
    return (new RegExp("(?:^|;\\s*)" + escape(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
])
