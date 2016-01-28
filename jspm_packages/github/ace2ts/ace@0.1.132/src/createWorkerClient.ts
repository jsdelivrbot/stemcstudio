import WorkerClient from './worker/WorkerClient';

export default function createWorkerClient(workerUrl: string): WorkerClient {
    return new WorkerClient(workerUrl)
}
