import { NgModule } from '@angular/core';

import { EditorComponent } from './editor.component';
import { EditorDirective } from './editor.directive';

@NgModule({
    declarations: [
        EditorComponent,
        EditorDirective
    ],
    imports: [],
    providers: [],
    exports: [
        EditorComponent,
        EditorDirective
    ]
})
export class EditorModule {
}
