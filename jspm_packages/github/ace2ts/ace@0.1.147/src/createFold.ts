import Fold from './Fold';
import Range from './Range';

export default function createFold(range: Range, placeholder: string): Fold {
    return new Fold(range, placeholder);
}