import Document from '../../../editor/Document';
import { DocumentMonitor } from '../monitoring.service';
import { WsModel } from '.././WsModel';

//
// RxJS imports
//
// import { Subscription } from 'rxjs/Subscription';
// import 'rxjs/add/operator/debounceTime';


// const JSON_EDIT_SYNCH_DELAY_MILLIS = 500;

export class TypeScriptMonitor implements DocumentMonitor {
    private documentChangeListenerRemover: (() => void) | undefined;
    constructor(private path: string, private doc: Document, private workspace: WsModel) {
        // Do nothing yet,maybe never.
    }

    /**
     * 1. Adds the script to the language service.
     * 2. Starts listening for changes to the document.
     * 3. Emits an event signifying the addition.
     */
    beginMonitoring(callback: (err: any) => void): void {
        const workspace = this.workspace;
        const path = this.path;
        const doc = this.doc;

        workspace.addScript(path, doc.getValue())
            .then((added) => {
                this.documentChangeListenerRemover = doc.addChangeListener((delta) => {
                    workspace.applyDelta(path, delta);
                });
                callback(void 0);
            })
            .catch(function (err) {
                callback(new Error(`addScript(${path}) failed. Cause: ${err}`));
            });
    }

    /**
     * 1. Stops listening for changes on the document.
     * 2. Removes the script from the language service.
     * 3. Emits an event signifying the removal.
     * 
     * The callback happens upon completion and reports the outcome of removing the script.
     */
    endMonitoring(callback: (err: any) => void): void {
        const workspace = this.workspace;
        const path = this.path;

        if (this.documentChangeListenerRemover) {
            this.documentChangeListenerRemover();
            this.documentChangeListenerRemover = void 0;
        }

        workspace.removeScript(path)
            .then(function (removed) {
                callback(void 0);
            })
            .catch(function (err) {
                callback(new Error(`removeScript(${path}) failed. Cause: ${err}`));
            });
    }
}
