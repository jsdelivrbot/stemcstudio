import { LineWidget } from './editor';

export interface EditorWithLineWidgets {

    enableLineWidgets(): void;

    addLineWidget(widget: LineWidget): LineWidget;
    removeLineWidget(widget: LineWidget): void;

    getLineWidgetsAtRow(row: number): LineWidget[];
}
