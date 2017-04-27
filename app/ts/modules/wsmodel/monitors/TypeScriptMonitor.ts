import Document from '../../../editor/Document';
import { DocumentMonitor } from '../monitoring.service';
import WsModel from '.././WsModel';

//
// RxJS imports
//
// import { Subscription } from 'rxjs/Subscription';
// import 'rxjs/add/operator/debounceTime';


// const JSON_EDIT_SYNCH_DELAY_MILLIS = 500;

export class TypeScriptMonitor implements DocumentMonitor {
    private documentChangeListenerRemover: (() => void) | undefined;
    constructor(private path: string, private doc: Document, private workspace: WsModel) {
        // Do nothing yet.
    }
    /**
     * 1. Adds the script to the language service.
     * 2. Starts listening for changes to the document.
     */
    beginMonitoring(callback: (err: any) => void): void {
        const workspace = this.workspace;
        const path = this.path;
        const doc = this.doc;

        // Ensure the script in the language service.
        const hook = (err: any) => {
            if (!err) {
                this.documentChangeListenerRemover = doc.addChangeListener((delta) => {
                    this.workspace.applyDelta(path, delta);
                });
            }
            else {
                console.warn(`WsModel.beginDocumentMonitoring(${path}) failed ${err}`);
            }
            callback(err);
        };
        workspace.ensureScript(path, doc.getValue(), hook);


    }

    /**
     * 1. Stops listening for changes on the document.
     * 2. Removes the script from the language service.
     * 
     * The callback happens upon completion and reports the outcome of removing the script.
     */
    endMonitoring(callback: (err: any) => void): void {
        const path = this.path;
        // We stop listening for change events first.
        // The language service document may go out of synchronization, but it will be removed anyway.
        // This is better than change events going to a missing script?
        if (this.documentChangeListenerRemover) {
            this.documentChangeListenerRemover();
            this.documentChangeListenerRemover = void 0;
        }

        /**
         * 
         */
        const hook = (err: any, value?: boolean) => {
            if (!err) {
                // Do nothing.
            }
            else {
                console.warn(`WsModel.endDocumentMonitoring(${path}) failed ${err}`);
            }
            callback(err);
        };

        // Remove the script from the language service.
        this.workspace.removeScript(path)
            .then(function (value) {
                if (typeof value === 'boolean') {
                    if (value) {
                        // Do nothing.
                    }
                    else {
                        // Idempotent but inefficient.
                        console.warn(`WsModel.removeScript(${path}) => ${value}`);
                    }
                }
                else {
                    // The worker thread is not obeying the contract.
                    console.warn(`WsModel.removeScript(${path}) => ${value}`);
                }
                hook(void 0, value);
            })
            .catch(function (err) {
                console.warn(`WsModel.removeScript(${path}) failed. Cause: ${err}`);
                hook(err);
            });
    }
}
