import Annotation from '../Annotation';
import AutoCompleteCommand from '../autocomplete/AutoCompleteCommand';
import Command from '../commands/Command';
import CompletionEntry from './CompletionEntry';
// import CompletionManager from '../autocomplete/CompletionManager';
import Delta from '../Delta';
import Diagnostic from './Diagnostic';
import Document from '../Document';
import getPosition from './getPosition';
import Marker from '../Marker';
import Editor from '../Editor';
import LanguageServiceProxy from './LanguageServiceProxy';
import Position from '../Position';
import OutputFile from './OutputFile';
import QuickInfo from './QuickInfo';
import QuickInfoTooltip from './QuickInfoTooltip';
import Range from '../Range';
import WorkspaceCompleter from './WorkspaceCompleter';
import {get} from '../lib/net';
import getModuleKindCallback from './getModuleKindCallback';
import getScriptTargetCallback from './getScriptTargetCallback';
import setModuleKindCallback from './setModuleKindCallback';
import setScriptTargetCallback from './setScriptTargetCallback';

function diagnosticToAnnotation(doc: Document, diagnostic: Diagnostic): Annotation {
  const minChar = diagnostic.start;
  // var limChar = minChar + diagnostic.length;
  const pos: Position = getPosition(doc, minChar);
  return { row: pos.row, column: pos.column, text: diagnostic.message, type: 'error' };
}

/**
 * @class Workspace
 */
export default class Workspace {

  /**
   * TODO: Data structure to handle Editor information?
   */
  private editors: { [fileName: string]: Editor } = {};
  private quickin: { [fileName: string]: QuickInfoTooltip } = {};
  private mousedn: { [fileName: string]: (event: any) => any } = {};
  private command: { [fileName: string]: Command } = {};
  private annotationHandlers: { [fileName: string]: (event: any) => any } = {};
  private changeHandlers: { [fileName: string]: (event: any, source: Editor) => any } = {};

  private refMarkers: number[] = [];

  /**
   * The diagnostics allow us to place markers in the marker layer.
   * This array keeps track of the marker identifiers so that we can
   * remove the existing ones when the time comes to replace them.
   *
   * @property errorMarkerIds
   * @type number[]
   */
  private errorMarkerIds: number[] = [];

  /**
   * @property workerProxy
   * @type LanguageServiceProxy
   * @private
   */
  private workerProxy: LanguageServiceProxy;

  /**
   * @class Workspace
   * @constructor
   */
  constructor() {
    // Do nothing.
  }

  /**
   * @method init
   * @param workerUrl {string}
   * @param scriptImports {string[]}
   * @return {void}
   */
  public init(workerUrl: string, scriptImports: string[]): void {
    // TODO: Make it possible to recycle the workspace.
    this.workerProxy = new LanguageServiceProxy(workerUrl);
    this.workerProxy.init(scriptImports);
  }

  /**
   * Detaches any attached editors and terminated the worker thread.
   *
   * @method terminate
   * @return {void}
   */
  public terminate(): void {
    this.detachEditors();
    this.workerProxy.terminate();
    this.workerProxy = void 0;
  }

  /**
   * @method setDefaultLibrary
   * @param url {string}
   * @return {void}
   */
  public setDefaultLibrary(url: string): void {
    get(url, (sourceCode: string) => {
      if (this.workerProxy) {
        this.workerProxy.setDefaultLibContent(sourceCode);
      }
    });
  }

  /**
   * @property moduleKind
   * @type Promise<string>
   */
  public get moduleKind(): Promise<string> {
    return new Promise<string>((resolve: (value: string) => any, reject: (err: any) => any) => {
      this.getModuleKind(function(err?: any, moduleKind?: string) {
        if (err) {
          reject(err);
        }
        else {
          resolve(moduleKind);
        }
      });
    });
  }

  public set moduleKind(promise: Promise<string>) {
    promise.then((moduleKind: string) => {
      this.setModuleKind(moduleKind, (err: any) => {
        if (err) {
          // What to do? Properties setters don't have a return type.
        }
      });
    });
  }

  /**
   * @method getModuleKind
   * @param callback {getModuleKindCallback}
   * @return {void}
   */
  public getModuleKind(callback: getModuleKindCallback): void {
    if (this.workerProxy) {
      this.workerProxy.getModuleKind(callback);
    }
    else {
      callback(new Error("moduleKind is not available."));
    }
  }

  /**
   * @method setModuleKind
   * @param moduleKind {string}
   * @param callback {setModuleKindCallback}
   * @return {void}
   */
  public setModuleKind(moduleKind: string, callback: setModuleKindCallback): void {
    if (this.workerProxy) {
      this.workerProxy.setModuleKind(moduleKind, callback);
    }
    else {
      callback(new Error("moduleKind is not available."));
    }
  }

  /**
   * @method getScriptTarget
   * @param callback {getScriptTargetCallback}
   * @return {void}
   */
  public getScriptTarget(callback: getScriptTargetCallback): void {
    if (this.workerProxy) {
      this.workerProxy.getScriptTarget(callback);
    }
    else {
      callback(new Error("scriptTarget is not available."));
    }
  }

  /**
   * @method setScriptTarget
   * @param scriptTarget {string}
   * @param callback {setScriptTarget}
   * @return {void}
   */
  public setScriptTarget(scriptTarget: string, callback: setScriptTargetCallback): void {
    if (this.workerProxy) {
      this.workerProxy.setScriptTarget(scriptTarget, callback);
    }
    else {
      callback(new Error("scriptTarget is not available."));
    }
  }

  /**
   * @method attachEditor
   * @param fileName {string}
   * @param editor {Editor}
   * @return {void}
   */
  public attachEditor(fileName: string, editor: Editor): void {
    this.editors[fileName] = editor;

    this.workerProxy.ensureScript(fileName, editor.getValue());

    var changeHandler = (delta: Delta, source: Editor) => {
      this.workerProxy.applyDelta(fileName, delta);
      this.updateMarkerModels(fileName, delta);
    };
    editor.on('change', changeHandler);
    this.changeHandlers[fileName] = changeHandler;

    // When the LanguageMode has completed syntax analysis, it emits annotations.
    // This is our cue to begin semantic analysis and make use of transpiled files.
    var annotationsHandler = (event: { data: Annotation[]; type: string }) => {
      this.semanticDiagnostics();
      this.outputFiles();
    };
    editor.session.on('annotations', annotationsHandler);
    this.annotationHandlers[fileName] = annotationsHandler;

    // Enable auto completion using the Workspace.
    // The command seems to be required on order to enable method completion.
    // However, it has the side-effect of enabling global completions (Ctrl-Space, etc).
    // TODO: We'd like to have method completions without global completions?
    // TODO: We should be able to filter global completions.
    editor.commands.addCommand(new AutoCompleteCommand());
    // editor.completionManager = new CompletionManager(editor);
    // editor.completionManager.autoInsert = true;
    // editor.completionManager.autoSelect = true;
    editor.completers.push(new WorkspaceCompleter(fileName, this));

    // Finally, enable QuickInfo.
    const quickInfo = new QuickInfoTooltip(fileName, editor, this);
    quickInfo.init();
    this.quickin[fileName] = quickInfo;
  }

  /**
   * @method detachEditor
   * @param fileName {string}
   * @param editor {Editor}
   * @return {void}
   */
  public detachEditor(fileName: string, editor: Editor): void {
    if (this.editors[fileName]) {
      // CleanUp QuickInfo
      const quickInfo = this.quickin[fileName];
      quickInfo.terminate();
      delete this.quickin[fileName];

      // Cleanup auto completion.
      const mousedownHandler = this.mousedn[fileName];
      if (mousedownHandler) {
        editor.off("mousedown", mousedownHandler);
        delete this.mousedn[fileName];
      }
      else {
        console.log(`There is no mousedownHandler for ${fileName}.`);
      }

      const completeCommand: Command = this.command[fileName];
      if (completeCommand) {
        editor.commands.removeCommand(completeCommand.name);
        delete this.command[fileName];
      }
      else {
        console.log(`There is no completeCommand for ${fileName}.`);
      }

      // Cleaup Annotation Handlers.
      var annotationHandler = this.annotationHandlers[fileName];
      editor.session.off('annotations', annotationHandler);
      delete this.annotationHandlers[fileName];

      // Cleanup Change Handlers.
      var changeHandler = this.changeHandlers[fileName];
      editor.off('change', changeHandler);
      delete this.changeHandlers[fileName];

      this.workerProxy.removeScript(fileName);

      delete this.editors[fileName];
    }
  }

  /**
   * @method detachEditors
   * @return {void}
   */
  public detachEditors(): void {
    var fileNames = Object.keys(this.editors);
    for (var i = 0, iLength = fileNames.length; i < iLength; i++) {
      let fileName = fileNames[i];
      let editor = this.editors[fileName];
      this.detachEditor(fileName, editor);
    }
  }

  /**
   * @method ensureScript
   * @param fileName {string}
   * @param content {string}
   * @return {void}
   */
  public ensureScript(fileName: string, content: string): void {
    return this.workerProxy.ensureScript(fileName, content);
  }

  private semanticDiagnostics() {
    var fileNames = Object.keys(this.editors);
    for (var i = 0; i < fileNames.length; i++) {
      var fileName = fileNames[i];
      var editor = this.editors[fileName];
      this.semanticDiagnosticsForEditor(fileName, editor);
    }
  }

  private updateEditor(errors: Diagnostic[], editor: Editor): void {
    var session = editor.getSession();
    var doc = session.getDocument();

    var annotations = errors.map(function(error) {
      return diagnosticToAnnotation(editor.getSession().getDocument(), error);
    });
    session.setAnnotations(annotations);

    this.errorMarkerIds.forEach(function(markerId) { session.removeMarker(markerId); });

    errors.forEach((error: { message: string; start: number; length: number }) => {
      var minChar = error.start;
      var limChar = minChar + error.length;
      var start = getPosition(doc, minChar);
      var end = getPosition(doc, limChar);
      var range = new Range(start.row, start.column, end.row, end.column);
      // Add a new marker to the given Range. The last argument (inFront) causes a
      // front marker to be defined and the 'changeFrontMarker' event fires.
      // The class parameter is a css stylesheet class so you must have it in your CSS.
      this.errorMarkerIds.push(session.addMarker(range, "typescript-error", "text", null, true));
    });
  }

  private semanticDiagnosticsForEditor(fileName: string, editor: Editor): void {

    this.workerProxy.getSyntaxErrors(fileName, (err: any, syntaxErrors: Diagnostic[]) => {
      if (err) {
        console.warn(`getSyntaxErrors(${fileName}) => ${err}`);
      }
      else {
        this.updateEditor(syntaxErrors, editor);
        if (syntaxErrors.length === 0) {
          this.workerProxy.getSemanticErrors(fileName, (err: any, semanticErrors: Diagnostic[]) => {
            if (err) {
              console.warn(`getSemanticErrors(${fileName}) => ${err}`);
            }
            else {
              this.updateEditor(semanticErrors, editor);
            }
          });
        }
      }
    });
  }

  private outputFiles() {
    var fileNames = Object.keys(this.editors);
    for (var i = 0; i < fileNames.length; i++) {
      var fileName = fileNames[i];
      var editor = this.editors[fileName];
      this.outputFilesForEditor(fileName, editor);
    }
  }

  private outputFilesForEditor(fileName: string, editor: Editor): void {
    var session = editor.getSession();
    this.workerProxy.getOutputFiles(fileName)
      .then(function(outputFiles: OutputFile[]) {
        session._emit("outputFiles", { data: outputFiles });
      })
      .catch(function(err: any) {
        console.warn(`getOutputFiles(${fileName}) => ${err}`);
      });
  }

  /**
   * @method getCompletionsAtPosition
   * @param fileName {string}
   * @param position {number}
   * @param prefix {string}
   * @return {Promise} CompletionEntry[]
   */
  getCompletionsAtPosition(fileName: string, position: number, prefix: string): Promise<CompletionEntry[]> {
    return this.workerProxy.getCompletionsAtPosition(fileName, position, prefix);
  }

  /**
   * @method getQuickInfoAtPosition
   * @param fileName {string}
   * @param position {number}
   * @return {Promise} QuickInfo
   */
  getQuickInfoAtPosition(fileName: string, position: number): Promise<QuickInfo> {
    return this.workerProxy.getQuickInfoAtPosition(fileName, position);
  }

  /**
   * @method removeScript
   * @param fileName {string}
   * @return {void}
   */
  public removeScript(fileName: string): void {
    return this.workerProxy.removeScript(fileName);
  }

  private updateMarkerModels(fileName: string, delta: Delta): void {
    var editor = this.editors[fileName];
    var action = delta.action;
    var markers: { [id: number]: Marker } = editor.getSession().getMarkers(true);
    var line_count = 0;
    // var isNewLine = editor.getSession().getDocument().isNewLine;
    if (action === "insert") {
      line_count = delta.lines.length;
    }
    else if (action === "remove") {
      line_count = -delta.lines.length;
    }
    else {
      console.warn(`updateMarkerModels(${fileName}, ${JSON.stringify(delta)})`);
    }
    if (line_count !== 0) {
      const markerUpdate = function(markerId: number) {
        var marker: Marker = markers[markerId];
        var row = delta.start.row;
        if (line_count > 0) {
          row = +1;
        }
        if (marker && marker.range.start.row > row) {
          marker.range.start.row += line_count;
          marker.range.end.row += line_count;
        }
      };
      this.errorMarkerIds.forEach(markerUpdate);
      this.refMarkers.forEach(markerUpdate);
      editor.updateFrontMarkers();
    }
  }
}
