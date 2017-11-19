import { Component, EventEmitter, Output, ElementRef, Input } from '@angular/core';
import { Editor } from './Editor';
import { Renderer } from './Renderer';

@Component({
    selector: 'editor',
    template: '',
    styles: [':host { display:block;width:100%; }']
})
export class EditorComponent {
    @Output() textChanged = new EventEmitter();
    @Output() textChange = new EventEmitter();
    @Input() style: any = {};
    /**
     * TODO: 'editor' is declared but its value is never read.
     */
    public editor: Editor;
    /**
     *
     */
    constructor(elementRef: ElementRef) {
        let container = elementRef.nativeElement;
        this.editor = new Editor(new Renderer(container), void 0);
    }
}
