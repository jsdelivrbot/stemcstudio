/*! **** BEGIN LICENSE BLOCK ****************************************************
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
"use strict";

import mixin from '../lib/mixin';
import Annotation from "../Annotation";
import Mirror from '../worker/Mirror';
import Document from '../Document';
import WorkerCallback from "../WorkerCallback";

/**
 * Doesn't really do much because TypeScript requires the concept of a workspace.
 * 
 * However, does provide some notifications to trigger further actions.
 *
 * @class TypeScriptWorker
 * @extends Mirror
 */
export default class TypeScriptWorker extends Mirror {

    /**
     * @property options
     * @private
     */
    private options;

    /**
     * @class TypeScriptWorker
     * @constructor
     * @param host {WorkerCallback}
     */
    constructor(host: WorkerCallback) {
        super(host, 500);
        this.setOptions();
    }

    /**
     * @method setOptions
     * @param [options]
     * @return {void}
     * @private
     */
    private setOptions(options?) {
        this.options = options || {};
    }

    /**
     * @method changeOptions
     * @param options
     * @return {void}
     * @private
     */
    private changeOptions(options): void {
        mixin(this.options, options);
        this.deferredUpdate.schedule(100);
    }

    /**
     * @method onUpdate
     * @return {void}
     * @protected
     */
    protected onUpdate(): void {
        var annotations: Annotation[] = [];
        this.emitAnnotations(annotations);
    }
}
