import Doodle from '../../services/doodles/Doodle';
import mathscript from 'davinci-mathscript';

/**
 * Returns the JavaScript to be inserted into the HTML script element.
 * This may involve further modifying the JavaScript emitted by the
 * TypeScript compiler by, for example, introducing operator overloading. 
 */
export default function currentJavaScript(fileName: string, doodle: Doodle): string {
    const code = doodle.lastKnownJs[fileName];
    if (code) {
        if (doodle.operatorOverloading) {
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
