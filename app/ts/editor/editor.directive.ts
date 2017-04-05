import { Directive, EventEmitter, Output, ElementRef, Input } from '@angular/core';
import { Editor } from './Editor';
import { Renderer } from './Renderer';

@Directive({
    selector: '[editor]'
})
export class EditorDirective {
    @Output() textChanged = new EventEmitter();
    @Output() textChange = new EventEmitter();
    /**
     * 
     */
    private editor: Editor;
    /**
     *
     */
    constructor(elementRef: ElementRef) {
        let container = elementRef.nativeElement;
        this.editor = new Editor(new Renderer(container), void 0);
    }

    @Input()
    set readOnly(readOnly: boolean) {
        this.editor.setReadOnly(readOnly);
    }
}
