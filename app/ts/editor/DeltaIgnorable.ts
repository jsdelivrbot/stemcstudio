import { Delta } from "editor-document";

/**
 *
 */
export interface DeltaIgnorable extends Delta {
    /**
     *
     */
    ignore?: boolean;
}
