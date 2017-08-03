export interface WorkerCallback {

    on(name: string, callback);
    callback(data, callbackId: number);
    emit(name: string, data?);
}
