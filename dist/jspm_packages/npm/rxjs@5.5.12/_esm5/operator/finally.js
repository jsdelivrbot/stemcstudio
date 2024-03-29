/* */ 
"format cjs";
/** PURE_IMPORTS_START .._operators_finalize PURE_IMPORTS_END */
import { finalize } from '../operators/finalize';
/**
 * Returns an Observable that mirrors the source Observable, but will call a specified function when
 * the source terminates on complete or error.
 * @param {function} callback Function to be called when source terminates.
 * @return {Observable} An Observable that mirrors the source, but will call the specified function on termination.
 * @method finally
 * @owner Observable
 */
export function _finally(callback) {
    return finalize(callback)(this);
}
//# sourceMappingURL=finally.js.map
