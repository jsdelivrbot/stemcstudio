// import Agenda from './Agenda';
import { AVLTree } from './trees/AVLTree';
import { Flow } from './Flow';
import { EventBus } from './EventBus';

const DEFAULT_AGENDA_GROUP = "main";

export class AgendaTree extends EventBus<AgendaTree> {
    agendaGroups: { [groupName: string]: AVLTree };
    agendaGroupStack: string[];
    rules;
    comparator;
    constructor(private flow: Flow<any>, private conflictResolution) {
        super();
        this.agendaGroups = {};
        this.agendaGroupStack = [DEFAULT_AGENDA_GROUP];
        this.rules = {};
        this.flow = flow;
        this.comparator = conflictResolution;
        this.setFocus(DEFAULT_AGENDA_GROUP).addAgendaGroup(DEFAULT_AGENDA_GROUP);
    }

    addAgendaGroup(groupName: string) {
        if (!this.agendaGroups[groupName]) {
            this.agendaGroups[groupName] = new AVLTree({ compare: this.comparator });
        }
    }

    setFocus(agendaGroup: string) {
        if (agendaGroup !== this.getFocused()) {
            this.agendaGroupStack.push(agendaGroup);
            this.emit("focused", agendaGroup, this);
        }
        return this;
    }

    getFocused(): string {
        const ags = this.agendaGroupStack;
        return ags[ags.length - 1];
    }

}
