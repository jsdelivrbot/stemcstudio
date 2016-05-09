import FlowContainer from './FlowContainer';

interface FlowService {
    createFlow<T>(name: string): FlowContainer<T>;
}

export default FlowService;
