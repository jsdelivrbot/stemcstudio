
var should  = require('should');
var Lactate = require('../lib/lactate');
var http    = require('./utils/http_utils');
var files   = require('./utils/get_files');

describe('Custom 404 Handlers', function() {

  const DIR = __dirname + '/files/';

  afterEach(http.stopServer);

  describe('#set(not_found) --string', function() {
    it('Should not err', function(done) {
      const dir = Lactate.dir(DIR);
      dir.set('not_found', DIR + '404.html');
      http.server(dir.toMiddleware());
      http.client('/', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done();
      })
    })
    it('Should have status 404', function(done) {
      const dir = Lactate.dir(DIR);
      dir.set('not_found', DIR + '404.html');
      http.server(dir.toMiddleware());
      http.client('/', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(404);
        done();
      })
    })
    it('Should have content-type header', function(done) {
      const dir = Lactate.dir(DIR);
      dir.set('not_found', DIR + '404.html');
      http.server(dir.toMiddleware());
      http.client('/', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
        done();
      })
    })
    it('Should have content-encoding header', function(done) {
      const dir = Lactate.dir(DIR);
      dir.set('not_found', DIR + '404.html');
      http.server(dir.toMiddleware());
      http.client('/', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-encoding', 'gzip');
        done();
      })
    })
    it('Should have content-length header', function(done) {
      const dir = Lactate.dir(DIR);
      dir.set('not_found', DIR + '404.html');
      http.server(dir.toMiddleware());
      http.client('/', 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-length');
        done();
      })
    })
    it('Should have date header', function(done) {
      const dir = Lactate.dir(DIR);
      dir.set('not_found', DIR + '404.html');
      http.server(dir.toMiddleware());
      http.client('/', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('date');
        done();
      })
    })
  })

  describe('#set(not_found) --string --non-existent', function() {
    it('Should not err', function(done) {
      var dir = Lactate.dir(DIR);
      dir.set('not_found', 'invalidpath');
      http.server(dir.toMiddleware());
      http.client('/', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done();
      })
    })
    it('Should have status 404', function(done) {
      var dir = Lactate.dir(DIR);
      dir.set('not_found', 'invalidpath');
      http.server(dir.toMiddleware());
      http.client('/', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(404);
        done();
      })
    })
    it('Should respond with no data', function(done) {
      var dir = Lactate.dir(DIR);
      dir.set('not_found', 'invalidpath');
      http.server(dir.toMiddleware());
      http.client('/', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        data.should.have.property('length', 0);
        done();
      })
    })
  })

  describe('#set(not_found) --function', function() {
    it('Should not err', function(done) {
      const dir = Lactate.dir(DIR);
      dir.set('not_found', function(req, res) {
        res.writeHead(404);
        res.end('test');
      });
      http.server(dir.toMiddleware());
      http.client('/', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done();
      })
    })
    it('Should have status 404', function(done) {
      const dir = Lactate.dir(DIR);
      dir.set('not_found', function(req, res) {
        res.writeHead(404);
        res.end('test');
      });
      http.server(dir.toMiddleware());
      http.client('/', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(404);
        done();
      })
    })
    it('Should respond with test string', function(done) {
      const dir = Lactate.dir(DIR);
      dir.set('not_found', function(req, res) {
        res.writeHead(404);
        res.end('test');
      });
      http.server(dir.toMiddleware());
      http.client('/', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        data.should.be.an.instanceof(Buffer);
        data.toString().should.equal('test');
        done();
      })
    })
  })
})

