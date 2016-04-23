import Workspace from './Workspace';
import ace from 'ace.js';
import * as ng from 'angular';

const systemImports: string[] = ['/jspm_packages/system.js', '/jspm.config.js']
const workerImports: string[] = systemImports.concat(['/js/ace-workers.js'])
const typescriptServices = ['/js/typescriptServices.js']

enum WorkspaceState {
    CONSTRUCTED,
    INIT_PENDING,
    INIT_FAILED,
    OPERATIONAL
}

interface WorkspaceCommand {

}

class SetDefaultLibraryCommand implements WorkspaceCommand {
    constructor(workspace: ace.Workspace, url: string) {
        // Do nothing, except maybe check arguments.
    }
}

/**
 * A thin wrapper around the ACE workspace in order to manage state and asynchronicity.
 */
export default class WorkspaceService implements Workspace {
    private state: WorkspaceState;
    private workspace: ace.Workspace = ace.createWorkspace();
    /**
     * 
     */
    private promises: ng.IPromise<any>[] = []
    private scriptLoaded: { [fileName: string]: boolean } = {};
    public static $inject: string[] = ['$q'];
    /**
     * @class WorkspaceService
     * @constructor
     */
    constructor(private $q: ng.IQService) {
        // In an ideal world, the constructor only serves to inject dependencies!
        this.state = WorkspaceState.CONSTRUCTED
    }

    /**
     * @method init
     * @return {void}
     */
    init(): void {
        const deferred: ng.IDeferred<any> = this.$q.defer<any>();
        this.state = WorkspaceState.INIT_PENDING
        this.workspace.init('/js/worker.js', workerImports.concat(typescriptServices), (err: any) => {
            if (err) {
                console.warn(`init() => ${err}`)
                this.state = WorkspaceState.INIT_FAILED
                deferred.reject(err)
            }
            else {
                this.state = WorkspaceState.OPERATIONAL
                deferred.resolve(true)
            }
        })
        this.promises.push(deferred.promise)
    }

    synchronize(): ng.IPromise<any> {
        return this.$q.all(this.promises)
    }

    /**
     * @method terminate
     * @return {void}
     */
    terminate(): void {
        this.workspace.terminate()
    }

    /**
     * @method setDefaultLibrary
     * @param url {string}
     * @return {void}
     */
    setDefaultLibrary(url: string): void {
        switch (this.state) {
            case WorkspaceState.OPERATIONAL: {
                const deferred: ng.IDeferred<boolean> = this.$q.defer<boolean>();
                this.workspace.setDefaultLibrary(url, function(err: any) {
                    if (err) {
                        console.warn(`setDefaultLibrary(${url}) => ${err}`)
                        deferred.reject(err)
                    }
                    else {
                        deferred.resolve(true)
                    }
                })
                this.promises.push(deferred.promise)
                break
            }
            case WorkspaceState.INIT_PENDING: {
                this.synchronize()
                    .then(() => {
                        this.promises = []
                        this.state = WorkspaceState.OPERATIONAL
                        // Using recursion allows me to avoid creating a stack of commands.
                        // Of course, the approaches are equivalent.
                        this.setDefaultLibrary(url)
                    })
                    .catch((reason: any) => {
                        this.state = WorkspaceState.INIT_FAILED
                    })
                break
            }
            case WorkspaceState.CONSTRUCTED: {
                throw new Error("TODO: setDefaultLibrary while CONSTRUCTED")
            }
            case WorkspaceState.INIT_FAILED: {
                throw new Error("TODO: setDefaultLibrary while INIT_FAILED")
            }
            default: {
                throw new Error("TODO: setDefaultLibrary before OPERATIONAL")
            }
        }
    }

    setModuleKind(moduleKind: string): void {
        switch (this.state) {
            case WorkspaceState.OPERATIONAL: {
                const deferred: ng.IDeferred<string> = this.$q.defer<string>();
                this.workspace.setModuleKind(moduleKind, (err: any) => {
                    if (err) {
                        console.warn(`setModuleKind('${moduleKind}') => ${err}`)
                        deferred.reject(err)
                    }
                    else {
                        deferred.resolve(moduleKind)
                    }
                })
                this.promises.push(deferred.promise)
                break
            }
            case WorkspaceState.INIT_PENDING: {
                this.synchronize()
                    .then(() => {
                        this.promises = []
                        // TODO: DRY
                        this.state = WorkspaceState.OPERATIONAL
                        // Using recursion allows me to avoid creating a stack of commands.
                        // Of course, the approaches are equivalent.
                        this.setModuleKind(moduleKind)
                    })
                    .catch((reason: any) => {
                        this.state = WorkspaceState.INIT_FAILED
                    })
                break
            }
            default: {
                throw new Error("TODO: setModuleKind before OPERATIONAL")
            }
        }
    }

    setScriptTarget(scriptTarget: string): void {
        const deferred: ng.IDeferred<string> = this.$q.defer<string>();
        this.workspace.setScriptTarget(scriptTarget, (err: any) => {
            if (err) {
                console.warn(`setScriptTarget('${scriptTarget}') => ${err}`)
                deferred.reject(err)
            }
            else {
                deferred.resolve(scriptTarget)
            }
        })
        this.promises.push(deferred.promise)
    }

    attachEditor(fileName: string, editor: ace.Editor): void {
        this.workspace.attachEditor(fileName, editor)
    }

    detachEditor(fileName: string, editor: ace.Editor): void {
        this.workspace.detachEditor(fileName, editor)
    }

    ensureScript(fileName: string, content: string): void {
        this.workspace.ensureScript(fileName, content)
        // TODO: This should wait for async result.
        this.scriptLoaded[fileName] = true
    }

    removeScript(fileName): void {
        this.workspace.removeScript(fileName)
        delete this.scriptLoaded[fileName]
    }

    removeScripts(): void {
        const fileNames = Object.keys(this.scriptLoaded)
        const iLen = fileNames.length
        for (let i = 0; i < iLen; i++) {
            const fileName = fileNames[i]
            this.removeScript(fileName)
        }
    }
}
