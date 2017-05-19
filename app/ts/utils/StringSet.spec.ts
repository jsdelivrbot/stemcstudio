//// <reference path="../../../typings/main/ambient/jasmine/index.d.ts" />

import { StringSet } from './StringSet';

describe("StringSet", function () {
  describe("constructor", function () {
    const s = new StringSet();
    it("should have size 0", function () {
      expect(s.size()).toBe(0);
    });
  });
  describe("add 'a' add 'b' add 'a'", function () {
    const s = new StringSet();
    s.add('a');
    s.add('b');
    s.add('a');
    it("should have size 2", function () {
      expect(s.size()).toBe(2);
    });
  });
});
