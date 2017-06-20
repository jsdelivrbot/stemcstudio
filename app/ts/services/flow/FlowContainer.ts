import { ConflictResolutionStrategy } from './ConflictResolutionStrategy';
import { Session } from './Session';
import { FlowSessionService } from './FlowSessionService';
import { Rule } from './Rule';
import { strategy } from './conflicts/strategy';

const conflictResolution = strategy(["salience", "activationRecency"]);

/**
 * This is a Flow builder because I can define rules then create a Session.
 */
export class FlowContainer<T> {
    private conflictResolutionStrategy: ConflictResolutionStrategy<T>;
    private rules: Rule<T>[] = [];
    constructor(private flowSessionService: FlowSessionService) {
        this.conflictResolutionStrategy = conflictResolution;
    }
    rule(
        name: string,
        options: {
            salience?: number,
            scope?: { [name: string]: any }
        },
        pattern: (facts: T) => boolean,
        action: (facts: T, session: Session<T>, next: (reason?: any) => any) => any
    ) {
        this.rules.push(new Rule<T>(name, options, pattern, action));
    }
    createSession(initialFacts: T): Session<T> {
        return this.flowSessionService.createSession(this.rules, this.conflictResolutionStrategy, initialFacts);
    }
}
