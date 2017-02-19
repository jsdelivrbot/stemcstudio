import Completion from "../Completion";
import PixelPosition from "../PixelPosition";

interface ListView {
    isOpen: boolean;
    container: HTMLElement;
    on(eventName: string, callback: Function, capturing?: boolean): void;
    focus(): void;
    getData(row: number): Completion;
    setData(data: Completion[]): void;
    getRow(): number;
    setRow(row: number): void;
    getTextLeftOffset(): number;
    show(pos: PixelPosition, lineHeight: number, topdownOnly?: boolean): void;
    hide(): void;
    setThemeCss(cssClass: string, href: string): void;
    setThemeDark(isDark: boolean): void;
    setFontSize(fontSize: string): void;
    getLength(): number;
}

export default ListView;
