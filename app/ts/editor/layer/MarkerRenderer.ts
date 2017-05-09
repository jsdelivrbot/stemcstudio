import MarkerConfig from './MarkerConfig';
import RangeBasic from '../RangeBasic';

interface MarkerRenderer {
    (html: (number | string)[], range: RangeBasic, left: number, top: number, config: MarkerConfig): void;
}

export default MarkerRenderer;
