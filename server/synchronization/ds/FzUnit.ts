import { FzEditor } from './FzEditor';
import { FzRemote } from './FzRemote';

/**
 * 
 */
export interface FzUnit {

    /**
     * The editor, in dehydrated form.
     */
    e: FzEditor;

    /**
     * The remote nodes.
     */
    k: { [nodeId: string]: FzRemote };
}
