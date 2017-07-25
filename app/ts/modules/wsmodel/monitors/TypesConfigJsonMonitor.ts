import { DocumentMonitor } from '../monitoring.service';
import { WsModel } from '.././WsModel';
import { EditSession } from '../../../editor/EditSession';

//
// RxJS imports
//
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';


const JSON_EDIT_SYNCH_DELAY_MILLIS = 500;

export class TypesConfigJsonMonitor implements DocumentMonitor {
    private changeEventsSubscription: Subscription | undefined;
    constructor(private path: string, private session: EditSession, private workspace: WsModel) {
        // Do nothing yet.
    }
    beginMonitoring(callback: (err: any) => void): void {
        const session = this.session;
        const path = this.path;
        const workspace = this.workspace;
        this.changeEventsSubscription = session.changeEvents
            .debounceTime(JSON_EDIT_SYNCH_DELAY_MILLIS)
            .subscribe((delta) => {
                const types = workspace.getTypesConfigSettings();
                if (types) {
                    workspace.changedTypesSettings.emitAsync('changedTypesSettings', types);
                }
                else {
                    console.warn(`${path} could not be parsed.`);
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
