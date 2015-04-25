
var http = require('http')
var port = 8080

var lactate = require('lactate').Lactate({
//  from:'/public/directory,
//  subdirs:false,
//  hidden:true,
//  not_found:function(req, res) { 
//    res.writeHead(404);
//    res.end('Not found');
//  },
//
//  cache:false,
//  watch_files:false,
//  max_age:'one year',
//
//  headers:{'x-powered-by':'butt'},
//  gzip:false,
//  minfiy:true,
//
//  bundle:'css',
//  rebundle:true
})

/*
* Without a string as first argument,
* Lactate will use req.url to determine
* file path. In this case, the file 
* 'index.html' may be reached from 
* http://localhost:8080/index.html
*/

var server = http.createServer(function(req, res) {
  //http://localhost:8080/index.html
  lactate.serve(req, res)

  //http://localhost:8080/*
  //lactate.serve('index.html', req, res)
})

server.listen(port, function() {
  console.log('Listening on port', port)
})

