/**
 * based on code from:
 *
 * @license RequireJS text 0.25.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

// import getDocumentHead from '../dom/getDocumentHead';

/**
 * Executes a 'GET' HTTP request with a responseText callback.
 */
export function get(url: string, user?: string, password?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true, user, password);
        xhr.onreadystatechange = function (this: XMLHttpRequest, ev: ProgressEvent) {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    resolve(this.responseText);
                }
                else {
                    reject(new Error(this.statusText));
                }
            }
        };
        xhr.send(null);
    });
}

/**
 * Creates a <script> tag, sets the 'src' property, and calls back when loaded.
 */
/*
export function loadScript(src: string, callback: () => any, doc: Document): void {

    const head: HTMLHeadElement = getDocumentHead(doc);
    let s: HTMLScriptElement = doc.createElement('script');

    s.src = src;
    head.appendChild(s);

    s.onload = s['onreadystatechange'] = function (_: any, isAbort?: boolean) {
        if (isAbort || !s['readyState'] || s['readyState'] === "loaded" || s['readyState'] === "complete") {
            s = s.onload = s['onreadystatechange'] = null;
            if (!isAbort) {
                callback();
            }
        }
    };
}
*/

/**
 * Convert a url into a fully qualified absolute URL.
 * This function does not work in IE6.
 */
export function qualifyURL(url: string): string {
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    return a.href;
}
