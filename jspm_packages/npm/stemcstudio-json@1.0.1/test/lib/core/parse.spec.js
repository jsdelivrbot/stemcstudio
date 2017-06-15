/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var parse_1 = require('./parse');
describe("json parse", function() {
  describe("json should pass", function() {
    var emptyJson = "{}";
    var oneProperty = '{"name": "stemcstudio.com"}';
    var arrayJSON = '{"licenses": [{"type": "MIT","url": "https://github.com/geometryzen/davinci-matrix/blob/master/LICENSE"}]}';
    it("empty json", function() {
      parse_1.parse(emptyJson);
    });
    it("oneProperty", function() {
      parse_1.parse(oneProperty);
    });
    it("arrayJSON", function() {
      parse_1.parse(arrayJSON);
    });
  });
  describe("json should fail", function() {
    var incorrectJSON = '{"asdf}';
    var testforThrow = function(test) {
      return parse_1.parse(test);
    };
    it("incorrect json", function() {
      expect(function() {
        parse_1.parse(testforThrow(incorrectJSON)).toThrow();
      });
    });
  });
});
