import AgendaTree from '../AgendaTree';
import WorkingMemory from '../WorkingMemory';

export default class RootNode {
    constructor(workingMemory: WorkingMemory, agenda: AgendaTree) {
        throw new Error('RootNode.constructor')
    }
    incrementCounter() {
        throw new Error('RootNode.incrementCounter')
    }
    resetCounter() {
        throw new Error('RootNode.resetCounter')
    }
}
