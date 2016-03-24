//// <reference path="../../../typings/main/ambient/jasmine/index.d.ts" />

import linkToMap from './linkToMap';

describe("linkToMap", function() {
  describe("single", function() {
    const href = `http://www.xyz.com?page=${Math.random()}`;
    const rel = `more${Math.random()}`;
    const map = linkToMap(`<${href}>; rel="${rel}"`);
    it("should create a map with a single entry", function() {
      expect(map[rel]).toBe(href);
    });
  });
  describe("multi", function() {
    const parts: string[] = [];
    // const href = `http://www.xyz.com?page=${Math.random()}`;
    // const rel = 'more';
    parts.push(`<a>; rel="one"`);
    parts.push(`<b>; rel="two"`);
    const link = parts.join(',');
    const map = linkToMap(link);
    it("should create a map with a single entry", function() {
      expect(map['one']).toBe('a');
    });
  });
});
