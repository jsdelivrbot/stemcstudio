import Annotation from "../Annotation";
import JavaScriptMode from "./JavaScriptMode";
import TypeScriptHighlightRules from "./TypeScriptHighlightRules";
import CstyleBehaviour from "./behaviour/CstyleBehaviour";
import CStyleFoldMode from "./folding/CstyleFoldMode";
import MatchingBraceOutdent from "./MatchingBraceOutdent";
import WorkerClient from "../worker/WorkerClient";
import EditSession from "../EditSession";

/**
 * @class TypeScriptMode
 * @extends JavaScriptMode
 */
export default class TypeScriptMode extends JavaScriptMode {

  $id = "ace/mode/typescript";

  /**
   * @class TypeScriptMode
   * @constructor
   * @param workerUrl {string}
   * @param scriptImports {sring[]}
   */
  constructor(workerUrl: string, scriptImports: string[]) {
    super(workerUrl, scriptImports);
    this.HighlightRules = TypeScriptHighlightRules;

    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
  }

  createWorker(session: EditSession): WorkerClient {

    var workerUrl = this.workerUrl;
    var scriptImports = this.scriptImports;

    var worker = new WorkerClient(workerUrl);

    worker.on("initAfter", function(event) {
      worker.attachToDocument(session.getDocument());
    });

    worker.on("initFail", function(message) {
    });

    worker.on("terminate", function() {
      worker.detachFromDocument();
      session.clearAnnotations();
    });

    worker.on('annotations', function(event: { data: Annotation[] }) {
      var annotations: Annotation[] = event.data;
      if (annotations.length > 0) {
        // session.setAnnotations(annotations);
      }
      else {
        // session.clearAnnotations();
      }
      session._emit("annotations", { data: annotations });
    });

    worker.on("getFileNames", function(event) {
      session._emit("getFileNames", { data: event.data });
    });

    // FIXME: Must be able to inject the module name.
    worker.init(scriptImports, 'ace-workers.js', 'TypeScriptWorker');

    return worker;
  };
}
