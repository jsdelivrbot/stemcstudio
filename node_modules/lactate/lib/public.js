
// Create default response pages

var path = require('path');
var fs = require('fs');

var version = require(__dirname + '/../package.json').version;
var publicPath = path.resolve(__dirname + '/../public');

var template = ''
+ '<html>'
+ '<head>'
+ '<meta charset=\'utf-8\'/>'
+ '<link rel=\'icon\' href=\'about:config\'/>'
+ '<title>{{status}} {{message}}</title>'
+ '<style>'
+ '*{color:#444;font-family:sans-serif;}'
+ '#center{width:50%;margin:100px auto;text-align:center;}'
+ '</style>'
+ '</head>'
+ '<body>'
+ '<div id=\'center\'>'
+ '<h1>{{message}}</h1>'
+ '<hr/>'
+ '<p>Lactate/{{version}}</p>'
+ '</div>'
+ '</body>'
+ '</html>\n'

var render = function(page, args) {
  var res = page;
  for (key in args) {
    var re = new RegExp('{{'+key+'}}', 'g');
    res = res.replace(re, args[key]);
  };
  return res;
};

var makePage = function(opts) {
  var name = path.join(publicPath, opts.status + '.html');
  var data = render(template, opts);
  fs.writeFile(name, data, function(err) {
    if (!err) return;
    console.error('Failed to write public file', name);
  });
};

([
  {
    status:'400',
    message:'Bad Request',
    version:version
  },
  {
    status:'403',
    message:'Forbidden',
    version:version
  },
  {
    status:'404',
    message:'Not Found',
    version:version
  },
  {
    status:'405',
    message:'Method Not Allowed',
    version:version
  },
  {
    status:'500',
    message:'Internal Error',
    version:version
  }
]).forEach(makePage);
