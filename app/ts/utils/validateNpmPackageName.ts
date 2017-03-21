/**
 * Copyright (c) 2015, npm, Inc
 * 
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee
 * is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE
 * INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS.
 * IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES
 * OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
 * NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
const scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$');

const builtins: string[] = [

];

const blacklist = [
    'node_modules',
    'favicon.ico'
];

export interface NpmValidateNameResult {
    validForNewPackages: boolean;
    validForOldPackages: boolean;
    warnings?: string[];
    errors?: string[];
}

const done = function (warnings: string[], errors: string[]): NpmValidateNameResult {
    const result: NpmValidateNameResult = {
        validForNewPackages: errors.length === 0 && warnings.length === 0,
        validForOldPackages: errors.length === 0,
        warnings: warnings,
        errors: errors
    };
    if (result.warnings && !result.warnings.length) delete result.warnings;
    if (result.errors && !result.errors.length) delete result.errors;
    return result;
};

export function validate(name: string): NpmValidateNameResult {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (name === null) {
        errors.push('name cannot be null');
        return done(warnings, errors);
    }

    if (name === undefined) {
        errors.push('name cannot be undefined');
        return done(warnings, errors);
    }

    if (typeof name !== 'string') {
        errors.push('name must be a string');
        return done(warnings, errors);
    }

    if (!name.length) {
        errors.push('name length must be greater than zero');
    }

    if (name.match(/^\./)) {
        errors.push('name cannot start with a period');
    }

    if (name.match(/^_/)) {
        errors.push('name cannot start with an underscore');
    }

    if (name.trim() !== name) {
        errors.push('name cannot contain leading or trailing spaces');
    }

    // No funny business
    blacklist.forEach(function (blacklistedName) {
        if (name.toLowerCase() === blacklistedName) {
            errors.push(blacklistedName + ' is a blacklisted name');
        }
    });

    // Generate warnings for stuff that used to be allowed

    // core module names like http, events, util, etc
    builtins.forEach(function (builtin) {
        if (name.toLowerCase() === builtin) {
            warnings.push(builtin + ' is a core module name');
        }
    });

    // really-long-package-names-------------------------------such--length-----many---wow
    // the thisisareallyreallylongpackagenameitshouldpublishdowenowhavealimittothelengthofpackagenames-poch.
    if (name.length > 214) {
        warnings.push('name can no longer contain more than 214 characters');
    }

    // mIxeD CaSe nAMEs
    if (name.toLowerCase() !== name) {
        warnings.push('name can no longer contain capital letters');
    }

    if (/[~'!()*]/.test(name.split('/').slice(-1)[0])) {
        warnings.push('name can no longer contain special characters ("~\'!()*")');
    }

    if (encodeURIComponent(name) !== name) {
        // Maybe it's a scoped package name, like @user/package
        const nameMatch = name.match(scopedPackagePattern);
        if (nameMatch) {
            const user = nameMatch[1];
            const pkg = nameMatch[2];
            if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
                return done(warnings, errors);
            }
        }

        errors.push('name can only contain URL-friendly characters');
    }

    return done(warnings, errors);
}
