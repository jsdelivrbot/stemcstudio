import { QuickInfo } from './QuickInfo';

export interface QuickInfoTooltipHost {
    getQuickInfoAtPosition(path: string, position: number): Promise<QuickInfo>;
}
