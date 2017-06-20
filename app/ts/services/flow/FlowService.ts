import { FlowContainer } from './FlowContainer';

export interface FlowService {
    createFlow<T>(name: string): FlowContainer<T>;
}
