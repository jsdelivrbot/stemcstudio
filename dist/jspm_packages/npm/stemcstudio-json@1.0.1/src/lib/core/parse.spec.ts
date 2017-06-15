import { parse } from './parse';

describe("json parse", function() {
    describe("json should pass", function() {
        const emptyJson = "{}";
        const oneProperty = '{"name": "stemcstudio.com"}';
        const arrayJSON = '{"licenses": [{"type": "MIT","url": "https://github.com/geometryzen/davinci-matrix/blob/master/LICENSE"}]}';
        it("empty json", function() {
            parse(emptyJson);
        });
        it("oneProperty", function() {
            parse(oneProperty);
        });
        it("arrayJSON", function() {
            parse(arrayJSON);
        });
    });
    describe("json should fail", function() {
        const incorrectJSON = '{"asdf}';
        const testforThrow = function(test: string): string {
            return parse(test);
        };
        it("incorrect json", function() {
            expect(function(){
                parse(testforThrow(incorrectJSON)).toThrow();
            });
        });
    });
});
