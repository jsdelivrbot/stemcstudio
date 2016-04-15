import oop = require('../lib/oop');
import m = require('../worker/mirror');
import lang = require('../lib/lang');
import dcm = require('../document');
import prsr = require('../mode/python/Parser');
import astnds = require('../mode/python/astnodes');
import bldr = require('../mode/python/builder');
import cmplr = require('../mode/python/compiler');
import symtbl = require('../mode/python/symtable');

/**
 * Symbol for an information annotation (gray italic i letter).
 */
var INFO = 'info';
/**
 * Symbol for a warning annotation (yellow triangle with exclamation).
 */
var WARNING = 'warning';
/**
 * Symbol for an error annotation (red box with x).
 */
var ERROR = 'error';

/**
 *
 */
export class PythonWorker extends m.Mirror {
    private options;

    constructor(sender/*FIXME: ace.WorkerSender*/) {
        super(sender, 500);

        this.setOptions();

        // Let the sender know that this worker has completed initialization.
        sender.emit('initAfter');
    }

    private setOptions(options?) {
        this.options = options || {};
    }

    private changeOptions(newOptions) {
        oop.mixin(this.options, newOptions);
        this.deferredUpdate.schedule(100);
    }

    public onUpdate() {
        var source = this.doc.getValue();

        var annotations: Array<{ row: number; column: number; text: string; type: string }> = [];

        try {
            var fileName: string = '<stdin>';

            var node = prsr.parse(fileName, source);

            var module: astnds.Module = bldr.astFromParse(node, fileName);

            var symbolTable: symtbl.SymbolTable = symtbl.symbolTable(module, fileName);

            var compiler = new cmplr.Compiler(fileName, symbolTable, 0, source);

            var compiled = { 'funcname': compiler.cmod(module), 'code': compiler.result.join('') };
        }
        catch (e) {
            try {
                annotations.push({
                    row: e.lineNumber - 1,
                    column: e.columnNumber,
                    text: e.message,
                    type: ERROR
                });
            }
            catch (slippery) {
                console.warn(slippery);
            }
        }

        this.sender.emit('syntax', annotations);
    }
}
