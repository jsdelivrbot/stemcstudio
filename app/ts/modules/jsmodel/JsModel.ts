import { Injectable } from '@angular/core';


/**
 * Keeps track of those aspects of the workspace relating to transpilation.
 * This allows us to defer transpiling TypeScript sources to JavaScript by tracking
 * which sources have been changed. 
 * Separated from the workspace model because these aspects have a temporary lifetime
 * which is the duration of an editing session.
 */
@Injectable()
export class JsModel {
    /**
     * The file information is keyed by the source file name.
     */
    private files: { [fileName: string]: JsFile } = {};
    /**
     * 
     */
    constructor() {
        // Do nothing.
        // console.lg("JsModel.constructor()");
    }

    watchFiles(fileNames: string[]): void {
        for (const fileName of fileNames) {
            this.ensureFile(fileName);
        }
        const existingNames = Object.keys(this.files);
        for (const fileName of existingNames) {
            if (fileNames.indexOf(fileName) < 0) {
                delete this.files[fileName];
            }
        }
    }

    /**
     * 
     */
    dispose(): void {
        this.files = {};
    }

    /**
     * Notifies this model that the source file with the specified path has been transpiled.
     * The version is the document version when the transpile was requested.
     */
    outputChanged(sourceFileName: string, outputFileName: string, outputText: string, version: number): void {
        const file = this.ensureFile(sourceFileName);
        file.outputVersion = version;
        // The 
        if (typeof file.sourceVersion === 'number') {
            file.sourceVersion = Math.max(file.sourceVersion, file.outputVersion);
        }
        else {
            file.sourceVersion = file.outputVersion;
        }
    }

    /**
     * Notifies this model that the contents of the file with the specified path has been changed.
     * The version is the the document version after the change has been applied.
     */
    sourceChanged(sourceFileName: string, version: number): void {
        const file = this.ensureFile(sourceFileName);
        file.sourceVersion = version;
    }

    /**
     * Returns a list of files that have either not yet been transpiled or the source is more recent than the output.
     */
    dirtyFiles(): string[] {
        const candidates = Object.keys(this.files);
        return candidates.filter((candidate) => {
            const file = this.files[candidate];
            if (typeof file.sourceVersion === 'number' && typeof file.outputVersion === 'number') {
                if (file.outputVersion < file.sourceVersion) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        });
    }

    /**
     * Helper method to guarantee that there is a file value at the specified path.
     */
    private ensureFile(fileName: string): JsFile {
        const existing = this.files[fileName];
        if (existing) {
            return existing;
        }
        else {
            const file = new JsFile();
            this.files[fileName] = file;
            return file;
        }
    }
    toString(): string {
        return JSON.stringify(this.files, null, 2);
    }
}

class JsFile {
    /**
     * The version of the document after the change has been applied.
     */
    sourceVersion?: number;
    /**
     * The version of the document used for the transpile.
     */
    outputVersion?: number;
    /**
     * 
     */
    constructor() {
        // Do nothing yet.
    }
}
