/* ***** BEGIN LICENSE BLOCK *****
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2016 David Geo Holmes <david.geo.holmes@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * ***** END LICENSE BLOCK ***** */
interface JSHintOptions {
    // Enforcing options
    bitwise?: boolean;
    /**
     * deprecated
     */
    camelcase?: boolean;
    curly?: boolean;
    /**
     * deprecated
     */
    enforceall?: boolean;
    eqeqeq?: boolean;
    /**
     * deprecated
     */
    es3?: boolean;
    /**
     * deprecated
     */
    es5?: boolean;
    esversion?: number;
    forin?: boolean;
    freeze?: boolean;
    funcscope?: boolean;
    futurehostile?: boolean;
    globals?: string[];
    /**
     * deprecated
     */
    immed?: boolean;
    /**
     * deprecated
     */
    indent?: number;
    iterator?: boolean;
    latedef?: boolean | string;
    maxcomplexity?: boolean;
    maxdepth?: number;
    maxerr?: number;
    /**
     * deprecated
     */
    maxlen?: number;
    maxparams?: boolean;
    maxstatements?: boolean;
    /**
     * deprecated
     */
    newcap?: boolean;
    noarg?: boolean;
    nocomma?: boolean;
    /**
     * deprecated
     */
    noempty?: boolean;
    /**
     *
     */
    nonbsp?: boolean;
    nonew?: boolean;
    notypeof?: boolean;
    predef?: string[];
    /**
     * deprecated
     */
    quotmark?: boolean | string;
    /**
     *
     */
    shadow?: boolean | string;
    singleGroups?: boolean;
    /**
     *
     */
    strict?: string | boolean;
    undef?: boolean;
    unused?: boolean;
    varstmt?: boolean;
    ignoreDelimiters?;
    onevar?: boolean;
    passfail?: boolean;
    exported?: { [nam: string]: boolean };
    scope?;
    // Relaxing
    asi?: boolean;
    boss?: boolean;
    debug?: boolean;
    elision?: boolean;
    eqnull?: boolean;
    esnext?: boolean;
    evil?: boolean;
    expr?: boolean;
    globalstrict?: boolean;
    lastsemic?: boolean;
    /**
     * deprecated
     */
    laxbreak?: boolean;
    /**
     * deprecated
     */
    laxcomma?: boolean;
    loopfunc?: boolean;
    moz?: boolean;
    /**
     * deprecated
     */
    multistr?: boolean;
    noyield?: boolean;
    plusplus?: boolean;
    proto?: boolean;
    scripturl?: boolean;
    /**
     * deprecated
     */
    sub?: boolean;
    supernew?: boolean;
    validthis?: boolean;
    withstmt?: boolean;
    // Environments
    /**
     *
     */
    browser?: boolean;
    browserify?: boolean;
    couch?: boolean;
    /**
     * Defines console, alert, etc.
     */
    devel?: boolean;
    dojo?: boolean;
    jasmine?: boolean;
    jquery?: boolean;
    mocha?: boolean;
    module?: boolean;
    mootools?: boolean;
    node?: boolean;
    nonstandard?: boolean;
    phantom?: boolean;
    prototypejs?: boolean;
    qunit?: boolean;
    rhino?: boolean;
    shelljs?: boolean;
    typed?: boolean;
    worker?: boolean;
    wsh?: boolean;
    yui?: boolean;
}

export default JSHintOptions;