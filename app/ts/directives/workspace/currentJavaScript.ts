import mathscript from 'davinci-mathscript';
import WsModel from '../../wsmodel/services/WsModel';
/**
 * Returns the JavaScript to be inserted into the HTML script element.
 * This may involve further modifying the JavaScript emitted by the
 * TypeScript compiler by, for example, introducing operator overloading. 
 */
export default function currentJavaScript(fileName: string, workspace: WsModel): string {
    const code = workspace.lastKnownJs[fileName];
    if (code) {
        if (workspace.operatorOverloading) {
            try {
                // In this location we are transpiling the code.
                return mathscript.transpile(code);
            }
            catch (e) {
                // We might end up here if there is an error in the source code.
                // TODO: Distinguish errors in transpile from errors in source code.
                console.warn(e);
                return code;
            }
        }
        else {
            return code;
        }
    }
    else {
        return "";
    }
}
