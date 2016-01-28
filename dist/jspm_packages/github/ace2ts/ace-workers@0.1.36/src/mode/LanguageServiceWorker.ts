import Delta from '../Delta';
import WorkerCallback from "../WorkerCallback";
import DefaultLanguageServiceHost from './typescript/DefaultLanguageServiceHost';
/**
 * @class LanguageServiceWorker
 */
export default class LanguageServiceWorker {

    /**
     * @property host
     * @type DefaultLanguageServiceHost
     * @private
     */
    private host: DefaultLanguageServiceHost;

    /**
     * @property service
     * @type LanguageService
     * @private
     */
    private service: ts.LanguageService;

    /**
     * @class LanguageServiceWorker
     * @constructor
     * @param sender {WorkerCallback}
     */
    constructor(sender: WorkerCallback) {

        // TODO: Provide the WorkerCallback to the host?
        this.host = new DefaultLanguageServiceHost();
        this.service = ts.createLanguageService(this.host);

        sender.on('defaultLibContent', (message: { data: { content: string } }) => {
            this.host.ensureScript(this.host.getDefaultLibFileName({}), message.data.content);
        });

        sender.on('ensureScript', (message: { data: { fileName: string; content: string } }) => {
            this.ensureScript(message.data.fileName, message.data.content);
        });

        sender.on('applyDelta', (message: { data: { fileName: string; delta: Delta } }) => {
            this.host.applyDelta(message.data.fileName, message.data.delta);
        });

        sender.on('removeScript', (message: { data: { fileName: string; content: string } }) => {
            this.host.removeScript(message.data.fileName);
        });

        sender.on('getSyntaxErrors', (request: { data: { fileName: string; callbackId: number } }) => {
            var data = request.data;
            var fileName: string = data.fileName;
            var callbackId: number = data.callbackId;
            var diagnostics = this.service.getSyntacticDiagnostics(fileName);
            var errors = diagnostics.map(function(diagnostic: ts.Diagnostic) {
                return { message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"), start: diagnostic.start, length: diagnostic.length };
            });
            var response = { errors: errors, callbackId: callbackId };
            sender.emit("syntaxErrors", response);
        });

        sender.on('getSemanticErrors', (request: { data: { fileName: string; callbackId: number } }) => {
            var data = request.data;
            var fileName: string = data.fileName;
            var callbackId: number = data.callbackId;
            var diagnostics = this.service.getSemanticDiagnostics(fileName);
            var errors = diagnostics.map(function(diagnostic: ts.Diagnostic) {
                return { message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"), start: diagnostic.start, length: diagnostic.length };
            });
            var response = { errors: errors, callbackId: callbackId };
            sender.emit("semanticErrors", response);
        });

        sender.on('getCompletionsAtPosition', (request: { data: { fileName: string; position: number; prefix: string; callbackId: number } }) => {
            try {
                const data = request.data;
                const fileName: string = data.fileName;
                const position: number = data.position;
                const prefix: string = data.prefix;
                if (typeof position !== 'number' || isNaN(position)) {
                    throw new Error("position must be a number and not NaN");
                }
                var completionInfo: ts.CompletionInfo = this.service.getCompletionsAtPosition(fileName, position);
                if (completionInfo) {
                    let completionEntries: ts.CompletionEntry[] = completionInfo.entries;
                    sender.emit('completions', { completions: completionEntries, callbackId: request.data.callbackId });
                }
                else {
                    sender.emit('completions', { completions: [], callbackId: request.data.callbackId });
                }
            }
            catch (e) {
                // e parameter cannot have a type annotation so we really have to do some introspection.
                // FIXME: It would be nice to ensure a {name, message} structure.
                sender.emit('completions', { err: e.toString(), callbackId: request.data.callbackId });
            }
        });

        sender.on('getQuickInfoAtPosition', (request: { data: { fileName: string; position: number; callbackId: number } }) => {
            try {
                var data = request.data;
                var fileName: string = data.fileName;
                var position: number = data.position;
                var callbackId: number = data.callbackId;
                if (typeof position !== 'number' || isNaN(position)) {
                    throw new Error("position must be a number and not NaN");
                }
                var quickInfo: ts.QuickInfo = this.service.getQuickInfoAtPosition(fileName, position);

                // Take advantage of TypeScript displayPartsToString function.
                var name = ts.displayPartsToString(quickInfo.displayParts);
                var comments = ts.displayPartsToString(quickInfo.documentation);

                sender.emit('quickInfo', { quickInfo: quickInfo, name: name, comments: comments, callbackId: callbackId });
            }
            catch (e) {
                // e parameter cannot have a type annotation so we really have to do some introspection.
                // FIXME: It would be nice to ensure a {name, message} structure.
                sender.emit('quickInfo', { err: e.toString(), callbackId: callbackId });
            }
        });

        sender.on('getOutputFiles', (request: { data: { fileName: string; callbackId: number } }) => {
            var data = request.data;
            var fileName: string = data.fileName;
            var callbackId: number = data.callbackId;
            try {
                var emitOutput: ts.EmitOutput = this.service.getEmitOutput(fileName);
                var outputFiles: ts.OutputFile[] = emitOutput.outputFiles;
                var response = { outputFiles: outputFiles, callbackId: callbackId };
                sender.emit("outputFiles", response);
            }
            catch (e) {
            }
        });
    }

    /**
     * @method ensureScript
     * @param fileName {string}
     * @param content {string}
     * @return {void}
     * @private
     */
    private ensureScript(fileName: string, content: string): void {
        this.host.ensureScript(fileName, content);
    }
}