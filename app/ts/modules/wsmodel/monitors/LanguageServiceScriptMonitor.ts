import { DocumentMonitor } from '../monitoring.service';
import { WsModel } from '.././WsModel';
//
// Editor Abstraction Layer
//
import { EditSession } from '../../../virtual/editor';

export class LanguageServiceScriptMonitor implements DocumentMonitor {
    private documentChangeListenerRemover: (() => void) | undefined;
    constructor(private path: string, private session: EditSession, private workspace: WsModel) {
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
        const session = this.session;

        workspace.addScript(path, session.getValue())
            .then((added) => {
                if (added) {
                    this.documentChangeListenerRemover = session.addChangeListener((delta) => {
                        workspace.applyDelta(path, delta);
                    });
                    callback(void 0);
                }
                else {
                    callback(new Error(`addScript(${path}) => added = ${added}`));
                }
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
                if (removed) {
                    callback(void 0);
                }
                else {
                    callback(new Error(`removeScript(${path}) => removed = ${removed}`));
                }
            })
            .catch(function (err) {
                callback(new Error(`removeScript(${path}) failed. Cause: ${err}`));
            });
    }
}
