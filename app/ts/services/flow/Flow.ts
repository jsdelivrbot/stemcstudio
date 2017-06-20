import { AgendaTree } from './AgendaTree';
import { EventBus } from './EventBus';
import { ExecutionStrategy } from './ExecutionStrategy';
import { RootNode } from './nodes/RootNode';
import { Session } from './Session';
import { WorkingMemory } from './WorkingMemory';

export class Flow<T> extends EventBus<Flow<T>> implements Session<T> {
    agenda: AgendaTree;
    executionStrategy: ExecutionStrategy<T>;
    rootNode: RootNode;
    workingMemory: WorkingMemory;
    private __rules;
    constructor(private name: string, private conflictResolutionStrategy) {
        super();
        this.name = name;
        this.__rules = {};
        this.conflictResolutionStrategy = conflictResolutionStrategy;
        this.workingMemory = new WorkingMemory();
        this.agenda = new AgendaTree(this, conflictResolutionStrategy);
        this.rootNode = new RootNode(this.workingMemory, this.agenda);
    }
    assert(fact: any) {
        throw new Error('Flow.assert');
    }
    modify(fact: any) {
        throw new Error('Flow.modify');
    }
    retract(fact: any) {
        throw new Error('Flow.retract');
    }
    getFacts(type?): any[] {
        return [];
    }
    execute(callback: (reason: any) => any): void {
        this.executionStrategy = new ExecutionStrategy(this);
        return this.executionStrategy.execute();
    }
    matchUntilHalt(): void {
        // We need $q to be injected, and hence into the service
        throw new Error('matchUntilHalt');
    }
    dispose(): void {
        // TODO
    }
}
