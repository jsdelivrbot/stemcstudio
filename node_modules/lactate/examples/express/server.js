
var express = require('express')
var app = express.createServer()

var port = 8080

var lactate = require('lactate').Lactate({
  //cache:false,
  //max_age:'one day'
})

app.get('/', function(req, res) {
  lactate.serve('index.html', req, res)
})

app.listen(port, function() {
  console.log('Listening on port', port)
})

