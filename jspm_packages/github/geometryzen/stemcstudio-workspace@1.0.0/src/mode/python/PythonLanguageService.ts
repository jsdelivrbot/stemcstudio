import { SourceMap } from 'typhon-typescript';

export class PythonLanguageService {
    private sourceMaps: { [fileName: string]: SourceMap } = {};
    constructor(host: ts.LanguageServiceHost) {
        // Do nothing yet.
    }
    getSourceMap(fileName: string): SourceMap {
        return this.sourceMaps[fileName];
    }
    setSourceMap(fileName: string, sourceMap: SourceMap): void {
        this.sourceMaps[fileName] = sourceMap;
    }
}
