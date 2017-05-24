import { MarkerConfig } from './MarkerConfig';
import { RangeBasic } from '../RangeBasic';

export interface MarkerRenderer {
    (html: (number | string)[], range: RangeBasic, left: number, top: number, config: MarkerConfig): void;
}
