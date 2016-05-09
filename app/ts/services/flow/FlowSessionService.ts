import ConflictResolutionStrategy from './ConflictResolutionStrategy';
import Rule from './Rule';
import Session from './Session';

interface FlowSessionService {
    createSession<T>(rules: Rule<T>[], conflictResolutionStrategy: ConflictResolutionStrategy<T>, initialFacts: T): Session<T>;
}

export default FlowSessionService;
