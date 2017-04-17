import MwChange from './MwChange';
import { MwDocument } from './MwDocument';

/**
 * The adapter on the user's workspace.
 */
export interface MwWorkspace {
    /**
     *
     */
    createFile(path: string, roomId: string, change: MwChange): MwDocument;

    /**
     * 
     */
    deleteFile(path: string, master: boolean): Promise<void>;
}
