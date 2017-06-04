import { MappingTree } from 'typhon-lang';

export class PythonLanguageService {
    private sourceMaps: { [fileName: string]: MappingTree } = {};
    constructor(host: ts.LanguageServiceHost) {
        // Do nothing yet.
    }
    getSourceMap(fileName: string): MappingTree {
        return this.sourceMaps[fileName];
    }
    setSourceMap(fileName: string, sourceMap: MappingTree): void {
        this.sourceMaps[fileName] = sourceMap;
    }
}
