/**
 * based on code from:
 *
 * @license RequireJS text 0.25.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

import getDocumentHead from '../dom/getDocumentHead';

/**
 * Executes a 'GET' HTTP request with a responseText callback.
 */
export function get(url: string, callback: (err: Error, responseText?: string) => any) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function (ev: ProgressEvent) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(void 0, xhr.responseText);
            }
            else {
                callback(new Error(xhr.statusText));
            }
        }
    };
    xhr.send(null);
}

/**
 * Creates a <script> tag, sets the 'src' property, and calls back when loaded.
 */
export function loadScript(src: string, callback: () => any, doc: Document): void {

    const head: HTMLHeadElement = getDocumentHead(doc);
    let s: HTMLScriptElement = doc.createElement('script');

    s.src = src;
    head.appendChild(s);

    s.onload = s['onreadystatechange'] = function (_, isAbort?: boolean) {
        if (isAbort || !s['readyState'] || s['readyState'] === "loaded" || s['readyState'] === "complete") {
            s = s.onload = s['onreadystatechange'] = null;
            if (!isAbort) {
                callback();
            }
        }
    };
}

/**
 * Convert a url into a fully qualified absolute URL.
 * This function does not work in IE6.
 */
export function qualifyURL(url: string): string {
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    return a.href;
}
