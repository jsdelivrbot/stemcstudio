import { Injectable } from '@angular/core';

import { Editor } from '../../virtual/editor';
import { EditorService } from '../../virtual/editor';
import { EditSession } from '../../virtual/editor';

import { Document as NativeDocument } from '../../editor/Document';
import { Editor as NativeEditor } from '../../editor/Editor';
import { EditSession as NativeEditSession } from '../../editor/EditSession';
import Renderer from '../../editor/Renderer';

/**
 * AngularJS dependency injection registry identifier.
 */
export const NATIVE_EDITOR_SERVICE_UUID = 'native-editor.service.uuid';

@Injectable()
export class NativeEditorService implements EditorService {
    constructor() {
        // Nothing to do because native editor is ready to go.
    }
    createSession(text: string): EditSession {
        const doc = new NativeDocument(text);
        const session = new NativeEditSession(doc);
        doc.release();
        return session;
    }
    createEditor(container: HTMLElement): Editor {
        return new NativeEditor(new Renderer(container), void 0);
    }
}
