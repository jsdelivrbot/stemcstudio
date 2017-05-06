import { Injectable } from '@angular/core';

import { Document } from '../../virtual/editor';
import { Editor } from '../../virtual/editor';
import { EditorService } from '../../virtual/editor';
import { EditSession } from '../../virtual/editor';

import { MonacoEditor } from './MonacoEditor';
import { MonacoEditSession } from './MonacoEditSession';
import { MonacoDocument } from './MonacoDocument';

/**
 * AngularJS dependency injection registry identifier.
 */
export const MONACO_EDITOR_SERVICE_UUID = 'monaco-editor.service.uuid';

/**
 * The namespace that monaco is loaded into.
 * This cannot be changed.
 */
const MONACO_NAMESPACE = 'monaco';
/**
 * The namespace that thhe monaco loader.js script establishes.
 * The script provides an AMD loader.
 * This cannot be changed.
 */
const REQUIRE_NAMESPACE = 'require';

interface RequireLite {
    (dependencies: string[], callback: () => void): void;
    config(options: { paths: { vs: string } }): void;
}

function monacoPath(version: string, distro: 'dev' | 'min'): string {
    return `js/monaco-editor@${version}/dev/vs`;
}

const vs = monacoPath('0.8.3', 'dev');

@Injectable()
export class MonacoEditorService implements EditorService {
    private readonly waitForLoad: Promise<void>;

    constructor() {
        this.waitForLoad = new Promise<void>((resolve, reject) => {
            // Fast path - monaco is already loaded.
            if (typeof window[MONACO_NAMESPACE] === 'object') {
                resolve();
                return;
            }

            const requireMonaco = (require: RequireLite) => {
                if (typeof window[REQUIRE_NAMESPACE] === 'function') {
                    require.config({ paths: { vs } });
                    require(['vs/editor/editor.main'], () => {
                        // console.log(`${MONACO_NAMESPACE} namespace has been loaded.`);
                        resolve();
                    });
                }
                else {
                    if (typeof window[REQUIRE_NAMESPACE] === 'function') {
                        reject(new Error(`'${REQUIRE_NAMESPACE}' is not a property of window.`));
                    }
                    else {
                        reject(new Error(`'${REQUIRE_NAMESPACE}' has an unexpected type ${typeof window[REQUIRE_NAMESPACE]}.`));
                    }
                }
            };

            // Load AMD loader if necessary
            if (typeof window[REQUIRE_NAMESPACE] === 'undefined') {
                const script = window.document.createElement('script');
                script.type = 'text/javascript';
                script.src = `${vs}/loader.js`;
                const onLoad = function () {
                    script.removeEventListener('load', onLoad);
                    requireMonaco(window[REQUIRE_NAMESPACE] as RequireLite);
                };
                script.addEventListener('load', onLoad);
                window.document.body.appendChild(script);
            }
            else {
                requireMonaco(window[REQUIRE_NAMESPACE] as RequireLite);
            }
        });
    }
    createDocument(text: string): Document {
        return new MonacoDocument(text);
    }
    createSession(doc: Document): EditSession {
        if (doc instanceof MonacoDocument) {
            return new MonacoEditSession(doc);
        }
        else {
            throw new Error("Expecting doc to be a Document");
        }
    }
    createEditor(container: HTMLElement): Editor {
        return new MonacoEditor(container);
    }
}
