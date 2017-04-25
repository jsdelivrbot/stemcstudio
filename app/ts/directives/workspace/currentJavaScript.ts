import mathscript from 'davinci-mathscript';
import WsModel from '../../modules/wsmodel/WsModel';
/**
 * Returns the JavaScript to be inserted into the HTML script element.
 * This may involve further modifying the JavaScript emitted by the
 * TypeScript compiler by, for example, introducing operator overloading.
 * The transpilation step also perfoms detection of infinite loops.
 * This function will soon be dead code as support for 1.x is dropped.
 */
export default function currentJavaScript(path: string, workspace: WsModel): string {
    const code = workspace.lastKnownJs[path];
    if (code) {
        try {
            const options: mathscript.TranspileOptions = {
                timeout: 1000,
                noLoopCheck: workspace.noLoopCheck,
                operatorOverloading: workspace.isOperatorOverloadingEnabled()
            };
            /**
             * The JavaScript code with operators replaced by function calls and infinite loop detection.
             */
            return mathscript.transpile(code, options);
        }
        catch (e) {
            // We might end up here if there is an error in the source code.
            // TODO: Distinguish errors in transpile from errors in source code.
            console.warn(e);
            return code;
        }
    }
    else {
        return "";
    }
}
