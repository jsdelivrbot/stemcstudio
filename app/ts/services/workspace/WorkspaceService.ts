import WorkspaceLocal from './Workspace';
import Editor from '../../widgets/editor/Editor';
import Workspace from '../../widgets/editor/workspace/Workspace';
import * as ng from 'angular';
import PromiseManager from './PromiseManager';

const systemImports: string[] = ['/jspm_packages/system.js', '/jspm.config.js']
const workerImports: string[] = systemImports.concat(['/js/ace-workers.js'])
const typescriptServices = ['/js/typescriptServices.js']

enum WorkspaceState {
    CONSTRUCTED,
    INIT_PENDING,
    INIT_FAILED,
    OPERATIONAL,
    TERM_PENDING,
    TERM_FAILED,
    TERMINATED
}

function decodeWorkspaceState(state: WorkspaceState): string {
    switch (state) {
        case WorkspaceState.CONSTRUCTED: return "CONSTRUCTED";
        case WorkspaceState.INIT_PENDING: return "INIT_PENDING";
        case WorkspaceState.INIT_FAILED: return "INIT_FAILED";
        case WorkspaceState.OPERATIONAL: return "OPERATIONAL";
        case WorkspaceState.TERM_PENDING: return "TERM_PENDING";
        case WorkspaceState.TERM_FAILED: return "TERM_FAILED";
        case WorkspaceState.TERMINATED: return "TERMINATED";
        default: return `Unknown state ${state}`;
    }
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
    // private promises: ng.IPromise<any>[] = [];
    private promises: PromiseManager;

    private editorCapturing: { [fileName: string]: boolean } = {};
    private editorLoaded: { [fileName: string]: Editor } = {};
    private editorReleasing: { [fileName: string]: boolean } = {};

    /**
     * 
     */
    private scriptCapturing: { [fileName: string]: boolean } = {};

    /**
     * 
     */
    private scriptWorking: { [fileName: string]: boolean } = {};

    /**
     * 
     */
    private scriptReleasing: { [fileName: string]: boolean } = {};

    public static $inject: string[] = ['$q'];
    /**
     * @class WorkspaceService
     * @constructor
     */
    constructor(private $q: ng.IQService) {
        this.workspace = new Workspace('/js/worker.js', workerImports.concat(typescriptServices));
        this.workspace.trace = false;
        this.state = WorkspaceState.CONSTRUCTED
        this.promises = new PromiseManager($q);
    }

    /**
     * Debugging function that dumps the state of this service.
     */
    private dump(where: string): void {
        /**
         * 
         */
        function showMe(title: string, map: { [fileName: string]: any }) {
            const fileNames = Object.keys(map)
            if (fileNames.length > 0) {
                console.log(title)
                console.log(JSON.stringify(fileNames, null, 2))
            }
        }

        if (!this.trace) {
            return;
        }
        console.log('===============================================')
        console.log(decodeWorkspaceState(this.state))
        console.log(`WorkspaceService.${where}`)
        if (this.promises.length) {
            console.log(`promises: ${this.promises.length}, ${JSON.stringify(this.promises.getOutstandingPurposes(), null, 2)}`)
        }
        console.log('===============================================')
        showMe("Capturing EDITORS", this.editorCapturing)
        showMe("Loaded    EDITORS", this.editorLoaded)
        showMe("Releasing EDITORS", this.editorReleasing)
        showMe("Capturing FILES", this.scriptCapturing)
        showMe("Loaded    FILES", this.scriptWorking)
        showMe("Releasing FILES", this.scriptReleasing)
    }

    /**
     * @method initialize
     * @return {void}
     */
    initialize(): void {
        this.dump(`initialize() (RAW)`)
        if (this.promises.length) {
            console.warn(`outstanding promises prior to reset: ${this.promises.length}, ${JSON.stringify(this.promises.getOutstandingPurposes(), null, 2)}`)
        }
        this.promises.reset()
        this.dump(`initialize() (RESET)`)
        const deferred = this.promises.defer('init')
        this.state = WorkspaceState.INIT_PENDING
        this.workspace.init((err: any) => {
            if (err) {
                console.warn(`init() => ${err}`)
                this.state = WorkspaceState.INIT_FAILED
                this.promises.reject(deferred, err)
            }
            else {
                this.dump(`init OK.`)
                this.state = WorkspaceState.OPERATIONAL
                this.promises.resolve(deferred)
            }
        })
    }

    synchronize(): ng.IPromise<any> {
        this.dump(`synchronize()`)
        const deferred: ng.IDeferred<any> = this.$q.defer<any>();
        this.promises.synchronize()
            .then(() => {
                this.dump(`synchronize OK.`)
                deferred.resolve()
            })
            .catch((err) => {
                console.warn(`synchronize failed ${err}.`)
                deferred.reject()
            })
        return deferred.promise
    }

    /**
     * @method terminate
     * @return {void}
     */
    terminate(): void {
        this.dump("terminate()")
        this.detachEditors()
        this.removeScripts()
        this.synchronize().then(() => {
            this.state = WorkspaceState.TERM_PENDING;
            this.workspace.terminate((err: any) => {
                if (!err) {
                    this.state = WorkspaceState.TERMINATED;
                    this.dump(`terminate OK.`)
                }
                else {
                    this.state = WorkspaceState.TERM_FAILED;
                    console.warn(`terminate() => ${err}`)
                    this.dump(`terminate failed ${err}.`)
                }
            })
        })
    }

    /**
     * @method setDefaultLibrary
     * @param url {string}
     * @return {void}
     */
    setDefaultLibrary(url: string): void {
        this.dump(`setDefaultLibrary(${url})`)
        switch (this.state) {
            case WorkspaceState.OPERATIONAL: {
                const deferred = this.promises.defer('setDefaultLibrary')
                this.workspace.setDefaultLibrary(url, (err: any) => {
                    if (err) {
                        console.warn(`setDefaultLibrary(${url}) => ${err}`)
                        this.promises.reject(deferred, err)
                    }
                    else {
                        this.promises.resolve(deferred, true)
                    }
                    this.dump(`setDefaultLibrary(${url}) completed.`)
                })
                break
            }
            case WorkspaceState.INIT_PENDING: {
                this.synchronize()
                    .then(() => {
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
        this.dump(`setModuleKind(${moduleKind})`)
        switch (this.state) {
            case WorkspaceState.OPERATIONAL: {
                const deferred = this.promises.defer('setModuleKind')
                this.workspace.setModuleKind(moduleKind, (err: any) => {
                    if (err) {
                        console.warn(`setModuleKind('${moduleKind}') => ${err}`)
                        this.promises.reject(deferred, err)
                    }
                    else {
                        this.promises.resolve(deferred, moduleKind)
                    }
                    this.dump(`setModuleKind('${moduleKind}') completed.`)
                })
                break
            }
            case WorkspaceState.INIT_PENDING: {
                this.synchronize()
                    .then(() => {
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
        this.dump(`setScriptTarget(${scriptTarget})`)
        const deferred = this.promises.defer('setScriptTarget')
        this.workspace.setScriptTarget(scriptTarget, (err: any) => {
            if (err) {
                console.warn(`setScriptTarget('${scriptTarget}') => ${err}`)
                this.promises.reject(deferred, err)
            }
            else {
                this.promises.resolve(deferred, scriptTarget)
            }
            this.dump(`setScriptTarget(${scriptTarget}) completed.`)
        })
    }

    setTrace(trace: boolean): void {
        this.dump(`setTrace(${trace})`)
        const deferred = this.promises.defer('setTrace')
        this.workspace.setTrace(trace, (err: any) => {
            if (err) {
                console.warn(`setTrace('${trace}') => ${err}`)
                this.promises.reject(deferred, err)
            }
            else {
                this.promises.resolve(deferred, trace)
            }
            this.dump(`setTrace(${trace}) completed.`)
        })
    }

    attachEditor(fileName: string, editor: Editor): void {
        this.dump(`attachEditor(${fileName})`)
        this.editorCapturing[fileName] = true;
        const deferred = this.promises.defer(`attachEditor('${fileName}')`)
        this.workspace.attachEditor(fileName, editor, (err: any) => {
            if (!err) {
                delete this.editorCapturing[fileName];
                this.editorLoaded[fileName] = editor
                this.promises.resolve(deferred, fileName)
            }
            else {
                console.warn(`attachEditor('${fileName}') => ${err}`)
                this.editorCapturing[fileName] = false;
                this.promises.reject(deferred, err)
            }
            this.dump(`attachEditor(${fileName}) callback.`)
        })
    }

    detachEditor(fileName: string, editor: Editor): void {
        this.dump(`detachEditor(${fileName})`)
        if (this.editorCapturing[fileName]) {
            console.warn(`${fileName} is already being captured, ignoring detachEditor(${fileName}).`)
            return;
        }
        if (this.editorLoaded[fileName] && !this.editorReleasing[fileName]) {
            this.editorReleasing[fileName] = true;
            const deferred = this.promises.defer(`detachEditor('${fileName}')`)
            this.workspace.detachEditor(fileName, editor, (err: any) => {
                if (!err) {
                    delete this.editorReleasing[fileName];
                    delete this.editorLoaded[fileName]
                    this.promises.resolve(deferred, fileName)
                }
                else {
                    console.warn(`detachEditor('${fileName}') => ${err}`)
                    this.editorReleasing[fileName] = err;
                    this.promises.reject(deferred, err)
                }
                this.dump(`detachEditor(${fileName}) callback.`)
            })
        }
    }

    ensureScript(fileName: string, content: string): void {
        this.dump(`ensureScript(${fileName})`)
        this.scriptCapturing[fileName] = true;
        const deferred = this.promises.defer(`ensureScript('${fileName}')`)
        this.workspace.ensureScript(fileName, content, (err: any) => {
            if (err) {
                this.scriptCapturing[fileName] = false;
                this.promises.reject(deferred, err);
            }
            else {
                delete this.scriptCapturing[fileName];
                this.scriptWorking[fileName] = true
                this.promises.resolve(deferred)
            }
            this.dump(`ensureScript(${fileName}) callback.`)
        })
    }

    removeScript(fileName: string): void {
        this.dump(`removeScript(${fileName})`)
        this.scriptReleasing[fileName] = true;
        const deferred = this.promises.defer(`removeScript('${fileName}')`)
        this.workspace.removeScript(fileName, (err: any) => {
            if (err) {
                this.scriptReleasing[fileName] = false;
                this.promises.reject(deferred, err);
            }
            else {
                delete this.scriptReleasing[fileName];
                delete this.scriptWorking[fileName]
                this.promises.resolve(deferred)
            }
            this.dump(`removeScript(${fileName}) callback.`)
        })
    }

    detachEditors(): void {
        this.dump(`detachEditors()`)
        const fileNames = Object.keys(this.editorLoaded)
        const iLen = fileNames.length
        for (let i = 0; i < iLen; i++) {
            const fileName = fileNames[i]
            const editor = this.editorLoaded[fileName]
            this.detachEditor(fileName, editor)
        }
    }

    /**
     * Remove all the scripts that are currently loaded.
     * TODO: Maybe need to account for in-flight requests.
     */
    removeScripts(): void {
        this.dump(`removeScripts()`)
        const fileNames = Object.keys(this.scriptWorking)
        const iLen = fileNames.length
        for (let i = 0; i < iLen; i++) {
            const fileName = fileNames[i]
            this.removeScript(fileName)
        }
    }

    /**
     *
     */
    outputFiles(): void {
        this.workspace.outputFiles()
    }
}
