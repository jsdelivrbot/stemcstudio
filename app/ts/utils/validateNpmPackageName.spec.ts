import { validate, NpmValidateNameResult } from './validateNpmPackageName';

const validForNewAndOld: NpmValidateNameResult = { validForNewPackages: true, validForOldPackages: true };

/**
 * 
 */
const noSpecialCharacters: NpmValidateNameResult = {
    validForNewPackages: false,
    validForOldPackages: true,
    warnings: ['name can no longer contain special characters ("~\'!()*")']
};

/**
 * 
 */
const nameLengthMustBeNonZero: NpmValidateNameResult = {
    validForNewPackages: false,
    validForOldPackages: false,
    errors: ['name length must be greater than zero']
};

describe("validateNpmPackageName", function () {
    describe("Traditional", function () {
        it("should allow hyphens", function () {
            expect(validate('some-package')).toEqual(validForNewAndOld);
        });
        it("should allow dot com", function () {
            expect(validate('example.com')).toEqual(validForNewAndOld);
        });
        it("should allow underscore", function () {
            expect(validate('under_score')).toEqual(validForNewAndOld);
        });
        it("should allow dot js", function () {
            expect(validate('period.js')).toEqual(validForNewAndOld);
        });
        it("should allow begin with number", function () {
            expect(validate('123numeric')).toEqual(validForNewAndOld);
        });
        it("should not allow special charaters", function () {
            expect(validate('crazy!')).toEqual(noSpecialCharacters);
        });
    });
    describe("Invalid", function () {
        it("zero length name", function () {
            expect(validate('')).toEqual(nameLengthMustBeNonZero);
        });
    });
});
