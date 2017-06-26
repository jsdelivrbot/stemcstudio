import { Fold } from "./Fold";
import { Delta } from "editor-document";

/**
 *
 */
export interface DeltaWithFolds extends Delta {
    /**
     *
     */
    folds?: Fold[];
}
