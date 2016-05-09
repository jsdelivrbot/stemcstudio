import * as ng from 'angular';
import FlowService from './FlowService';
import FlowContainer from './FlowContainer';
import FlowSessionService from './FlowSessionService';

export default class ReteFlowService implements FlowService {
    public static $inject: string[] = ['$q', 'flowSessionService'];
    constructor(private $q: ng.IQService, private flowSessionService: FlowSessionService) {
        // TODO
    }
    createFlow<T>(name: string): FlowContainer<T> {
        return new FlowContainer<T>(this.flowSessionService)
    }
}
