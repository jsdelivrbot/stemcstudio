import { Completion } from "../Completion";
import { PixelPosition } from "../PixelPosition";

export interface ListView {
    isOpen: boolean;
    container: HTMLElement;
    on(eventName: string, callback: Function, capturing?: boolean): void;
    focus(): void;
    getCompletionAtRow(row: number): Completion;
    getCompletions(): Completion[];
    setCompletions(completions: Completion[]): void;
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
