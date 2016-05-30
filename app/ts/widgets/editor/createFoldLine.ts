import Fold from './Fold';
import FoldLine from './FoldLine';

export default function createFoldLine(foldData: any, folds: Fold[]): FoldLine {
    return new FoldLine(foldData, folds);
}
