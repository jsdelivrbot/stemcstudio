export interface IExplorer {
    openFile(path: string): void;
    closeFile(path: string): void;
    selectFile(path: string): void;
}
