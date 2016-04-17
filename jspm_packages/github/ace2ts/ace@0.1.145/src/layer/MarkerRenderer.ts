import MarkerConfig from './MarkerConfig';
import Range from '../Range';

interface MarkerRenderer {
    (html: (number | string)[], range: Range, left: number, top: number, config: MarkerConfig): void;
}

export default MarkerRenderer;