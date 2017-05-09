import { Direction } from './editor';
import { TabstopManager } from './editor';

export interface EditorWithTabStops {
    enableTabStops(): TabstopManager;
    tabNext(direction?: Direction): void;
}
