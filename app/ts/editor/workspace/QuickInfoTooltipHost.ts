import { QuickInfo } from './QuickInfo';

interface QuickInfoTooltipHost {
    getQuickInfoAtPosition(path: string, position: number): Promise<QuickInfo>;
}

export default QuickInfoTooltipHost;
