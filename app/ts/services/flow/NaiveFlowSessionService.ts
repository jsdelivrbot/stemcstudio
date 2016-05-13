import ConflictResolutionStrategy from './ConflictResolutionStrategy';
import FlowSessionService from './FlowSessionService';
import NaiveSession from './NaiveSession';
import Rule from './Rule';
import Session from './Session';

export default class NaiveFlowSessionService implements FlowSessionService {
    createSession<T>(rules: Rule<T>[], conflictResolutionStrategy: ConflictResolutionStrategy<T>, facts: T): Session<T> {
        if (!conflictResolutionStrategy) {
            throw new Error("conflictResolutionStrategy must be defined.");
        }
        return new NaiveSession<T>(rules, conflictResolutionStrategy, facts);
    }
}
