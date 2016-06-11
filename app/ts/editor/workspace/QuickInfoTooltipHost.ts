import QuickInfo from './QuickInfo';

interface QuickInfoTooltipHost {
    getQuickInfoAtPosition(path: string, position: number, callback: (err: any, quickInfo: QuickInfo) => any);
}

export default QuickInfoTooltipHost;
