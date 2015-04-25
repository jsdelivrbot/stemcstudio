
var should  = require('should');
var Lactate = require('../lib/lactate');
var http    = require('./utils/http_utils');
var files   = require('./utils/get_files');
var fs      = require('fs');

describe('Bundle', function() {

  const DIR = __dirname + '/files/';

  afterEach(http.stopServer);

  describe('#bundle(js)', function() {
    it('Should bundle', function(done) {
      const dir = Lactate.dir(DIR);
      const file = 'common.js';
      http.server(dir.toMiddleware());
      dir.bundle('js', file, function(err, data) {
        should.not.exist(err);
        should.exist(data.toString());
        http.client('/' + file, 2, function(err, res, data) {
          should.not.exist(err);
          should.exist(data);
          res.should.have.status(200);
          res.headers.should.have.property('content-type');
          res.headers.should.have.property('content-encoding');
          res.headers.should.have.property('content-length');
          res.headers.should.have.property('date');
          res.headers.should.have.property('last-modified');
          res.headers.should.have.property('cache-control');
          fs.unlink(DIR + file, done);
        });
      });
    })
  })

  describe('#bundleJS()', function() {
    it('Should bundle', function(done) {
      const dir = Lactate.dir(DIR);
      const fileName = 'common.js';
      const filePath = DIR + fileName;
      http.server(dir.toMiddleware());
      dir.bundleJS(fileName, function(err, data) {
        should.not.exist(err);
        should.exist(data.toString());
        http.client('/' + fileName, 2, function(err, res, data) {
          should.not.exist(err);
          should.exist(data);
          res.should.have.status(200);
          res.headers.should.have.property('content-type');
          res.headers.should.have.property('content-encoding');
          res.headers.should.have.property('content-length');
          res.headers.should.have.property('date');
          res.headers.should.have.property('last-modified');
          res.headers.should.have.property('cache-control');
          fs.unlink(filePath, done);
        });
      });
    })
  })

  describe('#bundleCSS()', function() {
    it('Should bundle', function(done) {
      const dir = Lactate.dir(DIR);
      const fileName = 'common.css';
      const filePath = DIR + fileName;
      http.server(dir.toMiddleware());
      dir.bundleCSS(fileName, function(err, data) {
        should.not.exist(err);
        should.exist(data.toString());
        http.client('/' + fileName, 2, function(err, res, data) {
          should.not.exist(err);
          should.exist(data);
          res.should.have.status(200);
          res.headers.should.have.property('content-type');
          res.headers.should.have.property('content-encoding');
          res.headers.should.have.property('content-length');
          res.headers.should.have.property('date');
          res.headers.should.have.property('last-modified');
          res.headers.should.have.property('cache-control');
          fs.unlink(filePath, done);
        });
      });
    })
  })

})
