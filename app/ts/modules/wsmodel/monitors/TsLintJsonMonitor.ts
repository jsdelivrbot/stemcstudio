import { DocumentMonitor } from '../monitoring.service';
import { WsModel } from '.././WsModel';
//
// Editor Abstraction Layer
//
import { Document } from '../../../virtual/editor';

//
// RxJS imports
//
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';


const JSON_EDIT_SYNCH_DELAY_MILLIS = 500;

/**
 * Monitor for the tslint.json file.
 */
export class TsLintJsonMonitor implements DocumentMonitor {
    private changeEventsSubscription: Subscription | undefined;
    constructor(private doc: Document, private workspace: WsModel) {
        // Do nothing yet.
    }

    beginMonitoring(callback: (err: any) => void): void {
        const doc = this.doc;
        const workspace = this.workspace;
        this.changeEventsSubscription = doc.changeEvents
            .debounceTime(JSON_EDIT_SYNCH_DELAY_MILLIS)
            .subscribe((delta) => {
                const tsl = workspace.getTsLintSettings();
                if (tsl) {
                    workspace.changedTsLintSettings.emitAsync('changedLintSettings', tsl);
                }
                else {
                    // There is an error in the tsconfig.json file.
                    // This will happen frequently during editing and should be ignored.
                }
            });
        window.setTimeout(callback, 0);
    }
    endMonitoring(callback: (err: any) => void): void {
        if (this.changeEventsSubscription) {
            this.changeEventsSubscription.unsubscribe();
            this.changeEventsSubscription = void 0;
        }
        else {
            // Idempotent.
        }
        window.setTimeout(callback, 0);
    }
}
