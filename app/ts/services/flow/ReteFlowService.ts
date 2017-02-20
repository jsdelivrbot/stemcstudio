import FlowService from './FlowService';
import FlowContainer from './FlowContainer';
import FlowSessionService from './FlowSessionService';

export default class ReteFlowService implements FlowService {
    public static $inject: string[] = ['flowSessionService'];
    constructor(private flowSessionService: FlowSessionService) {
        // TODO
    }
    createFlow<T>(/* name: string */): FlowContainer<T> {
        return new FlowContainer<T>(this.flowSessionService);
    }
}
