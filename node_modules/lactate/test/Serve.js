
var should = require('should');
var Lactate = require('../lib/lactate');
var http = require('./utils/http_utils');
var files = require('./utils/get_files');

describe('Serve', function() {

  var DIR = __dirname;

  afterEach(http.stopServer);

  describe('#serve(index.html)', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      });
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done();
      })
    })
    it('Should have status 200', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(200);
        done();
      })
    })
    it('Should have content-type header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
        done();
      })
    })
    it('Should have content-encoding header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-encoding', 'gzip')
        done()
      })
    })
    it('Should have content-length header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-length', String(size));
        done();
      })
    })
    it('Should have date header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('date');
        done();
      })
    })
    it('Should have last-modified header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('last-modified');
        done();
      })
    })
    it('Should have cache-control header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('cache-control');
        done();
      })
    })
    it('Should serve complete data', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        data.should.have.property('length', size);
        done();
      })
    })
  })

  describe('#serve(script.js)', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'script.js';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      });
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done();
      })
    })
    it('Should have status 200', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'script.js';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(200);
        done();
      })
    })
    it('Should have content-type header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'script.js';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-type', 'text/javascript; charset=UTF-8');
        done();
      })
    })
    it('Should have content-encoding header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'script.js';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-encoding', 'gzip')
        done()
      })
    })
    it('Should have content-length header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'script.js';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-length', String(size));
        done();
      })
    })
    it('Should have date header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'script.js';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('date');
        done();
      })
    })
    it('Should have last-modified header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'script.js';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('last-modified');
        done();
      })
    })
    it('Should have cache-control header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'script.js';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('cache-control');
        done();
      })
    })
    it('Should serve complete data', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'script.js';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        data.should.have.property('length', size);
        done();
      })
    })
  })

  describe('#serve(style.css)', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'style.css';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done();
      })
    })
    it('Should have status 200', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'style.css';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(200);
        done();
      })
    })
    it('Should have content-type header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'style.css';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-type', 'text/css; charset=UTF-8');
        done();
      })
    })
    it('Should have content-encoding header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'style.css';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res)
      });
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-encoding', 'gzip');
        done();
      });
    });
    it('Should have content-length header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'style.css';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      });
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-length', String(size));
        done();
      });
    })
    it('Should have date header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'style.css';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('date');
        done();
      })
    })
    it('Should have last-modified header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'style.css';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('last-modified');
        done();
      })
    })
    it('Should have cache-control header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'style.css';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('cache-control');
        done();
      })
    })
    it('Should serve complete data', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'style.css';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        data.should.have.property('length', size);
        done();
      })
    })
  })

  describe('#serve(test.png)', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'test.png';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done()
      })
    })
    it('Should have status 200', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'test.png';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(200);
        done();
      })
    })
    it('Should have content-type header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'test.png';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-type', 'image/png');
        done();
      })
    })
    it('Should not have content-encoding header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'test.png';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.not.have.property('content-encoding');
        done()
      })
    })
    it('Should have content-length header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'test.png';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-length', String(size));
        done();
      })
    })
    it('Should have date header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'test.png';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('date');
        done();
      })
    })
    it('Should have last-modified header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'test.png';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('last-modified');
        done();
      })
    })
    it('Should have cache-control header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'test.png';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('cache-control');
        done();
      })
    })
    it('Should serve complete data', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'test.png';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        data.should.property('length', size);
        done()
      })
    })
  })

  describe('#serve(landing%20page.html)', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'landing page.html';
      var size = files[file];
      var url = '/files/landing%20page.html';
      http.server(function(req, res) {
        lactate.serve(req, res);
      });
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done();
      })
    })
    it('Should have status 200', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'landing page.html';
      var size = files[file];
      var url = '/files/landing%20page.html';
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(200);
        done();
      })
    })
    it('Should have content-type header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'landing page.html';
      var size = files[file];
      var url = '/files/landing%20page.html';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
        done();
      })
    })
    it('Should have content-encoding header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'landing page.html';
      var size = files[file];
      var url = '/files/landing%20page.html';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-encoding', 'gzip')
        done()
      })
    })
    it('Should have content-length header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'landing page.html';
      var size = files[file];
      var url = '/files/landing%20page.html';
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-length', String(size));
        done();
      })
    })
    it('Should have date header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'landing page.html';
      var size = files[file];
      var url = '/files/landing%20page.html';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('date');
        done();
      })
    })
    it('Should have last-modified header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'landing page.html';
      var size = files[file];
      var url = '/files/landing%20page.html';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('last-modified');
        done();
      })
    })
    it('Should have cache-control header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'landing page.html';
      var size = files[file];
      var url = '/files/landing%20page.html';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('cache-control');
        done();
      })
    })
    it('Should serve complete data', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'landing page.html';
      var size = files[file];
      var url = '/files/landing%20page.html';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        data.should.have.property('length', size);
        done();
      })
    })
  })

  describe('#serve(index.html?v=3)', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/index.html?v=3';
      http.server(function(req, res) {
        lactate.serve(req, res);
      });
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done();
      })
    })
    it('Should have status 200', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/index.html?v=3';
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(200);
        done();
      })
    })
    it('Should have content-type header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/index.html?v=3';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
        done();
      })
    })
    it('Should have content-encoding header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/index.html?v=3';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-encoding', 'gzip')
        done()
      })
    })
    it('Should have content-length header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/index.html?v=3';
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-length', String(size));
        done();
      })
    })
    it('Should have date header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/index.html?v=3';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('date');
        done();
      })
    })
    it('Should have last-modified header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/index.html?v=3';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('last-modified');
        done();
      })
    })
    it('Should have cache-control header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/index.html?v=3';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('cache-control');
        done();
      })
    })
    it('Should serve complete data', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/index.html?v=3';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        data.should.have.property('length', size);
        done();
      })
    })
  })

  describe('#serve(invalidpath)', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({ root:DIR })
      var file = 'invalidpath';
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done();
      })
    })
    it('Should have status code 404', function(done) {
      var lactate = Lactate.Lactate({ root:DIR })
      var file = 'invalidpath';
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(404);
        done();
      })
    })
    it('Should have content-type header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR })
      var file = 'invalidpath';
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
        done();
      })
    });
    it('Should have content-encoding header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR })
      var file = 'invalidpath';
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-encoding');
        done();
      })
    });
    it('Should have content-length header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR })
      var file = 'invalidpath';
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-length');
        done();
      })
    });
    it('Should have date header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR })
      var file = 'invalidpath';
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('date');
        done();
      })
    });
  })

  describe('#serve(.invalidpath) --no-hidden', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({ root:DIR, hidden:false })
      var file = '.invalidpath';
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done()
      })
    })
    it('Should have status 403', function(done) {
      var lactate = Lactate.Lactate({ root:DIR, hidden:false })
      var file = '.invalidpath';
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(403)
        done();
      })
    })
    it('Should have content-type header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR, hidden:false })
      var file = '.invalidpath';
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
        done();
      })
    });
    it('Should have content-encoding header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR, hidden:false })
      var file = '.invalidpath';
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-encoding');
        done();
      })
    });
    it('Should have content-length header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR, hidden:false })
      var file = '.invalidpath';
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-length');
        done();
      })
    });
    it('Should have date header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR, hidden:false })
      var file = '.invalidpath';
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('date');
        done();
      })
    });
  });

  describe('#serve(files/script.js) --no-subdirs', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({ root:__dirname, subdirs:false });
      var url = '/urls/script.js';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done();
      })
    })
    it('Should have status 403', function(done) {
      var lactate = Lactate.Lactate({ root:__dirname, subdirs:false });
      var url = '/urls/script.js';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(403);
        done();
      })
    })
    it('Should have content-type header', function(done) {
      var lactate = Lactate.Lactate({ root:__dirname, subdirs:false });
      var url = '/urls/script.js';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
        done();
      })
    });
    it('Should have content-encoding header', function(done) {
      var lactate = Lactate.Lactate({ root:__dirname, subdirs:false });
      var url = '/urls/script.js';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        res.headers.should.have.property('content-encoding', 'gzip');
        done();
      })
    });
    it('Should have content-length header', function(done) {
      var lactate = Lactate.Lactate({ root:__dirname, subdirs:false });
      var url = '/urls/script.js';
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        res.headers.should.have.property('content-length');
        done();
      })
    });
    it('Should have date header', function(done) {
      var lactate = Lactate.Lactate({ root:__dirname, subdirs:false });
      var url = '/urls/script.js';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('date');
        done();
      })
    });
  });

  describe('#serve(files/script.js) --using-method-POST', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({ root:__dirname });
      var url = '/urls/script.js';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, 'POST', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done();
      })
    })
    it('Should have status 405', function(done) {
      var lactate = Lactate.Lactate({ root:__dirname });
      var url = '/urls/script.js';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, 'POST', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(405);
        done();
      })
    })
    it('Should have content-type header', function(done) {
      var lactate = Lactate.Lactate({ root:__dirname });
      var url = '/urls/script.js';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, 'POST', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
        done();
      })
    });
    it('Should have content-encoding header', function(done) {
      var lactate = Lactate.Lactate({ root:__dirname });
      var url = '/urls/script.js';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, 'POST', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-encoding', 'gzip');
        done();
      })
    });
    it('Should have content-length header', function(done) {
      var lactate = Lactate.Lactate({ root:__dirname });
      var url = '/urls/script.js';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, 'POST', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-length');
        done();
      })
    });
    it('Should have date header', function(done) {
      var lactate = Lactate.Lactate({ root:__dirname });
      var url = '/urls/script.js';
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, 'POST', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('date');
        done();
      })
    });
  })

  describe('#serve(index.html) --using-method-HEAD', function() {
    it('Should not err', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      });
      http.client(url, 2, 'HEAD', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        done();
      })
    })
    it('Should have status 200', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, 'HEAD', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.should.have.status(200);
        done();
      })
    })
    it('Should have content-type header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, 'HEAD', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-type', 'text/html; charset=UTF-8');
        done();
      })
    })
    it('Should have content-encoding header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, 'HEAD', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-encoding', 'gzip')
        done()
      })
    })
    it('Should have content-length header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res)
      })
      http.client(url, 2, 'HEAD', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('content-length', String(size));
        done();
      })
    })
    it('Should have date header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, 'HEAD', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('date');
        done();
      })
    })
    it('Should have last-modified header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, 'HEAD', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('last-modified');
        done();
      })
    })
    it('Should have cache-control header', function(done) {
      var lactate = Lactate.Lactate({ root:DIR });
      var file = 'index.html';
      var size = files[file];
      var url = '/files/' + file;
      http.server(function(req, res) {
        lactate.serve(req, res);
      })
      http.client(url, 2, 'HEAD', function(err, res, data) {
        should.not.exist(err);
        should.exist(res);
        should.exist(data);
        res.headers.should.have.property('cache-control');
        done();
      })
    })
  })

});
