import WorkspaceLocal from './Workspace';
import Editor from '../../widgets/editor/Editor';
import Workspace from '../../widgets/editor/workspace/Workspace';
import * as ng from 'angular';
import PromiseManager from './PromiseManager';

const systemImports: string[] = ['/jspm_packages/system.js', '/jspm.config.js'];
const workerImports: string[] = systemImports.concat(['/js/ace-workers.js']);
const typescriptServices = ['/js/typescriptServices.js'];

enum WorkspaceState {
    CONSTRUCTED,
    INIT_PENDING,
    INIT_FAILED,
    OPERATIONAL,
    TERM_PENDING,
    TERM_FAILED,
    TERMINATED
}

/**
 * A thin wrapper around the ACE workspace in order to manage state and asynchronicity.
 */
export default class WorkspaceService implements WorkspaceLocal {
    public trace: boolean = false;
    private state: WorkspaceState;
    private workspace: Workspace;

    /**
     * 
     */
    private promises: PromiseManager;

    public static $inject: string[] = ['$q'];

    /**
     * @class WorkspaceService
     * @constructor
     */
    constructor(private $q: ng.IQService) {
        this.workspace = new Workspace('/js/worker.js', workerImports.concat(typescriptServices));
        this.workspace.trace = false;
        this.state = WorkspaceState.CONSTRUCTED;
        this.promises = new PromiseManager($q);
    }

    /**
     * @method initialize
     * @return {void}
     */
    initialize(): void {
        if (this.promises.length) {
            console.warn(`outstanding promises prior to reset: ${this.promises.length}, ${JSON.stringify(this.promises.getOutstandingPurposes(), null, 2)}`);
        }
        this.promises.reset();
        const deferred = this.promises.defer('init');
        this.state = WorkspaceState.INIT_PENDING;
        this.workspace.init((err: any) => {
            if (err) {
                console.warn(`init() => ${err}`);
                this.state = WorkspaceState.INIT_FAILED;
                this.promises.reject(deferred, err);
            }
            else {
                this.state = WorkspaceState.OPERATIONAL;
                this.promises.resolve(deferred);
            }
        });
    }

    synchronize(): ng.IPromise<any> {
        const deferred: ng.IDeferred<any> = this.$q.defer<any>();
        this.promises.synchronize()
            .then(() => {
                deferred.resolve();
            })
            .catch((err) => {
                console.warn(`synchronize failed ${err}.`);
                deferred.reject();
            });
        return deferred.promise;
    }

    /**
     * @method terminate
     * @return {void}
     */
    terminate(): void {
        this.detachEditors();
        this.removeScripts();
        this.synchronize().then(() => {
            this.state = WorkspaceState.TERM_PENDING;
            this.workspace.terminate((err: any) => {
                if (!err) {
                    this.state = WorkspaceState.TERMINATED;
                }
                else {
                    this.state = WorkspaceState.TERM_FAILED;
                    console.warn(`terminate() => ${err}`);
                }
            });
        });
    }

    /**
     * @method setDefaultLibrary
     * @param url {string}
     * @return {void}
     */
    setDefaultLibrary(url: string): void {
        switch (this.state) {
            case WorkspaceState.OPERATIONAL: {
                const deferred = this.promises.defer('setDefaultLibrary');
                this.workspace.setDefaultLibrary(url, (err: any) => {
                    if (err) {
                        console.warn(`setDefaultLibrary(${url}) => ${err}`);
                        this.promises.reject(deferred, err);
                    }
                    else {
                        this.promises.resolve(deferred, true);
                    }
                });
                break;
            }
            case WorkspaceState.INIT_PENDING: {
                this.synchronize()
                    .then(() => {
                        this.state = WorkspaceState.OPERATIONAL;
                        // Using recursion allows me to avoid creating a stack of commands.
                        // Of course, the approaches are equivalent.
                        this.setDefaultLibrary(url);
                    })
                    .catch((reason: any) => {
                        this.state = WorkspaceState.INIT_FAILED;
                    });
                break;
            }
            case WorkspaceState.CONSTRUCTED: {
                throw new Error("TODO: setDefaultLibrary while CONSTRUCTED");
            }
            case WorkspaceState.INIT_FAILED: {
                throw new Error("TODO: setDefaultLibrary while INIT_FAILED");
            }
            default: {
                throw new Error("TODO: setDefaultLibrary before OPERATIONAL");
            }
        }
    }

    setModuleKind(moduleKind: string): void {
        switch (this.state) {
            case WorkspaceState.OPERATIONAL: {
                const deferred = this.promises.defer('setModuleKind');
                this.workspace.setModuleKind(moduleKind, (err: any) => {
                    if (err) {
                        console.warn(`setModuleKind('${moduleKind}') => ${err}`);
                        this.promises.reject(deferred, err);
                    }
                    else {
                        this.promises.resolve(deferred, moduleKind);
                    }
                });
                break;
            }
            case WorkspaceState.INIT_PENDING: {
                this.synchronize()
                    .then(() => {
                        // TODO: DRY
                        this.state = WorkspaceState.OPERATIONAL;
                        // Using recursion allows me to avoid creating a stack of commands.
                        // Of course, the approaches are equivalent.
                        this.setModuleKind(moduleKind);
                    })
                    .catch((reason: any) => {
                        this.state = WorkspaceState.INIT_FAILED;
                    });
                break;
            }
            default: {
                throw new Error("TODO: setModuleKind before OPERATIONAL");
            }
        }
    }

    setScriptTarget(scriptTarget: string): void {
        const deferred = this.promises.defer('setScriptTarget');
        this.workspace.setScriptTarget(scriptTarget, (err: any) => {
            if (err) {
                console.warn(`setScriptTarget('${scriptTarget}') => ${err}`);
                this.promises.reject(deferred, err);
            }
            else {
                this.promises.resolve(deferred, scriptTarget);
            }
        });
    }

    setTrace(trace: boolean): void {
        const deferred = this.promises.defer('setTrace');
        this.workspace.setTrace(trace, (err: any) => {
            if (err) {
                console.warn(`setTrace('${trace}') => ${err}`);
                this.promises.reject(deferred, err);
            }
            else {
                this.promises.resolve(deferred, trace);
            }
        });
    }

    attachEditor(fileName: string, editor: Editor): void {
        const deferred = this.promises.defer(`attachEditor('${fileName}')`);
        this.workspace.attachEditor(fileName, editor, (err: any) => {
            if (!err) {
                this.promises.resolve(deferred, fileName);
            }
            else {
                console.warn(`attachEditor('${fileName}') => ${err}`);
                this.promises.reject(deferred, err);
            }
        });
    }

    detachEditor(fileName: string, editor: Editor): void {
        const deferred = this.promises.defer(`detachEditor('${fileName}')`);
        this.workspace.detachEditor(fileName, editor, (err: any) => {
            if (!err) {
                this.promises.resolve(deferred, fileName);
            }
            else {
                console.warn(`detachEditor('${fileName}') => ${err}`);
                this.promises.reject(deferred, err);
            }
        });
    }

    ensureScript(fileName: string, content: string): void {
        const deferred = this.promises.defer(`ensureScript('${fileName}')`);
        this.workspace.ensureScript(fileName, content, (err: any) => {
            if (err) {
                this.promises.reject(deferred, err);
            }
            else {
                this.promises.resolve(deferred);
            }
        });
    }

    removeScript(fileName: string): void {
        const deferred = this.promises.defer(`removeScript('${fileName}')`);
        this.workspace.removeScript(fileName, (err: any) => {
            if (err) {
                this.promises.reject(deferred, err);
            }
            else {
                this.promises.resolve(deferred);
            }
        });
    }

    detachEditors(): void {
        // Do nothing.
    }

    removeScripts(): void {
        // Do nothing.
    }

    getEditorFileNames(): string[] {
        return this.workspace.getEditorFileNames();
    }

    getEditor(fileName: string): Editor {
        return this.workspace.getEditor(fileName);
    }

    /**
     * 
     */
    semanticDiagnostics(): void {
        this.workspace.semanticDiagnostics();
    }

    /**
     *
     */
    outputFiles(): void {
        this.workspace.outputFiles();
    }
}
