import { DocumentMonitor } from '../monitoring.service';
import { WsModel } from '.././WsModel';
import { EditSession } from '../../../editor/EditSession';

//
// RxJS imports
//
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';


const JSON_EDIT_SYNCH_DELAY_MILLIS = 500;
const TSCONFIG_DOT_JSON = 'tsconfig.json';

export class TsConfigJsonMonitor implements DocumentMonitor {
    private changeEventsSubscription: Subscription | undefined;
    constructor(private session: EditSession, private workspace: WsModel) {
        // Do nothing yet.
    }

    /**
     * Begins a debounced subscription that emits changedCompilerSettings events.
     */
    beginMonitoring(callback: (err: any) => void): void {
        this.changeEventsSubscription = this.session.changeEvents
            .debounceTime(JSON_EDIT_SYNCH_DELAY_MILLIS)
            .subscribe((delta) => {
                const newSettings = this.workspace.tsconfigSettings;
                if (newSettings) {
                    if (newSettings) {
                        this.workspace.synchTsConfig(newSettings)
                            .then((oldSettings) => {
                                // TODO: We now have the potential to emit oldSettings and newSettings.
                                this.workspace.changedCompilerSettings.emitAsync('changedCompilerSettings', newSettings);
                            })
                            .catch((reason) => {
                                // TODO: Report this back to the workspace.
                            });
                    }
                    else {
                        console.warn(`Unable to process ${JSON.stringify(delta, null, 2)} from ${TSCONFIG_DOT_JSON}`);
                    }
                }
                else {
                    // There is an error in the tsconfig.json file.
                    // This will happen frequently during editing and should be ignored.
                }
            });
        window.setTimeout(callback, 0);
    }

    /**
     * Ends the debounced subscription that emits changedCompilerSettings events.
     */
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
